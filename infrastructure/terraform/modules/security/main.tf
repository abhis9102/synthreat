# Security Module: KMS CMK, Security Groups, IAM Roles & AWS WAFv2

variable "environment" { type = string }
variable "vpc_id" { type = string }

# ── 1. KMS Customer Managed Key ──────────────────────────────────────────────
resource "aws_kms_key" "main" {
  description             = "Synthreat ${var.environment} Envelope Encryption CMK"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "synthreat-${var.environment}-cmk"
  }
}

resource "aws_kms_alias" "main" {
  name          = "alias/synthreat-${var.environment}-key"
  target_key_id = aws_kms_key.main.key_id
}

# ── 2. Security Groups ────────────────────────────────────────────────────────
# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "synthreat-${var.environment}-alb-sg"
  description = "Controls ingress traffic to public Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTPS from everywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP redirect"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Outbound to private app containers"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "synthreat-${var.environment}-alb-sg"
  }
}

# App Tier Security Group (ECS Tasks)
resource "aws_security_group" "app" {
  name        = "synthreat-${var.environment}-app-sg"
  description = "Allows traffic strictly from ALB to ECS Fargate services"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Core API ingress from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "AI RAG Service ingress from ALB"
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow outbound to VPC endpoints, external LLM APIs, and NAT"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "synthreat-${var.environment}-app-sg"
  }
}

# ── 3. IAM Roles for ECS Fargate ──────────────────────────────────────────────
# Execution Role (pull image, write logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "synthreat-${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_default" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Role (Bedrock, KMS, SecretsManager, S3 access)
resource "aws_iam_role" "ecs_task_role" {
  name = "synthreat-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "ecs_task_permissions" {
  name        = "synthreat-${var.environment}-task-policy"
  description = "Granular application permissions for Synthreat ECS tasks"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "BedrockInference"
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      {
        Sid    = "KMSDecryption"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.main.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_attach" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_permissions.arn
}

# ── 4. AWS WAFv2 Web ACL (OWASP Top 10 + IP Rate Limiting) ────────────────────
resource "aws_wafv2_web_acl" "main" {
  name        = "synthreat-${var.environment}-waf"
  description = "Synthreat Enterprise WAF with Managed OWASP Rules"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimitPerIP"
    priority = 2

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "SynthreatWafMetric"
    sampled_requests_enabled   = true
  }

  tags = {
    Name = "synthreat-${var.environment}-waf"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "kms_key_arn" { value = aws_kms_key.main.arn }
output "alb_security_group_id" { value = aws_security_group.alb.id }
output "app_security_group_id" { value = aws_security_group.app.id }
output "ecs_execution_role_arn" { value = aws_iam_role.ecs_execution_role.arn }
output "ecs_task_role_arn" { value = aws_iam_role.ecs_task_role.arn }
output "waf_web_acl_arn" { value = aws_wafv2_web_acl.main.arn }

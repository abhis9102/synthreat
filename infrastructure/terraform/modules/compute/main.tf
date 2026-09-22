# Compute Module: AWS ALB + ECS Fargate Microservices

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "app_subnet_ids" { type = list(string) }
variable "alb_subnet_ids" { type = list(string) }
variable "app_security_group_id" { type = string }
variable "alb_security_group_id" { type = string }
variable "task_execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
variable "database_secret_arn" { type = string }
variable "redis_endpoint" { type = string }
variable "acm_certificate_arn" { type = string; default = "" }

# ── 1. Application Load Balancer ──────────────────────────────────────────────
resource "aws_lb" "main" {
  name               = "synthreat-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.alb_subnet_ids

  enable_deletion_protection = var.environment == "prod" ? true : false

  tags = {
    Name = "synthreat-${var.environment}-alb"
  }
}

# Core API Target Group
resource "aws_lb_target_group" "core_api" {
  name        = "synthreat-${var.environment}-core-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/health/live"
    interval            = 20
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }

  tags = {
    Name = "synthreat-${var.environment}-core-tg"
  }
}

# AI RAG Service Target Group
resource "aws_lb_target_group" "ai_rag" {
  name        = "synthreat-${var.environment}-ai-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/health/live"
    interval            = 20
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }

  tags = {
    Name = "synthreat-${var.environment}-ai-tg"
  }
}

# ALB HTTP Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.core_api.arn
  }
}

# Route /api/v1/ai/* to AI RAG Service
resource "aws_lb_listener_rule" "ai_routing" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ai_rag.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/ai/*"]
    }
  }
}

# ── 2. ECS Cluster ────────────────────────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "synthreat-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "synthreat-${var.environment}-cluster"
  }
}

# ── 3. CloudWatch Log Groups ──────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "core_api" {
  name              = "/ecs/synthreat-${var.environment}-core-api"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "ai_service" {
  name              = "/ecs/synthreat-${var.environment}-ai-service"
  retention_in_days = 30
}

# ── 4. ECS Task Definitions & Services ────────────────────────────────────────
# Core API Service Definition
resource "aws_ecs_task_definition" "core_api" {
  family                   = "synthreat-${var.environment}-core-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([{
    name      = "core-api"
    image     = "public.ecr.aws/docker/library/node:22-alpine" # Replace with your ECR image URI in production
    essential = true
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = var.environment },
      { name = "PORT", value = "3000" },
      { name = "REDIS_HOST", value = var.redis_endpoint }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.core_api.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "core_api" {
  name            = "synthreat-${var.environment}-core-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.core_api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.app_subnet_ids
    security_groups = [var.app_security_group_id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.core_api.arn
    container_name   = "core-api"
    container_port   = 3000
  }

  deployment_controller {
    type = "ECS"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "alb_dns_name" { value = aws_lb.main.dns_name }
output "cluster_name" { value = aws_ecs_cluster.main.name }

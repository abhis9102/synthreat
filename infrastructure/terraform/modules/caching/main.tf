# Caching Module: Amazon ElastiCache Redis 7.x (Multi-AZ Cluster)

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "cache_subnet_ids" { type = list(string) }
variable "app_security_group_id" { type = string }
variable "node_type" { type = string; default = "cache.r7g.large" }
variable "kms_key_arn" { type = string }

# ── 1. Subnet Group ───────────────────────────────────────────────────────────
resource "aws_elasticache_subnet_group" "redis" {
  name       = "synthreat-${var.environment}-redis-subnet-group"
  subnet_ids = var.cache_subnet_ids

  tags = {
    Name = "synthreat-${var.environment}-redis-subnets"
  }
}

# ── 2. Security Group ─────────────────────────────────────────────────────────
resource "aws_security_group" "redis" {
  name        = "synthreat-${var.environment}-redis-sg"
  description = "Allows Redis port 6379 from App Tier only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Redis from App Containers"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.app_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Name = "synthreat-${var.environment}-redis-sg"
  }
}

# ── 3. Redis Replication Group ────────────────────────────────────────────────
resource "random_password" "redis_auth" {
  length  = 32
  special = false
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "synthreat-${var.environment}-redis"
  description                = "Synthreat ${var.environment} Redis Cluster with Failover"
  node_type                  = var.node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  subnet_group_name          = aws_elasticache_subnet_group.redis.name
  security_group_ids         = [aws_security_group.redis.id]
  automatic_failover_enabled = true
  multi_az_enabled           = true
  num_cache_clusters         = 2
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.redis_auth.result
  kms_key_id                 = var.kms_key_arn

  tags = {
    Name = "synthreat-${var.environment}-redis"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "redis_endpoint" { value = aws_elasticache_replication_group.redis.primary_endpoint_address }
output "redis_port" { value = aws_elasticache_replication_group.redis.port }

# Database Module: Amazon Aurora PostgreSQL 16 (Serverless v2 Multi-AZ)

variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "database_subnet_ids" { type = list(string) }
variable "app_security_group_id" { type = string }
variable "db_name" { type = string }
variable "db_username" { type = string }
variable "min_capacity" { type = number; default = 1.0 }
variable "max_capacity" { type = number; default = 16.0 }
variable "kms_key_arn" { type = string }

# ── 1. DB Subnet Group ────────────────────────────────────────────────────────
resource "aws_db_subnet_group" "aurora" {
  name        = "synthreat-${var.environment}-db-subnet-group"
  subnet_ids  = var.database_subnet_ids
  description = "Private isolated data subnets for Aurora cluster"

  tags = {
    Name = "synthreat-${var.environment}-db-subnet-group"
  }
}

# ── 2. Database Security Group ────────────────────────────────────────────────
resource "aws_security_group" "db" {
  name        = "synthreat-${var.environment}-aurora-sg"
  description = "Allows inbound PostgreSQL traffic exclusively from app containers"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from App Tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.app_security_group_id]
  }

  egress {
    description = "No outbound allowed from database"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Name = "synthreat-${var.environment}-db-sg"
  }
}

# ── 3. Secrets Manager Master Password ────────────────────────────────────────
resource "random_password" "master" {
  length  = 24
  special = false
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "synthreat/${var.environment}/aurora/credentials"
  kms_key_id  = var.kms_key_arn
  description = "Master credentials for Synthreat Aurora PostgreSQL"

  tags = {
    Name = "synthreat-${var.environment}-db-secret"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    engine   = "postgres"
    host     = aws_rds_cluster.aurora.endpoint
    port     = 5432
    database = var.db_name
    username = var.db_username
    password = random_password.master.result
  })
}

# ── 4. Aurora PostgreSQL Serverless v2 Cluster ────────────────────────────────
resource "aws_rds_cluster" "aurora" {
  cluster_identifier      = "synthreat-${var.environment}-aurora"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "16.2"
  database_name           = var.db_name
  master_username         = var.db_username
  master_password         = random_password.master.result
  db_subnet_group_name    = aws_db_subnet_group.aurora.name
  vpc_security_group_ids  = [aws_security_group.db.id]
  kms_key_id              = var.kms_key_arn
  storage_encrypted       = true
  deletion_protection     = var.environment == "prod" ? true : false
  backup_retention_period = 14
  preferred_backup_window = "03:00-04:00"

  serverlessv2_scaling_configuration {
    min_capacity = var.min_capacity
    max_capacity = var.max_capacity
  }

  tags = {
    Name = "synthreat-${var.environment}-aurora"
  }
}

# Multi-AZ Instances (Primary Writer + Read Replica for high availability)
resource "aws_rds_cluster_instance" "instances" {
  count               = 2
  identifier          = "synthreat-${var.environment}-aurora-${count.index + 1}"
  cluster_identifier  = aws_rds_cluster.aurora.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.aurora.engine
  engine_version      = aws_rds_cluster.aurora.engine_version
  publicly_accessible = false

  tags = {
    Name = "synthreat-${var.environment}-aurora-instance-${count.index + 1}"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "cluster_endpoint" { value = aws_rds_cluster.aurora.endpoint }
output "reader_endpoint" { value = aws_rds_cluster.aurora.reader_endpoint }
output "secret_arn" { value = aws_secretsmanager_secret.db_credentials.arn }
output "security_group_id" { value = aws_security_group.db.id }

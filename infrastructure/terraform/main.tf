# Synthreat Cloud Platform - Main Terraform Specification
# Multi-AZ Production Infrastructure on AWS

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "s3" {
    bucket         = "synthreat-terraform-state-prod"
    key            = "platform/prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "synthreat-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Synthreat"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Security    = "Strict"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# ── 1. VPC & Networking ───────────────────────────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr             = var.vpc_cidr
  availability_zones   = slice(data.aws_availability_zones.available.names, 0, 3)
  environment          = var.environment
}

# ── 2. Security, IAM & WAF ────────────────────────────────────────────────────
module "security" {
  source = "./modules/security"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id
}

# ── 3. Persistence: Aurora PostgreSQL Serverless v2 ──────────────────────────
module "database" {
  source = "./modules/database"

  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  database_subnet_ids    = module.vpc.database_subnet_ids
  app_security_group_id  = module.security.app_security_group_id
  db_name                = "synthreat_prod"
  db_username            = "synthreat_admin"
  min_capacity           = 1.0
  max_capacity           = 16.0
  kms_key_arn            = module.security.kms_key_arn
}

# ── 4. Caching: ElastiCache Redis Cluster ─────────────────────────────────────
module "caching" {
  source = "./modules/caching"

  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  cache_subnet_ids      = module.vpc.database_subnet_ids
  app_security_group_id = module.security.app_security_group_id
  node_type             = "cache.r7g.large"
  kms_key_arn           = module.security.kms_key_arn
}

# ── 5. Compute: ECS Fargate Application Tier ──────────────────────────────────
module "compute" {
  source = "./modules/compute"

  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  app_subnet_ids        = module.vpc.app_subnet_ids
  alb_subnet_ids        = module.vpc.public_subnet_ids
  app_security_group_id = module.security.app_security_group_id
  alb_security_group_id = module.security.alb_security_group_id
  task_execution_role_arn = module.security.ecs_execution_role_arn
  task_role_arn         = module.security.ecs_task_role_arn
  database_secret_arn   = module.database.secret_arn
  redis_endpoint        = module.caching.redis_endpoint
  acm_certificate_arn   = var.acm_certificate_arn
}

# ── 6. Edge & CDN: CloudFront + S3 ───────────────────────────────────────────
module "edge" {
  source = "./modules/edge"

  environment         = var.environment
  domain_name         = var.domain_name
  alb_dns_name        = module.compute.alb_dns_name
  web_acl_arn         = module.security.waf_web_acl_arn
  acm_certificate_arn = var.acm_certificate_arn
  kms_key_arn         = module.security.kms_key_arn
}

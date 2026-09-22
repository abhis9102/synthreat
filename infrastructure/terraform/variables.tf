# Synthreat Platform Terraform Variables

variable "aws_region" {
  description = "Primary AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Target environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the dedicated Synthreat VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "domain_name" {
  description = "Public apex domain for the Synthreat platform"
  type        = string
  default     = "synthreat.com"
}

variable "acm_certificate_arn" {
  description = "ARN of the AWS ACM Certificate for HTTPS (us-east-1 for CloudFront)"
  type        = string
  default     = ""
}

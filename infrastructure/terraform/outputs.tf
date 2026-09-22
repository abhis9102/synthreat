# Synthreat Platform Terraform Outputs

output "vpc_id" {
  description = "The ID of the provisioned VPC"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = module.compute.alb_dns_name
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = module.edge.cloudfront_domain_name
}

output "aurora_cluster_endpoint" {
  description = "The primary connection endpoint for the Aurora PostgreSQL cluster"
  value       = module.database.cluster_endpoint
}

output "redis_primary_endpoint" {
  description = "The primary endpoint of the ElastiCache Redis replication group"
  value       = module.caching.redis_endpoint
}

# Edge Module: Amazon CloudFront CDN + S3 Static Origin + OAC

variable "environment" { type = string }
variable "domain_name" { type = string }
variable "alb_dns_name" { type = string }
variable "web_acl_arn" { type = string }
variable "acm_certificate_arn" { type = string; default = "" }
variable "kms_key_arn" { type = string }

# ── 1. S3 Static Web Assets Bucket ───────────────────────────────────────────
resource "aws_s3_bucket" "static" {
  bucket        = "synthreat-${var.environment}-static-assets"
  force_destroy = var.environment == "prod" ? false : true

  tags = {
    Name = "synthreat-${var.environment}-static"
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# ── 2. CloudFront Origin Access Control (OAC) ─────────────────────────────────
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "synthreat-${var.environment}-oac"
  description                       = "Origin Access Control for Synthreat S3 Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# S3 Policy allowing CloudFront OAC read
resource "aws_s3_bucket_policy" "oac_read" {
  bucket = aws_s3_bucket.static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontServicePrincipal"
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }
      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.static.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
        }
      }
    }]
  })
}

# ── 3. CloudFront Global Edge Distribution ────────────────────────────────────
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Synthreat ${var.environment} Global CDN"
  default_root_object = "index.html"
  web_acl_id          = var.web_acl_arn

  # S3 Static Origin
  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "S3-StaticAssets"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # ALB Dynamic API Origin
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "ALB-DynamicAPI"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default Cache Behavior (Static S3)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-StaticAssets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # /api/* Dynamic API Behavior (ALB Forwarding)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-DynamicAPI"

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies { forward = "all" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == "" ? true : false
    acm_certificate_arn            = var.acm_certificate_arn != "" ? var.acm_certificate_arn : null
    ssl_support_method             = var.acm_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name = "synthreat-${var.environment}-cdn"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "cloudfront_domain_name" { value = aws_cloudfront_distribution.cdn.domain_name }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.cdn.id }
output "static_bucket_name" { value = aws_s3_bucket.static.id }

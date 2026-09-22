# VPC Module: Multi-AZ Network Segmentation with Isolated Sandbox

variable "vpc_cidr" { type = string }
variable "availability_zones" { type = list(string) }
variable "environment" { type = string }

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "synthreat-${var.environment}-vpc"
  }
}

# ── 1. Public Subnets ─────────────────────────────────────────────────────────
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index + 1)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "synthreat-${var.environment}-public-${var.availability_zones[count.index]}"
    Tier = "Public"
  }
}

# ── 2. Private App Subnets ───────────────────────────────────────────────────
resource "aws_subnet" "app" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "synthreat-${var.environment}-app-${var.availability_zones[count.index]}"
    Tier = "Private-App"
  }
}

# ── 3. Isolated Sandbox Subnet (Zero Outbound Internet) ───────────────────────
resource "aws_subnet" "sandbox" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, 20)
  availability_zone = var.availability_zones[0]

  tags = {
    Name = "synthreat-${var.environment}-isolated-sandbox"
    Tier = "Isolated-ZeroEgress"
  }
}

# ── 4. Private Data Subnets (Aurora & Redis) ──────────────────────────────────
resource "aws_subnet" "data" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 30)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "synthreat-${var.environment}-data-${var.availability_zones[count.index]}"
    Tier = "Private-Data"
  }
}

# ── 5. Gateways & Routing ─────────────────────────────────────────────────────
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "synthreat-${var.environment}-igw"
  }
}

resource "aws_eip" "nat" {
  count  = 3
  domain = "vpc"

  tags = {
    Name = "synthreat-${var.environment}-nat-eip-${count.index + 1}"
  }
}

resource "aws_nat_gateway" "nat" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "synthreat-${var.environment}-nat-${count.index + 1}"
  }
  depends_on = [aws_internet_gateway.gw]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "synthreat-${var.environment}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = 3
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private App Route Tables (Multi-AZ NAT)
resource "aws_route_table" "app" {
  count  = 3
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[count.index].id
  }

  tags = {
    Name = "synthreat-${var.environment}-app-rt-${count.index + 1}"
  }
}

resource "aws_route_table_association" "app" {
  count          = 3
  subnet_id      = aws_subnet.app[count.index].id
  route_table_id = aws_route_table.app[count.index].id
}

# Isolated Sandbox Route Table (Local traffic only - NO default route)
resource "aws_route_table" "sandbox" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "synthreat-${var.environment}-sandbox-rt-isolated"
  }
}

resource "aws_route_table_association" "sandbox" {
  subnet_id      = aws_subnet.sandbox.id
  route_table_id = aws_route_table.sandbox.id
}

# Data Subnets Route Table (Local only)
resource "aws_route_table" "data" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "synthreat-${var.environment}-data-rt"
  }
}

resource "aws_route_table_association" "data" {
  count          = 3
  subnet_id      = aws_subnet.data[count.index].id
  route_table_id = aws_route_table.data.id
}

# ── 6. S3 Gateway Endpoint (Free & Private) ──────────────────────────────────
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = concat(aws_route_table.app[*].id, [aws_route_table.data.id])

  tags = {
    Name = "synthreat-${var.environment}-s3-endpoint"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "vpc_id" { value = aws_vpc.main.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "app_subnet_ids" { value = aws_subnet.app[*].id }
output "sandbox_subnet_id" { value = aws_subnet.sandbox.id }
output "database_subnet_ids" { value = aws_subnet.data[*].id }

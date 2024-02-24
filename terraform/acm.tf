resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.webapp-name}.anuradhawick.com"
  validation_method = "EMAIL"
  provider = aws.us_east_1
  tags = var.common-tags

  lifecycle {
    create_before_destroy = true
  }

  validation_option {
    domain_name       = "${var.webapp-name}.anuradhawick.com"
    validation_domain = "anuradhawick.com"
  }
}
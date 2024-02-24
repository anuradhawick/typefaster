resource "aws_cloudfront_origin_access_control" "s3_distribution" {
  name                              = "${var.webapp-name}-s3-access-control"
  description                       = "Policy for ${var.webapp-name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "s3_distribution" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.apps_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_distribution.id
    origin_id                = "${var.webapp-name}-s3-origin-id"
    origin_path              = "/${var.webapp-name}"
  }

  tags = var.common-tags
  comment             = "${var.webapp-name} distribution"
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  default_root_object = "index.html"

  custom_error_response {
    response_code      = 200
    error_code         = 404
    response_page_path = "/index.html"
  }

  custom_error_response {
    response_code      = 200
    error_code         = 400
    response_page_path = "/index.html"
  }

  custom_error_response {
    response_code      = 200
    error_code         = 403
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "${var.webapp-name}-s3-origin-id"
    cache_policy_id        = data.aws_cloudfront_cache_policy.s3_distribution.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method = "sni-only"
    # cloudfront_default_certificate = true
  }

  aliases = ["${var.webapp-name}.anuradhawick.com"]
}

# allow cloudfront to access s3
resource "aws_s3_bucket_policy" "s3_access_from_cloudfront" {
  bucket = aws_s3_bucket.apps_bucket.id
  policy = data.aws_iam_policy_document.s3_access_from_cloudfront.json
}

# iam policy
data "aws_iam_policy_document" "s3_access_from_cloudfront" {
  statement {
    principals {
      type = "Service"
      identifiers = [
        "cloudfront.amazonaws.com"
      ]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.apps_bucket.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        aws_cloudfront_distribution.s3_distribution.arn
      ]
    }
  }
}

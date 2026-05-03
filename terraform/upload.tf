data "external" "build" {
  program = ["python3", "build.py"]

  query = {
    install_command   = var.install-command
    build_command     = var.build-command
    webapp_dir        = var.webapp-dir
    build_destination = var.build-destination
  }

  working_dir = path.module
}

resource "null_resource" "s3_upload" {
  triggers = {
    compiled_code_hash = data.external.build.result.hash
    build_file_hash    = filesha1("${path.module}/build.py")
  }

  provisioner "local-exec" {
    command = "/bin/bash \"$UPLOAD_SCRIPT\" \"$BUILD_DESTINATION\" \"$S3_BUCKET\" \"$WEBAPP_NAME\""

    environment = {
      BUILD_DESTINATION = var.build-destination
      S3_BUCKET         = aws_s3_bucket.apps_bucket.id
      UPLOAD_SCRIPT     = "${path.module}/upload.sh"
      WEBAPP_NAME       = var.webapp-name
    }
  }

  depends_on = [
    aws_s3_bucket.apps_bucket
  ]
}

resource "null_resource" "cloudfront_invalidate" {
  triggers = {
    compiled_code_hash = data.external.build.result.hash
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.s3_distribution.id} --paths '/*'"
  }

  depends_on = [
    null_resource.s3_upload,
  ]
}

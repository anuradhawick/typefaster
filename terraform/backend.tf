terraform {
  backend "s3" {
    bucket         = "terraform-states-anuradhawick"
    key            = "typefaster"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-states-anuradhawick"
  }
}
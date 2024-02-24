# _TypeFaster_

<p align="center">
<img src="./typefaster/src/assets/logo.webp" width="400px" style="display: block; margin: 0 auto;">
</p>

Visit: [https://typefaster.anuradhawick.com](https://typefaster.anuradhawick.com)

## Setup Guide

Create stories in stories directory, include images in `webp` format (thats cheaper). Add a json explaining the story using below schema.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "prompt": {
      "type": "string",
      "description": "A detailed instruction or command for generating content, specifying the nature and requirements of the content to be created."
    },
    "title": {
      "type": "string",
      "description": "The title of the content or project for which the prompt is issued, serving as a brief identifier or name."
    }
  },
  "required": ["prompt", "title"]
}
```

Add a `story.txt` plain text file that contains the actual story.

Now run `process_stories.py` script to generate the story related content inside the angular app.

## Development Guide

Use `pnpm` to install angular dependencies.

## Deployment Guide

Run the following commands before deploying to ensure clean code.

```bash
pnpm run pretty
ng lint --fix
```

All runs must be completed without errors before deployment and code committing.

Terraform state bucket is managed outside of the program. So it must be imported.

```bash
terraform import aws_s3_bucket.apps_bucket apps-anuradhawick
```

Once you have done that you can apply

```bash
terraform apply
```

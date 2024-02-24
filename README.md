# Setup Guide

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

# Deployment Guide

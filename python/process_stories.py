import json
import pathlib
import re
from glob import glob

from PIL import Image

WHITE_SPACES = r"(\s+)"
WHITE_SPACE = r" "


def resize_and_optimize_webp(file_path, output_path):
    """
    Resizes all WEBP images found in the input_folder to 600x600 pixels
    and saves the optimized images to the output_folder.
    """
    # Open the image
    with Image.open(file_path) as img:
        # Resize the image
        img = img.resize((600, 600), Image.ANTIALIAS)
        # Save the image to output directory with optimization
        img.save(
            output_path, format="WEBP", optimize=True, quality=80
        )  # quality can be adjusted as needed


story_summaries = []

for dir in glob("../stories/*"):
    if not pathlib.Path(dir).is_dir():
        continue
    story_index = dir.split("/")[-1]
    json_data = json.load(open(pathlib.Path(dir).joinpath("story.json")))
    story_data = open(pathlib.Path(dir).joinpath("story.txt")).read()
    images_src = list(pathlib.Path(dir).rglob("*.webp"))
    images_dest = [
        pathlib.Path("").joinpath("/assets/stories", path.name).as_posix()
        for path in images_src
    ]

    for source in images_src:
        print(
            pathlib.Path("")
            .joinpath("../typefaster/src/assets/stories", source.name)
            .as_posix()
        )
        resize_and_optimize_webp(source.as_posix(), pathlib.Path("")
            .joinpath("../typefaster/src/assets/stories", source.name)
            .as_posix())

    full_json = {
        **json_data,
        "images": images_dest,
        "story": re.sub(WHITE_SPACES, WHITE_SPACE, story_data),
    }

    story_summaries.append(
        {"images": images_dest, "title": json_data["title"], "index": int(story_index)}
    )

    with open(
        pathlib.Path("../").joinpath(
            "typefaster/src/assets/stories/", story_index + ".json"
        ),
        "w+",
    ) as fout:
        json.dump(full_json, fout)

story_summaries.sort(key=lambda x: x["index"])

with open(
    pathlib.Path("../").joinpath("typefaster/src/assets/stories/", "summary.json"), "w+"
) as fout:
    json.dump(story_summaries, fout)

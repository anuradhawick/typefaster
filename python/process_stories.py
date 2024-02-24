from glob import glob
import pathlib
import json
import re
import shutil

WHITE_SPACES = r"(\s+)"
WHITE_SPACE = r" "

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
        shutil.copyfile(
            source.as_posix(),
            pathlib.Path("")
            .joinpath("../typefaster/src/assets/stories", source.name)
            .as_posix(),
        )

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

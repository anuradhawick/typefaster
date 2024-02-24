import os
import hashlib
import sys
import subprocess
import json


# docs - https://stackoverflow.com/questions/36204248/creating-unique-hash-for-directory-in-python
def sha1_of_file(filepath: str):
    sha = hashlib.sha1()
    sha.update(filepath.encode())

    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(2**10), b""):
            sha.update(block)
        return sha.hexdigest()


def hash_dir(dir_path: str):
    sha = hashlib.sha1()

    for path, _, files in os.walk(dir_path):
        # we sort to guarantee that files will always go in the same order
        for file in sorted(files):
            file_hash = sha1_of_file(os.path.join(path, file))
            sha.update(file_hash.encode())

    return sha.hexdigest()


def npm_install(cmd: str, dir: str):
    out = subprocess.Popen(
        cmd.split(),
        cwd=dir,
        encoding="ascii",
        stdout=sys.stderr,
    )
    code = out.wait()
    assert code == 0, "ERROR: npm install returned non-zero exit"


def build(cmd: str, dir: str):
    out = subprocess.Popen(
        cmd.split(),
        cwd=dir,
        stdout=sys.stderr,
    )
    code = out.wait()
    assert code == 0, "ERROR: ng build returned non-zero exit"


if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    build_cmd = args["build_command"]
    install_cmd = args["install_command"]
    webapp_dir = args["webapp_dir"]
    build_destiation = args["build_destiation"]

    npm_install(install_cmd, webapp_dir)
    build(build_cmd, webapp_dir)
    print(f""" {{ "hash": "{hash_dir(build_destiation)}" }} """)
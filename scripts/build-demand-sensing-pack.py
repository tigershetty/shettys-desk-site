#!/usr/bin/env python3
"""Build the PDF, checksums, and deterministic Demand Sensing Router ZIP."""

from __future__ import annotations

import hashlib
import subprocess
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "resource-packs" / "demand-sensing-router"
ARCHIVE = ROOT / "private" / "resources" / "demand-sensing-router-v1.2.0.zip"
TOP_LEVEL = "shettys-desk-demand-sensing-router-v1.2.0"
EXCLUDED_PARTS = {"sample-run", "__pycache__", ".DS_Store"}
ZIP_TIMESTAMP = (2026, 7, 15, 12, 0, 0)


def release_files() -> list[Path]:
    return [
        path
        for path in sorted(PACK.rglob("*"))
        if path.is_file()
        and path.name != "CHECKSUMS.sha256"
        and not EXCLUDED_PARTS.intersection(path.relative_to(PACK).parts)
    ]


def write_checksums(files: list[Path]) -> Path:
    output = PACK / "CHECKSUMS.sha256"
    lines = []
    for path in files:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        lines.append(f"{digest}  {path.relative_to(PACK).as_posix()}")
    output.write_text("\n".join(lines) + "\n", encoding="ascii")
    return output


def write_archive(files: list[Path]) -> None:
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ARCHIVE, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            relative = path.relative_to(PACK).as_posix()
            info = zipfile.ZipInfo(f"{TOP_LEVEL}/{relative}", ZIP_TIMESTAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o755 if path.name == "START.py" else 0o644) << 16
            archive.writestr(info, path.read_bytes(), compresslevel=9)


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-demand-sensing-guide.py")], check=True)
    files = release_files()
    checksums = write_checksums(files)
    write_archive(sorted([*files, checksums]))
    print(f"Wrote {ARCHIVE}")


if __name__ == "__main__":
    main()

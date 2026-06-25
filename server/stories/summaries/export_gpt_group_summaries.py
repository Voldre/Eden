from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


SUMMARIES_DIR = Path(__file__).resolve().parent
SERVER_DIR = SUMMARIES_DIR.parent.parent
DEFAULT_RESUME_PATH = SERVER_DIR / "JDRresume.json"
DEFAULT_OUTPUT_DIR = SUMMARIES_DIR / "output_json"


class HtmlTextExtractor(HTMLParser):
    BLOCK_TAGS = {
        "article",
        "br",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "ol",
        "p",
        "pre",
        "section",
        "ul",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() in self.BLOCK_TAGS:
            self._parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in self.BLOCK_TAGS:
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        self._parts.append(data)

    def get_text(self) -> str:
        text = "".join(self._parts).replace("\xa0", " ")
        lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]

        clean_lines: list[str] = []
        previous_was_blank = False
        for line in lines:
            if not line:
                if clean_lines and not previous_was_blank:
                    clean_lines.append("")
                previous_was_blank = True
                continue

            clean_lines.append(line)
            previous_was_blank = False

        return "\n".join(clean_lines).strip()


def html_to_text(html: str) -> str:
    parser = HtmlTextExtractor()
    parser.feed(html)
    parser.close()
    return parser.get_text()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def read_html(path: Path) -> str:
    with path.open("r", encoding="utf-8") as file:
        return file.read().strip()


def build_group_exports(resumes: list[dict[str, Any]]) -> dict[int, list[dict[str, Any]]]:
    exports: dict[int, list[dict[str, Any]]] = defaultdict(list)
    missing_files: list[Path] = []

    for resume in resumes:
        groupe = int(resume["groupe"])
        html_path = SUMMARIES_DIR / f"G{groupe}" / f"{resume['seance']}.html"

        if not html_path.exists():
            missing_files.append(html_path)
            continue

        html_content = read_html(html_path)
        relative_html_path = html_path.relative_to(SUMMARIES_DIR).as_posix()

        exports[groupe].append(
            {
                "groupe": groupe,
                "seance": resume["seance"],
                "date": resume["date"],
                "titre": resume["titre"],
                "personnages": resume.get("personnages", []),
                "contexte": resume.get("contexte", ""),
                "source_html": relative_html_path,
                "contenu": html_to_text(html_content),
            }
        )

    if missing_files:
        missing = "\n".join(f"- {path}" for path in missing_files)
        raise FileNotFoundError(f"Fichiers HTML introuvables :\n{missing}")

    return exports


def write_group_exports(exports: dict[int, list[dict[str, Any]]], output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    written_files: list[Path] = []

    for groupe in sorted(exports):
        group_document = {
            "format": "eden-jdr-gpt-custom-resumes-v1",
            "groupe": groupe,
            "nombre_resumes": len(exports[groupe]),
            "resumes": exports[groupe],
        }
        output_path = output_dir / f"groupe_{groupe}_resumes.json" if groupe != 0 else output_dir / "autre_resumes.json"

        with output_path.open("w", encoding="utf-8") as file:
            json.dump(group_document, file, ensure_ascii=False, indent=2)
            file.write("\n")

        written_files.append(output_path)

    return written_files


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Exporte les résumés JDR par groupe dans des fichiers JSON lisibles "
            "par un GPT Custom."
        )
    )
    parser.add_argument(
        "--resume-path",
        type=Path,
        default=DEFAULT_RESUME_PATH,
        help=f"Chemin vers JDRresume.json. Défaut : {DEFAULT_RESUME_PATH}",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Dossier de sortie. Défaut : {DEFAULT_OUTPUT_DIR}",
    )
    return parser.parse_args()


def main() -> int:
    # python .\server\stories\summaries\export_gpt_group_summaries.py
    args = parse_args()
    resumes = read_json(args.resume_path)
    exports = build_group_exports(resumes)
    written_files = write_group_exports(exports, args.output_dir)

    print("Exports générés :")
    for path in written_files:
        print(f"- {path}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"Erreur : {error}", file=sys.stderr)
        raise SystemExit(1)

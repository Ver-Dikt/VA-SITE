from __future__ import annotations

import json
import shutil
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Ver-Dikt\Downloads\Telegram Desktop\VA PRESS KIT RU small size.pdf")
OUT = ROOT / "assets" / "press"
PDF_OUT = ROOT / "assets" / "pdf" / "VA PRESS KIT RU small size.pdf"


def clean_name(value: str) -> str:
    return "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in value).strip("-")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PDF_OUT.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SOURCE, PDF_OUT)

    doc = fitz.open(SOURCE)
    pages = []
    images = []

    for page_index, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        pages.append({"page": page_index, "text": text})

        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        render_path = OUT / f"page-{page_index:02d}.jpg"
        pix.save(render_path, jpg_quality=88)

        for image_index, image in enumerate(page.get_images(full=True), start=1):
            xref = image[0]
            info = doc.extract_image(xref)
            ext = info.get("ext", "png")
            image_path = OUT / f"image-p{page_index:02d}-{image_index:02d}.{clean_name(ext)}"
            image_path.write_bytes(info["image"])
            images.append(
                {
                    "page": page_index,
                    "file": image_path.relative_to(ROOT).as_posix(),
                    "width": info.get("width"),
                    "height": info.get("height"),
                    "colorspace": info.get("cs-name"),
                }
            )

    (OUT / "presskit-text.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "presskit-text.txt").write_text(
        "\n\n".join(f"--- PAGE {item['page']} ---\n{item['text']}" for item in pages),
        encoding="utf-8",
    )
    (OUT / "images.json").write_text(json.dumps(images, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({"pages": len(pages), "images": len(images), "pdf": str(PDF_OUT)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

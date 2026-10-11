"""Markdown raporu telefonda okunur PDF'e çevirir.
Kullanım: python3 tools/md2pdf.py girdi.md cikti.pdf
"""
import html, pathlib, subprocess, sys, tempfile
import markdown

CSS = """
@page { size: A4; margin: 14mm 12mm; }
body { font-family: 'DejaVu Sans', 'Noto Color Emoji', sans-serif; font-size: 11.5pt; line-height: 1.5; color: #1C2230; }
h1 { font-size: 20pt; color: #1C2230; border-bottom: 3px solid #E8A33D; padding-bottom: 6px; }
h2 { font-size: 15pt; color: #9A5A0B; margin-top: 22px; }
h3 { font-size: 12.5pt; }
table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 10px 0; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { background: #1C2230; color: #F6F3EC; text-align: left; padding: 5px 6px; }
td { border-bottom: 1px solid #E4DED2; padding: 5px 6px; vertical-align: top; }
tr:nth-child(even) td { background: #FAF7F1; }
code, pre { font-family: 'DejaVu Sans Mono', monospace; background: #F3EFE6; border-radius: 4px; }
pre { padding: 10px; white-space: pre-wrap; }
blockquote { border-left: 4px solid #E8A33D; margin: 8px 0; padding: 4px 12px; background: #FBF6EC; }
"""

JS = """
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + process.argv[2]);
  await p.pdf({ path: process.argv[3], format: 'A4', printBackground: true,
                margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
  await b.close();
})();
"""

def main(src, dst):
    text = pathlib.Path(src).read_text(encoding="utf-8")
    body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    title = html.escape(pathlib.Path(src).stem)
    page = f"<!doctype html><html lang='tr'><head><meta charset='utf-8'><title>{title}</title><style>{CSS}</style></head><body>{body}</body></html>"
    with tempfile.TemporaryDirectory() as d:
        h = pathlib.Path(d, "r.html"); h.write_text(page, encoding="utf-8")
        j = pathlib.Path(d, "p.js"); j.write_text(JS)
        subprocess.run(["node", str(j), str(h), str(pathlib.Path(dst).resolve())], check=True,
                       env={**__import__("os").environ, "NODE_PATH": subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()})

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

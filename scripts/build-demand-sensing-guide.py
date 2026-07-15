#!/usr/bin/env python3
"""Build the compact Shetty's Desk Demand Sensing Router field guide."""

from __future__ import annotations

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "resource-packs" / "demand-sensing-router"
OUTPUT = PACK / "START-HERE.pdf"
VISUAL = ROOT / "scripts" / "assets" / "demand-sensing-visual-cover.jpg"
LOGO = ROOT / "scripts" / "assets" / "shettys-desk-logo-small.png"

TERRACOTTA = colors.HexColor("#D97656")
OLIVE = colors.HexColor("#3C3828")
BLUE = colors.HexColor("#247BE1")
NAVY = colors.HexColor("#1939A5")
TEAL = colors.HexColor("#14B8A6")
AMBER = colors.HexColor("#F59E0B")
INK = colors.HexColor("#15315C")
MUTED = colors.HexColor("#5D7599")
LINE = colors.HexColor("#DCEAF8")
PAPER = colors.HexColor("#FBFCFE")
PALE_BLUE = colors.HexColor("#EFF6FF")
PALE_TEAL = colors.HexColor("#ECFDF8")
PALE_AMBER = colors.HexColor("#FFF8E8")
PALE_TERRACOTTA = colors.HexColor("#FFF3EE")


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=27,
            leading=30,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            textColor=MUTED,
            spaceAfter=8,
        ),
        "eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9,
            textColor=TERRACOTTA,
            spaceAfter=6,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=21,
            textColor=INK,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=INK,
            spaceBefore=4,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11.7,
            textColor=INK,
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7,
            leading=9.5,
            textColor=MUTED,
        ),
        "mini": ParagraphStyle(
            "Mini",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=6.4,
            leading=8.4,
            textColor=INK,
        ),
        "code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=6.9,
            leading=9.4,
            textColor=INK,
            backColor=colors.HexColor("#F7FAFF"),
            borderColor=LINE,
            borderWidth=0.6,
            borderPadding=7,
            spaceBefore=3,
            spaceAfter=6,
        ),
        "callout": ParagraphStyle(
            "Callout",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11.5,
            textColor=INK,
        ),
        "metric": ParagraphStyle(
            "Metric",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=INK,
            alignment=TA_CENTER,
        ),
    }


STYLES = make_styles()


def para(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, STYLES[style])


def bullet(text: str, color=TEAL, width=6.35 * inch) -> Table:
    item = Table([["", para(text)]], colWidths=[0.09 * inch, width - 0.09 * inch])
    item.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), color),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 0),
                ("TOPPADDING", (0, 0), (0, 0), 3),
                ("BOTTOMPADDING", (0, 0), (0, 0), 3),
                ("LEFTPADDING", (1, 0), (1, 0), 6),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (1, 0), (1, 0), 0),
                ("BOTTOMPADDING", (1, 0), (1, 0), 3),
            ]
        )
    )
    return item


def section_header(label: str, title: str) -> list:
    return [para(label.upper(), "eyebrow"), para(title, "h1")]


def styled_table(rows, widths, font_size=6.8, header_fill=PALE_BLUE) -> Table:
    wrapped = []
    for row_index, row in enumerate(rows):
        cells = []
        for value in row:
            cell_style = ParagraphStyle(
                f"Cell-{row_index}-{len(cells)}",
                parent=STYLES["mini"],
                fontName="Helvetica-Bold" if row_index == 0 else "Helvetica",
                fontSize=font_size,
                leading=font_size + 2.3,
                textColor=INK,
            )
            cells.append(Paragraph(str(value), cell_style))
        wrapped.append(cells)
    table = Table(wrapped, colWidths=widths, repeatRows=1)
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
        ("BACKGROUND", (0, 0), (-1, 0), header_fill),
    ]
    for row_index in range(2, len(rows), 2):
        commands.append(("BACKGROUND", (0, row_index), (-1, row_index), PAPER))
    table.setStyle(TableStyle(commands))
    return table


def callout(label: str, text: str, fill, line, widths=(1.25 * inch, 5.1 * inch)) -> Table:
    box = Table([[para(label, "callout"), para(text)]], colWidths=list(widths))
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.65, line),
                ("LINEBEFORE", (0, 0), (0, -1), 3, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return box


def draw_logo(canvas, image_path: Path, x, y, width):
    canvas.drawImage(str(image_path), x, y, width=width, height=width, mask="auto", preserveAspectRatio=True)


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    logo = Path(doc.logo_path)
    draw_logo(canvas, logo, 0.62 * inch, height - 0.49 * inch, 0.28 * inch)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.setFillColor(OLIVE)
    canvas.drawString(0.95 * inch, height - 0.35 * inch, "SHETTY'S DESK")
    canvas.setFont("Helvetica", 6.8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.62 * inch, height - 0.35 * inch, "DEMAND SENSING ROUTER / FIELD GUIDE")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.62 * inch, height - 0.55 * inch, width - 0.62 * inch, height - 0.55 * inch)
    canvas.line(0.62 * inch, 0.45 * inch, width - 0.62 * inch, 0.45 * inch)
    canvas.setFont("Helvetica", 6.6)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.62 * inch, 0.27 * inch, "Version 1.2.0 / July 2026")
    canvas.drawRightString(width - 0.62 * inch, 0.27 * inch, f"Page {doc.page} of 4")
    canvas.restoreState()


def cover_decor(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, height - 0.12 * inch, width, 0.12 * inch, stroke=0, fill=1)
    canvas.setFillColor(OLIVE)
    canvas.rect(0, 0, width, 0.09 * inch, stroke=0, fill=1)
    draw_logo(canvas, Path(doc.logo_path), 0.62 * inch, height - 0.95 * inch, 0.62 * inch)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(OLIVE)
    canvas.drawString(1.32 * inch, height - 0.65 * inch, "SHETTY'S DESK")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(1.32 * inch, height - 0.79 * inch, "SUPPLY-CHAIN OPERATING ARTIFACTS")
    canvas.restoreState()


def build_story(visual_path: Path):
    story = []
    visual = Image(str(visual_path), width=2.12 * inch, height=3.18 * inch)
    cover_copy = [
        Spacer(1, 0.52 * inch),
        para("FREE WORKFLOW PACK / VERSION 1.2.0", "eyebrow"),
        para("Demand Sensing Router", "title"),
        para(
            "Turn demand history and fresh operating signals into a planner-reviewable cadence decision for every SKU-location.",
            "subtitle",
        ),
        Spacer(1, 0.08 * inch),
        callout(
            "START IN 5 MINUTES",
            "Run one local command with synthetic data. It profiles four SKUs, validates the known-good board, and shows the exact next files to replace.",
            PALE_TERRACOTTA,
            TERRACOTTA,
            widths=(1.15 * inch, 2.2 * inch),
        ),
        Spacer(1, 0.12 * inch),
        para("THE DECISION", "eyebrow"),
        para("Route each SKU-location to one of three lanes:", "h2"),
        bullet("SENSE FREQUENTLY when a fresh signal can still change an operating decision.", BLUE, 3.35 * inch),
        bullet("PLAN MONTHLY when the baseline cadence still fits the decision horizon.", TEAL, 3.35 * inch),
        bullet("SPECIAL METHOD / REVIEW for intermittent, lumpy, lifecycle, or weak-evidence exceptions.", AMBER, 3.35 * inch),
    ]
    cover = Table([[cover_copy, visual]], colWidths=[3.55 * inch, 2.2 * inch])
    cover.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 16),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([cover, Spacer(1, 0.17 * inch)])
    metrics = Table(
        [[
            para("1 SAFE START", "metric"),
            para("2 INPUT FILES", "metric"),
            para("5 REVIEW OUTPUTS", "metric"),
        ]],
        colWidths=[2.05 * inch, 2.05 * inch, 2.05 * inch],
    )
    metrics.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), PALE_TERRACOTTA),
                ("BACKGROUND", (1, 0), (1, 0), PALE_TEAL),
                ("BACKGROUND", (2, 0), (2, 0), PALE_AMBER),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.extend([metrics, Spacer(1, 0.15 * inch)])
    story.append(
        callout(
            "HUMAN BOUNDARY",
            "The pack prepares evidence and a recommendation. The planner approves policy, cadence, master data, and every system-of-record change.",
            PALE_BLUE,
            NAVY,
        )
    )
    story.append(PageBreak())

    story.extend(section_header("01 / First run", "Prove the pack before using your data"))
    story.append(para("Open Terminal in the extracted pack folder and run one command:"))
    story.append(para("python3 START.py", "code"))
    story.append(
        callout(
            "EXPECTED RESULT",
            "4 profiles written / known-good routing board passed / next files printed. No external service or production data is used.",
            PALE_TEAL,
            TEAL,
        )
    )
    story.extend([Spacer(1, 0.12 * inch), para("What the command proves", "h2")])
    for item in [
        "Python can read the included history and calculate ADI, CV2, and demand-pattern evidence.",
        "The routing-board validator rejects unsupported frequent-sensing recommendations.",
        "The package structure, examples, and expected output contract are intact.",
    ]:
        story.append(bullet(item))

    sample_rows = [
        ["SKU / location", "Pattern evidence", "Route", "Why it belongs there"],
        ["A100 / TOR", "Smooth + fresh POS", "Sense frequently", "A 3-day response window can still change replenishment."],
        ["C310 / VAN", "Stable + long horizon", "Plan monthly", "New information does not change the near-term decision."],
        ["D440 / MTL", "Intermittent", "Special review", "Long zero gaps need a method decision, not a faster cadence."],
        ["F660 / TOR", "Phase-in", "Special review", "Lifecycle evidence overrides a simplistic history route."],
    ]
    story.extend([
        Spacer(1, 0.1 * inch),
        para("Completed sample: what good looks like", "h2"),
        styled_table(sample_rows, [1.05 * inch, 1.35 * inch, 1.1 * inch, 2.85 * inch], 6.4, PALE_TEAL),
        Spacer(1, 0.12 * inch),
        para("Choose the lightest tool path", "h2"),
    ])
    path_rows = [
        ["Path", "Best first use", "Start with"],
        ["Chat first", "Learn the method with minimal setup", "Run START.py, attach four files, paste the starter prompt."],
        ["Agent Skill", "Reuse the method in a compatible tool", "Install the complete skill folder; keep scripts and references together."],
        ["Claude Project / Cowork", "Give a team one controlled workspace", "Attach the skill, workers, and input files; run manually first."],
    ]
    story.append(styled_table(path_rows, [1.15 * inch, 2.15 * inch, 3.05 * inch], 6.7))
    story.append(PageBreak())

    story.extend(section_header("02 / Your data", "Replace two files, preserve the evidence contract"))
    two_files = Table(
        [[
            [
                para("FILE 1", "eyebrow"),
                para("Demand history", "h2"),
                para("Copy <b>sample-demand-history.csv</b> to <b>my-demand-history.csv</b>."),
                bullet("sku / location: stable planning keys", BLUE, 2.95 * inch),
                bullet("period: one daily or weekly format", BLUE, 2.95 * inch),
                bullet("demand: numeric actual demand", BLUE, 2.95 * inch),
                bullet("one row per SKU-location-period", BLUE, 2.95 * inch),
            ],
            [
                para("FILE 2", "eyebrow"),
                para("Routing context", "h2"),
                para("Copy <b>sample-routing-context.csv</b> to <b>my-routing-context.csv</b>."),
                bullet("dated signal + freshness", TEAL, 2.95 * inch),
                bullet("open response window", TEAL, 2.95 * inch),
                bullet("lifecycle + portfolio priority", TEAL, 2.95 * inch),
                bullet("decision supported + planner comment", TEAL, 2.95 * inch),
            ],
        ]],
        colWidths=[3.08 * inch, 3.08 * inch],
    )
    two_files.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), PALE_BLUE),
                ("BACKGROUND", (1, 0), (1, 0), PALE_TEAL),
                ("BOX", (0, 0), (-1, -1), 0.55, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.55, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.extend([two_files, Spacer(1, 0.12 * inch)])

    context_rows = [
        ["Context field", "What it must answer", "Example"],
        ["signal_type + signal_date", "What changed, and when was it observed?", "POS / 2026-07-15"],
        ["signal_freshness_days", "Is the evidence recent enough for this review?", "2"],
        ["response_window_days", "Can the supported decision still change?", "3"],
        ["lifecycle", "Does phase-in/out require special treatment?", "ACTIVE"],
        ["decision_supported", "Which operating decision can move?", "REPLENISHMENT"],
        ["previous_cadence", "Did the route change since last review?", "PLAN MONTHLY"],
    ]
    story.extend([
        para("Routing context: the fields that stop generic AI output", "h2"),
        styled_table(context_rows, [1.55 * inch, 2.95 * inch, 1.85 * inch], 6.6, PALE_AMBER),
        Spacer(1, 0.1 * inch),
        callout(
            "NON-NEGOTIABLE",
            "A frequent-sensing route needs a dated trigger signal, an open response window, and a named operating decision. Missing evidence stays in planner review.",
            PALE_AMBER,
            AMBER,
        ),
        Spacer(1, 0.1 * inch),
        para("Run your history", "h2"),
        para("python3 skills/demand-sensing-router/scripts/profile_demand.py my-demand-history.csv --output my-demand-profile.csv", "code"),
        para("Then attach the profile, context, routing policy, and data contract with the supplied chat-first or Cowork prompt."),
    ])
    story.append(PageBreak())

    story.extend(section_header("03 / Planner review", "Start with the exceptions, not the stable rows"))
    output_rows = [
        ["Review order", "Artifact", "The question it should answer"],
        ["1", "Route-change log", "Which SKU-location moved, and what new evidence caused it?"],
        ["2", "Data-quality exceptions", "Which recommendation failed because evidence is missing, stale, or conflicting?"],
        ["3", "Demand-review brief", "Which open response window or operating decision needs attention now?"],
        ["4", "Routing board", "Does every lane match the policy and the visible evidence?"],
        ["5", "Run manifest", "Which sources, dates, policy version, and checks produced this package?"],
    ]
    story.append(styled_table(output_rows, [0.65 * inch, 1.65 * inch, 4.05 * inch], 6.8, PALE_TEAL))
    story.extend([Spacer(1, 0.1 * inch), para("Four planner questions", "h2")])
    questions = Table(
        [[
            para("1. What evidence caused the route to move?", "callout"),
            para("2. Is the signal fresh enough to matter?", "callout"),
        ], [
            para("3. Which decision can still change?", "callout"),
            para("4. What evidence still needs to be challenged?", "callout"),
        ]],
        colWidths=[3.08 * inch, 3.08 * inch],
    )
    questions.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE_BLUE),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.extend([questions, Spacer(1, 0.1 * inch), para("Fast troubleshooting", "h2")])
    trouble_rows = [
        ["Problem", "Fix"],
        ["python3 not found", "Use a managed Python 3 environment; the pack needs only the standard library."],
        ["Missing-column error", "Copy the supplied CSV header exactly before replacing rows."],
        ["Duplicate-row error", "Keep one row per SKU-location-period."],
        ["Frequent-sensing route rejected", "Add a dated signal, open window, and supported decision or keep it in review."],
        ["Sensitive data concern", "Anonymize identifiers or use an approved enterprise AI environment."],
    ]
    story.append(styled_table(trouble_rows, [1.8 * inch, 4.55 * inch], 6.6, PALE_TERRACOTTA))
    story.extend([Spacer(1, 0.1 * inch), para("Ready-to-run checklist", "h2")])
    checklist = [
        "[ ] START.py passes with the synthetic sample.",
        "[ ] My two input files preserve the supplied fields and grain.",
        "[ ] Every frequent-sensing route has dated evidence and an open decision.",
        "[ ] Changed routes explain why they moved; failed checks stay visible.",
        "[ ] A planner approves the final cadence and any system update.",
    ]
    left = [bullet(item, TERRACOTTA, 3.05 * inch) for item in checklist[:3]]
    right = [bullet(item, TERRACOTTA, 3.05 * inch) for item in checklist[3:]]
    check_table = Table([[left, right]], colWidths=[3.08 * inch, 3.08 * inch])
    check_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 6)]))
    story.extend([
        check_table,
        Spacer(1, 0.08 * inch),
        callout(
            "NEXT MOVE",
            "Run the sample, inspect the completed outputs, copy the two input files, and build the first board with governed data. Keep the originals as your known-good reference.",
            PALE_TERRACOTTA,
            TERRACOTTA,
        ),
    ])
    return story


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.68 * inch,
        bottomMargin=0.57 * inch,
        title="Demand Sensing Router - Start Here",
        author="Shetty's Desk",
        subject="Four-page field guide for the Demand Sensing Router workflow pack",
        creator="Shetty's Desk resource pipeline",
        invariant=1,
    )
    doc.logo_path = str(LOGO)
    cover_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="cover")
    body_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_decor, autoNextPageTemplate="Body"),
            PageTemplate(id="Body", frames=[body_frame], onPage=page_decor),
        ]
    )
    # Stable document IDs and metadata keep release checksums meaningful.
    doc.build(build_story(VISUAL))
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build_pdf()

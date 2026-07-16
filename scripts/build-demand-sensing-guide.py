#!/usr/bin/env python3
"""Build the branded Demand Sensing Router beginner guide PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "resource-packs" / "demand-sensing-router" / "START-HERE.pdf"
VISUAL = ROOT / "public" / "resources" / "demand-sensing-router" / "visual.png"

INDIGO = colors.HexColor("#4F46E5")
TEAL = colors.HexColor("#14B8A6")
AMBER = colors.HexColor("#F59E0B")
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#64748B")
BORDER = colors.HexColor("#D9DEE8")
PALE_INDIGO = colors.HexColor("#EEF2FF")
PALE_TEAL = colors.HexColor("#F0FDFA")
PALE_AMBER = colors.HexColor("#FFFBEB")


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=34,
            textColor=INK,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=12,
            leading=18,
            textColor=MUTED,
        ),
        "eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=INDIGO,
            spaceAfter=8,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=25,
            textColor=INK,
            spaceAfter=12,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=INK,
            spaceAfter=7,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=11,
            textColor=MUTED,
        ),
        "code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=11,
            textColor=INK,
            backColor=colors.HexColor("#F8FAFC"),
            borderColor=BORDER,
            borderWidth=0.5,
            borderPadding=8,
            spaceBefore=5,
            spaceAfter=9,
        ),
        "callout": ParagraphStyle(
            "Callout",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=14,
            textColor=INK,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=12,
            textColor=INDIGO,
            alignment=TA_CENTER,
        ),
    }


STYLES = make_styles()


def para(text, style="body"):
    return Paragraph(text, STYLES[style])


def bullet(text, color=TEAL):
    item = Table([["", para(text)]], colWidths=[0.12 * inch, 6.28 * inch])
    item.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), color),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 0),
                ("TOPPADDING", (0, 0), (0, 0), 5),
                ("BOTTOMPADDING", (0, 0), (0, 0), 5),
                ("LEFTPADDING", (1, 0), (1, 0), 8),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (1, 0), (1, 0), 0),
                ("BOTTOMPADDING", (1, 0), (1, 0), 4),
            ]
        )
    )
    return item


def section_header(label, title):
    return [para(label.upper(), "eyebrow"), para(title, "h1")]


def styled_table(rows, widths, header=True, font_size=7.5):
    wrapped = []
    for row_index, row in enumerate(rows):
        cells = []
        for value in row:
            cell_style = ParagraphStyle(
                f"Cell-{row_index}",
                parent=STYLES["small"],
                fontName="Helvetica-Bold" if header and row_index == 0 else "Helvetica",
                fontSize=font_size,
                leading=font_size + 3,
                textColor=INK,
            )
            cells.append(Paragraph(str(value), cell_style))
        wrapped.append(cells)
    table = Table(wrapped, colWidths=widths, repeatRows=1 if header else 0)
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if header:
        commands.append(("BACKGROUND", (0, 0), (-1, 0), PALE_INDIGO))
    for row_index in range(1 if header else 0, len(rows)):
        if row_index % 2 == 0:
            commands.append(
                ("BACKGROUND", (0, row_index), (-1, row_index), colors.HexColor("#F8FAFC"))
            )
    table.setStyle(TableStyle(commands))
    return table


def callout(label, text, fill, line):
    box = Table(
        [[para(label, "callout"), para(text)]],
        colWidths=[1.65 * inch, 4.75 * inch],
    )
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.7, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return box


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.7 * inch, height - 0.52 * inch, width - 0.7 * inch, height - 0.52 * inch)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.setFillColor(INK)
    canvas.drawString(0.7 * inch, height - 0.38 * inch, "SHETTY'S DESK")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(
        width - 0.7 * inch,
        height - 0.38 * inch,
        "DEMAND SENSING ROUTER - START HERE",
    )
    canvas.line(0.7 * inch, 0.5 * inch, width - 0.7 * inch, 0.5 * inch)
    canvas.drawString(0.7 * inch, 0.32 * inch, "Version 1.1.0 - July 2026")
    canvas.drawRightString(width - 0.7 * inch, 0.32 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover_page(canvas, _doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(PALE_INDIGO)
    canvas.rect(0, height - 0.18 * inch, width, 0.18 * inch, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, width, 0.12 * inch, stroke=0, fill=1)
    canvas.restoreState()


def build_story():
    story = []
    visual = Image(str(VISUAL), width=2.35 * inch, height=3.525 * inch)
    cover_copy = [
        para("FREE WORKFLOW PACK - VERSION 1.1.0", "eyebrow"),
        para("Demand Sensing Router", "title"),
        para(
            "A beginner-safe guide to run the sample, replace it with your own data, and prepare a planner-reviewable routing board.",
            "subtitle",
        ),
        Spacer(1, 0.18 * inch),
        bullet("Start with synthetic data and two standard-library Python scripts."),
        bullet("Choose a chat-first, Agent Skill, or Claude Project path."),
        bullet("Route each SKU-location with traceable evidence and checks."),
        bullet("Keep final policy and system changes with the planner."),
        Spacer(1, 0.16 * inch),
        para("WHO THIS IS FOR", "eyebrow"),
        para(
            "Demand planners, supply-chain analysts, planning leaders, and transformation teams trying the workflow for the first time."
        ),
    ]
    cover = Table([[cover_copy, visual]], colWidths=[3.65 * inch, 2.45 * inch])
    cover.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 20),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([Spacer(1, 0.45 * inch), cover, Spacer(1, 0.35 * inch)])
    meta = Table(
        [[
            para("10 MIN SAMPLE", "cover_meta"),
            para("2 INPUT FILES", "cover_meta"),
            para("5 REVIEW OUTPUTS", "cover_meta"),
        ]],
        colWidths=[2.1 * inch, 2.1 * inch, 2.1 * inch],
    )
    meta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), PALE_INDIGO),
                ("BACKGROUND", (1, 0), (1, 0), PALE_TEAL),
                ("BACKGROUND", (2, 0), (2, 0), PALE_AMBER),
                ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.extend([meta, PageBreak()])

    story.extend(section_header("1 - Choose a route", "Pick the simplest first-run path"))
    story.append(
        para(
            "Run the synthetic sample before deciding how deeply to install the workflow. The operating method stays the same; only the tool surface changes."
        )
    )
    path_rows = [
        ["Path", "Use it when", "What to do first"],
        ["A - Chat first", "You want to understand the method with the least setup.", "Run the profile script, upload four files, and paste the supplied chat prompt."],
        ["B - Agent Skill", "Your tool supports a skills folder or Agent Skills.", "Install the complete skill folder, then run the sample and validator."],
        ["C - Project / Cowork", "A business user needs one reusable controlled workspace.", "Attach the skill, workers, and inputs; use the Cowork run prompt manually."],
    ]
    story.extend(
        [
            styled_table(path_rows, [1.25 * inch, 2.35 * inch, 2.8 * inch]),
            Spacer(1, 0.18 * inch),
            callout(
                "RECOMMENDED FIRST RUN",
                "Choose Path A. It proves the data shape and routing logic before you install or schedule anything.",
                PALE_TEAL,
                TEAL,
            ),
            Spacer(1, 0.16 * inch),
            para("What this workflow builds", "h2"),
        ]
    )
    for item in [
        "A current routing board for each SKU-location.",
        "A route-change log showing what moved and why.",
        "A data-quality exception list for missing or stale evidence.",
        "A demand-review brief connecting changes to open decisions.",
        "A run manifest with source dates, policy version, and validation status.",
    ]:
        story.append(bullet(item))
    story.append(PageBreak())

    story.extend(section_header("2 - Run the sample", "Prove the package before using your data"))
    story.append(para("Open Terminal, move into the extracted package folder, and run:"))
    story.append(
        para(
            "python3 skills/demand-sensing-router/scripts/profile_demand.py<br/>  skills/demand-sensing-router/assets/sample-demand-history.csv<br/>  --output demand-profile.csv",
            "code",
        )
    )
    story.extend(
        [
            para("Expected result:", "h2"),
            para("Wrote 4 demand profiles to demand-profile.csv", "code"),
            para("Then validate the supplied routing-board example:", "h2"),
            para(
                "python3 skills/demand-sensing-router/scripts/validate_routing.py<br/>  examples/routing-board-example.csv",
                "code",
            ),
            para("Expected result:", "h2"),
            para("Routing validation passed", "code"),
            para("What success means", "h2"),
        ]
    )
    for item in [
        "Python can read the sample data and create one profile per SKU-location.",
        "The validator can read the expected routing-board schema.",
        "You have not connected production data or changed any planning policy.",
    ]:
        story.append(bullet(item))
    story.append(PageBreak())

    story.extend(section_header("3 - Replace file one", "Map your demand history"))
    story.extend(
        [
            para("Copy the sample instead of overwriting it:"),
            para("sample-demand-history.csv  ->  my-demand-history.csv", "code"),
        ]
    )
    history_rows = [
        ["Column", "Replace with", "Rule"],
        ["sku", "Your item, material, or product code", "Use one stable identifier."],
        ["location", "Planning location, plant, DC, or market", "Use the planning grain used in review."],
        ["period", "Daily or weekly period", "Use one consistent ISO date or week format."],
        ["demand", "Historical actual demand", "Use numeric demand for that period."],
    ]
    story.extend(
        [
            styled_table(history_rows, [1.05 * inch, 2.65 * inch, 2.7 * inch]),
            Spacer(1, 0.18 * inch),
        ]
    )
    for item in [
        "Keep one row per SKU-location-period.",
        "Do not mix daily and weekly history for the same SKU-location.",
        "Use zero for genuine zero demand; do not use zero for missing data.",
        "Anonymize identifiers before using an external AI service unless your approved enterprise environment permits the data.",
    ]:
        story.append(bullet(item, AMBER if item.startswith("Anonymize") else TEAL))
    story.append(PageBreak())

    story.extend(section_header("4 - Replace file two", "Map the routing context"))
    story.extend(
        [
            para("Copy the sample instead of overwriting it:"),
            para("sample-routing-context.csv  ->  my-routing-context.csv", "code"),
        ]
    )
    context_rows_a = [
        ["Column", "Replace with"],
        ["sku, location", "The same keys used in demand history"],
        ["signal_type", "POS, orders, promotion, launch plan, or another approved signal"],
        ["signal_date", "The date the signal was observed or extracted"],
        ["signal_freshness_days", "Days between the signal date and review date"],
        ["response_window_days", "Days remaining for the supported decision to change"],
        ["lifecycle", "Active, phase-in, phase-out, or your governed equivalent"],
    ]
    context_rows_b = [
        ["Column", "Replace with"],
        ["volume_value_tier", "Your approved portfolio tier"],
        ["service_priority", "High, medium, low, or your approved service class"],
        ["decision_supported", "Replenishment, deployment, allocation, capacity, sequence, or method choice"],
        ["planner_comment", "A short known event, assumption, or one-off explanation"],
        ["previous_cadence", "The previously approved routing lane"],
    ]
    story.extend(
        [
            styled_table(context_rows_a, [1.75 * inch, 4.65 * inch]),
            Spacer(1, 0.14 * inch),
            styled_table(context_rows_b, [1.75 * inch, 4.65 * inch]),
            Spacer(1, 0.18 * inch),
            callout(
                "NON-NEGOTIABLE",
                "Use ISO dates such as 2026-07-15. A signal without a date cannot pass the freshness check.",
                PALE_AMBER,
                AMBER,
            ),
            PageBreak(),
        ]
    )

    story.extend(section_header("5 - Run your data", "Create the first routing package"))
    story.extend(
        [
            para("Profile your history:"),
            para(
                "python3 skills/demand-sensing-router/scripts/profile_demand.py<br/>  my-demand-history.csv<br/>  --output my-demand-profile.csv",
                "code",
            ),
            para("Give the assistant these four files:", "h2"),
        ]
    )
    for item in [
        "my-demand-profile.csv",
        "my-routing-context.csv",
        "skills/demand-sensing-router/references/routing-policy.md",
        "skills/demand-sensing-router/references/data-contract.md",
    ]:
        story.append(bullet(item))
    story.append(para("Then paste this instruction:", "h2"))
    prompt = (
        "Use the supplied routing policy and data contract. Combine my demand profile with my routing context. "
        "Produce the routing board, route-change log, data-quality exceptions, demand-review brief, and run manifest. "
        "Do not invent missing evidence. Do not publish a frequent-sensing route without a dated signal, an open response window, and a supported operating decision. "
        "Send failed checks to planner review."
    )
    story.extend(
        [
            para(prompt, "code"),
            para(
                "For a tool-specific setup, use the complete prompt in prompts/chat-first-starter.md or prompts/cowork-run-prompt.md."
            ),
            PageBreak(),
        ]
    )

    story.extend(section_header("6 - Review the outputs", "Start the meeting with exceptions"))
    output_rows = [
        ["Output", "Use it for", "Review first"],
        ["Routing board", "The current lane and its evidence", "Changed and failed rows"],
        ["Route-change log", "What moved since last cycle", "Every unexplained move"],
        ["Data-quality exceptions", "Missing, stale, or conflicting evidence", "All open exceptions"],
        ["Demand-review brief", "Decision-focused meeting preparation", "Closing response windows"],
        ["Run manifest", "Traceability and reproducibility", "Source dates and validation status"],
    ]
    story.extend(
        [
            styled_table(output_rows, [1.55 * inch, 2.75 * inch, 2.1 * inch]),
            Spacer(1, 0.18 * inch),
            para("Planner approval questions", "h2"),
        ]
    )
    for item in [
        "What evidence caused this SKU-location to move?",
        "Is the trigger signal still fresh enough to matter?",
        "Can replenishment, deployment, allocation, capacity, or sequence still change?",
        "What evidence is missing or contradictory?",
        "Should the proposed lane be approved, rejected, or held for special review?",
    ]:
        story.append(bullet(item))
    story.extend(
        [
            Spacer(1, 0.12 * inch),
            callout(
                "DECISION BOUNDARY",
                "The workflow prepares evidence and a recommendation. The planner approves forecast policy, cadence, master data, and every system-of-record change.",
                PALE_INDIGO,
                INDIGO,
            ),
            PageBreak(),
        ]
    )

    story.extend(section_header("7 - Fix common issues", "Troubleshooting and final check"))
    trouble_rows = [
        ["Problem", "What to check"],
        ["python3: command not found", "Install Python 3 or use a managed company environment."],
        ["Missing-column error", "Compare your header row with the sample exactly."],
        ["Duplicate-row error", "Keep one row per SKU-location-period."],
        ["Unsupported frequent-sensing route", "Add a dated signal, open response window, and decision it can still change."],
        ["Mixed daily and weekly history", "Separate the series or convert it to one consistent bucket."],
        ["Sensitive data concern", "Anonymize identifiers or use an approved enterprise AI environment."],
    ]
    story.extend(
        [
            styled_table(trouble_rows, [2.25 * inch, 4.15 * inch]),
            Spacer(1, 0.18 * inch),
            para("Final checklist", "h2"),
        ]
    )
    for item in [
        "[ ] The sample scripts run successfully.",
        "[ ] My two input files preserve the supplied column names.",
        "[ ] Every signal has a source date.",
        "[ ] Every frequent-sensing route names an open decision window.",
        "[ ] Changed routes explain why they moved.",
        "[ ] Failed checks remain exceptions.",
        "[ ] A planner approves the final cadence and system update.",
    ]:
        story.append(bullet(item))
    story.extend(
        [
            Spacer(1, 0.16 * inch),
            para("NEXT", "eyebrow"),
            para(
                "Run the sample, inspect the five example outputs, and only then make copies of the two CSV input files. Keep the original examples as your known-good reference.",
                "callout",
            ),
        ]
    )
    return story


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.68 * inch,
        title="Demand Sensing Router - Start Here",
        author="Shetty's Desk",
        subject="Beginner setup and usage guide for the Demand Sensing Router workflow pack",
    )
    cover_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="cover")
    body_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(
                id="Cover",
                frames=[cover_frame],
                onPage=cover_page,
                autoNextPageTemplate="Body",
            ),
            PageTemplate(id="Body", frames=[body_frame], onPage=page_decor),
        ]
    )
    doc.build(build_story())
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build_pdf()

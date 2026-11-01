#!/usr/bin/env python3
"""
Generates a PDF of PROMPTS.md for Verified Academic Brief Generator using ReportLab.
"""
import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Preformatted,
    KeepTogether,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#5e6978"))
        
        if self._pageNumber > 1:
            self.drawString(54, 755, "Prompt Engineering Documentation — Verified Academic Brief Generator")
            self.setStrokeColor(colors.HexColor("#e5ddcb"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)

        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "Verified Academic Brief Generator | Prompt Engineering Documentation")
        self.setStrokeColor(colors.HexColor("#e5ddcb"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()
    
    c_navy = colors.HexColor("#14233c")
    c_burgundy = colors.HexColor("#7f1d2a")
    c_slate = colors.HexColor("#334155")
    c_muted = colors.HexColor("#64748b")
    c_light = colors.HexColor("#f8f4ec")
    c_border = colors.HexColor("#e5ddcb")

    style_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=c_navy,
        spaceAfter=6,
    )
    style_sub = ParagraphStyle(
        "CoverSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=15,
        textColor=c_burgundy,
        spaceAfter=12,
    )
    style_h1 = ParagraphStyle(
        "H1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=c_navy,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )
    style_h2 = ParagraphStyle(
        "H2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13.5,
        textColor=c_burgundy,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True,
    )
    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=c_slate,
        spaceAfter=5,
    )
    style_code = ParagraphStyle(
        "Code_Custom",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=7,
        leading=8.5,
        textColor=colors.HexColor("#1e293b"),
    )
    style_table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.5,
        textColor=c_slate,
    )
    style_table_hdr = ParagraphStyle(
        "TableHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )

    story = []

    # Title Block
    story.append(Paragraph("PROMPTS.md", style_sub))
    story.append(Paragraph("Prompt Engineering Documentation — Verified Academic Brief Generator", style_title))
    story.append(Paragraph(
        "This file documents the three prompt versions used to develop the Verified Academic Brief Generator, the final structured prompt, and the method for evaluating prompt quality.",
        style_body
    ))
    story.append(Paragraph(
        "The application generates an academic brief from retrieved web evidence. It should use trustworthy sources such as government websites, universities, official reports, reputable organizations, credible news publications, technical documentation, and research papers where relevant. It must not invent sources, URLs, quotations, statistics, or findings.",
        style_body
    ))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Section 1
    story.append(Paragraph("1. Prompt Engineering Objective", style_h1))
    story.append(Paragraph("The objective was to improve the quality and reliability of generated academic briefs through iterative prompt design.", style_body))
    story.append(Paragraph("The prompts were developed to improve:<br/>"
                           "• <b>Relevance</b> to the user's topic and academic level.<br/>"
                           "• <b>Organization and clarity</b> of the academic brief.<br/>"
                           "• <b>Traceability</b> between factual claims and retrieved sources.<br/>"
                           "• <b>Detection</b> of unsupported or conflicting information.<br/>"
                           "• <b>Consistent, machine-readable output</b> for the application.", style_body))

    # Section 2
    story.append(Paragraph("2. Prompt Version 1 — Basic Zero-Shot Prompt", style_h1))
    story.append(Paragraph("<b>Purpose:</b> Establish a simple baseline with minimal instructions.", style_body))
    p1_text = """Write an academic research brief about the following topic:

Topic: {{topic}}

Include an introduction, key findings, conclusion, and references.
Use reliable sources and make the information accurate."""
    code_box1 = Table([[Preformatted(p1_text, style_code)]], colWidths=[504])
    code_box1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(code_box1)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Limitations:</b><br/>"
                           "• Does not define a consistent output structure.<br/>"
                           "• Does not require each factual claim to be linked to a specific source.<br/>"
                           "• May produce incomplete or inconsistent references.<br/>"
                           "• Does not explain how to handle conflicting or insufficient evidence.", style_body))
    story.append(Paragraph("<b>Role in development:</b> This version serves as the baseline against which the more structured prompts can be compared.", style_body))

    # Section 3
    story.append(Paragraph("3. Prompt Version 2 — Multi-Stage Research Prompt", style_h1))
    story.append(Paragraph("<b>Purpose:</b> Break the task into explicit research and writing stages.", style_body))
    p2_text = """You are an academic research assistant. Prepare a research brief on:

Topic: {{topic}}
Academic level: {{academicLevel}}
Preferred length: {{briefLength}}

Follow these stages:
1. Understand the topic and identify the central research question.
2. Identify useful search queries and the kinds of sources needed.
3. Review the web evidence supplied to you.
4. Extract relevant facts, statistics, findings, and limitations from the sources.
5. Organize the evidence into key themes.
6. Draft an academic brief using only information supported by the supplied evidence.
7. Review each factual claim and check whether a source supports it.
8. List the references and identify any gaps or conflicting findings.

Rules:
- Do not invent sources, authors, URLs, statistics, quotations, or publication dates.
- Do not claim to have accessed a source unless its content or retrieved evidence is available.
- If evidence is insufficient, state that clearly.
- Distinguish established findings from interpretations.
- Include limitations and conflicting evidence where present."""
    code_box2 = Table([[Preformatted(p2_text, style_code)]], colWidths=[504])
    code_box2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(code_box2)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Improvements over Version 1:</b><br/>"
                           "• Makes the research process more systematic.<br/>"
                           "• Separates evidence review from writing.<br/>"
                           "• Explicitly asks for limitations and conflicting information.<br/>"
                           "• Adds instructions against fabricated sources and facts.", style_body))
    story.append(Paragraph("<b>Limitations:</b><br/>"
                           "• A long sequence of separate model calls can increase latency and API usage.<br/>"
                           "• If an intermediate stage fails, later stages may receive incomplete information.<br/>"
                           "• The prompt alone cannot prove that a source is genuine or that a claim is supported; the application must validate retrieved source data.<br/>"
                           "<i>Implementation note: These are logical workflow stages. They do not necessarily require eight separate LLM calls.</i>", style_body))

    # Section 4
    story.append(Paragraph("4. Prompt Version 3 — Grounded Structured Production Prompt", style_h1))
    story.append(Paragraph("<b>Purpose:</b> Generate a consistent academic brief using retrieved evidence and a structured JSON response.", style_body))
    story.append(Paragraph("<i>The application should replace the placeholders with the actual user input and retrieved source material before sending the prompt to the model.</i>", style_body))
    p3_text = """You are an academic research assistant. Your task is to produce a clear, balanced, evidence-based academic brief.

USER INPUT
Topic: {{topic}} | Academic level: {{academicLevel}} | Preferred length: {{briefLength}}

RETRIEVED WEB EVIDENCE
{{retrievedEvidence}}

AVAILABLE SOURCES
{{sourceList}}

CORE INSTRUCTIONS
1. Base factual statements only on the retrieved evidence provided above.
2. Use sources from the available source list. Do not invent or substitute sources.
3. Give each source a stable source ID, such as S1, S2, and S3.
4. Cite factual statements with the relevant source IDs, for example [S1].
5. A citation is valid only when the cited source actually supports the statement.
6. Do not create quotations. An evidence excerpt must appear in the supplied retrieved material and must preserve its meaning.
7. Do not invent URLs, authors, publishers, publication dates, statistics, research findings, or DOIs.
8. If the evidence does not support a claim, mark it as "unverified".
9. If sources disagree, describe the disagreement and cite the relevant sources.
10. Distinguish source-reported facts from analysis or interpretation.
11. Do not treat a domain or source category alone as proof that a claim is true.
12. If the retrieved evidence is insufficient, explain the limitation instead of filling the gap with unsupported information.
13. Return valid JSON only. Do not include Markdown fences or introductory text.

OUTPUT FORMAT (JSON Schema):
{
  "title": "Academic title",
  "researchQuestion": "The central research question",
  "executiveSummary": "A concise summary grounded in the evidence",
  "introduction": "Background, context, and definitions supported by evidence",
  "keyFindings": [{ "finding": "Concise evidence-based finding", "sourceIds": ["S1"] }],
  "evidenceAnalysis": "Analysis including relevant patterns, mechanisms, and differences",
  "limitationsAndConflictingInfo": "Evidence limitations, uncertainty, and conflicting findings",
  "conclusion": "A balanced conclusion based on the available evidence",
  "claims": [{
    "id": "CLM-001", "claimText": "Factual claim", "sourceIds": ["S1"],
    "evidenceExcerpt": "Short excerpt from retrieved evidence", "status": "supported",
    "confidenceScore": 90, "rationale": "Reasoning", "sectionRef": "Key Findings"
  }],
  "references": [{
    "sourceId": "S1", "title": "Exact title", "publisher": "Publisher",
    "url": "Exact URL", "publicationDate": "Date or null"
  }]
}

CLAIM STATUS RULES:
- "supported": cited evidence directly supports claim.
- "partially_supported": evidence supports only part or requires qualification.
- "contradicted": supplied evidence conflicts with claim.
- "unverified": supplied evidence does not establish claim."""
    code_box3 = Table([[Preformatted(p3_text, style_code)]], colWidths=[504])
    code_box3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(code_box3)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Improvements over Version 2:</b><br/>"
                           "• Uses retrieved evidence as the grounding context.<br/>"
                           "• Defines a predictable JSON structure for application processing.<br/>"
                           "• Connects individual claims to source IDs and evidence excerpts.<br/>"
                           "• Defines explicit claim-verification statuses.<br/>"
                           "• Requires the model to report insufficient or conflicting evidence.<br/>"
                           "• Avoids treating a source's domain or category as automatic proof of accuracy.", style_body))

    # Section 5
    story.append(Paragraph("5. Prompt Comparison", style_h1))
    headers5 = [Paragraph(h, style_table_hdr) for h in ["Evaluation Area", "Version 1: Basic", "Version 2: Multi-Stage", "Version 3: Grounded Structured"]]
    rows5 = [
        ["Instructions", "Minimal", "Detailed stages", "Detailed rules and schema"],
        ["Output consistency", "Not specified", "Partly specified", "JSON structure specified"],
        ["Claim-level citations", "Not required", "Requested", "Required through source IDs"],
        ["Evidence excerpts", "Not required", "Requested", "Required for claim records"],
        ["Conflicting evidence", "Not specified", "Requested", "Explicitly required"],
        ["Insufficient evidence", "Not specified", "Explicitly handled", "Explicit status and explanation"],
        ["Fabricated source prevention", "General request for reliability", "Explicit prohibition", "Explicit prohibition and source-list constraint"],
    ]
    t5_data = [headers5]
    for r in rows5:
        t5_data.append([
            Paragraph(f"<b>{r[0]}</b>", style_table_cell),
            Paragraph(r[1], style_table_cell),
            Paragraph(r[2], style_table_cell),
            Paragraph(f"<b>{r[3]}</b>", style_table_cell),
        ])
    t5 = Table(t5_data, colWidths=[114, 110, 130, 150])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t5)
    story.append(Spacer(1, 8))

    # Section 6
    story.append(Paragraph("6. Prompt Testing and Evaluation Method", style_h1))
    story.append(Paragraph("To compare the prompt versions fairly:<br/>"
                           "1. Use the same topic, academic level, and brief length for all versions.<br/>"
                           "2. Provide the same retrieved source material wherever the prompt design allows.<br/>"
                           "3. Save the prompt, model output, timestamp, and evaluation result for each run.<br/>"
                           "4. Evaluate the output using the rubric below.<br/>"
                           "5. Repeat tests where possible; do not treat a single run as proof of reliability.", style_body))

    headers6 = [Paragraph(h, style_table_hdr) for h in ["Criterion", "What to Check"]]
    rows6 = [
        ["Topic relevance", "Does the brief answer the requested topic?"],
        ["Source validity", "Do the cited sources exist in the supplied source list?"],
        ["Claim support", "Does each cited source support the associated claim?"],
        ["Evidence traceability", "Can the claim be traced to the supplied evidence excerpt?"],
        ["Output structure", "Does the output follow the required format?"],
        ["Balanced analysis", "Are limitations and conflicting findings represented?"],
        ["Honesty about uncertainty", "Are unsupported claims marked as unverified?"],
    ]
    t6_data = [headers6]
    for r in rows6:
        t6_data.append([
            Paragraph(f"<b>{r[0]}</b>", style_table_cell),
            Paragraph(r[1], style_table_cell),
        ])
    t6 = Table(t6_data, colWidths=[150, 354])
    t6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t6)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Scoring System:</b> 0 (Missing/incorrect), 1 (Partially meets), 2 (Fully meets). Maximum score: 14 points. Percentage score: (score / 14) × 100.", style_body))
    story.append(Paragraph("<b>Test Cases:</b> 1. General topic, 2. Technical topic, 3. Current topic, 4. Conflicting evidence, 5. Insufficient-evidence edge case.<br/>"
                           "<i>Important: Enter measured scores only after running tests. Do not present illustrative figures as verified results.</i>", style_body))

    # Section 7
    story.append(Paragraph("7. Final Prompt Selection", style_h1))
    story.append(Paragraph("<b>Version 3 is the recommended production prompt</b> because it provides the clearest structure for evidence-grounded generation and application-side validation.", style_body))
    story.append(Paragraph("However, prompt instructions alone do not guarantee factual correctness. The application should independently check source IDs, URLs, retrieved excerpts, and claim-to-source relationships. If the evidence is missing or insufficient, the application should show that limitation rather than generate replacement references.", style_body))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "docs/Prompt_Engineering_Documentation.pdf"
    build_pdf(out_path)


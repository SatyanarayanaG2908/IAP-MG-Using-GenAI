# FILE PATH: python-services/pdf_service/pdf_generator.py

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os
import io
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend - must be before pyplot import
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# ── Font Registration ──────────────────────────────────────────────────────────
def register_unicode_fonts():
    try:
        font_dir = "C:/Windows/Fonts/"
        font_mappings = {
            "NotoSansDevanagari": "NotoSansDevanagari-Regular.ttf",
            "NotoSansTelugu":     "NotoSansTelugu-Regular.ttf",
            "NotoSansTamil":      "NotoSansTamil-Regular.ttf",
            "NotoSansBengali":    "NotoSansBengali-Regular.ttf",
            "NotoSansGujarati":   "NotoSansGujarati-Regular.ttf",
            "NotoSansKannada":    "NotoSansKannada-Regular.ttf",
            "NotoSansMalayalam":  "NotoSansMalayalam-Regular.ttf",
            "NotoSansGurmukhi":   "NotoSansGurmukhi-Regular.ttf",
        }
        count = 0
        for name, file in font_mappings.items():
            path = os.path.join(font_dir, file)
            if os.path.exists(path):
                try:
                    pdfmetrics.registerFont(TTFont(name, path))
                    print(f"✅ Registered font: {name}")
                    count += 1
                except Exception as e:
                    print(f"⚠️ {name}: {e}")
            else:
                print(f"⚠️ Font not found: {file}")
        print(f"✅ Total fonts registered: {count}/8")
    except Exception as e:
        print(f"⚠️ Font registration error: {e}")

register_unicode_fonts()

def get_font_for_language(language: str) -> str:
    font_map = {
        "English": "Helvetica", "Hindi": "NotoSansDevanagari", "Telugu": "NotoSansTelugu",
        "Tamil": "NotoSansTamil", "Bengali": "NotoSansBengali", "Marathi": "NotoSansDevanagari",
        "Gujarati": "NotoSansGujarati", "Kannada": "NotoSansKannada",
        "Malayalam": "NotoSansMalayalam", "Punjabi": "NotoSansGurmukhi"
    }
    font_name = font_map.get(language, "Helvetica")
    try:
        pdfmetrics.getFont(font_name)
        return font_name
    except:
        return "Helvetica"

def get_disease_reason(disease: dict) -> str:
    reason = disease.get('reason', '')
    if reason and isinstance(reason, str) and reason.strip():
        return reason
    reasoning = disease.get('reasoning', '')
    if reasoning:
        if isinstance(reasoning, list):
            return '. '.join([str(r) for r in reasoning if r])
        elif isinstance(reasoning, str):
            return reasoning
    return 'Based on symptom analysis and clinical patterns.'

# ── Chart Generation ───────────────────────────────────────────────────────────
def generate_confidence_charts(diseases: list) -> bytes:
    """Generate side-by-side pie chart + bar chart, return PNG bytes"""
    if not diseases:
        return None
    
    names = [d.get('name', 'Unknown') for d in diseases]
    confidences = [float(d.get('confidence', 0)) for d in diseases]
    
    # Shorten long names for chart labels
    short_names = []
    for n in names:
        if len(n) > 22:
            short_names.append(n[:20] + '...')
        else:
            short_names.append(n)
    
    chart_colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][:len(diseases)]
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))
    fig.patch.set_facecolor('#f8fafc')
    
    # ── Pie Chart ──────────────────────────────────────────────────────────────
    wedges, texts, autotexts = ax1.pie(
        confidences,
        labels=None,
        colors=chart_colors,
        autopct='%1.0f%%',
        startangle=90,
        wedgeprops=dict(edgecolor='white', linewidth=2),
        pctdistance=0.75,
    )
    for at in autotexts:
        at.set_fontsize(11)
        at.set_fontweight('bold')
        at.set_color('white')
    
    ax1.set_title('Confidence Distribution', fontsize=13, fontweight='bold', color='#0f172a', pad=12)
    
    # Legend below pie
    legend_patches = [mpatches.Patch(color=chart_colors[i], label=short_names[i]) for i in range(len(diseases))]
    ax1.legend(handles=legend_patches, loc='lower center', bbox_to_anchor=(0.5, -0.22),
               fontsize=8.5, frameon=False, ncol=1)
    
    # ── Bar Chart ──────────────────────────────────────────────────────────────
    bars = ax2.barh(
        range(len(diseases)),
        confidences,
        color=chart_colors,
        edgecolor='white',
        linewidth=1.5,
        height=0.55,
    )
    
    # Add value labels on bars
    for i, (bar, val) in enumerate(zip(bars, confidences)):
        ax2.text(val + 1, bar.get_y() + bar.get_height()/2,
                 f'{val:.0f}%', va='center', ha='left',
                 fontsize=10, fontweight='bold', color='#0f172a')
    
    ax2.set_xlim(0, max(confidences) + 15)
    ax2.set_yticks(range(len(diseases)))
    ax2.set_yticklabels(short_names, fontsize=9.5, fontweight='bold')
    ax2.set_xlabel('Confidence (%)', fontsize=10, color='#64748b')
    ax2.set_title('Probability Analysis', fontsize=13, fontweight='bold', color='#0f172a', pad=12)
    ax2.set_facecolor('#ffffff')
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)
    ax2.spines['left'].set_color('#e2e8f0')
    ax2.spines['bottom'].set_color('#e2e8f0')
    ax2.tick_params(colors='#64748b')
    ax2.invert_yaxis()
    
    # Grid lines on bar chart
    ax2.xaxis.grid(True, linestyle='--', alpha=0.4, color='#e2e8f0')
    ax2.set_axisbelow(True)
    
    plt.tight_layout(pad=2.5)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight',
                facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return buf

# ── Page Numbers ───────────────────────────────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.setFont('Helvetica', 9)
        self.setFillColor(colors.grey)
        self.drawRightString(A4[0] - 40, 30, f"Page {self._pageNumber} of {page_count}")

# ── Main PDF Generator ─────────────────────────────────────────────────────────
def generate_pdf_report(user_data: dict, symptoms: str, analysis_result: dict, language: str) -> str:
    output_dir = os.path.join(os.path.dirname(__file__), 'outputs')
    os.makedirs(output_dir, exist_ok=True)

    # User info with safe fallbacks
    username    = user_data.get('username', 'patient')
    first_name  = user_data.get('first_name', '')
    last_name   = user_data.get('last_name', '')
    full_name   = f"{first_name} {last_name}".strip() or username
    age         = user_data.get('age', 'N/A')
    gender      = user_data.get('gender', 'N/A')
    blood_group = user_data.get('blood_group', 'N/A')
    phone       = user_data.get('phone', 'N/A')
    email       = user_data.get('email', 'N/A')

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    pdf_path  = os.path.join(output_dir, f"medical_report_{username}_{timestamp}.pdf")

    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            rightMargin=40, leftMargin=40,
                            topMargin=36, bottomMargin=50)
    story  = []
    styles = getSampleStyleSheet()

    selected_font = get_font_for_language(language)
    try:
        pdfmetrics.getFont(f"{selected_font}-Bold")
        bold_font = f"{selected_font}-Bold"
    except:
        bold_font = selected_font if selected_font != "Helvetica" else "Helvetica-Bold"

    # ── Styles ─────────────────────────────────────────────────────────────────
    title_style = ParagraphStyle('Title', parent=styles['Heading1'],
        fontSize=22, textColor=colors.HexColor('#0F4C75'),
        spaceAfter=6, alignment=TA_CENTER, fontName=bold_font, leading=26)

    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
        fontSize=10, textColor=colors.HexColor('#1B6CA8'),
        spaceAfter=14, alignment=TA_CENTER, fontName=selected_font, leading=13)

    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'],
        fontSize=13, textColor=colors.HexColor('#0F4C75'),
        spaceAfter=6, spaceBefore=12, fontName=bold_font,
        backColor=colors.HexColor('#EBF5FB'),
        leftIndent=8, rightIndent=8, leading=17)

    subheading_style = ParagraphStyle('SubHeading', parent=styles['Normal'],
        fontSize=11, textColor=colors.HexColor('#1B6CA8'),
        spaceAfter=4, spaceBefore=6, fontName=bold_font, leading=14)

    normal_style = ParagraphStyle('Normal2', parent=styles['Normal'],
        fontSize=10, textColor=colors.HexColor('#2D3748'),
        spaceAfter=5, fontName=selected_font, leading=14)

    small_style = ParagraphStyle('Small', parent=styles['Normal'],
        fontSize=9, textColor=colors.HexColor('#2D3748'),
        spaceAfter=4, fontName=selected_font, leading=12)

    bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'],
        fontSize=10, textColor=colors.HexColor('#2D3748'),
        spaceAfter=4, leftIndent=16, fontName=selected_font, leading=14)

    disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Normal'],
        fontSize=8.5, textColor=colors.HexColor('#78350F'),
        backColor=colors.HexColor('#FEF3C7'), borderColor=colors.HexColor('#FCD34D'),
        borderWidth=1, leftIndent=12, rightIndent=12,
        spaceBefore=8, spaceAfter=8, leading=12)

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 1 — TITLE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("MEDICAL DIAGNOSIS REPORT", title_style))
    story.append(Paragraph("AI-Powered Health Assessment  •  IAP-MG Using GenAI", subtitle_style))
    story.append(Spacer(1, 0.08*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 2 — PATIENT INFORMATION
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("Patient Information", heading_style))
    story.append(Spacer(1, 0.05*inch))

    patient_rows = [
        [Paragraph("<b>Full Name</b>", small_style),  Paragraph(str(full_name),   small_style),
         Paragraph("<b>Age</b>",        small_style),  Paragraph(str(age) + " yrs", small_style)],
        [Paragraph("<b>Gender</b>",     small_style),  Paragraph(str(gender),      small_style),
         Paragraph("<b>Blood Group</b>",small_style),  Paragraph(str(blood_group), small_style)],
        [Paragraph("<b>Phone</b>",      small_style),  Paragraph(str(phone),       small_style),
         Paragraph("<b>Email</b>",      small_style),  Paragraph(str(email),       small_style)],
        [Paragraph("<b>Language</b>",   small_style),  Paragraph(str(language),    small_style),
         Paragraph("<b>Report Date</b>",small_style),  Paragraph(datetime.now().strftime("%d %b %Y, %I:%M %p"), small_style)],
    ]

    col_w = [1.2*inch, 2.05*inch, 1.2*inch, 2.55*inch]
    pt = Table(patient_rows, colWidths=col_w)
    pt.setStyle(TableStyle([
        ('GRID',         (0,0), (-1,-1), 0.5, colors.HexColor('#D1E8F0')),
        ('BACKGROUND',   (0,0), (0,-1),  colors.HexColor('#EBF5FB')),
        ('BACKGROUND',   (2,0), (2,-1),  colors.HexColor('#EBF5FB')),
        ('ROWBACKGROUNDS',(0,0),(-1,-1), [colors.white, colors.HexColor('#F8FBFD')]),
        ('LEFTPADDING',  (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING',   (0,0), (-1,-1), 6),
        ('BOTTOMPADDING',(0,0), (-1,-1), 6),
        ('VALIGN',       (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(pt)
    story.append(Spacer(1, 0.15*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 3 — REPORTED SYMPTOMS
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("Reported Symptoms", heading_style))
    story.append(Spacer(1, 0.05*inch))
    clean_symptoms = str(symptoms).strip(', ') if symptoms else 'Not provided'
    # Wrap in a light box
    sym_data = [[Paragraph(clean_symptoms, normal_style)]]
    sym_table = Table(sym_data, colWidths=[7*inch])
    sym_table.setStyle(TableStyle([
        ('BACKGROUND',  (0,0), (-1,-1), colors.HexColor('#F0F9FF')),
        ('BOX',         (0,0), (-1,-1), 1, colors.HexColor('#BAE6FD')),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING',(0,0), (-1,-1), 14),
        ('TOPPADDING',  (0,0), (-1,-1), 10),
        ('BOTTOMPADDING',(0,0),(-1,-1), 10),
    ]))
    story.append(sym_table)
    story.append(Spacer(1, 0.15*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 4 — PRIMARY DIAGNOSIS
    # ══════════════════════════════════════════════════════════════════════════
    diseases     = analysis_result.get("diseases", [])
    final_disease = analysis_result.get("final_disease", diseases[0].get("name","") if diseases else "")

    story.append(Paragraph("Primary Diagnosis", heading_style))
    story.append(Spacer(1, 0.05*inch))

    primary_conf = next((d.get('confidence',0) for d in diseases if d.get('name') == final_disease), diseases[0].get('confidence',0) if diseases else 0)
    primary_data = [[
        Paragraph(f"<b>{final_disease}</b>", ParagraphStyle('PrimDisease', parent=styles['Normal'],
            fontSize=14, textColor=colors.HexColor('#1E3A8A'), fontName=bold_font, leading=18)),
        Paragraph(f"<b>{primary_conf}% Confidence</b>", ParagraphStyle('PrimConf', parent=styles['Normal'],
            fontSize=14, textColor=colors.HexColor('#16a34a'), fontName=bold_font, leading=18, alignment=1)),
    ]]
    prim_table = Table(primary_data, colWidths=[4.5*inch, 2.5*inch])
    prim_table.setStyle(TableStyle([
        ('BACKGROUND',  (0,0), (-1,-1), colors.HexColor('#DBEAFE')),
        ('BOX',         (0,0), (-1,-1), 2, colors.HexColor('#2563EB')),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING',(0,0), (-1,-1), 14),
        ('TOPPADDING',  (0,0), (-1,-1), 12),
        ('BOTTOMPADDING',(0,0),(-1,-1),12),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('ROUNDEDCORNERS', (0,0), (-1,-1), 6),
    ]))
    story.append(prim_table)
    story.append(Spacer(1, 0.18*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 5 — CONFIDENCE CHARTS (Pie + Bar)
    # ══════════════════════════════════════════════════════════════════════════
    if len(diseases) > 0:
        story.append(Paragraph("Confidence Analysis — Visual Overview", heading_style))
        story.append(Spacer(1, 0.08*inch))
        try:
            chart_buf = generate_confidence_charts(diseases)
            if chart_buf:
                chart_img = Image(chart_buf, width=7*inch, height=3.2*inch)
                story.append(chart_img)
                story.append(Spacer(1, 0.15*inch))
        except Exception as e:
            print(f"⚠️ Chart generation failed: {e}")
            story.append(Paragraph(f"[Chart unavailable: {str(e)}]", small_style))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 6 — ANALYSIS RESULTS TABLE (Top 3 diseases)
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("Analysis Results — All Conditions", heading_style))
    story.append(Spacer(1, 0.08*inch))

    table_data = [[
        Paragraph("<b>#</b>",                  small_style),
        Paragraph("<b>Disease / Condition</b>", small_style),
        Paragraph("<b>Confidence</b>",          small_style),
        Paragraph("<b>Clinical Reasoning</b>",  small_style),
    ]]
    for i, disease in enumerate(diseases):
        if not isinstance(disease, dict):
            continue
        is_primary = disease.get("name", "") == final_disease
        reason_text = get_disease_reason(disease)
        rank_text   = f"<b>#{i+1}</b>{'  ★' if is_primary else ''}"
        name_text   = f"<b>{disease.get('name','Unknown')}</b>{'  (Primary)' if is_primary else ''}"
        table_data.append([
            Paragraph(rank_text,  small_style),
            Paragraph(name_text,  small_style),
            Paragraph(f"<b>{disease.get('confidence',0)}%</b>", small_style),
            Paragraph(str(reason_text), small_style),
        ])

    dt = Table(table_data, colWidths=[0.45*inch, 2.1*inch, 0.75*inch, 3.7*inch], repeatRows=1, splitByRow=1)
    dt.setStyle(TableStyle([
        ('BACKGROUND',  (0,0), (-1,0), colors.HexColor('#1B6CA8')),
        ('TEXTCOLOR',   (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN',       (0,0), (-1,0), 'CENTER'),
        ('TOPPADDING',  (0,0), (-1,0), 8), ('BOTTOMPADDING',(0,0),(-1,0), 8),
        # Highlight primary row
        ('BACKGROUND',  (0,1), (-1,1), colors.HexColor('#DBEAFE')),
        ('TEXTCOLOR',   (0,1), (-1,1), colors.HexColor('#1E3A8A')),
        ('VALIGN',      (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 7), ('RIGHTPADDING',(0,0),(-1,-1), 7),
        ('TOPPADDING',  (0,1), (-1,-1), 6), ('BOTTOMPADDING',(0,1),(-1,-1),6),
        ('GRID',        (0,0), (-1,-1), 0.7, colors.HexColor('#CCCCCC')),
        ('ROWBACKGROUNDS',(0,2),(-1,-1), [colors.white, colors.HexColor('#F8FBFD')]),
        ('ALIGN',       (2,1), (2,-1), 'CENTER'),
    ]))
    story.append(dt)
    story.append(Spacer(1, 0.18*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 7 — MEDICINES
    # ══════════════════════════════════════════════════════════════════════════
    medical_plan = analysis_result.get('medical_plan', {})
    medicines    = medical_plan.get('medicines', [])

    if medicines:
        story.append(Paragraph("Treatment Plan — Medicines", heading_style))
        story.append(Spacer(1, 0.08*inch))
        med_header = [[
            Paragraph("<b>Medicine</b>",    small_style),
            Paragraph("<b>Dosage</b>",      small_style),
            Paragraph("<b>Frequency</b>",   small_style),
            Paragraph("<b>Duration</b>",    small_style),
            Paragraph("<b>Instructions</b>",small_style),
        ]]
        med_rows = []
        for med in medicines:
            if not isinstance(med, dict):
                continue
            side = med.get('sideEffects', med.get('side_effects', ''))
            instr = med.get('foodInstruction', med.get('food_instruction', 'As directed'))
            if side:
                instr += f"\nSide effects: {side}"
            med_rows.append([
                Paragraph(str(med.get('name', 'N/A')),      small_style),
                Paragraph(str(med.get('dosage', 'N/A')),    small_style),
                Paragraph(str(med.get('frequency', 'N/A')), small_style),
                Paragraph(str(med.get('duration', 'N/A')),  small_style),
                Paragraph(str(instr),                        small_style),
            ])
        if med_rows:
            mt = Table(med_header + med_rows, colWidths=[1.9*inch, 0.85*inch, 1.15*inch, 0.95*inch, 2.15*inch], repeatRows=1)
            mt.setStyle(TableStyle([
                ('BACKGROUND',  (0,0), (-1,0), colors.HexColor('#1B6CA8')),
                ('TEXTCOLOR',   (0,0), (-1,0), colors.whitesmoke),
                ('GRID',        (0,0), (-1,-1), 0.7, colors.HexColor('#CCCCCC')),
                ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white, colors.HexColor('#F8FBFD')]),
                ('TOPPADDING',  (0,0), (-1,-1), 6),
                ('BOTTOMPADDING',(0,0),(-1,-1), 6),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('VALIGN',      (0,0), (-1,-1), 'TOP'),
            ]))
            story.append(mt)
        story.append(Spacer(1, 0.15*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 8 — DIET RECOMMENDATIONS
    # ══════════════════════════════════════════════════════════════════════════
    diet = medical_plan.get('diet', {})
    if diet and isinstance(diet, dict):
        story.append(Paragraph("Diet Recommendations", heading_style))
        story.append(Spacer(1, 0.05*inch))
        recommended = diet.get('recommended', [])
        avoid       = diet.get('avoid', [])

        diet_rows = []
        if recommended:
            diet_rows.append([
                Paragraph("✅ <b>Recommended</b>", small_style),
                Paragraph(", ".join(str(r) for r in recommended), small_style),
            ])
        if avoid:
            diet_rows.append([
                Paragraph("❌ <b>Avoid</b>", small_style),
                Paragraph(", ".join(str(a) for a in avoid), small_style),
            ])
        if diet_rows:
            dtable = Table(diet_rows, colWidths=[1.3*inch, 5.7*inch])
            dtable.setStyle(TableStyle([
                ('GRID',        (0,0), (-1,-1), 0.5, colors.HexColor('#D1FAE5')),
                ('BACKGROUND',  (0,0), (0,-1), colors.HexColor('#ECFDF5')),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('RIGHTPADDING',(0,0), (-1,-1), 10),
                ('TOPPADDING',  (0,0), (-1,-1), 7),
                ('BOTTOMPADDING',(0,0),(-1,-1), 7),
                ('VALIGN',      (0,0), (-1,-1), 'TOP'),
            ]))
            story.append(dtable)
        story.append(Spacer(1, 0.15*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 9 — PRECAUTIONS
    # ══════════════════════════════════════════════════════════════════════════
    precautions = medical_plan.get('precautions', [])
    if precautions:
        story.append(Paragraph("Precautions & Safety Measures", heading_style))
        story.append(Spacer(1, 0.05*inch))
        for p in precautions:
            story.append(Paragraph(f"• {str(p)}", bullet_style))
        story.append(Spacer(1, 0.12*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 10 — RECOVERY TIMELINE & CONFIDENCE
    # ══════════════════════════════════════════════════════════════════════════
    recovery = analysis_result.get('recovery', {})
    if recovery and isinstance(recovery, dict):
        story.append(Paragraph("Recovery Timeline & Outlook", heading_style))
        story.append(Spacer(1, 0.05*inch))

        rec_duration   = recovery.get('duration', 'Varies')
        rec_confidence = recovery.get('confidence', 'Moderate')
        rec_timeline   = recovery.get('timeline', 'Follow treatment plan for best results.')

        rec_rows = []
        if rec_duration:
            rec_rows.append([Paragraph("⏱ <b>Expected Duration</b>", small_style), Paragraph(str(rec_duration), normal_style)])
        if rec_confidence:
            rec_rows.append([Paragraph("📊 <b>Recovery Confidence</b>", small_style), Paragraph(str(rec_confidence), normal_style)])
        if rec_timeline:
            rec_rows.append([Paragraph("📋 <b>Timeline Notes</b>", small_style), Paragraph(str(rec_timeline), normal_style)])

        if rec_rows:
            rtable = Table(rec_rows, colWidths=[1.7*inch, 5.3*inch])
            rtable.setStyle(TableStyle([
                ('GRID',        (0,0), (-1,-1), 0.5, colors.HexColor('#E0E7FF')),
                ('BACKGROUND',  (0,0), (0,-1), colors.HexColor('#EEF2FF')),
                ('ROWBACKGROUNDS',(0,0),(-1,-1),[colors.white, colors.HexColor('#F5F7FF')]),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('RIGHTPADDING',(0,0), (-1,-1), 10),
                ('TOPPADDING',  (0,0), (-1,-1), 8),
                ('BOTTOMPADDING',(0,0),(-1,-1), 8),
                ('VALIGN',      (0,0), (-1,-1), 'TOP'),
            ]))
            story.append(rtable)
        story.append(Spacer(1, 0.2*inch))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 11 — DISCLAIMER
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(
        "⚠️  MEDICAL DISCLAIMER: This report is generated by an AI system (Google Gemini) "
        "for informational and educational purposes only. It does NOT constitute professional "
        "medical advice, diagnosis, or treatment. Always consult a qualified, licensed healthcare "
        "provider before making any medical decisions. In case of emergency, call your local "
        "emergency services immediately.",
        disclaimer_style
    ))

    # Build PDF
    print(f"📄 Building PDF — font: {selected_font} | language: {language}")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ PDF generated: {pdf_path}")
    return pdf_path
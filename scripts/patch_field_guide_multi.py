# One-off builder: multi-project field guide. Run from ic-review-app: python3 scripts/patch_field_guide_multi.py
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "field-guide.html"
text = path.read_text(encoding="utf-8")

m_open = re.search(
    r'<div class="card-scroll" id="cardScroll">\s*<div class="card-wrap">\s*',
    text,
)
if not m_open:
    raise SystemExit("open marker not found")
m_close = re.search(
    r"\s*</div><!-- card-wrap -->\s*</div><!-- card-scroll -->", text[m_open.end() :]
)
if not m_close:
    raise SystemExit("close marker not found")
inner_start = m_open.end()
inner_end = m_open.end() + m_close.start()
holycow_inner = text[inner_start:inner_end]

holycow_inner = re.sub(
    r"\s*<p style=\"font-size:10px;color:#64748b;margin-bottom:8px;line-height:1\.45\">[\s\S]*?</p>\s*\n\s*<table class=\"tbl\">",
    "\n        <table class=\"tbl\">",
    holycow_inner,
    count=1,
)

old_full_start = m_open.start()
old_full_end = m_open.end() + m_close.end()
new_scroll = """<div class="card-scroll" id="cardScroll">
  <div id="guideMount" class="card-wrap"></div>
  </div><!-- card-scroll -->"""
text = text[:old_full_start] + new_scroll + text[old_full_end:]

if '<div id="projectHome"' not in text:
    text = text.replace(
        "<body>\n\n<div class=\"topbar\">",
        """<body>

<div id="projectHome" class="project-home">
  <div class="project-home-inner">
    <h1 class="ph-title">IC Review — Interactive field guides</h1>
    <p class="ph-sub">Choose a project to open the same layout as production, with badges you can click to read field logic.</p>
    <div class="ph-grid">
      <a class="ph-card" href="?p=holycow">
        <div class="ph-card-top">
          <span class="proj-brand ph-muted">Steak Hotel by Holycow</span>
          <span class="tag tag-slate">Asset Class A</span>
        </div>
        <div class="ph-card-title ph-link">Steak Hotel by Holycow Medan</div>
        <div class="ph-card-amt">Rp 3.100.000.000</div>
        <div class="ph-card-meta">Analyst: Priska Ponggawa · Submitted 19 Feb 2026</div>
        <div class="ph-card-badges"><span class="tag tag-blue">Project</span><span class="ph-vote">4/5 voted</span></div>
      </a>
      <a class="ph-card" href="?p=cum">
        <div class="ph-card-top">
          <span class="proj-brand ph-muted">Cipta Usaha Media</span>
          <span class="tag tag-slate">B - PO</span>
        </div>
        <div class="ph-card-title ph-link">Cipta Usaha Media (#26) — PO Financing: Orang Tua</div>
        <div class="ph-card-amt">Rp 249.000.000</div>
        <div class="ph-card-meta">Analyst: Nila Layla Melinda · Submitted 31 Mar 2026</div>
        <div class="ph-card-badges"><span class="tag tag-blue">PO/Invoice</span><span class="ph-vote">1/3 voted</span></div>
      </a>
      <a class="ph-card" href="?p=cea">
        <div class="ph-card-top">
          <span class="proj-brand ph-muted">Cahaya Energi Asia</span>
          <span class="tag tag-slate">B - PO</span>
        </div>
        <div class="ph-card-title ph-link">Cahaya Energi Asia - Aztech #1</div>
        <div class="ph-card-amt">Rp 6.000.000.000</div>
        <div class="ph-card-meta">Analyst: Junaidi · Submitted 23 Oct 2025</div>
        <div class="ph-card-badges">
          <span class="tag tag-purple">PO/Invoice+Plafond</span>
          <span class="tag ph-tag-red">1 error</span>
          <span class="tag ph-tag-warn">1 warning</span>
          <span class="ph-vote">1/3 voted</span>
        </div>
        <div class="ph-card-footwarn">
          <div class="ph-inline-warn">More than 6 months ago (submitted 2025-10-20).</div>
          <div class="ph-inline-err">SLIK-Key Person file missing for key person: KP signatory (from diligence). Must be received before disbursement.</div>
        </div>
      </a>
    </div>
  </div>
</div>

<div id="guideShell" class="guide-shell" hidden>
<div class="topbar" id="guideTopbar">""",
        1,
    )

text = text.replace(
    """<div class="topbar" id="guideTopbar">
  <div>
    <h1>IC Review Card — Interactive Field Guide</h1>
    <p>Steak Hotel by Holycow Medan &nbsp;·&nbsp; Coda row i-iNREe2I8Sx &nbsp;·&nbsp; Pending IC Review</p>
  </div>
  <div class="topbar-hint">👆 Click any badge or label to inspect a field</div>
</div>""",
    """<div class="topbar" id="guideTopbar">
  <div>
    <h1>IC Review Card — Interactive Field Guide</h1>
    <p id="topbarProjectLine">Pick a project from the home screen</p>
    <div class="topbar-switch">
      <span class="topbar-switch-label">Project</span>
      <a class="topbar-switch-a" href="?p=holycow">Holycow</a>
      <a class="topbar-switch-a" href="?p=cum">Cipta Usaha Media</a>
      <a class="topbar-switch-a" href="?p=cea">Cahaya Energi Asia</a>
      <a class="topbar-switch-home" href="field-guide.html">All projects</a>
    </div>
  </div>
  <div class="topbar-hint">👆 Click any badge or label to inspect a field</div>
</div>""",
    1,
)

text = text.replace(
    "</div><!-- body-wrap -->\n\n",
    "</div><!-- body-wrap -->\n\n</div><!-- guideShell -->\n\n",
    1,
)

css_add = """
/* Project picker home */
.project-home {
  position: fixed; inset: 0; z-index: 200;
  background: linear-gradient(165deg, #f8fafc 0%, #e2e8f0 100%);
  overflow-y: auto; padding: 32px 20px 48px;
}
.project-home-inner { max-width: 960px; margin: 0 auto; }
.ph-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.ph-sub { font-size: 13px; color: #64748b; margin-bottom: 28px; line-height: 1.5; }
.ph-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.ph-card {
  display: block; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  padding: 18px 18px 16px; text-decoration: none; color: inherit;
  box-shadow: 0 1px 3px rgba(15,23,42,0.06);
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
}
.ph-card:hover {
  border-color: #93c5fd; box-shadow: 0 8px 24px rgba(30,64,175,0.12);
  transform: translateY(-2px);
}
.ph-card-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
.ph-muted { font-size: 12px; color: #64748b; font-weight: 500; }
.ph-card-title { font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px; line-height: 1.35; }
.ph-card-amt { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.ph-card-meta { font-size: 11px; color: #94a3b8; line-height: 1.45; margin-bottom: 10px; }
.ph-card-badges { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.ph-vote { font-size: 11px; color: #94a3b8; margin-left: 4px; }
.ph-tag-red { background: #fee2e2; color: #b91c1c; }
.ph-tag-warn { background: #fef3c7; color: #92400e; }
.ph-card-footwarn { margin-top: 12px; padding-top: 10px; border-top: 1px solid #f1f5f9; font-size: 11px; line-height: 1.45; }
.ph-inline-warn { color: #d97706; margin-bottom: 6px; }
.ph-inline-warn::before { content: "⚠ "; }
.ph-inline-err { color: #dc2626; }
.ph-inline-err::before { content: "✕ "; }
.guide-shell { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.guide-shell .body-wrap { flex: 1; min-height: 0; }
.topbar-switch {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px;
  margin-top: 10px; font-size: 11px;
}
.topbar-switch-label { color: #93c5fd; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.topbar-switch-a, .topbar-switch-home {
  color: #fff; opacity: 0.85; text-decoration: underline; text-underline-offset: 2px;
}
.topbar-switch-a:hover, .topbar-switch-home:hover { opacity: 1; }
.topbar-switch-home { margin-left: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.35); }
.banner-item-err {
  font-size: 12px; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 8px; padding: 10px 12px; line-height: 1.45;
}
.banner-item-warn {
  font-size: 12px; color: #92400e; background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 8px; padding: 10px 12px; line-height: 1.45;
}
"""
if ".project-home" not in text:
    text = text.replace("</style>", css_add + "\n</style>", 1)

cum_path = Path(__file__).with_name("field_guide_tpl_cum.html")
cea_path = Path(__file__).with_name("field_guide_tpl_cea.html")
TPL_CUM = cum_path.read_text(encoding="utf-8")
TPL_CEA = cea_path.read_text(encoding="utf-8")

holycow_block = (
    '<template id="tpl-guide-holycow">\n  <div id="guideMount" class="card-wrap">\n'
    + holycow_inner.replace('<a class="page-back" href="#">', '<a class="page-back" href="field-guide.html">', 1)
    + "  </div>\n</template>\n\n"
)

insert_point = text.index("<script>")
text = text[:insert_point] + holycow_block + TPL_CUM + "\n" + TPL_CEA + "\n" + text[insert_point:]

path.write_text(text, encoding="utf-8")
print("OK:", path)

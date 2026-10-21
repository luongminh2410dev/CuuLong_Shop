// Batch test render LaTeX cho dữ liệu đề thi tuyensinh247, replicate CHÍNH XÁC
// hành vi của thư viện react-latex-next (split delimiter + katex.renderToString,
// strict=false). Mục tiêu: với từng field cần test, xác định field có chứa LaTeX
// hay không; nếu có thì render thử và đánh dấu PASS/FAIL + lý do lỗi.
//
// Cách chạy:
//   node scripts/latex-batch-test.mjs <id1> <id2> ...
//   node scripts/latex-batch-test.mjs --csv <path-to-exam_id.csv> --limit 10
//
// Output:
//   <outDir>/latex-test-result.csv   — bảng audit pass/fail từng field
//   <outDir>/latex-test-report.html  — xem trực quan kết quả render

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
// Cấu hình KaTeX + các điểm tiền xử lý dùng chung (xem lib/katex-config.js).
// HTML-decode KHÔNG nằm trong file đó (xử lý HTML chung) -> làm riêng ở dưới.
import {
  KATEX_DELIMITERS,
  KATEX_MACROS,
  applyKatexRewrites,
  PREPROCESS_NOTES,
} from '../lib/katex-config.js';

const require = createRequire(import.meta.url);
// Dùng đúng katex mà react-latex-next dùng (hoisted ở node_modules gốc).
const katex = require('katex');

const API = 'https://api.tuyensinh247.com/v1/exam/questions?exam_id=';
const HEADERS = {
  token: '76VGQauxbzu2T6KJLs6apde9lpK',
  'X-os': 'ios',
  'X-app-version': '1.11.9',
};

// 7 field cần test theo yêu cầu.
const FIELDS = ['answer_a', 'answer_b', 'answer_c', 'answer_d', 'answer_vip', 'description', 'question_guide'];

const OUT_DIR = '/Users/minhla/Downloads';

// Delimiters + macros lấy thẳng từ config dùng chung.
const DELIMITERS = KATEX_DELIMITERS;
const MACROS = KATEX_MACROS;

// Mô tả cấu hình + tiền xử lý để hiển thị trong HTML report (lấy từ config).
const KATEX_VERSION = require('katex/package.json').version;
const CONFIG_NOTES = {
  library: `react-latex-next@${require('react-latex-next/package.json').version} + katex@${KATEX_VERSION}`,
  delimiters: PREPROCESS_NOTES.delimiters,
  detection: `katex.renderToString với throwOnError=true; field FAIL nếu BẤT KỲ fragment math nào throw`,
  preprocess: [
    PREPROCESS_NOTES.htmlDecodeNote,
    ...PREPROCESS_NOTES.rewrites,
    ...PREPROCESS_NOTES.macros.map((m) => `Macro: ${m}`),
  ],
  filter: 'Chỉ test field có chứa ≥1 fragment LaTeX (giữa các delimiter). Field không có LaTeX bị bỏ qua.',
};

// ---------------------------------------------------------------------------
// splitAtDelimiters + findEndOfMath: COPY nguyên văn từ
// node_modules/react-latex-next/dist/index.js để đảm bảo tách fragment y hệt.
// ---------------------------------------------------------------------------
function findEndOfMath(delimiterValue, text, startIndex) {
  let index = startIndex;
  let braceLevel = 0;
  const delimLength = delimiterValue.length;
  while (index < text.length) {
    const character = text[index];
    if (braceLevel <= 0 && text.slice(index, index + delimLength) === delimiterValue) {
      return index;
    } else if (character === '\\') {
      index++;
    } else if (character === '{') {
      braceLevel++;
    } else if (character === '}') {
      braceLevel--;
    }
    index++;
  }
  return -1;
}

function escapeRegex(text) {
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const amsRegex = /^\\begin{/;

function splitAtDelimiters(text, delimiters) {
  let index;
  const data = [];
  const regexLeft = new RegExp('(' + delimiters.map((x) => escapeRegex(x.left)).join('|') + ')');
  while (true) {
    index = text.search(regexLeft);
    if (index === -1) break;
    if (index > 0) {
      data.push({ type: 'text', data: text.slice(0, index) });
      text = text.slice(index);
    }
    const i = delimiters.findIndex((delim) => text.startsWith(delim.left));
    index = findEndOfMath(delimiters[i].right, text, delimiters[i].left.length);
    if (index === -1) break;
    const rawData = text.slice(0, index + delimiters[i].right.length);
    const math = amsRegex.test(rawData) ? rawData : text.slice(delimiters[i].left.length, index);
    data.push({ type: 'math', data: math, rawData, display: delimiters[i].display });
    text = text.slice(index + delimiters[i].right.length);
  }
  if (text !== '') data.push({ type: 'text', data: text });
  return data;
}

// ---------------------------------------------------------------------------
// Render 1 chuỗi theo đúng cách react-latex-next làm.
// Trả về { html, mathCount, fails:[{latex, error}] }.
// fails rỗng => PASS.
// ---------------------------------------------------------------------------
function renderLikeLibrary(text, macros = {}) {
  const parts = splitAtDelimiters(text, DELIMITERS);
  const fragments = [];
  const fails = [];
  let mathCount = 0;
  for (const part of parts) {
    if (part.type === 'text') {
      fragments.push(part.data);
    } else {
      mathCount++;
      try {
        // react-latex-next gọi katex.renderToString(latex, { displayMode, macros })
        // => throwOnError mặc định = true. Nếu throw => fragment fail.
        const rendered = katex.renderToString(part.data, { displayMode: part.display, macros });
        fragments.push(rendered);
      } catch (err) {
        fails.push({ latex: part.data, error: (err && err.message) || String(err) });
        // strict=false: thư viện nuốt lỗi, hiển thị raw -> bọc span đỏ trong report.
        fragments.push(`<span style="color:#cc0000" title="${escapeHtml(String(err && err.message))}">${escapeHtml(part.rawData || part.data)}</span>`);
      }
    }
  }
  return { html: fragments.join(''), mathCount, fails };
}

// ---------------------------------------------------------------------------
// Giải mã HTML entities (để: (1) tạo content_text dễ đọc; (2) tính thử xem nếu
// decode trước khi render thì có pass không -> tư vấn tiền xử lý).
// ---------------------------------------------------------------------------
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü',
  yacute: 'ý', ntilde: 'ñ', ccedil: 'ç',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Egrave: 'È', Eacute: 'É', Ecirc: 'Ê',
  Igrave: 'Ì', Iacute: 'Í', Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô',
  Ugrave: 'Ù', Uacute: 'Ú',
  hellip: '…', ndash: '–', mdash: '—', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  times: '×', divide: '÷', deg: '°', plusmn: '±', middot: '·', laquo: '«', raquo: '»',
};

function decodeEntities(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => safeCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => (name in NAMED ? NAMED[name] : m));
}

function safeCodePoint(cp) {
  try { return String.fromCodePoint(cp); } catch { return ''; }
}

// Tiền xử lý chuẩn trước khi render:
//   (1) HTML-decode (ngoài config — xử lý HTML chung)
//   (2) applyKatexRewrites: các string-rewrite của KaTeX (trong lib/katex-config.js)
// Macros (\mspace -> \mskip ...) áp ở tầng render, không phải ở đây.
function preprocess(raw) {
  return applyKatexRewrites(decodeEntities(String(raw == null ? '' : raw)));
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// content_text dễ đọc: decode entity rồi bỏ tag HTML.
function toReadable(raw) {
  return decodeEntities(String(raw == null ? '' : raw))
    .replace(/<img[^>]*>/gi, '[img]')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------
function csvCell(v) {
  const s = v == null ? '' : String(v);
  return '"' + s.replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

// ---------------------------------------------------------------------------
async function fetchExam(id) {
  const res = await fetch(API + id, { headers: HEADERS });
  const json = await res.json();
  return json;
}

function parseArgs() {
  const a = process.argv.slice(2);
  const ids = [];
  let csv = null, limit = 10;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--csv') csv = a[++i];
    else if (a[i] === '--limit') limit = parseInt(a[++i], 10);
    else ids.push(a[i].trim());
  }
  if (csv) {
    const fromCsv = fs.readFileSync(csv, 'utf8').trim().split(/\r?\n/).slice(1)
      .map((s) => s.trim()).filter(Boolean);
    ids.push(...fromCsv.slice(0, limit));
  }
  return ids;
}

async function main() {
  const ids = parseArgs();
  if (!ids.length) {
    console.error('Cần truyền ít nhất 1 exam id. VD: node scripts/latex-batch-test.mjs 160781');
    process.exit(1);
  }
  console.log('Sẽ test', ids.length, 'đề:', ids.join(', '));

  const rows = []; // cho CSV
  const reportItems = []; // cho HTML
  const summary = { exams_ok: 0, exams_err: 0, questions: 0, fields_total: 0, latex_fields: 0, pass: 0, fail: 0, rescued_by_preprocess: 0 };

  for (const id of ids) {
    let json;
    try {
      json = await fetchExam(id);
    } catch (e) {
      summary.exams_err++;
      console.log(`  ✗ exam ${id}: fetch lỗi ${e.message}`);
      continue;
    }
    const questions = json && json.data && json.data.questions;
    if (!Array.isArray(questions) || !questions.length) {
      summary.exams_err++;
      console.log(`  ✗ exam ${id}: không có questions (message="${json && json.message}")`);
      continue;
    }
    summary.exams_ok++;
    console.log(`  ✓ exam ${id}: ${questions.length} câu hỏi`);

    questions.forEach((q, qIdx) => {
      summary.questions++;
      for (const field of FIELDS) {
        const raw = q[field];
        summary.fields_total++;
        if (raw == null || String(raw).trim() === '') continue;

        // *** TIỀN XỬ LÝ: HTML-decode + normalize *{n}{l} TRƯỚC khi render ***
        const pre = preprocess(raw);

        // FILTER: field có chứa LaTeX không? = có >=1 fragment math.
        const probe = splitAtDelimiters(pre, DELIMITERS);
        const hasMath = probe.some((p) => p.type === 'math');
        if (!hasMath) continue; // không phải latex -> bỏ qua

        summary.latex_fields++;

        // Render trên dữ liệu ĐÃ tiền xử lý + macros (luồng chính).
        const r = renderLikeLibrary(pre, MACROS);
        const pass = r.fails.length === 0;

        // So sánh: render dữ liệu THÔ (không tiền xử lý, không macros) -> baseline thư viện.
        const rRaw = renderLikeLibrary(String(raw), {});
        const passRaw = rRaw.fails.length === 0;

        if (pass) summary.pass++;
        else summary.fail++;
        if (!passRaw && pass) summary.rescued_by_preprocess++;

        const errMsg = r.fails.map((f) => `[${f.latex}] => ${f.error}`).join(' ||| ');

        rows.push({
          exam_id: id,
          question_id: q.id,
          q_index: qIdx,
          field,
          content_text: toReadable(raw),
          math_source: probe.filter((p) => p.type === 'math').map((p) => p.data).join(' ||| '),
          pass: pass ? 'PASS' : 'FAIL',
          error: errMsg,
          pass_without_preprocess: passRaw ? 'PASS' : 'FAIL',
          rescued_by_preprocess: (!passRaw && pass) ? 'YES' : '',
          raw_value: String(raw),
        });

        reportItems.push({
          exam_id: id, question_id: q.id, q_index: qIdx, field,
          pass, rescued: (!passRaw && pass), html: r.html, content: toReadable(raw), errMsg,
        });
      }
    });
  }

  // --- Ghi CSV ---
  const headers = ['exam_id', 'question_id', 'q_index', 'field', 'content_text', 'math_source', 'pass', 'error', 'pass_without_preprocess', 'rescued_by_preprocess', 'raw_value'];
  const csvLines = [headers.join(',')];
  for (const row of rows) csvLines.push(headers.map((h) => csvCell(row[h])).join(','));
  const csvPath = path.join(OUT_DIR, 'latex-test-result.csv');
  fs.writeFileSync(csvPath, '﻿' + csvLines.join('\r\n'), 'utf8'); // BOM cho Excel mở tiếng Việt

  // --- Ghi HTML report ---
  const htmlPath = path.join(OUT_DIR, 'latex-test-report.html');
  fs.writeFileSync(htmlPath, buildReport(reportItems, summary, ids.join(', ')), 'utf8');

  // --- In summary ---
  console.log('\n===== KẾT QUẢ =====');
  console.log(`Đề OK / lỗi:            ${summary.exams_ok} / ${summary.exams_err}`);
  console.log(`Tổng câu hỏi:           ${summary.questions}`);
  console.log(`Tổng field quét:        ${summary.fields_total}`);
  console.log(`Field có LaTeX (tested): ${summary.latex_fields}`);
  console.log(`  PASS (sau tiền xử lý):  ${summary.pass}`);
  console.log(`  FAIL:                 ${summary.fail}`);
  console.log(`  (số field được CỨU nhờ tiền xử lý: ${summary.rescued_by_preprocess})`);
  console.log('\nCSV:    ' + csvPath);
  console.log('Report: ' + htmlPath);
}

function buildReport(items, summary, examIdsLabel) {
  const cards = items.map((it) => `
    <div class="card ${it.pass ? 'pass' : 'fail'}">
      <div class="meta">
        <span class="badge ${it.pass ? 'b-pass' : 'b-fail'}">${it.pass ? 'PASS' : 'FAIL'}</span>
        ${it.rescued ? '<span class="badge b-warn">được cứu nhờ tiền xử lý</span>' : ''}
        <code>exam ${it.exam_id} · q#${it.q_index} (id ${it.question_id}) · ${it.field}</code>
      </div>
      <div class="rendered">${it.html}</div>
      ${it.errMsg ? `<div class="err">${escapeHtml(it.errMsg)}</div>` : ''}
    </div>`).join('\n');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LaTeX test report</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/katex.min.css">
<style>
  body{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#f1f5f9;margin:0;padding:24px;color:#0f172a}
  h1{font-size:20px}
  .sum{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;gap:20px;flex-wrap:wrap}
  .sum b{font-size:22px;display:block}
  .cfg{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;color:#334155}
  .cfg h2{margin:0 0 10px;font-size:14px;color:#0f172a}
  .cfg .row{display:flex;gap:8px;margin:4px 0}
  .cfg .k{flex:0 0 130px;color:#64748b;font-weight:600}
  .cfg code{background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:12px}
  .cfg ol{margin:4px 0 0;padding-left:20px}
  .cfg li{margin:3px 0}
  .card{background:#fff;border:1px solid #e2e8f0;border-left-width:5px;border-radius:10px;padding:14px;margin-bottom:12px}
  .card.pass{border-left-color:#16a34a}
  .card.fail{border-left-color:#dc2626}
  .meta{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px;color:#64748b;flex-wrap:wrap}
  .badge{font-weight:700;font-size:11px;padding:2px 8px;border-radius:999px}
  .b-pass{background:#dcfce7;color:#15803d}.b-fail{background:#fee2e2;color:#b91c1c}.b-warn{background:#fef9c3;color:#a16207}
  .rendered{font-size:16px;line-height:1.8}
  .rendered img{max-width:280px;display:block;margin:8px 0;border:1px solid #e2e8f0;border-radius:6px}
  .err{margin-top:8px;font-family:ui-monospace,monospace;font-size:12px;color:#b91c1c;background:#fef2f2;padding:8px;border-radius:6px;white-space:pre-wrap}
  .filters{margin-bottom:16px}
  button{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;margin-right:6px}
  button.active{background:#0f172a;color:#fff}
</style></head><body>
<h1>Kết quả test hiển thị LaTeX — react-latex-next</h1>
<div class="sum">
  <div>Field có LaTeX<b>${summary.latex_fields}</b></div>
  <div style="color:#16a34a">PASS<b>${summary.pass}</b></div>
  <div style="color:#dc2626">FAIL<b>${summary.fail}</b></div>
  <div style="color:#a16207">Được cứu nhờ tiền xử lý<b>${summary.rescued_by_preprocess}</b></div>
</div>
<div class="cfg">
  <h2>⚙️ Cấu hình & Tiền xử lý áp dụng</h2>
  <div class="row"><div class="k">Thư viện</div><div><code>${escapeHtml(CONFIG_NOTES.library)}</code></div></div>
  <div class="row"><div class="k">Delimiters</div><div><code>${escapeHtml(CONFIG_NOTES.delimiters)}</code></div></div>
  <div class="row"><div class="k">Phát hiện lỗi</div><div>${escapeHtml(CONFIG_NOTES.detection)}</div></div>
  <div class="row"><div class="k">Lọc field</div><div>${escapeHtml(CONFIG_NOTES.filter)}</div></div>
  <div class="row"><div class="k">Tiền xử lý</div><div><ol>${CONFIG_NOTES.preprocess.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol></div></div>
  <div class="row"><div class="k">Đề đã test</div><div><code>${escapeHtml(examIdsLabel)}</code></div></div>
</div>
<div class="filters">
  <button class="active" onclick="flt('all',this)">Tất cả</button>
  <button onclick="flt('fail',this)">Chỉ FAIL</button>
  <button onclick="flt('pass',this)">Chỉ PASS</button>
</div>
${cards}
<script>
function flt(mode,btn){
  document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card').forEach(c=>{
    c.style.display = mode==='all' ? '' : (c.classList.contains(mode) ? '' : 'none');
  });
}
</script>
</body></html>`;
}

main().catch((e) => { console.error(e); process.exit(1); });

'use client';

// Màn hình thử nghiệm thư viện `react-latex-next` để render LaTeX.
// Gồm 2 phần:
//   1. Live preview: gõ tay LaTeX và xem kết quả render ngay.
//   2. Batch test: nạp dữ liệu hàng loạt (call API hoặc dán JSON) rồi
//      render từng item, tự động đánh dấu PASS / FAIL dựa trên việc KaTeX
//      có sinh ra phần tử lỗi `.katex-error` hay không.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
// Cấu hình KaTeX + string-rewrite tiền xử lý dùng chung (xem lib/katex-config.js).
// HTML-decode KHÔNG nằm trong config (xử lý HTML chung) -> giữ trong component.
import { KATEX_MACROS, applyKatexRewrites } from '@/lib/katex-config';

// Cách bọc nội dung trước khi đưa vào <Latex>. react-latex-next chỉ render
// math khi gặp delimiter ($...$, $$...$$, \(...\), \[...\]); nếu chuỗi thô
// không có delimiter thì nó coi như text thường. Vì vậy cho phép tự bọc.
type WrapMode = 'asis' | 'inline' | 'display';

function wrap(raw: string, mode: WrapMode): string {
  const s = raw ?? '';
  if (mode === 'inline') return `$${s}$`;
  if (mode === 'display') return `$$${s}$$`;
  return s;
}

// --- Tiền xử lý dữ liệu trước khi render (giống script batch) ---
// Dữ liệu thực tế (vd đề thi) hay nhúng HTML entity bên trong LaTeX
// (&gt; &lt; &nbsp;) và dùng toán tử cột *{n}{l} mà KaTeX không hiểu.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü', yacute: 'ý',
  ntilde: 'ñ', ccedil: 'ç',
  hellip: '…', ndash: '–', mdash: '—', ldquo: '“', rdquo: '”',
  lsquo: '‘', rsquo: '’', times: '×', divide: '÷', deg: '°',
  plusmn: '±', middot: '·', laquo: '«', raquo: '»',
};

function decodeEntities(str: string): string {
  if (str == null) return '';
  return String(str)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => safeCp(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeCp(parseInt(d, 10)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) =>
      name in NAMED_ENTITIES ? NAMED_ENTITIES[name] : m,
    );
}

function safeCp(cp: number): string {
  try {
    return String.fromCodePoint(cp);
  } catch {
    return '';
  }
}

// Tiền xử lý: (1) HTML-decode (ngay trong file này) -> (2) string-rewrite của
// KaTeX (applyKatexRewrites từ lib/katex-config.js, vd *{n}{l}). Macros áp ở
// tầng render (<Latex macros=...>), không phải ở đây.
function preprocess(raw: string): string {
  return applyKatexRewrites(decodeEntities(String(raw ?? '')));
}

interface TestResult {
  ok: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// ErrorBoundary: một số input dị dạng có thể khiến react-latex-next ném lỗi JS
// (không chỉ là katex-error trong DOM) làm crash cả cây React. Bắt lại để coi
// như FAIL thay vì sập màn hình.
// ---------------------------------------------------------------------------
class LatexErrorBoundary extends React.Component<
  { onError: (msg: string) => void; resetKey: string; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prev: { resetKey: string }) {
    // Reset trạng thái lỗi khi nội dung thay đổi (dùng lại cho item khác).
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error?.message || 'Lỗi runtime khi render LaTeX');
  }

  render() {
    if (this.state.hasError) {
      return <span className="text-red-600 text-sm">⚠ Render crash</span>;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// LatexRender: render 1 chuỗi và báo cáo kết quả (pass/fail) qua callback.
// Phát hiện lỗi bằng cách dò phần tử `.katex-error` mà KaTeX sinh ra khi
// throwOnError = false (mặc định của react-latex-next).
// ---------------------------------------------------------------------------
function LatexRender({
  content,
  macros,
  onResult,
}: {
  content: string;
  macros?: Record<string, string>;
  onResult?: (r: TestResult) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [crashMsg, setCrashMsg] = useState<string | null>(null);

  useEffect(() => {
    if (crashMsg) {
      onResult?.({ ok: false, message: crashMsg });
      return;
    }
    if (!ref.current) return;
    const errorNodes = ref.current.querySelectorAll('.katex-error');
    if (errorNodes.length > 0) {
      const first = errorNodes[0] as HTMLElement;
      onResult?.({
        ok: false,
        message: first.getAttribute('title') || 'KaTeX parse error',
      });
    } else {
      onResult?.({ ok: true, message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, crashMsg]);

  return (
    <div ref={ref} className="latex-render break-words">
      <LatexErrorBoundary
        resetKey={content}
        onError={(m) => setCrashMsg(m)}
      >
        <Latex macros={macros}>{content}</Latex>
      </LatexErrorBoundary>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trích danh sách item LaTeX từ response API tùy ý.
// ---------------------------------------------------------------------------
const COMMON_FIELDS = ['latex', 'formula', 'content', 'tex', 'value', 'expression', 'text', 'question'];

function getByPath(obj: any, path: string): any {
  if (!path.trim()) return obj;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key.trim()]), obj);
}

interface BatchItem {
  id: string | number;
  raw: string;
}

function extractItems(json: any, itemsPath: string, field: string): BatchItem[] {
  let arr = getByPath(json, itemsPath);

  // Nếu không trỏ rõ path mà response là object, tự tìm mảng đầu tiên.
  if (!Array.isArray(arr) && json && typeof json === 'object' && !itemsPath.trim()) {
    const found = Object.values(json).find((v) => Array.isArray(v));
    if (found) arr = found;
  }
  if (!Array.isArray(arr)) {
    if (typeof json === 'string') arr = [json];
    else throw new Error('Không tìm thấy mảng dữ liệu. Hãy nhập "Đường dẫn mảng" (vd: data.items).');
  }

  return arr.map((el: any, idx: number) => {
    let raw: any;
    if (typeof el === 'string' || typeof el === 'number') {
      raw = String(el);
    } else if (el && typeof el === 'object') {
      if (field.trim()) {
        raw = getByPath(el, field);
      } else {
        const key = COMMON_FIELDS.find((k) => typeof el[k] === 'string');
        raw = key ? el[key] : JSON.stringify(el);
      }
    } else {
      raw = String(el);
    }
    return { id: el?.id ?? idx, raw: raw == null ? '' : String(raw) };
  });
}

// ---------------------------------------------------------------------------
// Component chính
// ---------------------------------------------------------------------------
const SAMPLE = `Phương trình bậc hai: $ax^2 + bx + c = 0$ có nghiệm
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
Tích phân: $\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}$
Ma trận: $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$
Tổng: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$`;

type ResultMap = Record<string, TestResult>;

export default function LatexTestPage() {
  // --- Live preview ---
  const [liveInput, setLiveInput] = useState(SAMPLE);

  // --- Batch config ---
  const [apiUrl, setApiUrl] = useState('');
  const [itemsPath, setItemsPath] = useState('');
  const [field, setField] = useState('');
  const [wrapMode, setWrapMode] = useState<WrapMode>('asis');
  const [preprocessOn, setPreprocessOn] = useState(true);
  const [pasteJson, setPasteJson] = useState('');

  const [items, setItems] = useState<BatchItem[]>([]);
  const [results, setResults] = useState<ResultMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlyFailed, setOnlyFailed] = useState(false);

  const handleResult = (key: string, r: TestResult) => {
    setResults((prev) => {
      const old = prev[key];
      if (old && old.ok === r.ok && old.message === r.message) return prev;
      return { ...prev, [key]: r };
    });
  };

  const loadFromJson = (json: any) => {
    const extracted = extractItems(json, itemsPath, field);
    setResults({});
    setItems(extracted);
  };

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    setItems([]);
    setResults({});
    try {
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const json = await res.json();
      loadFromJson(json);
    } catch (e: any) {
      setError(e?.message || 'Lỗi khi gọi API. Có thể bị CORS — thử dùng "Dán JSON".');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPasted = () => {
    setError(null);
    setItems([]);
    setResults({});
    try {
      const json = JSON.parse(pasteJson);
      loadFromJson(json);
    } catch (e: any) {
      setError(e?.message || 'JSON không hợp lệ');
    }
  };

  const stats = useMemo(() => {
    const total = items.length;
    const evaluated = Object.keys(results).length;
    let pass = 0;
    let fail = 0;
    for (const k of Object.keys(results)) {
      if (results[k].ok) pass++;
      else fail++;
    }
    return { total, evaluated, pass, fail };
  }, [items, results]);

  const exportFailed = () => {
    const failed = items
      .filter((it) => results[String(it.id)]?.ok === false)
      .map((it) => ({ id: it.id, raw: it.raw, error: results[String(it.id)]?.message }));
    const blob = new Blob([JSON.stringify(failed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'latex-failed.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleItems = onlyFailed
    ? items.filter((it) => results[String(it.id)]?.ok === false)
    : items;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">
            Thử nghiệm hiển thị LaTeX — <code className="text-blue-600">react-latex-next</code>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Render bằng KaTeX. Item nào KaTeX không parse được sẽ bị đánh dấu{' '}
            <span className="font-semibold text-red-600">FAIL</span>.
          </p>
        </header>

        {/* ============ LIVE PREVIEW ============ */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">1. Live preview (gõ tay)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              spellCheck={false}
              className="w-full h-56 font-mono text-sm border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập LaTeX, dùng $...$ hoặc $$...$$"
            />
            <div className="h-56 overflow-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
              <LatexRender content={liveInput} />
            </div>
          </div>
        </section>

        {/* ============ BATCH TEST ============ */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">2. Test hàng loạt từ API / JSON</h2>

          {/* Config */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/latex-data"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleFetch}
                disabled={loading || !apiUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                {loading ? 'Đang tải…' : 'Gọi API'}
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-2">
              <label className="text-xs text-slate-500 flex flex-col gap-1">
                Đường dẫn mảng (tùy chọn)
                <input
                  value={itemsPath}
                  onChange={(e) => setItemsPath(e.target.value)}
                  placeholder="vd: data.items"
                  className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800"
                />
              </label>
              <label className="text-xs text-slate-500 flex flex-col gap-1">
                Tên field chứa LaTeX (tùy chọn)
                <input
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="vd: formula"
                  className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800"
                />
              </label>
              <label className="text-xs text-slate-500 flex flex-col gap-1">
                Chế độ bọc
                <select
                  value={wrapMode}
                  onChange={(e) => setWrapMode(e.target.value as WrapMode)}
                  className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 bg-white"
                >
                  <option value="asis">Giữ nguyên (đã có $…$)</option>
                  <option value="inline">Bọc inline $…$</option>
                  <option value="display">Bọc display $$…$$</option>
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={preprocessOn}
                onChange={(e) => setPreprocessOn(e.target.checked)}
              />
              Tiền xử lý: HTML-decode (<code>&amp;gt; &amp;lt; &amp;nbsp;</code>) + chuẩn hóa cột{' '}
              <code>*{'{'}n{'}'}{'{'}l{'}'}</code> + macro{' '}
              <code>\mspace→\mskip</code> trước khi render
            </label>

            {/* Paste JSON fallback (tránh CORS) */}
            <details className="text-sm">
              <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                Hoặc dán JSON trực tiếp (nếu API bị CORS)
              </summary>
              <textarea
                value={pasteJson}
                onChange={(e) => setPasteJson(e.target.value)}
                spellCheck={false}
                placeholder='vd: ["x^2", "\\frac{1}{2}", {"formula": "E=mc^2"}]'
                className="w-full h-28 mt-2 font-mono text-xs border border-slate-300 rounded-lg p-2"
              />
              <button
                onClick={handleLoadPasted}
                disabled={!pasteJson.trim()}
                className="mt-1 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm"
              >
                Nạp JSON
              </button>
            </details>
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Stats bar */}
          {items.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                Tổng: {stats.total}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                Pass: {stats.pass}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                Fail: {stats.fail}
              </span>
              {stats.evaluated < stats.total && (
                <span className="text-slate-400">đang render… {stats.evaluated}/{stats.total}</span>
              )}
              <label className="flex items-center gap-1.5 ml-auto text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyFailed}
                  onChange={(e) => setOnlyFailed(e.target.checked)}
                />
                Chỉ hiện FAIL
              </label>
              <button
                onClick={exportFailed}
                disabled={stats.fail === 0}
                className="text-blue-600 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                Xuất danh sách FAIL (.json)
              </button>
            </div>
          )}

          {/* Results list */}
          <div className="mt-4 space-y-3">
            {visibleItems.map((it) => {
              const key = String(it.id);
              const r = results[key];
              const source = preprocessOn ? preprocess(it.raw) : it.raw;
              const wrapped = wrap(source, wrapMode);
              return (
                <div
                  key={key}
                  className={`border rounded-lg p-3 ${
                    r ? (r.ok ? 'border-green-200 bg-green-50/40' : 'border-red-300 bg-red-50/50') : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-400 font-mono">#{key}</span>
                    {r ? (
                      r.ok ? (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          PASS
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          FAIL
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">…</span>
                    )}
                    {r && !r.ok && (
                      <span className="text-xs text-red-600 truncate">{r.message}</span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 items-start">
                    <pre className="text-xs bg-slate-900 text-slate-100 rounded p-2 overflow-auto whitespace-pre-wrap break-words">
                      {it.raw}
                    </pre>
                    <div className="bg-white border border-slate-200 rounded p-2 overflow-auto">
                      <LatexRender
                        content={wrapped}
                        macros={preprocessOn ? { ...MACROS } : undefined}
                        onResult={(res) => handleResult(key, res)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

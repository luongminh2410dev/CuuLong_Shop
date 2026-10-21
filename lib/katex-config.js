// =============================================================================
// CẤU HÌNH KaTeX + CÁC ĐIỂM TIỀN XỬ LÝ (preprocess) DÙNG CHUNG
// -----------------------------------------------------------------------------
// File này là NGUỒN DUY NHẤT cho mọi "điểm vá" giúp render dữ liệu LaTeX thực tế
// (vd: đề thi từ API) bằng react-latex-next / KaTeX. Dev chỉ cần đọc 1 file này
// là nắm được tất cả chỗ chỉnh sửa LaTeX trước khi đưa vào engine.
//
// Dùng được cho CẢ:
//   - UI (TypeScript, qua bundler Next):  import { KATEX_MACROS, applyKatexRewrites } from '@/lib/katex-config'
//   - Script Node (.mjs):                 import { ... } from '../lib/katex-config.js'
//
// ⚠ KHÔNG đặt HTML-decode (giải mã &gt; &lt; &nbsp; &agrave; ...) vào đây.
//   HTML-decode là xử lý HTML CHUNG, không thuộc phạm vi KaTeX. Hãy decode ở
//   RIÊNG một bước, TRƯỚC khi gọi applyKatexRewrites().  Thứ tự khuyến nghị:
//
//       const latex = applyKatexRewrites(htmlDecode(rawFieldValue));
//       <Latex macros={KATEX_MACROS}>{latex}</Latex>
// =============================================================================

// -----------------------------------------------------------------------------
// 1) DELIMITERS — phải khớp mặc định của react-latex-next.
//    (Tham chiếu: node_modules/react-latex-next/dist/index.js -> defaultDelimiters)
// -----------------------------------------------------------------------------
export const KATEX_DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '$', right: '$', display: false },
  { left: '\\[', right: '\\]', display: true },
];

// -----------------------------------------------------------------------------
// 2) MACROS — bù các lệnh KaTeX KHÔNG định nghĩa nhưng CÓ THỂ map 1-1 (token
//    expansion). Truyền thẳng vào prop `macros` của <Latex> hoặc option `macros`
//    của katex.renderToString.
//
//    Chỉ dùng được cho lệnh dạng "đổi tên / mở rộng". KHÔNG dùng được cho khác
//    biệt cấu trúc/môi trường (vd \begin{...}) — loại đó xem mục 3.
// -----------------------------------------------------------------------------
export const KATEX_MACROS = {
  // \mspace{6mu}  ->  \mskip 6mu   (KaTeX không có \mspace; \mskip giữ co giãn)
  '\\mspace': '\\mskip#1',

  // --- Bật khi DỮ LIỆU thực sự xuất hiện (tránh thêm sớm gây regression) ---
  // '\\mbox': '\\text{#1}',  // \mbox{...} -> \text{...}  (support table: dùng \text)
  // '\\hbox': '\\text{#1}',  // tương tự \mbox
};

// -----------------------------------------------------------------------------
// 3) STRING REWRITES — các biến đổi BẮT BUỘC sửa ở mức CHUỖI vì `macros` không
//    làm được (toán tử cú pháp, environment, ...). Mỗi rule tự mô tả để report
//    và dev đọc hiểu ngay.
//
//    Khi gặp lỗi KaTeX loại MỚI (xem cột `error` trong CSV của script test),
//    thêm 1 rule vào mảng này là xong.
// -----------------------------------------------------------------------------
export const KATEX_STRING_REWRITES = [
  {
    name: 'array-star-columns',
    note:
      'Toán tử lặp cột của array: *{n}{spec} -> spec lặp n lần. ' +
      'KaTeX không hiểu "*" trong đặc tả cột (MathJax thì có). ' +
      'VD: \\begin{array}{*{20}{l}} -> \\begin{array}{llllllllllllllllllll}',
    apply: (s) =>
      s.replace(
        /\*\s*\{\s*(\d+)\s*\}\s*\{([^{}]*)\}/g,
        (_m, n, spec) => spec.repeat(Math.min(parseInt(n, 10) || 0, 100)),
      ),
  },

  // Ví dụ rule sẽ thêm trong tương lai nếu data có:
  // {
  //   name: 'eqalign-to-aligned',
  //   note: '\\eqalign{...} -> \\begin{aligned}...\\end{aligned} (KaTeX không có \\eqalign)',
  //   apply: (s) => s.replace(/\\eqalign\s*\{([\s\S]*?)\}/g, '\\begin{aligned}$1\\end{aligned}'),
  // },
];

/**
 * Áp dụng TẤT CẢ string-rewrite ở mục 3 (KHÔNG gồm HTML-decode).
 * @param {string} input - chuỗi LaTeX (nên đã HTML-decode trước nếu cần)
 * @returns {string}
 */
export function applyKatexRewrites(input) {
  let s = String(input == null ? '' : input);
  for (const rule of KATEX_STRING_REWRITES) s = rule.apply(s);
  return s;
}

// -----------------------------------------------------------------------------
// 4) METADATA — mô tả ngắn gọn để hiển thị trong report/UI cho người xem nắm.
//    (Bao gồm cả ghi chú HTML-decode để người đọc thấy bức tranh đầy đủ, dù
//     bước decode được thực thi BÊN NGOÀI file này.)
// -----------------------------------------------------------------------------
export const PREPROCESS_NOTES = {
  htmlDecodeNote:
    'HTML-decode entities (&gt; → > , &lt; → < , &nbsp; → space , &agrave; → à …) ' +
    '— thực thi BÊN NGOÀI file config (xử lý HTML chung, không thuộc KaTeX).',
  macros: Object.entries(KATEX_MACROS).map(([k, v]) => `${k} → ${v}`),
  rewrites: KATEX_STRING_REWRITES.map((r) => r.note),
  delimiters: KATEX_DELIMITERS.map(
    (d) => `${d.left}…${d.right}${d.display ? ' (display)' : ''}`,
  ).join(' , '),
};

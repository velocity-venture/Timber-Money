export type Enriched = {
  type: string;
  summary: { total: string|null; date: string|null; vendor: string|null };
  period?: { start?: string|null; end?: string|null };
  transactions?: { date?: string; desc?: string; amount?: number }[];
  validations?: { totalMatches?: boolean; notes?: string[] };
  preview?: string[];
};

export function enrich(text: string, base: Enriched): Enriched {
  const out: Enriched = { ...base, validations: { notes: [] } };

  // Statement period
  const period = text.match(/\b(period|from)\s*[:-]?\s*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]20\d{2})\s*(to|-|through)\s*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]20\d{2})/i);
  if (period) out.period = { start: period[2], end: period[4] };

  // Transactions (very lenient)
  const tx: { date?: string; desc?: string; amount?: number }[] = [];
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 2000);
  const txRe = /^(\d{1,2}[\/\-]\d{1,2})(?:[\/\-](\d{2,4}))?\s+(.+?)\s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)$/;
  for (const line of lines) {
    const m = line.match(txRe);
    if (m) {
      const date = m[1] + (m[2] ? '/' + m[2] : '');
      const desc = m[3].replace(/\s+/g, ' ').slice(0, 120);
      const amt = Number(String(m[4]).replace(/[^0-9.-]/g, ''));
      if (!Number.isNaN(amt)) tx.push({ date, desc, amount: amt });
    }
  }
  if (tx.length) out.transactions = tx.slice(0, 500);

  // Validate total (rough: sum of positive lines equals stated total)
  const stated = out.summary?.total ? Number(String(out.summary.total).replace(/[^0-9.-]/g,'')) : null;
  if (stated != null && tx.length) {
    const sum = tx.filter(t=>t.amount&&t.amount>0).reduce((a,b)=>a+(b.amount||0),0);
    out.validations = out.validations || {};
    out.validations.totalMatches = Math.abs(sum - stated) < 0.01;
    if (!out.validations.totalMatches) out.validations.notes = [...(out.validations.notes||[]), `Sum ${sum} != stated ${stated}`];
  }

  return out;
}

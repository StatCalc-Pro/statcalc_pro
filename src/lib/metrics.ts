export type RawRow = Record<string, any>;

export type Study = {
  id: string | number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  sensitivity: number;
  specificity: number;
  tpr: number;
  fpr: number;
};

function toNumber(v: any) {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeMetrics(rawRows: RawRow[], idFieldCandidates: string[] = ["id", "ID"]) {
  const rows: Study[] = rawRows.map((r: RawRow, idx: number) => {
    const tp = toNumber(r.tp ?? r.TP ?? r.true_positive ?? r.verdadeiro_positivo);
    const fp = toNumber(r.fp ?? r.FP ?? r.false_positive ?? r.falso_positivo);
    const tn = toNumber(r.tn ?? r.TN ?? r.true_negative ?? r.verdadeiro_negativo);
    const fn = toNumber(r.fn ?? r.FN ?? r.false_negative ?? r.falso_negativo);

    let id: string | number = idx + 1;
    for (const candidate of idFieldCandidates) {
      if (candidate in r) {
        id = r[candidate];
        break;
      }
    }

    const sensitivity = tp + fn === 0 ? 0 : tp / (tp + fn);
    const specificity = tn + fp === 0 ? 0 : tn / (tn + fp);
    const tpr = sensitivity;
    const fpr = 1 - specificity;

    return { id, tp, fp, tn, fn, sensitivity, specificity, tpr, fpr };
  });

  return rows;
}

export function computeAUCFromRows(rows: Study[]) {
  const roc = rows.map((r) => ({ fpr: r.fpr, tpr: r.tpr })).sort((a, b) => a.fpr - b.fpr);
  const fpr = roc.map((r) => r.fpr);
  const tpr = roc.map((r) => r.tpr);
  return trapezoidAUC(fpr, tpr);
}

export function trapezoidAUC(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 2) return 0;
  let auc = 0;
  for (let i = 1; i < x.length; i++) {
    const dx = x[i] - x[i - 1];
    const avgY = (y[i] + y[i - 1]) / 2;
    auc += dx * avgY;
  }
  // clamp to [0,1]
  return Math.max(0, Math.min(1, auc));
}

export function exportResultsJson(rows: Study[]) {
  const studies = rows.map((r) => ({ id: r.id, tp: r.tp, fp: r.fp, tn: r.tn, fn: r.fn, sensitivity: r.sensitivity, specificity: r.specificity }));
  const avgSensitivity = rows.reduce((s, r) => s + r.sensitivity, 0) / Math.max(1, rows.length);
  const avgSpecificity = rows.reduce((s, r) => s + r.specificity, 0) / Math.max(1, rows.length);
  const auc = computeAUCFromRows(rows);
  const summary = { avg_sensitivity: avgSensitivity, avg_specificity: avgSpecificity, auc };
  return { studies, summary };
}

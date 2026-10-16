import { inputZ } from './parallel_zin.js';
import { calculate } from './calculateVSWR.js';

/**
 * Random search for the line parameters (impedance and length of both lines
 * in every stage) that give the lowest worst-case VSWR over all frequencies.
 *
 * One candidate = one set of {Z01, Z02, length1, length2} per stage, sampled
 * uniformly between the min/max entered in the stages table. The SAME candidate
 * is evaluated at every frequency (a real network has one set of lines),
 * and its score is the largest VSWR among the frequencies (minimax).
 */
class RandomSearch {
  /** uniform random number in [min, max]; tolerates min > max */
  static uniform(a, b, rng = Math.random) {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return lo + rng() * (hi - lo);
  }

  static sample(ranges, rng = Math.random) {
    return ranges.map(([a, b]) => ({
      Z01: RandomSearch.uniform(a.rmin, a.rmax, rng),
      Z02: RandomSearch.uniform(b.rmin, b.rmax, rng),
      length1: RandomSearch.uniform(a.lmin, a.lmax, rng),
      length2: RandomSearch.uniform(b.lmin, b.lmax, rng),
    }));
  }

  /** Evaluate one candidate at one frequency; stages are cascaded. */
  static evaluateAt(Z0, frequency, load_real, load_imag, stages, vf = 1) {
    let zr = load_real;
    let zx = load_imag;
    for (const s of stages) {
      const d = inputZ.parallelBranchesImpedance(
        s.Z01, s.Z02, s.length1, s.length2, zr, zx, frequency, vf);
      zr = d.Zin_parallel.real;
      zx = d.Zin_parallel.imag;
    }
    if (!Number.isFinite(zr) || !Number.isFinite(zx)) return null;
    const v = calculate.calculateVSWR(Z0, zr, zx);
    if (!Number.isFinite(v.vswr) || v.vswr < 1) return null;
    return {
      vswr: v.vswr,
      db: v.reflection_losses,
      gamma: v.gamma,
      Zin: { real: zr, imag: zx },
    };
  }

  static run({ Z0, freqs, ranges, iterations, vf = 1, rng = Math.random,
               onImprove = null }) {
    const wasVerbose = inputZ.verbose;
    inputZ.verbose = false; // thousands of calls: keep the console usable
    let best = null;
    try {
      for (let it = 1; it <= iterations; it++) {
        const stages = RandomSearch.sample(ranges, rng);
        const perFreq = [];
        let worst = 0;
        let valid = true;
        for (const p of freqs) {
          const r = RandomSearch.evaluateAt(Z0, p.f, p.r, p.x, stages, vf);
          if (!r) { valid = false; break; }
          perFreq.push(r);
          if (r.vswr > worst) worst = r.vswr;
          if (best && worst >= best.score) { valid = false; break; } // early out
        }
        if (!valid) continue;
        best = { score: worst, stages, perFreq, iteration: it };
        if (onImprove) onImprove(best, it);
      }
    } finally {
      inputZ.verbose = wasVerbose;
    }
    return best;
  }

  /** Read min/max inputs of the stages table from the page. */
  static readRanges(stp_n, ids) {
    const num = (id) => {
      const el = document.getElementById(id);
      const v = el ? parseFloat(el.value) : NaN;
      if (Number.isNaN(v)) {
        throw new Error(`random_search;enter a numeric value in field ${id}.`);
      }
      return v;
    };
    const ranges = [];
    for (let i = 0; i < stp_n; i++) {
      const row = [];
      for (let j = 0; j < 2; j++) {
        row.push({
          rmin: num(ids.id_rmin[i][j]), rmax: num(ids.id_rmax[i][j]),
          lmin: num(ids.id_lmin[i][j]), lmax: num(ids.id_lmax[i][j]),
        });
      }
      ranges.push(row);
    }
    return ranges;
  }
}
export { RandomSearch };
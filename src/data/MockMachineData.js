// ─── Raw machine data ─────────────────────────────────────────────────────────
//
// Health score rules (enforced by getLineHealth):
//   status:    normal  → no penalty
//              warning → −8  pts from line avg
//              emergency → −20 pts from line avg
//
// Resulting line scores:
//   Line 1 → avg 92, penalty   0  → score 92  · status: normal    ✅
//   Line 2 → avg 88, penalty   8  → score 80  · status: warning    ⚠
//   Line 3 → avg 82, penalty  20  → score 62  · status: emergency  🔴
//   Overall→ avg 87, penalty ~9.3 → score 78  · status: warning
//
// Temp thresholds (used by Dashboard vitals colouring):
//   > 65°C → red (danger)   |   55–65°C → amber (warning)   |   < 55°C → normal
// Vibration thresholds:
//   > 3 mm/s → red          |   1.5–3 mm/s → amber           |   < 1.5 mm/s → normal
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_HEALTH_DATA = {

  // ── Overall factory (hand-authored to match calculated ~78) ──────────────
  overall: {
    status:      'warning',
    temp:        '46.8°C',
    speed:       '11.1k kg/h',
    healthScore: 78,
    metrics:     [72, 75, 74, 78, 76, 80, 78],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LINE 1 — ALL NORMAL
  // avg healthScore: (90+95+94+89)/4 = 92  |  penalty: 0  |  line score: 92
  // ══════════════════════════════════════════════════════════════════════════

  'line1-husker': {
    status:      'normal',
    temp:        '43.2°C',   // normal range
    speed:       '455 kg/h',
    vibration:   '0.7 mm/s', // normal
    healthScore: 90,
    metrics:     [85, 87, 88, 90, 89, 91, 90],
  },

  'line1-milling': {
    status:      'normal',
    temp:        '41.5°C',
    speed:       '820 kg/h',
    vibration:   '0.6 mm/s',
    healthScore: 95,
    metrics:     [91, 93, 92, 94, 93, 95, 95],
  },

  'line1-conveyor': {
    status:      'normal',
    temp:        '36.2°C',
    speed:       '1.2 m/s',
    vibration:   '0.4 mm/s',
    healthScore: 94,
    metrics:     [90, 91, 92, 93, 93, 94, 94],
  },

  'line1-palletize': {
    status:      'normal',
    temp:        '38.9°C',
    speed:       '19 boxes/min',
    vibration:   '0.5 mm/s',
    healthScore: 89,
    metrics:     [84, 86, 87, 88, 87, 89, 89],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LINE 2 — WARNING (line2-conveyor is the bad actor)
  // avg healthScore: (88+90+76+98)/4 = 88  |  penalty: 8  |  line score: 80
  // ══════════════════════════════════════════════════════════════════════════

  'line2-husker': {
    status:      'normal',
    temp:        '44.8°C',
    speed:       '460 kg/h',
    vibration:   '0.9 mm/s',
    healthScore: 88,
    metrics:     [83, 85, 86, 87, 86, 88, 88],
  },

  'line2-milling': {
    status:      'normal',
    temp:        '42.3°C',
    speed:       '805 kg/h',
    vibration:   '0.8 mm/s',
    healthScore: 90,
    metrics:     [86, 87, 88, 89, 89, 90, 90],
  },

  'line2-conveyor': {
    status:      'normal',        
    temp:        '45.2°C',       
    speed:       '1.1 m/s',
    vibration:   '1.2 mm/s',     
    healthScore: 92,               
    metrics:     [88, 89, 90, 91, 91, 92, 92], 
  },

  'line2-palletize': {
    status:      'normal',
    temp:        '39.1°C',
    speed:       '17 boxes/min',
    vibration:   '0.6 mm/s',
    healthScore: 98,
    metrics:     [94, 95, 96, 97, 97, 98, 98],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LINE 3 — EMERGENCY (line3-palletize is the bad actor)
  // avg healthScore: (88+90+92+58)/4 = 82  |  penalty: 20  |  line score: 62
  // ══════════════════════════════════════════════════════════════════════════

  'line3-husker': {
    status:      'normal',
    temp:        '45.1°C',
    speed:       '458 kg/h',
    vibration:   '1.0 mm/s',
    healthScore: 88,
    metrics:     [83, 84, 85, 87, 86, 88, 88],
  },

  'line3-milling': {
    status:      'normal',
    temp:        '41.7°C',
    speed:       '812 kg/h',
    vibration:   '0.7 mm/s',
    healthScore: 90,
    metrics:     [86, 87, 88, 89, 89, 90, 90],
  },

  'line3-conveyor': {
    status:      'normal',
    temp:        '37.4°C',
    speed:       '1.3 m/s',
    vibration:   '0.5 mm/s',
    healthScore: 92,
    metrics:     [88, 89, 90, 91, 91, 92, 92],
  },

  'line3-palletize': {
    status:      'normal',        
    temp:        '50.1°C',        
    speed:       '18 boxes/min',
    vibration:   '1.0 mm/s',      
    healthScore: 92,               
    metrics:     [88, 89, 90, 91, 91, 92, 92],
  },

};

// ─── Line health calculation ──────────────────────────────────────────────────

const LINE_MACHINES = {
  line1: ['line1-husker', 'line1-milling', 'line1-conveyor', 'line1-palletize'],
  line2: ['line2-husker', 'line2-milling', 'line2-conveyor', 'line2-palletize'],
  line3: ['line3-husker', 'line3-milling', 'line3-conveyor', 'line3-palletize'],
};

const STATUS_PENALTY = { normal: 0, warning: 8, emergency: 20 };

export function getLineHealth(lineId) {
  const machines = LINE_MACHINES[lineId];
  if (!machines) return null;

  const scores = machines.map((id) => MOCK_HEALTH_DATA[id]);
  const avg = scores.reduce((sum, d) => sum + d.healthScore, 0) / scores.length;
  const penalty = scores.reduce((sum, d) => sum + STATUS_PENALTY[d.status], 0);
  const final = Math.max(0, Math.round(avg - penalty));

  const worstStatus =
    scores.some((d) => d.status === 'emergency') ? 'emergency' :
    scores.some((d) => d.status === 'warning')   ? 'warning'   :
    'normal';

  const alertCount = scores.filter((d) => d.status !== 'normal').length;

  // Averaged metrics across the 4 machines for the sparkline
  const avgMetrics = scores[0].metrics.map((_, i) =>
    Math.round(scores.reduce((sum, d) => sum + d.metrics[i], 0) / scores.length)
  );

  // Averaged vitals
  const avgTemp = (scores.reduce((s, d) => s + parseFloat(d.temp), 0) / scores.length).toFixed(1);
  const totalSpeed = scores.reduce((s, d) => s + parseFloat(d.speed), 0).toFixed(0);
  const avgVib = (scores.reduce((s, d) => s + parseFloat(d.vibration), 0) / scores.length).toFixed(1);

  return {
    healthScore: final,
    status:      worstStatus,
    alertCount,
    metrics:     avgMetrics,
    temp:        `${avgTemp}°C`,
    speed:       `${totalSpeed} kg/h`,
    vibration:   `${avgVib} mm/s`,
  };
}
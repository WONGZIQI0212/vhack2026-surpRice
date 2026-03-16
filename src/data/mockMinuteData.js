export const MOCK_MINUTE_DATA = {
  overall: Array.from({ length: 60 }).map((_, i) => ({
    time: `09:${String(i).padStart(2, "0")}`,
    temp: 36 + (i % 8) * 0.8,
    vibration: 0.8 + (i % 5) * 0.12,
    speed: 118 + (i % 7) * 3,
    load: 72 + (i % 9) * 2,
    energy: 18 + (i % 6) * 0.9,
    anomaly: i === 22 || i === 41,
  })),

  line1: Array.from({ length: 60 }).map((_, i) => ({
    time: `09:${String(i).padStart(2, "0")}`,
    temp: 44 + (i % 10) * 0.9,
    vibration: 1.4 + (i % 6) * 0.18,
    speed: 96 + (i % 8) * 4,
    load: 75 + (i % 10) * 1.8,
    energy: 12 + (i % 5) * 0.7,
    anomaly: i === 17 || i === 38,
  })),

  line2: Array.from({ length: 60 }).map((_, i) => ({
    time: `09:${String(i).padStart(2, "0")}`,
    temp: 47 + (i % 8) * 1.1,
    vibration: 1.8 + (i % 7) * 0.22,
    speed: 88 + (i % 7) * 3,
    load: 79 + (i % 8) * 2.4,
    energy: 13 + (i % 6) * 0.8,
    anomaly: i === 12 || i === 45,
  })),

  line3: Array.from({ length: 60 }).map((_, i) => ({
    time: `09:${String(i).padStart(2, "0")}`,
    temp: 49 + (i % 7) * 1.2,
    vibration: 2.1 + (i % 6) * 0.26,
    speed: 83 + (i % 9) * 2,
    load: 82 + (i % 9) * 2.2,
    energy: 14 + (i % 5) * 0.85,
    anomaly: i === 9 || i === 27 || i === 52,
  })),

  "line1-machine1": Array.from({ length: 60 }).map((_, i) => ({
    time: `09:${String(i).padStart(2, "0")}`,
    temp: 53 + (i % 8) * 1.25,
    vibration: 2.2 + (i % 6) * 0.3,
    speed: 72 + (i % 6) * 3,
    load: 81 + (i % 7) * 2.8,
    energy: 9 + (i % 4) * 0.6,
    anomaly: i === 14 || i === 29 || i === 48,
  })),
};

export function getMinuteDataById(mId) {
  return MOCK_MINUTE_DATA[mId] || MOCK_MINUTE_DATA.overall;
}

export function getMinuteStats(rows) {
  const avg = (key) =>
    (rows.reduce((sum, r) => sum + Number(r[key] || 0), 0) / rows.length).toFixed(1);

  const max = (key) => Math.max(...rows.map((r) => Number(r[key] || 0))).toFixed(1);
  const latest = rows[rows.length - 1] || {};

  return {
    avgTemp: avg("temp"),
    maxTemp: max("temp"),
    avgVibration: avg("vibration"),
    maxVibration: max("vibration"),
    avgLoad: avg("load"),
    maxLoad: max("load"),
    latest,
    anomalyCount: rows.filter((r) => r.anomaly).length,
  };
}
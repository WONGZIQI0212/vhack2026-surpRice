import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import GlassCard from '../components/ui/GlassCard';
import { T, STATUS_CONFIG } from '../styles/theme';
import { MOCK_HEALTH_DATA, getLineHealth } from '../data/MockMachineData';

/* ── Animations ────────────────────────────────────────────── */
const fillBar = keyframes`
  from { width: 0%; }
  to   { width: var(--target-w); }
`;

const borderPulseWarn = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.0), 0 1px 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(13,17,23,0.07); }
  50%     { box-shadow: 0 0 0 3px rgba(217,119,6,0.25), 0 1px 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(13,17,23,0.07); }
`;

const borderPulseDanger = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.0), 0 1px 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(13,17,23,0.07); }
  50%     { box-shadow: 0 0 0 4px rgba(220,38,38,0.3), 0 1px 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(13,17,23,0.07); }
`;

/* ── Styled components ─────────────────────────────────────── */
const Label = styled.div`
  font-size: 0.58rem;
  color: ${T.muted};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 2.2rem;
  font-weight: 300;
  letter-spacing: -1.5px;
  color: ${(p) =>
    p.$status === 'emergency' ? T.danger :
    p.$status === 'warning'   ? T.warning :
    T.text};
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
  margin-bottom: 4px;
`;

const ValueUnit = styled.span`
  font-size: 0.78rem;
  font-weight: 400;
  color: ${T.sub};
  margin-left: 3px;
`;

/* Status-aware card — pulses border when warning/emergency */
const AlertCard = styled(GlassCard)`
  border-color: ${(p) =>
    p.$status === 'emergency' ? 'rgba(220,38,38,0.35)' :
    p.$status === 'warning'   ? 'rgba(217,119,6,0.3)' :
    'rgba(255,255,255,0.85)'};

  animation: ${(p) =>
    p.$status === 'emergency'
      ? css`${borderPulseDanger} 1.2s ease infinite`
      : p.$status === 'warning'
      ? css`${borderPulseWarn} 1.8s ease infinite`
      : 'none'};
`;

/* Status chip inside card */
const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) => STATUS_CONFIG[p.$s].bg};
  border: 1px solid ${(p) => STATUS_CONFIG[p.$s].border};
  border-radius: 20px;
  padding: 3px 9px;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${(p) => STATUS_CONFIG[p.$s].color};
  margin-bottom: 10px;
`;

const ChipDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => STATUS_CONFIG[p.$s].color};
  flex-shrink: 0;
`;

/* ── Health Score Bar ──────────────────────────────────────── */
const ScoreBarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(180,192,210,0.2);
  border-radius: 99px;
  overflow: hidden;
  margin-top: auto;
`;

const ScoreBarFill = styled.div`
  height: 100%;
  border-radius: 99px;
  --target-w: ${(p) => p.$score}%;
  width: var(--target-w);
  background: ${(p) =>
    p.$score >= 90 ? `linear-gradient(90deg, ${T.success}, #34d399)` :
    p.$score >= 70 ? `linear-gradient(90deg, ${T.warning}, #fbbf24)` :
                     `linear-gradient(90deg, ${T.danger},  #f87171)`};
  animation: ${fillBar} 0.9s cubic-bezier(0.34,1.2,0.64,1) both;
  transition: background 0.4s ease;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const ScoreSubLabel = styled.span`
  font-size: 0.6rem;
  color: ${T.muted};
  font-weight: 500;
`;

/* ── Sparkline (SVG) ───────────────────────────────────────── */
function Sparkline({ values, status }) {
  const W = 200, H = 46;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return `${x},${y}`;
  });
  const color =
    status === 'emergency' ? T.danger :
    status === 'warning'   ? T.warning :
    T.accent;
  const areaPath = `M${pts[0]} L${pts.join(' L')} L${W},${H} L0,${H} Z`;
  const linePath = `M${pts.join(' L')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 46, marginTop: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${status})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r="3" fill={color}
      />
    </svg>
  );
}

/* ── Vibration Bar (horizontal segments) ──────────────────── */
const VibSegments = styled.div`
  display: flex;
  gap: 3px;
  align-items: flex-end;
  margin-top: auto;
  height: 28px;
`;

const VibSeg = styled.div`
  flex: 1;
  border-radius: 2px;
  height: ${(p) => 30 + p.$i * 14}%;
  background: ${(p) =>
    p.$active
      ? p.$status === 'emergency' ? T.danger
      : p.$status === 'warning'   ? T.warning
      : T.accent
      : 'rgba(180,192,210,0.18)'};
  transition: background 0.3s, height 0.4s;
`;

/* ── Vitals strip (machine-level only) ────────────────────── */
const VitalsRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  border-top: 1px solid rgba(200,210,225,0.4);
  padding-top: 10px;
`;

const Vital = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const VitalLabel = styled.div`
  font-size: 0.5rem;
  color: ${T.muted};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
`;

const VitalValue = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(p) => p.$hot ? T.danger : p.$warm ? T.warning : T.text};
  font-variant-numeric: tabular-nums;
`;

/* ── Main component ────────────────────────────────────────── */
export default function Dashboard({ mId }) {
  const isOverall = mId === 'overall';
  const isLine    = ['line1', 'line2', 'line3'].includes(mId);
  const isMachine = mId?.includes('-');

  // Pull data from the right source depending on view level
  const lineHealth = isLine ? getLineHealth(mId) : null;
  const data = lineHealth || MOCK_HEALTH_DATA[mId] || MOCK_HEALTH_DATA['overall'];
  const status = data.status;

  const tempVal     = parseFloat(data.temp) || 0;
  const vibVal      = parseFloat(data.vibration) || 0;
  const vibSegCount = Math.round(Math.min(vibVal / 4, 1) * 10) || 6;
  const metrics     = data.metrics || [40, 50, 60, 70, 80, 90, 100];

  const cardLabel = isOverall ? 'Factory Health' : isLine ? `Line Health` : 'Machine Health';

  return (
    <>
      {/* ── Card 1: Health Score ── */}
      <AlertCard $status={status} $flex={1}>
        <Label>{cardLabel}</Label>
        <StatusChip $s={status}>
          <ChipDot $s={status} />
          {STATUS_CONFIG[status].label}
          {isLine && lineHealth.alertCount > 0 && (
            <span style={{ marginLeft: 4 }}>· {lineHealth.alertCount} alert{lineHealth.alertCount > 1 ? 's' : ''}</span>
          )}
        </StatusChip>
        <Value $status={status}>
          {data.healthScore}<ValueUnit>%</ValueUnit>
        </Value>
        <ScoreRow>
          <ScoreSubLabel>Health Score</ScoreSubLabel>
          <ScoreSubLabel style={{ color:
            data.healthScore >= 90 ? T.success :
            data.healthScore >= 70 ? T.warning : T.danger
          }}>
            {data.healthScore >= 90 ? 'Good' :
             data.healthScore >= 70 ? 'Moderate' : 'Critical'}
          </ScoreSubLabel>
        </ScoreRow>
        <ScoreBarTrack>
          <ScoreBarFill $score={data.healthScore} />
        </ScoreBarTrack>

        {/* Vitals strip — machine AND line views */}
        {!isOverall && (
          <VitalsRow>
            <Vital>
              <VitalLabel>Avg Temp</VitalLabel>
              <VitalValue $hot={tempVal > 65} $warm={tempVal > 55 && tempVal <= 65}>
                {data.temp}
              </VitalValue>
            </Vital>
            <Vital>
              <VitalLabel>{isLine ? 'Total Speed' : 'Speed'}</VitalLabel>
              <VitalValue>{data.speed}</VitalValue>
            </Vital>
            <Vital>
              <VitalLabel>Avg Vibration</VitalLabel>
              <VitalValue $hot={vibVal > 3} $warm={vibVal > 1.5 && vibVal <= 3}>
                {data.vibration || '—'}
              </VitalValue>
            </Vital>
          </VitalsRow>
        )}
      </AlertCard>

      {/* ── Card 2: Trend ── */}
      <AlertCard $status={status} $flex={1}>
        <Label>Load Trend · Last 7 Readings</Label>
        <Value $status={status}>
          {metrics[metrics.length - 1]}<ValueUnit>%</ValueUnit>
        </Value>
        <ScoreSubLabel style={{ marginBottom: 4, display: 'block' }}>
          {metrics[metrics.length - 1] > metrics[0] ? '▲ Rising' : '▼ Falling'}&nbsp;
          <span style={{ color: T.muted }}>
            ({Math.abs(metrics[metrics.length - 1] - metrics[0])} pts vs first reading)
          </span>
        </ScoreSubLabel>
        <Sparkline values={metrics} status={status} />
      </AlertCard>

      {/* ── Card 3: Vibration / Energy ── */}
      <AlertCard $status={status} $flex={1}>
        <Label>{isOverall ? 'Factory Energy Draw' : 'Vibration Level'}</Label>
        <Value $status={status}>
          {isOverall ? '1.4k' : data.vibration?.split(' ')[0] || '—'}
          <ValueUnit>{isOverall ? 'kWh' : 'mm/s'}</ValueUnit>
        </Value>
        <ScoreSubLabel style={{ marginBottom: 'auto', display: 'block' }}>
          {isOverall
            ? 'Across all production lines'
            : vibVal > 3   ? '⚠ Exceeds safe threshold'
            : vibVal > 1.5 ? '△ Slightly elevated'
            : '✓ Within normal range'}
        </ScoreSubLabel>
        <VibSegments>
          {Array.from({ length: 10 }).map((_, i) => (
            <VibSeg key={i} $i={i} $active={i < vibSegCount} $status={status} />
          ))}
        </VibSegments>
      </AlertCard>
    </>
  );
}
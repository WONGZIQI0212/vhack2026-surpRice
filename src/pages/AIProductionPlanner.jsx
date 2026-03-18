import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { T } from '../styles/theme';

// ─── Animations (identical to AIPrediction) ───────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`;
const shimmerAnim = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;
const barIn = keyframes`
  from { width: 0; }
  to   { width: var(--w); }
`;
const traceMove = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;
const scanDown = keyframes`
  0%   { top: -15%; opacity: 0.5; }
  100% { top: 110%; opacity: 0; }
`;
const dotBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
`;
const countAnim = keyframes`
  from { opacity: 0; transform: scale(0.85) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

// ─── Layout (identical to AIPrediction) ───────────────────────────────────────
const Root = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const LeftCol = styled.div`
  width: 185px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  min-height: 0;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(55,102,240,0.15); border-radius: 3px; }
`;

const RightCol = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 8px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(55,102,240,0.18); border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: rgba(55,102,240,0.35); }
`;

// ─── Glass card (identical to AIPrediction) ───────────────────────────────────
const Card = styled.div`
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.88);
  border-radius: 16px;
  box-shadow: 0 2px 18px rgba(13,17,23,0.055), 0 1px 0 rgba(255,255,255,0.9) inset;
  padding: 14px 15px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;

const CardTrace = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, ${T.accent} 30%, ${T.accentM} 70%, transparent);
  background-size: 200% auto;
  animation: ${traceMove} 3.5s linear infinite;
`;

const CardScan = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 55px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(59,110,240,0.025), transparent);
  animation: ${scanDown} 4.5s linear infinite;
`;

const SectionLabel = styled.div`
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 11px;
  display: flex;
  align-items: center;
  gap: 6px;
  &::before {
    content: '';
    width: 3px; height: 11px;
    background: linear-gradient(180deg, ${T.accent}, ${T.accentM});
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

// ─── Left panel – status rows (identical to AIPrediction) ─────────────────────
const StatusRow = styled.div`
  padding: 7px 0;
  border-bottom: 1px solid rgba(200,210,225,0.25);
  &:last-child { border-bottom: none; }
`;

const StatusLabel = styled.div`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 2px;
`;

const StatusValue = styled.div`
  font-size: 0.86rem;
  font-weight: 700;
  color: ${p => p.$green ? T.success : T.text};
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GreenDot = styled.span`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${T.success};
  display: inline-block;
  animation: ${dotBlink} 2s ease infinite;
  flex-shrink: 0;
`;

const StatusBar = styled.div`
  height: 2px; margin-top: 3px;
  background: rgba(180,192,210,0.18);
  border-radius: 99px; overflow: hidden;
  &::after {
    content: '';
    display: block; height: 100%;
    width: ${p => p.$pct}%;
    background: ${p => p.$green
      ? `linear-gradient(90deg, ${T.success}, #34d399)`
      : `linear-gradient(90deg, ${T.accent}, ${T.accentM})`};
    border-radius: 99px;
  }
`;

// ─── AI Badge (identical to AIPrediction) ─────────────────────────────────────
const AIBadge = styled.div`
  position: absolute; top: 13px; right: 14px;
  display: flex; align-items: center; gap: 4px;
  font-size: 0.48rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: ${T.accentM};
  background: rgba(59,110,240,0.07);
  border: 1px solid rgba(59,110,240,0.16);
  border-radius: 20px; padding: 3px 8px;
`;

// ─── Scenario selector grid ────────────────────────────────────────────────────
const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const ScenarioCard = styled.button`
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  padding: 11px 6px 9px;
  border-radius: 12px;
  border: 1px solid ${p => p.$active ? `rgba(23,72,200,0.5)` : `rgba(210,218,232,0.6)`};
  background: ${p => p.$active
    ? `linear-gradient(160deg, rgba(23,72,200,0.09), rgba(59,110,240,0.03))`
    : `rgba(255,255,255,0.55)`};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.5, 0.64, 1);
  position: relative; overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(59,110,240,0.38);
    box-shadow: 0 6px 18px rgba(23,72,200,0.1);
  }
`;

const ScenarioGlow = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,110,240,0.12), transparent);
  pointer-events: none;
`;

const ScenarioIcon = styled.div`
  width: 34px; height: 34px; border-radius: 9px;
  background: ${p => p.$active
    ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})`
    : `rgba(180,192,210,0.22)`};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; transition: background 0.2s;
`;

const ScenarioName = styled.div`
  font-size: 0.6rem; font-weight: 700;
  color: ${p => p.$active ? T.accent : T.text};
  text-align: center; line-height: 1.3; transition: color 0.2s;
`;

const ScenarioSubText = styled.div`
  font-size: 0.5rem; color: ${T.muted}; text-align: center;
`;

// ─── Input grid ───────────────────────────────────────────────────────────────
const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;

const InputWrap = styled.div`
  display: flex; flex-direction: column; gap: 4px;
`;

const InputLabel = styled.div`
  font-size: 0.5rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: ${T.muted};
`;

const StyledInput = styled.input`
  padding: 9px 11px;
  border-radius: 9px;
  border: 1px solid ${p => p.$focus ? `rgba(59,110,240,0.45)` : `rgba(210,218,232,0.6)`};
  background: rgba(255,255,255,0.8);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem; font-weight: 600;
  color: ${T.text};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: ${p => p.$focus ? `0 0 0 3px rgba(59,110,240,0.1)` : `none`};
  &::placeholder { color: rgba(92,106,130,0.4); }
`;

// ─── Run button (identical to AIPrediction) ───────────────────────────────────
const RunButton = styled.button`
  width: 100%; padding: 12px 0;
  border-radius: 11px; border: none;
  background: ${p => p.$running
    ? `linear-gradient(90deg, ${T.accent}, ${T.accentM}, ${T.accent})`
    : `linear-gradient(135deg, ${T.accent}, ${T.accentM})`};
  background-size: ${p => p.$running ? '300% auto' : '100%'};
  animation: ${p => p.$running ? css`${shimmerAnim} 1.2s linear infinite` : 'none'};
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  cursor: ${p => (p.disabled && !p.$running) ? 'not-allowed' : p.$running ? 'wait' : 'pointer'};
  opacity: ${p => (p.disabled && !p.$running) ? 0.38 : 1};
  box-shadow: ${p => (p.disabled && !p.$running) ? 'none' : '0 4px 18px rgba(23,72,200,0.3)'};
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(23,72,200,0.38); }
  &:active:not(:disabled) { transform: translateY(0); }
`;

const BtnSpinner = styled.div`
  width: 11px; height: 11px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: ${spinAnim} 0.8s linear infinite;
`;

// ─── Empty state (identical to AIPrediction) ──────────────────────────────────
const EmptyState = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 22px 0 18px; gap: 8px;
`;
const EmptyRing = styled.div`
  width: 44px; height: 44px; border-radius: 13px;
  background: rgba(59,110,240,0.05);
  border: 1px dashed rgba(59,110,240,0.22);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
`;

// ─── ROI summary cards (identical to AIPrediction) ────────────────────────────
const ROIGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; margin-bottom: 12px;
  animation: ${fadeUp} 0.35s 0.1s both;
`;

const ROICard = styled.div`
  background: ${p => p.$accent
    ? `linear-gradient(145deg, rgba(23,72,200,0.09), rgba(59,110,240,0.04))`
    : `rgba(255,255,255,0.65)`};
  border: 1px solid ${p => p.$accent ? `rgba(59,110,240,0.24)` : `rgba(210,218,232,0.5)`};
  border-radius: 12px; padding: 11px 12px;
  display: flex; flex-direction: column; gap: 3px;
  position: relative; overflow: hidden;
`;

const ROITopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: ${p => p.$color};
`;

const ROIIcon  = styled.div`font-size: 0.85rem; line-height: 1;`;
const ROILabel = styled.div`font-size: 0.5rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${T.muted}; margin-top: 2px;`;
const ROIValue = styled.div`
  font-size: 1rem; font-weight: 700; letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  color: ${p => p.$color || T.text};
  animation: ${countAnim} 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: ${p => p.$delay || 0}s;
`;
const ROISub = styled.div`font-size: 0.56rem; color: ${T.muted}; line-height: 1.4;`;

// ─── Metric result cards (identical to AIPrediction) ──────────────────────────
const MetricGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; margin-bottom: 10px;
`;

const MetricCard = styled.div`
  background: ${p => p.$highlight
    ? `linear-gradient(155deg, rgba(23,72,200,0.07), rgba(59,110,240,0.02))`
    : `rgba(248,249,253,0.95)`};
  border: 1px solid ${p => p.$highlight ? `rgba(59,110,240,0.22)` : `rgba(210,218,232,0.6)`};
  border-radius: 13px; padding: 12px 13px 10px;
  display: flex; flex-direction: column; gap: 3px;
  position: relative; overflow: hidden;
  animation: ${fadeUp} 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.06}s;
`;

const MetricTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: ${p => p.$good
    ? `linear-gradient(90deg, transparent, ${T.success}, transparent)`
    : `linear-gradient(90deg, transparent, ${T.warning}, transparent)`};
`;

const MetricHeader     = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1px;`;
const MetricIcon       = styled.div`font-size: 0.9rem; line-height: 1;`;
const MetricDeltaBadge = styled.div`
  font-size: 0.52rem; font-weight: 700;
  color: ${p => p.$good ? T.success : T.warning};
  background: ${p => p.$good ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)'};
  border-radius: 6px; padding: 2px 6px;
`;
const MetricTitle  = styled.div`font-size: 0.5rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.muted};`;
const MetricBefore = styled.div`font-size: 0.72rem; color: ${T.sub}; font-weight: 500;`;
const MetricArrow  = styled.div`font-size: 0.6rem; color: ${T.muted};`;
const MetricAfter  = styled.div`
  font-size: 0.92rem; font-weight: 700;
  color: ${p => p.$good ? T.success : T.text};
  font-variant-numeric: tabular-nums;
  animation: ${countAnim} 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.05 + 0.1}s;
`;
const MetricDivider = styled.div`height: 1px; background: rgba(200,210,225,0.25); margin: 4px 0;`;

const BarPairWrap  = styled.div`display: flex; align-items: center; gap: 5px; margin-top: 2px;`;
const BarPairLabel = styled.div`font-size: 0.46rem; color: ${T.muted}; width: 26px; flex-shrink: 0;`;
const BarTrack     = styled.div`flex: 1; height: 3px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const BarFill      = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%; width: var(--w);
  background: ${p => p.$color};
  animation: ${barIn} 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay}s;
`;

const ConfRow   = styled.div`display: flex; align-items: center; justify-content: space-between; margin-top: 4px;`;
const ConfLabel = styled.div`font-size: 0.46rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.muted};`;
const ConfPct   = styled.div`font-size: 0.58rem; font-weight: 700; color: ${p => p.$value >= 88 ? T.success : p.$value >= 75 ? T.warning : T.danger};`;
const ConfTrack = styled.div`height: 2px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const ConfFill  = styled.div`
  height: 100%; border-radius: 99px;
  width: ${p => p.$value}%;
  background: ${p => p.$value >= 88
    ? `linear-gradient(90deg, ${T.success}, #34d399)`
    : p.$value >= 75
    ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
    : `linear-gradient(90deg, ${T.danger}, #f87171)`};
`;

// ─── Risk panel (identical to AIPrediction) ───────────────────────────────────
const RiskPanel = styled.div`
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(210,218,232,0.5);
  border-radius: 13px; padding: 13px 14px;
  animation: ${fadeUp} 0.4s 0.3s both;
`;
const RiskHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px;`;
const RiskTitle  = styled.div`
  font-size: 0.5rem; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase; color: ${T.muted};
  display: flex; align-items: center; gap: 6px;
  &::before { content: ''; width: 3px; height: 11px; background: linear-gradient(180deg, ${T.warning}, #f59e0b); border-radius: 2px; }
`;
const RiskBadge = styled.div`
  font-size: 0.6rem; font-weight: 700;
  color: ${p => p.$level === 'Low' ? T.success : p.$level === 'Medium' ? T.warning : T.danger};
  background: ${p => p.$level === 'Low' ? 'rgba(5,150,105,0.1)' : p.$level === 'Medium' ? 'rgba(217,119,6,0.1)' : 'rgba(220,38,38,0.1)'};
  border: 1px solid ${p => p.$level === 'Low' ? 'rgba(5,150,105,0.2)' : p.$level === 'Medium' ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)'};
  border-radius: 20px; padding: 3px 10px;
`;
const RiskGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;`;
const RiskItem = styled.div`
  background: rgba(248,249,253,0.9);
  border: 1px solid rgba(210,218,232,0.4);
  border-radius: 10px; padding: 10px 11px;
  display: flex; flex-direction: column; gap: 4px;
  animation: ${fadeUp} 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.07}s;
`;
const RiskItemIcon = styled.div`font-size: 0.88rem; line-height: 1;`;
const RiskItemName = styled.div`font-size: 0.52rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.muted};`;
const RiskLevel    = styled.div`font-size: 0.64rem; font-weight: 700; color: ${p => p.$level === 'Low' ? T.success : p.$level === 'Medium' ? T.warning : T.danger};`;
const RiskDesc     = styled.div`font-size: 0.57rem; color: ${T.sub}; line-height: 1.5;`;
const RiskBarTrack = styled.div`height: 3px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const RiskBarFill  = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%; width: var(--w);
  background: ${p => p.$pct <= 33
    ? `linear-gradient(90deg, ${T.success}, #34d399)`
    : p.$pct <= 66
    ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
    : `linear-gradient(90deg, ${T.danger}, #f87171)`};
  animation: ${barIn} 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay || 0}s;
`;

// ─── Summary row (identical to AIPrediction) ──────────────────────────────────
const SummaryRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 12px; padding-top: 10px;
  border-top: 1px solid rgba(200,210,225,0.28);
  animation: ${fadeUp} 0.35s 0.45s both;
`;
const SummaryBadge = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-size: 0.61rem; font-weight: 700; color: ${T.success};
  background: rgba(5,150,105,0.08);
  border: 1px solid rgba(5,150,105,0.2);
  border-radius: 20px; padding: 5px 13px;
`;
const ButtonRow = styled.div`display: flex; gap: 7px;`;
const OutlineButton = styled.button`
  background: transparent;
  border: 1px solid rgba(200,210,225,0.55); border-radius: 8px;
  padding: 5px 13px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${T.muted}; cursor: pointer; transition: all 0.15s;
  &:hover { border-color: rgba(59,110,240,0.38); color: ${T.accent}; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SNAP_ROWS = [
  { key: 'output',     label: 'Daily Output',    green: true,  pct: 68 },
  { key: 'capacity',   label: 'Capacity Used',   green: false, pct: 74 },
  { key: 'labor',      label: 'Workers Active',  green: false, pct: 55 },
  { key: 'bottleneck', label: 'Bottleneck',      green: false, pct: 60 },
  { key: 'storage',    label: 'Storage Fill',    green: false, pct: 72 },
  { key: 'efficiency', label: 'Line Efficiency', green: true,  pct: 80 },
];

const CURRENT_STATUS = {
  output:     '8,400 kg',
  capacity:   '74%',
  labor:      '18 ops',
  bottleneck: 'Packaging',
  storage:    '72%',
  efficiency: '80%',
};

const SCENARIOS = [
  { id: 'max_speed', icon: '⚡', name: 'Max Speed',  sub: 'Fastest plan'  },
  { id: 'economic',  icon: '💰', name: 'Economic',   sub: 'Lowest cost'   },
  { id: 'balanced',  icon: '⚖️', name: 'Balanced',   sub: 'Optimal mix'   },
  { id: 'overtime',  icon: '🕐', name: 'Overtime',   sub: 'Extra shifts'  },
  { id: 'lean',      icon: '📉', name: 'Lean',       sub: 'Min. waste'    },
  { id: 'surge',     icon: '🚀', name: 'Surge Mode', sub: 'Peak demand'   },
];

const SCENARIO_DATA = {
  max_speed: { daysMultiplier: 0.70, costMult: 1.25, efficiencyGain: '+18%', laborNote: 'All lines at 100%',        bottleneck: 'Conveyor Belt', risk: { overall: 'Medium', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'Medium', pct: 55, desc: 'Continuous max load accelerates wear on husker units.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'Medium', pct: 50, desc: 'Workers at sustained pace — schedule mandatory breaks.' },
    { icon: '📦', name: 'Storage Surge', level: 'Low',    pct: 30, desc: 'High output fills storage faster; dispatch daily.' },
  ]}},
  economic:  { daysMultiplier: 1.35, costMult: 0.80, efficiencyGain: '+6%',  laborNote: 'Reduced shift overlap',    bottleneck: 'Milling Unit',  risk: { overall: 'Low', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'Low',    pct: 18, desc: 'Light load extends equipment lifespan significantly.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'Low',    pct: 15, desc: 'Relaxed pace improves worker wellbeing scores.' },
    { icon: '📦', name: 'Storage Surge', level: 'Low',    pct: 22, desc: 'Slower fill rate gives logistics more lead time.' },
  ]}},
  balanced:  { daysMultiplier: 1.00, costMult: 1.00, efficiencyGain: '+12%', laborNote: 'Standard allocation',      bottleneck: 'Packaging',     risk: { overall: 'Low', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'Low',    pct: 28, desc: 'Normal operating load within design specs.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'Low',    pct: 20, desc: 'Standard shifts maintain healthy work rhythm.' },
    { icon: '📦', name: 'Storage Surge', level: 'Low',    pct: 35, desc: 'Output matched to dispatch schedule — minimal overflow.' },
  ]}},
  overtime:  { daysMultiplier: 0.80, costMult: 1.40, efficiencyGain: '+22%', laborNote: 'Evening shifts added',     bottleneck: 'Palletizer',    risk: { overall: 'Medium', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'Medium', pct: 60, desc: 'Extended runtime increases breakdown probability.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'High',   pct: 80, desc: 'Night shifts require mandatory rest-day compensation.' },
    { icon: '📦', name: 'Storage Surge', level: 'Medium', pct: 55, desc: 'Overnight output requires early-morning dispatch.' },
  ]}},
  lean:      { daysMultiplier: 1.20, costMult: 0.88, efficiencyGain: '+9%',  laborNote: 'Waste reduction focus',   bottleneck: 'Husker Line 3', risk: { overall: 'Low', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'Low',    pct: 20, desc: 'Optimised cycles cut idle time and heat stress.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'Low',    pct: 18, desc: 'Lean workflows reduce unnecessary physical strain.' },
    { icon: '📦', name: 'Storage Surge', level: 'Low',    pct: 25, desc: 'Just-in-time processing limits inventory buildup.' },
  ]}},
  surge:     { daysMultiplier: 0.60, costMult: 1.55, efficiencyGain: '+28%', laborNote: 'All hands + temp workers', bottleneck: 'Loading Bay',  risk: { overall: 'High', items: [
    { icon: '⚡', name: 'Machine Wear',  level: 'High',   pct: 85, desc: 'Surge demand drives all machines to thermal limits.' },
    { icon: '👤', name: 'Fatigue Risk',  level: 'High',   pct: 88, desc: 'Temp workers require safety briefings before start.' },
    { icon: '📦', name: 'Storage Surge', level: 'High',   pct: 78, desc: 'Surge output may exceed warehouse capacity.' },
  ]}},
};

const BASE_DAYS = 10;
const BASE_COST = 12000;

function computePlan(scenario, targetKg, deadlineDays) {
  const s    = SCENARIO_DATA[scenario];
  const days = Math.ceil((targetKg / 1000) * BASE_DAYS * s.daysMultiplier);
  const cost = Math.round((targetKg / 1000) * BASE_COST * s.costMult);
  const rawMat  = Math.round(targetKg * 1.08);
  const storage = Math.round(targetKg * 0.55);
  const meetsDeadline = deadlineDays ? days <= parseInt(deadlineDays) : null;
  return { days, cost, rawMat, storage, meetsDeadline, ...s };
}

const CONFIDENCE_MAP = {
  max_speed: { time: 88.4, cost: 82.1, storage: 91.2 },
  economic:  { time: 93.7, cost: 95.2, storage: 89.4 },
  balanced:  { time: 94.1, cost: 91.8, storage: 92.6 },
  overtime:  { time: 86.3, cost: 79.5, storage: 87.0 },
  lean:      { time: 90.5, cost: 93.4, storage: 88.9 },
  surge:     { time: 82.7, cost: 74.3, storage: 85.1 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIProductionPlanner() {
  const [selected,   setSelected]   = useState(null);
  const [target,     setTarget]     = useState('');
  const [deadline,   setDeadline]   = useState('');
  const [running,    setRunning]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [focusField, setFocusField] = useState(null);

  const selScenario = SCENARIOS.find(s => s.id === selected);
  const conf        = selected ? CONFIDENCE_MAP[selected] : null;

  const pickScenario = (id) => { setSelected(id); setResult(null); };

  const runPlan = () => {
    if (!selected || !target || running) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(computePlan(selected, parseFloat(target), deadline));
      setRunning(false);
    }, 1800);
  };

  const resetAll = () => { setResult(null); setSelected(null); setTarget(''); setDeadline(''); };

  return (
    <Root>

      {/* ── LEFT: Current Status (identical structure to AIPrediction) ── */}
      <LeftCol>
        <Card style={{ minHeight: '100%', boxSizing: 'border-box' }}>
          <CardTrace />
          <CardScan />
          <SectionLabel>Current Status</SectionLabel>
          {SNAP_ROWS.map(r => (
            <StatusRow key={r.key}>
              <StatusLabel>{r.label}</StatusLabel>
              <StatusValue $green={r.green}>
                {r.green && <GreenDot />}
                {CURRENT_STATUS[r.key]}
              </StatusValue>
              <StatusBar $pct={r.pct} $green={r.green} />
            </StatusRow>
          ))}
        </Card>
      </LeftCol>

      {/* ── RIGHT: Planner + Results (identical structure to AIPrediction) ── */}
      <RightCol>

        {/* Selector Card */}
        <Card>
          <CardTrace />
          <AIBadge>✨ AI Engine</AIBadge>
          <SectionLabel>Production Planning · Simulation</SectionLabel>

          <ScenarioGrid>
            {SCENARIOS.map(s => (
              <ScenarioCard
                key={s.id}
                $active={selected === s.id}
                onClick={() => pickScenario(s.id)}
              >
                {selected === s.id && <ScenarioGlow />}
                <ScenarioIcon $active={selected === s.id}>{s.icon}</ScenarioIcon>
                <ScenarioName $active={selected === s.id}>{s.name}</ScenarioName>
                <ScenarioSubText>{s.sub}</ScenarioSubText>
              </ScenarioCard>
            ))}
          </ScenarioGrid>

          {selected && (
            <InputGrid>
              <InputWrap>
                <InputLabel>Target Output (kg)</InputLabel>
                <StyledInput
                  type="number"
                  placeholder="e.g. 5000"
                  value={target}
                  $focus={focusField === 'target'}
                  onFocus={() => setFocusField('target')}
                  onBlur={() => setFocusField(null)}
                  onChange={e => { setTarget(e.target.value); setResult(null); }}
                />
              </InputWrap>
              <InputWrap>
                <InputLabel>Deadline (days, optional)</InputLabel>
                <StyledInput
                  type="number"
                  placeholder="e.g. 7"
                  value={deadline}
                  $focus={focusField === 'deadline'}
                  onFocus={() => setFocusField('deadline')}
                  onBlur={() => setFocusField(null)}
                  onChange={e => { setDeadline(e.target.value); setResult(null); }}
                />
              </InputWrap>
            </InputGrid>
          )}

          <RunButton
            onClick={runPlan}
            $running={running}
            disabled={!selected || !target || running}
          >
            {running
              ? <><BtnSpinner />Analysing {selScenario?.name} plan for {target} kg…</>
              : result
                ? '⟳  Re-run AI Planning'
                : '▶  Run AI Planning'}
          </RunButton>
        </Card>

        {/* Results Card */}
        <Card>
          <CardTrace />

          {!result ? (
            <EmptyState>
              <EmptyRing>📊</EmptyRing>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: T.muted }}>
                No plan yet
              </div>
              <div style={{ fontSize: '0.6rem', color: T.muted, opacity: 0.6, textAlign: 'center' }}>
                {selected
                  ? target
                    ? 'Press ▶ Run AI Planning above'
                    : 'Enter a target output to continue'
                  : 'Select a planning scenario to begin'}
              </div>
            </EmptyState>
          ) : (
            <>
              <SectionLabel>
                Planning Results · {selScenario?.name} · {parseFloat(target).toLocaleString()} kg
              </SectionLabel>

              {/* ROI Summary */}
              <ROIGrid>
                <ROICard $accent>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.accent}, transparent)`} />
                  <ROIIcon>⏱️</ROIIcon>
                  <ROILabel>Completion Time</ROILabel>
                  <ROIValue $color={T.accent} $delay={0}>{result.days} days</ROIValue>
                  <ROISub>
                    {result.meetsDeadline === null
                      ? `${selScenario?.name} schedule`
                      : result.meetsDeadline
                        ? `✓ Meets your ${deadline}-day deadline`
                        : `✕ Exceeds deadline by ${result.days - parseInt(deadline)}d`}
                  </ROISub>
                </ROICard>

                <ROICard>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.warning}, transparent)`} />
                  <ROIIcon>💸</ROIIcon>
                  <ROILabel>Operational Cost</ROILabel>
                  <ROIValue $color={T.warning} $delay={0.08}>RM {result.cost.toLocaleString()}</ROIValue>
                  <ROISub>labour + ops for this run</ROISub>
                </ROICard>

                <ROICard>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.success}, transparent)`} />
                  <ROIIcon>📈</ROIIcon>
                  <ROILabel>Efficiency Gain</ROILabel>
                  <ROIValue $color={T.success} $delay={0.16}>{result.efficiencyGain}</ROIValue>
                  <ROISub>vs. unoptimised baseline</ROISub>
                </ROICard>
              </ROIGrid>

              {/* Metric Cards */}
              <MetricGrid>

                <MetricCard $index={0} $highlight>
                  <MetricTopLine $good />
                  <MetricHeader>
                    <MetricIcon>📅</MetricIcon>
                    <MetricDeltaBadge $good>Optimised</MetricDeltaBadge>
                  </MetricHeader>
                  <MetricTitle>Time Planning</MetricTitle>
                  <MetricBefore>Baseline: ~{Math.round(result.days * 1.3)} days</MetricBefore>
                  <MetricArrow>↓</MetricArrow>
                  <MetricAfter $good $index={0}>{result.days} days</MetricAfter>
                  <MetricDivider />
                  <BarPairWrap>
                    <BarPairLabel>Before</BarPairLabel>
                    <BarTrack><BarFill $pct={75} $color={`linear-gradient(90deg, ${T.accent}, ${T.accentM})`} $delay={0} /></BarTrack>
                  </BarPairWrap>
                  <BarPairWrap>
                    <BarPairLabel>After</BarPairLabel>
                    <BarTrack><BarFill $pct={52} $color={`linear-gradient(90deg, ${T.success}, #34d399)`} $delay={0.15} /></BarTrack>
                  </BarPairWrap>
                  <ConfRow>
                    <ConfLabel>AI Confidence</ConfLabel>
                    <ConfPct $value={conf.time}>{conf.time}%</ConfPct>
                  </ConfRow>
                  <ConfTrack><ConfFill $value={conf.time} $delay={0.3} /></ConfTrack>
                </MetricCard>

                <MetricCard $index={1}>
                  <MetricTopLine $good />
                  <MetricHeader>
                    <MetricIcon>👷</MetricIcon>
                    <MetricDeltaBadge $good>Assigned</MetricDeltaBadge>
                  </MetricHeader>
                  <MetricTitle>Labor Dynamics</MetricTitle>
                  <MetricBefore>Bottleneck: {result.bottleneck}</MetricBefore>
                  <MetricArrow>↓</MetricArrow>
                  <MetricAfter $good $index={1}>{result.laborNote}</MetricAfter>
                  <MetricDivider />
                  <BarPairWrap>
                    <BarPairLabel>Idle</BarPairLabel>
                    <BarTrack><BarFill $pct={40} $color={`linear-gradient(90deg, ${T.accent}, ${T.accentM})`} $delay={0.05} /></BarTrack>
                  </BarPairWrap>
                  <BarPairWrap>
                    <BarPairLabel>Active</BarPairLabel>
                    <BarTrack><BarFill $pct={78} $color={`linear-gradient(90deg, ${T.success}, #34d399)`} $delay={0.2} /></BarTrack>
                  </BarPairWrap>
                  <ConfRow>
                    <ConfLabel>AI Confidence</ConfLabel>
                    <ConfPct $value={conf.time}>{conf.time}%</ConfPct>
                  </ConfRow>
                  <ConfTrack><ConfFill $value={conf.time} $delay={0.36} /></ConfTrack>
                </MetricCard>

                <MetricCard $index={2}>
                  <MetricTopLine $good={result.storage < 5000} />
                  <MetricHeader>
                    <MetricIcon>🗃️</MetricIcon>
                    <MetricDeltaBadge $good={result.storage < 5000}>
                      {result.storage < 5000 ? 'OK' : 'Review'}
                    </MetricDeltaBadge>
                  </MetricHeader>
                  <MetricTitle>Storage & Inventory</MetricTitle>
                  <MetricBefore>Raw needed: {result.rawMat.toLocaleString()} kg</MetricBefore>
                  <MetricArrow>↓</MetricArrow>
                  <MetricAfter $good={result.storage < 5000} $index={2}>
                    {result.storage.toLocaleString()} kg req.
                  </MetricAfter>
                  <MetricDivider />
                  <BarPairWrap>
                    <BarPairLabel>Raw</BarPairLabel>
                    <BarTrack><BarFill $pct={65} $color={`linear-gradient(90deg, ${T.accent}, ${T.accentM})`} $delay={0.1} /></BarTrack>
                  </BarPairWrap>
                  <BarPairWrap>
                    <BarPairLabel>Store</BarPairLabel>
                    <BarTrack><BarFill $pct={48} $color={`linear-gradient(90deg, ${T.success}, #34d399)`} $delay={0.25} /></BarTrack>
                  </BarPairWrap>
                  <ConfRow>
                    <ConfLabel>AI Confidence</ConfLabel>
                    <ConfPct $value={conf.storage}>{conf.storage}%</ConfPct>
                  </ConfRow>
                  <ConfTrack><ConfFill $value={conf.storage} $delay={0.42} /></ConfTrack>
                </MetricCard>

              </MetricGrid>

              {/* Risk Assessment */}
              <RiskPanel>
                <RiskHeader>
                  <RiskTitle>Risk Assessment</RiskTitle>
                  <RiskBadge $level={result.risk.overall}>
                    {result.risk.overall === 'Low' ? '✓' : result.risk.overall === 'Medium' ? '⚠' : '✕'} Overall {result.risk.overall} Risk
                  </RiskBadge>
                </RiskHeader>
                <RiskGrid>
                  {result.risk.items.map((item, i) => (
                    <RiskItem key={item.name} $index={i}>
                      <RiskItemIcon>{item.icon}</RiskItemIcon>
                      <RiskItemName>{item.name}</RiskItemName>
                      <RiskLevel $level={item.level}>{item.level} Risk</RiskLevel>
                      <RiskBarTrack>
                        <RiskBarFill $pct={item.pct} $delay={i * 0.08 + 0.4} />
                      </RiskBarTrack>
                      <RiskDesc>{item.desc}</RiskDesc>
                    </RiskItem>
                  ))}
                </RiskGrid>
              </RiskPanel>

              <SummaryRow>
                <SummaryBadge>
                  ✦ Plan ready · {result.days} days · RM {result.cost.toLocaleString()} est. cost
                </SummaryBadge>
                <ButtonRow>
                  <OutlineButton onClick={resetAll}>Reset</OutlineButton>
                </ButtonRow>
              </SummaryRow>
            </>
          )}
        </Card>

      </RightCol>
    </Root>
  );
}
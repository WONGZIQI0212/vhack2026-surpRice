import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { T } from '../styles/theme';
 
// Animations
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
const confFill = keyframes`
  from { width: 0; }
  to   { width: var(--cf); }
`;
const dotBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
`;
const glowBtn = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(23,72,200,0.22); }
  50%       { box-shadow: 0 0 0 7px rgba(23,72,200,0); }
`;
const countAnim = keyframes`
  from { opacity: 0; transform: scale(0.85) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
 
// Layout
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
 
// Glass card base
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
 
// Left panel - status rows
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
 
// AI badge
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
 
// Machine selector grid
const MachineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;
 
const MachineCard = styled.button`
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
  ${p => p.$active && css`animation: ${glowBtn} 2.5s ease infinite;`}
`;
 
const MachineGlow = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,110,240,0.12), transparent);
  pointer-events: none;
`;
 
const MachineIcon = styled.div`
  width: 34px; height: 34px; border-radius: 9px;
  background: ${p => p.$active
    ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})`
    : `rgba(180,192,210,0.22)`};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; transition: background 0.2s;
`;
 
const MachineName = styled.div`
  font-size: 0.6rem; font-weight: 700;
  color: ${p => p.$active ? T.accent : T.text};
  text-align: center; line-height: 1.3; transition: color 0.2s;
`;
 
const MachineSubText = styled.div`
  font-size: 0.5rem; color: ${T.muted}; text-align: center;
`;
 
const MachinePrice = styled.div`
  font-size: 0.58rem; font-weight: 700;
  color: ${p => p.$active ? T.accent : `rgba(92,106,130,0.7)`};
  margin-top: 1px;
`;
 
// 3D preview tag
const Tag3D = styled.div`
  display: flex; align-items: center; gap: 7px;
  padding: 7px 12px;
  background: linear-gradient(135deg, rgba(23,72,200,0.07), rgba(59,110,240,0.03));
  border: 1px solid rgba(59,110,240,0.2);
  border-radius: 10px; margin-bottom: 12px;
  font-size: 0.6rem; font-weight: 600; color: ${T.accent};
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;
 
const GreenPulse = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34,197,94,0.7);
  animation: ${dotBlink} 1.5s ease infinite;
  flex-shrink: 0;
`;
 
// Quantity selector
const QtyRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px;
  background: rgba(235,240,255,0.5);
  border: 1px solid rgba(59,110,240,0.14);
  border-radius: 11px; margin-bottom: 12px;
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;
 
const QtyLabelWrap = styled.div`
  display: flex; flex-direction: column; gap: 2px;
`;
 
const QtyTitle = styled.div`
  font-size: 0.62rem; font-weight: 700; color: ${T.text};
`;
 
const QtySub = styled.div`
  font-size: 0.55rem; color: ${T.muted};
`;
 
const QtyControls = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
 
const QtyBtn = styled.button`
  width: 26px; height: 26px; border-radius: 8px;
  border: 1px solid rgba(59,110,240,0.25);
  background: rgba(255,255,255,0.8);
  font-size: 0.85rem; font-weight: 700; color: ${T.accent};
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover { background: rgba(235,240,255,0.9); border-color: rgba(59,110,240,0.45); }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;
 
const QtyNum = styled.div`
  font-size: 1.1rem; font-weight: 700; color: ${T.accent};
  min-width: 22px; text-align: center; font-variant-numeric: tabular-nums;
`;
 
const TotalCostBadge = styled.div`
  font-size: 0.6rem; font-weight: 700; color: ${T.accent};
  background: rgba(23,72,200,0.07);
  border: 1px solid rgba(59,110,240,0.18);
  border-radius: 8px; padding: 4px 10px;
`;
 
// Run button
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
 
// Data source banner
const DataSourceBanner = styled.div`
  display: flex; align-items: flex-start; gap: 8px;
  padding: 9px 12px;
  background: rgba(235,240,255,0.55);
  border: 1px solid rgba(59,110,240,0.13);
  border-radius: 10px; margin-bottom: 12px;
  font-size: 0.58rem; color: ${T.sub}; line-height: 1.5;
  animation: ${fadeUp} 0.3s ease both;
`;
 
const DataSourceDot = styled.div`
  width: 6px; height: 6px; border-radius: 50%;
  background: ${T.accentM}; flex-shrink: 0; margin-top: 3px;
`;
 
// ROI summary cards
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
 
const ROIIcon = styled.div`font-size: 0.85rem; line-height: 1;`;
const ROILabel = styled.div`font-size: 0.5rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${T.muted}; margin-top: 2px;`;
const ROIValue = styled.div`
  font-size: 1rem; font-weight: 700; letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  color: ${p => p.$color || T.text};
  animation: ${countAnim} 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: ${p => p.$delay || 0}s;
`;
const ROISub = styled.div`font-size: 0.56rem; color: ${T.muted}; line-height: 1.4;`;
 
// Metric result grid
const MetricGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; margin-bottom: 10px;
`;
 
const MetricCard = styled.div`
  border-radius: 14px; padding: 13px 12px 12px;
  display: flex; flex-direction: column; gap: 3px;
  position: relative; overflow: hidden;
  background: ${p => p.$highlight
    ? `linear-gradient(155deg, rgba(23,72,200,0.08), rgba(59,110,240,0.03))`
    : `rgba(255,255,255,0.68)`};
  border: 1px solid ${p => p.$highlight ? `rgba(59,110,240,0.24)` : `rgba(210,218,232,0.5)`};
  box-shadow: 0 1px 8px rgba(13,17,23,0.04);
  animation: ${fadeUp} 0.38s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.07}s;
  transition: transform 0.18s, box-shadow 0.18s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,17,23,0.08); }
`;
 
const MetricTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: ${p => p.$good
    ? `linear-gradient(90deg, transparent, ${T.success} 40%, ${T.success} 60%, transparent)`
    : `linear-gradient(90deg, transparent, ${T.danger} 40%, ${T.danger} 60%, transparent)`};
`;
 
const MetricHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-top: 1px;`;
const MetricIcon = styled.div`font-size: 1rem; line-height: 1;`;
const MetricDeltaBadge = styled.div`
  font-size: 0.48rem; font-weight: 700;
  color: ${p => p.$good ? T.success : T.danger};
  background: ${p => p.$good ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)'};
  border-radius: 5px; padding: 1px 5px;
`;
const MetricTitle = styled.div`font-size: 0.52rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.muted};`;
const MetricBefore = styled.div`font-size: 0.65rem; color: ${T.sub}; font-weight: 500; font-variant-numeric: tabular-nums;`;
const MetricArrow = styled.div`font-size: 0.5rem; color: ${T.muted};`;
const MetricAfter = styled.div`
  font-size: 0.92rem; font-weight: 700;
  color: ${p => p.$good ? T.success : T.danger};
  font-variant-numeric: tabular-nums; letter-spacing: -0.01em;
  animation: ${countAnim} 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.07 + 0.15}s;
`;
const MetricDivider = styled.div`height: 1px; background: rgba(200,210,225,0.3); margin: 5px 0;`;
const BarPairWrap = styled.div`display: flex; flex-direction: column; gap: 2px; margin-bottom: 2px;`;
const BarPairLabel = styled.div`font-size: 0.46rem; color: ${T.muted}; letter-spacing: 0.06em;`;
const BarTrack = styled.div`height: 2.5px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const BarFill = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%;
  width: var(--w);
  background: ${p => p.$color};
  animation: ${barIn} 0.85s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay}s;
`;
const ConfRow = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;`;
const ConfLabel = styled.div`font-size: 0.48rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.muted};`;
const ConfPct = styled.div`
  font-size: 0.56rem; font-weight: 700;
  color: ${p => p.$value >= 90 ? T.success : p.$value >= 75 ? T.warning : T.danger};
`;
const ConfTrack = styled.div`height: 2px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const ConfFill = styled.div`
  height: 100%; border-radius: 99px;
  --cf: ${p => p.$value}%;
  width: var(--cf);
  background: ${p => p.$value >= 90
    ? `linear-gradient(90deg, ${T.success}, #34d399)`
    : p.$value >= 75
    ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
    : `linear-gradient(90deg, ${T.danger}, #f87171)`};
  animation: ${confFill} 1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay}s;
`;
 
// Risk panel
const RiskPanel = styled.div`
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(210,218,232,0.5);
  border-radius: 13px; padding: 13px 14px;
  animation: ${fadeUp} 0.4s 0.3s both;
`;
const RiskHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px;`;
const RiskTitle = styled.div`
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
const RiskLevel = styled.div`font-size: 0.64rem; font-weight: 700; color: ${p => p.$level === 'Low' ? T.success : p.$level === 'Medium' ? T.warning : T.danger};`;
const RiskDesc = styled.div`font-size: 0.57rem; color: ${T.sub}; line-height: 1.5;`;
const RiskBarTrack = styled.div`height: 3px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden;`;
const RiskBarFill = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%;
  width: var(--w);
  background: ${p => p.$pct <= 33
    ? `linear-gradient(90deg, ${T.success}, #34d399)`
    : p.$pct <= 66
    ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
    : `linear-gradient(90deg, ${T.danger}, #f87171)`};
  animation: ${barIn} 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay || 0}s;
`;
 
// Summary row
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
 
// Empty state
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
 
// Modal
const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(13,17,23,0.55);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  z-index: 200; display: flex; align-items: center; justify-content: center;
  animation: ${fadeUp} 0.2s ease both;
`;
const ModalBox = styled.div`
  width: min(940px, 93vw); max-height: 88vh;
  background: rgba(255,255,255,0.97);
  border: 1px solid rgba(255,255,255,0.95); border-radius: 22px;
  box-shadow: 0 32px 80px rgba(13,17,23,0.22);
  overflow-y: auto; padding: 24px 26px; position: relative;
  animation: ${popIn} 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(55,102,240,0.2); border-radius: 4px; }
`;
const ModalCloseBtn = styled.button`
  position: absolute; top: 16px; right: 16px;
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid rgba(200,210,225,0.5); background: transparent;
  font-size: 0.9rem; cursor: pointer; color: ${T.muted};
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  &:hover { color: ${T.text}; border-color: rgba(59,110,240,0.38); }
`;
const ModalHeading = styled.div`
  font-size: 0.9rem; font-weight: 700; color: ${T.text};
  margin-bottom: 4px;
  display: flex; align-items: center; gap: 8px;
  &::before { content: ''; width: 3px; height: 16px; background: linear-gradient(180deg, ${T.accent}, ${T.accentM}); border-radius: 2px; }
`;
const ModalSubHeading = styled.div`
  font-size: 0.6rem; color: ${T.muted}; margin-bottom: 18px; padding-left: 11px;
`;
const ModalMetricGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;
`;
const ModalMetricCard = styled.div`
  background: ${p => p.$highlight
    ? `linear-gradient(155deg, rgba(23,72,200,0.07), rgba(59,110,240,0.02))`
    : `rgba(248,249,253,0.95)`};
  border: 1px solid ${p => p.$highlight ? `rgba(59,110,240,0.22)` : `rgba(210,218,232,0.6)`};
  border-radius: 14px; padding: 18px 16px 14px;
  display: flex; flex-direction: column; gap: 5px;
  position: relative; overflow: hidden;
  animation: ${fadeUp} 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$index * 0.055}s;
`;
const ModalMetricTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: ${p => p.$good
    ? `linear-gradient(90deg, transparent, ${T.success}, transparent)`
    : `linear-gradient(90deg, transparent, ${T.danger}, transparent)`};
`;
const ModalMetricIcon  = styled.div`font-size: 1.4rem; line-height: 1; margin-bottom: 2px;`;
const ModalMetricTitle = styled.div`font-size: 0.58rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.muted};`;
const ModalMetricBefore= styled.div`font-size: 0.8rem; color: ${T.sub}; font-weight: 500;`;
const ModalMetricArrow = styled.div`font-size: 0.65rem; color: ${T.muted};`;
const ModalMetricAfter = styled.div`font-size: 1.35rem; font-weight: 700; color: ${p => p.$good ? T.success : T.danger}; font-variant-numeric: tabular-nums; letter-spacing: -0.02em;`;
const ModalMetricDelta = styled.div`
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 0.7rem; font-weight: 700;
  color: ${p => p.$good ? T.success : T.danger};
  background: ${p => p.$good ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)'};
  border-radius: 7px; padding: 3px 8px; width: fit-content;
`;
const ModalConfRow   = styled.div`display: flex; align-items: center; justify-content: space-between; margin-top: 4px;`;
const ModalConfLabel = styled.div`font-size: 0.52rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.muted};`;
const ModalConfValue = styled.div`font-size: 0.65rem; font-weight: 700; color: ${p => p.$value >= 90 ? T.success : p.$value >= 75 ? T.warning : T.danger};`;
const ModalBarTrack  = styled.div`height: 4px; background: rgba(180,192,210,0.18); border-radius: 99px; overflow: hidden; margin-top: 2px;`;
const ModalBarFill   = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%; width: var(--w);
  background: ${p => p.$color};
  animation: ${barIn} 0.85s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: ${p => p.$delay}s;
`;
const ModalInsight = styled.div`
  font-size: 0.67rem; color: ${T.sub}; line-height: 1.6; margin-top: 6px;
  padding-top: 8px; border-top: 1px solid rgba(200,210,225,0.3);
`;
 
// ─── Data ─────────────────────────────────────────────────────────────────────
 
const CURRENT_DATA = {
  overall: { profit: '+$45,000', labor: '18 ops', production: '11,100 kg/h', energy: '1,400 kWh', storage: '85%', workplace: 'Moderate' },
  line1:   { profit: '+$45,300', labor: '6 ops',  production: '3,890 kg/h',  energy: '460 kWh',   storage: '72%', workplace: 'Good' },
  line2:   { profit: '+$42,700', labor: '6 ops',  production: '3,720 kg/h',  energy: '450 kWh',   storage: '68%', workplace: 'Good' },
  line3:   { profit: '+$43,800', labor: '6 ops',  production: '3,760 kg/h',  energy: '455 kWh',   storage: '70%', workplace: 'Good' },
};
 
const SNAP_ROWS = [
  { key: 'profit',     label: 'Est. Profit',  green: true,  pct: 62 },
  { key: 'labor',      label: 'Workers',       green: false, pct: 45 },
  { key: 'production', label: 'Production',    green: false, pct: 55 },
  { key: 'energy',     label: 'Energy',        green: false, pct: 42 },
  { key: 'storage',    label: 'Storage',       green: false, pct: 85 },
  { key: 'workplace',  label: 'Workplace',     green: false, pct: 70 },
];
 
const MACHINES = [
  { id: 'husker',    icon: '🌾', name: 'Paddy Husker',      sub: 'De-hulling', price: 'RM 28,000' },
  { id: 'milling',   icon: '⚙️', name: 'Rice Milling',      sub: 'Polishing',  price: 'RM 45,000' },
  { id: 'conveyor',  icon: '🔄', name: 'Conveyor Belt',     sub: 'Transport',  price: 'RM 18,500' },
  { id: 'palletize', icon: '🤖', name: 'Palletizing Robot', sub: 'Stacking',   price: 'RM 62,000' },
];
 
const MACHINE_PRICES = { husker: 28000, milling: 45000, conveyor: 18500, palletize: 62000 };
 
const DELTAS = {
  husker:    { profit: +8200,  labor: -1, production: +620,  energy: +85,  storage: +6,  workplace: 'Good' },
  milling:   { profit: +9500,  labor: -2, production: +780,  energy: +95,  storage: +8,  workplace: 'Good' },
  conveyor:  { profit: +5800,  labor: 0,  production: +510,  energy: +60,  storage: +4,  workplace: 'Moderate' },
  palletize: { profit: +7100,  labor: -2, production: +340,  energy: +70,  storage: +7,  workplace: 'Good' },
};
 
const CONFIDENCE = {
  husker:    { profit: 91.4, production: 94.2, labor: 88.7, energy: 86.1, storage: 92.3, workplace: 89.5 },
  milling:   { profit: 93.8, production: 96.1, labor: 91.2, energy: 84.7, storage: 94.0, workplace: 90.3 },
  conveyor:  { profit: 87.6, production: 90.4, labor: 95.0, energy: 88.2, storage: 85.9, workplace: 83.4 },
  palletize: { profit: 90.2, production: 88.9, labor: 97.3, energy: 85.6, storage: 91.7, workplace: 94.8 },
};
 
const DATA_SOURCES = {
  husker:    'Analysed 1,243 paddy husker deployments across SE Asian rice mills (2019-2024)',
  milling:   'Derived from 987 milling unit upgrades in comparable factory configurations',
  conveyor:  'Modelled on 2,104 conveyor integration datasets from automated food processing plants',
  palletize: 'Trained on 1,876 palletizing robot deployments in medium-scale manufacturing facilities',
};
 
const RISK_DATA = {
  husker: { overall: 'Low', items: [
    { icon: '⚡', name: 'Power Load',  level: 'Low',    pct: 22, desc: 'Within current electrical capacity. No additional circuit required.' },
    { icon: '📐', name: 'Floor Space', level: 'Low',    pct: 28, desc: 'Fits within designated zone. No structural changes needed.' },
    { icon: '👤', name: 'Training',    level: 'Medium', pct: 45, desc: 'Operators require 2-day onboarding for new de-hulling unit.' },
  ]},
  milling: { overall: 'Low', items: [
    { icon: '⚡', name: 'Power Load',  level: 'Medium', pct: 52, desc: 'May require dedicated 3-phase line. Verify with electrician.' },
    { icon: '📐', name: 'Floor Space', level: 'Low',    pct: 30, desc: 'Footprint compatible with current milling zone layout.' },
    { icon: '👤', name: 'Training',    level: 'Low',    pct: 18, desc: 'Minimal retraining — similar interface to current unit.' },
  ]},
  conveyor: { overall: 'Low', items: [
    { icon: '⚡', name: 'Power Load',  level: 'Low',    pct: 20, desc: 'Low power draw. Standard 240V outlet sufficient.' },
    { icon: '📐', name: 'Floor Space', level: 'Medium', pct: 55, desc: 'Belt extension requires partial rearrangement of layout.' },
    { icon: '👤', name: 'Training',    level: 'Low',    pct: 15, desc: 'Simple operation — minimal training required.' },
  ]},
  palletize: { overall: 'Medium', items: [
    { icon: '⚡', name: 'Power Load',  level: 'Medium', pct: 58, desc: 'Robot arm draws 4.2 kW peak. Check circuit breaker capacity.' },
    { icon: '📐', name: 'Floor Space', level: 'Medium', pct: 60, desc: 'Requires 3m safety clearance radius. Zone reconfiguration needed.' },
    { icon: '👤', name: 'Training',    level: 'Medium', pct: 50, desc: 'Operators need 3-day certified robotics safety training.' },
  ]},
};
 
const METRICS = [
  { key: 'profit',     label: 'Est. Profit',  icon: '💰', goodUp: true  },
  { key: 'production', label: 'Production',   icon: '⚡', goodUp: true  },
  { key: 'labor',      label: 'Workers',      icon: '👷', goodUp: false },
  { key: 'energy',     label: 'Energy Use',   icon: '🔋', goodUp: false },
  { key: 'storage',    label: 'Storage',      icon: '🗃️', goodUp: true  },
  { key: 'workplace',  label: 'Workplace',    icon: '🏭', goodUp: true  },
];
 
const INSIGHTS = {
  profit:     'Revenue increase driven by higher throughput and reduced labour costs per unit produced.',
  production: 'Higher output per hour enables fulfilment of more orders within the same shift window.',
  labor:      'Automation reduces operators required on the floor, freeing staff for quality-control roles.',
  energy:     'Additional machinery increases power draw. Schedule high-load tasks during off-peak tariff hours.',
  storage:    'Higher production volume fills warehouse capacity faster. Review logistics dispatch frequency.',
  workplace:  'Automated handling reduces repetitive strain risk and improves floor safety compliance.',
};
 
function computeResult(now, delta, machineId, qty) {
  const p  = parseInt(now.profit.replace(/[^0-9]/g, ''));
  const l  = parseInt(now.labor);
  const pr = parseInt(now.production.replace(/[^0-9]/g, ''));
  const e  = parseInt(now.energy.replace(/[^0-9]/g, ''));
  const s  = parseInt(now.storage);
  const totalCost = MACHINE_PRICES[machineId] * qty;
  const profitGain = delta.profit * qty;
  return {
    profit:     `+$${(p + delta.profit * qty).toLocaleString()}`,
    labor:      `${Math.max(0, l + delta.labor * qty)} ops`,
    production: `${(pr + delta.production * qty).toLocaleString()} kg/h`,
    energy:     `${(e + delta.energy * qty).toLocaleString()} kWh`,
    storage:    `${Math.min(99, s + delta.storage * qty)}%`,
    workplace:  delta.workplace,
    roi: {
      totalCost,
      profitGain,
      paybackMonths: Math.ceil(totalCost / profitGain),
    },
    deltas: {
      profit:     { val: `+$${(delta.profit * qty).toLocaleString()}`,         good: true },
      production: { val: `+${(delta.production * qty).toLocaleString()} kg/h`, good: true },
      labor:      { val: delta.labor * qty < 0 ? `${delta.labor * qty}` : `+${delta.labor * qty}`, good: delta.labor <= 0 },
      energy:     { val: `+${delta.energy * qty} kWh`,                         good: false },
      storage:    { val: `+${delta.storage * qty}%`,                            good: true },
      workplace:  { val: delta.workplace === 'Good' ? 'Better' : 'Same',       good: delta.workplace === 'Good' },
    },
  };
}
 
// ─── Component ────────────────────────────────────────────────────────────────
 
export default function AIPrediction({ mId, onNewMachineSelect }) {
  const [selected, setSelected] = useState(null);
  const [qty,      setQty]      = useState(1);
  const [running,  setRunning]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [zoomed,   setZoomed]   = useState(false);
 
  const now = CURRENT_DATA[mId] || CURRENT_DATA.overall;
 
  useEffect(() => {
    setResult(null);
    setSelected(null);
    setQty(1);
    if (onNewMachineSelect) onNewMachineSelect(null);
  }, [mId]);
 
  const pickMachine = (id) => {
    setSelected(id);
    setResult(null);
    if (onNewMachineSelect) onNewMachineSelect(id);
  };
 
  const runPrediction = () => {
    if (!selected || running) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(computeResult(now, DELTAS[selected], selected, qty));
      setRunning(false);
    }, 1800);
  };
 
  const resetAll = () => {
    setResult(null);
    setSelected(null);
    setQty(1);
    if (onNewMachineSelect) onNewMachineSelect(null);
  };
 
  const selMachine = MACHINES.find(m => m.id === selected);
  const conf = selected ? CONFIDENCE[selected] : null;
  const risk = selected && result ? RISK_DATA[selected] : null;
 
  return (
    <Root>
 
      {/* LEFT: Current Status */}
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
                {now[r.key]}
              </StatusValue>
              <StatusBar $pct={r.pct} $green={r.green} />
            </StatusRow>
          ))}
        </Card>
      </LeftCol>
 
      {/* RIGHT: Simulator + Results */}
      <RightCol>
 
        {/* Selector Card */}
        <Card>
          <CardTrace />
          <AIBadge>✨ AI Engine</AIBadge>
          <SectionLabel>Add New Machine · Simulation</SectionLabel>
 
          {selected && (
            <Tag3D>
              <GreenPulse />
              3D Preview Active · {selMachine?.name} loaded in scene above
            </Tag3D>
          )}
 
          <MachineGrid>
            {MACHINES.map(m => (
              <MachineCard
                key={m.id}
                $active={selected === m.id}
                onClick={() => pickMachine(m.id)}
              >
                {selected === m.id && <MachineGlow />}
                <MachineIcon $active={selected === m.id}>{m.icon}</MachineIcon>
                <MachineName $active={selected === m.id}>{m.name}</MachineName>
                <MachineSubText>{m.sub}</MachineSubText>
                <MachinePrice $active={selected === m.id}>{m.price}</MachinePrice>
              </MachineCard>
            ))}
          </MachineGrid>
 
          {selected && (
            <QtyRow>
              <QtyLabelWrap>
                <QtyTitle>Number of Units</QtyTitle>
                <QtySub>Multiply effect across {qty} machine{qty > 1 ? 's' : ''}</QtySub>
              </QtyLabelWrap>
              <QtyControls>
                <QtyBtn onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</QtyBtn>
                <QtyNum>{qty}</QtyNum>
                <QtyBtn onClick={() => setQty(q => Math.min(5, q + 1))} disabled={qty >= 5}>+</QtyBtn>
              </QtyControls>
              <TotalCostBadge>
                Total: RM {(MACHINE_PRICES[selected] * qty).toLocaleString()}
              </TotalCostBadge>
            </QtyRow>
          )}
 
          <RunButton
            onClick={runPrediction}
            $running={running}
            disabled={!selected || running}
          >
            {running
              ? <><BtnSpinner />Analysing {qty > 1 ? `${qty}x ` : ''}{selMachine?.name} deployment data…</>
              : result
                ? '⟳  Re-run Prediction'
                : '▶  Run AI Prediction'}
          </RunButton>
        </Card>
 
        {/* Results Card */}
        <Card>
          <CardTrace />
 
          {!result ? (
            <EmptyState>
              <EmptyRing>🤖</EmptyRing>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: T.muted }}>
                No prediction yet
              </div>
              <div style={{ fontSize: '0.6rem', color: T.muted, opacity: 0.6, textAlign: 'center' }}>
                {selected ? 'Press ▶ Run AI Prediction above' : 'Select a machine type to begin'}
              </div>
            </EmptyState>
          ) : (
            <>
              <SectionLabel>
                Prediction Results · {qty > 1 ? `${qty}x ` : ''}{selMachine?.name}
              </SectionLabel>
 
              <DataSourceBanner>
                <DataSourceDot />
                <span>
                  <b style={{ color: T.accent }}>Data source: </b>
                  {DATA_SOURCES[selected]}
                </span>
              </DataSourceBanner>
 
              {/* ROI Summary */}
              <ROIGrid>
                <ROICard $accent>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.accent}, transparent)`} />
                  <ROIIcon>💸</ROIIcon>
                  <ROILabel>Total Investment</ROILabel>
                  <ROIValue $color={T.accent} $delay={0}>
                    RM {result.roi.totalCost.toLocaleString()}
                  </ROIValue>
                  <ROISub>{qty} unit{qty > 1 ? 's' : ''} x RM {MACHINE_PRICES[selected].toLocaleString()}</ROISub>
                </ROICard>
                <ROICard>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.success}, transparent)`} />
                  <ROIIcon>📈</ROIIcon>
                  <ROILabel>Monthly Profit Gain</ROILabel>
                  <ROIValue $color={T.success} $delay={0.08}>
                    +${result.roi.profitGain.toLocaleString()}
                  </ROIValue>
                  <ROISub>vs current baseline</ROISub>
                </ROICard>
                <ROICard>
                  <ROITopLine $color={`linear-gradient(90deg, transparent, ${T.warning}, transparent)`} />
                  <ROIIcon>⏱️</ROIIcon>
                  <ROILabel>Est. Payback Period</ROILabel>
                  <ROIValue $color={T.warning} $delay={0.16}>
                    {result.roi.paybackMonths} months
                  </ROIValue>
                  <ROISub>at current production rate</ROISub>
                </ROICard>
              </ROIGrid>
 
              {/* Metric Cards */}
              <MetricGrid>
                {METRICS.map((m, i) => {
                  const d  = result.deltas[m.key];
                  const cv = conf[m.key];
                  return (
                    <MetricCard key={m.key} $index={i} $highlight={i === 0}>
                      <MetricTopLine $good={d.good} />
                      <MetricHeader>
                        <MetricIcon>{m.icon}</MetricIcon>
                        <MetricDeltaBadge $good={d.good}>
                          {d.good ? '▲' : '▼'} {d.val}
                        </MetricDeltaBadge>
                      </MetricHeader>
                      <MetricTitle>{m.label}</MetricTitle>
                      <MetricBefore>{now[m.key]}</MetricBefore>
                      <MetricArrow>↓</MetricArrow>
                      <MetricAfter $good={d.good} $index={i}>{result[m.key]}</MetricAfter>
                      <MetricDivider />
                      <BarPairWrap>
                        <BarPairLabel>Before</BarPairLabel>
                        <BarTrack>
                          <BarFill $pct={60} $color={`linear-gradient(90deg, ${T.accent}, ${T.accentM})`} $delay={i * 0.05} />
                        </BarTrack>
                      </BarPairWrap>
                      <BarPairWrap>
                        <BarPairLabel>After</BarPairLabel>
                        <BarTrack>
                          <BarFill
                            $pct={d.good ? 80 : 50}
                            $color={d.good
                              ? `linear-gradient(90deg, ${T.success}, #34d399)`
                              : `linear-gradient(90deg, ${T.danger}, #f87171)`}
                            $delay={i * 0.05 + 0.17}
                          />
                        </BarTrack>
                      </BarPairWrap>
                      <ConfRow>
                        <ConfLabel>AI Confidence</ConfLabel>
                        <ConfPct $value={cv}>{cv}%</ConfPct>
                      </ConfRow>
                      <ConfTrack>
                        <ConfFill $value={cv} $delay={i * 0.06 + 0.3} />
                      </ConfTrack>
                    </MetricCard>
                  );
                })}
              </MetricGrid>
 
              {/* Risk Assessment */}
              {risk && (
                <RiskPanel>
                  <RiskHeader>
                    <RiskTitle>Risk Assessment</RiskTitle>
                    <RiskBadge $level={risk.overall}>
                      {risk.overall === 'Low' ? '✓' : risk.overall === 'Medium' ? '⚠' : '✕'} Overall {risk.overall} Risk
                    </RiskBadge>
                  </RiskHeader>
                  <RiskGrid>
                    {risk.items.map((item, i) => (
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
              )}
 
              <SummaryRow>
                <SummaryBadge>✦ ROI positive · Recommended to deploy</SummaryBadge>
                <ButtonRow>
                  <OutlineButton onClick={() => setZoomed(true)}>⛶ Expand</OutlineButton>
                  <OutlineButton onClick={resetAll}>Reset</OutlineButton>
                </ButtonRow>
              </SummaryRow>
            </>
          )}
        </Card>
 
      </RightCol>
 
      {/* Fullscreen Modal */}
      {zoomed && result && (
        <ModalOverlay onClick={() => setZoomed(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalCloseBtn onClick={() => setZoomed(false)}>✕</ModalCloseBtn>
            <ModalHeading>
              Prediction Results · {qty > 1 ? `${qty}x ` : ''}{selMachine?.name}
            </ModalHeading>
            <ModalSubHeading>{DATA_SOURCES[selected]}</ModalSubHeading>
            <ModalMetricGrid>
              {METRICS.map((m, i) => {
                const d  = result.deltas[m.key];
                const cv = conf[m.key];
                return (
                  <ModalMetricCard key={m.key} $index={i} $highlight={i === 0}>
                    <ModalMetricTopLine $good={d.good} />
                    <ModalMetricIcon>{m.icon}</ModalMetricIcon>
                    <ModalMetricTitle>{m.label}</ModalMetricTitle>
                    <ModalMetricBefore>{now[m.key]}</ModalMetricBefore>
                    <ModalMetricArrow>↓</ModalMetricArrow>
                    <ModalMetricAfter $good={d.good}>{result[m.key]}</ModalMetricAfter>
                    <ModalMetricDelta $good={d.good}>
                      {d.good ? '▲' : '▼'} {d.val}
                    </ModalMetricDelta>
                    <ModalConfRow>
                      <ModalConfLabel>AI Confidence</ModalConfLabel>
                      <ModalConfValue $value={cv}>{cv}%</ModalConfValue>
                    </ModalConfRow>
                    <ModalBarTrack>
                      <ModalBarFill $pct={60} $color={`linear-gradient(90deg, ${T.accent}, ${T.accentM})`} $delay={i * 0.05} />
                    </ModalBarTrack>
                    <ModalBarTrack>
                      <ModalBarFill
                        $pct={d.good ? 80 : 50}
                        $color={d.good
                          ? `linear-gradient(90deg, ${T.success}, #34d399)`
                          : `linear-gradient(90deg, ${T.danger}, #f87171)`}
                        $delay={i * 0.05 + 0.15}
                      />
                    </ModalBarTrack>
                    <ModalBarTrack>
                      <ModalBarFill
                        $pct={cv}
                        $color={cv >= 90
                          ? `linear-gradient(90deg, ${T.success}, #34d399)`
                          : cv >= 75
                          ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
                          : `linear-gradient(90deg, ${T.danger}, #f87171)`}
                        $delay={i * 0.05 + 0.3}
                      />
                    </ModalBarTrack>
                    <ModalInsight>{INSIGHTS[m.key]}</ModalInsight>
                  </ModalMetricCard>
                );
              })}
            </ModalMetricGrid>
            <SummaryRow>
              <SummaryBadge>
                ✦ ROI positive · Payback in {result.roi.paybackMonths} months
              </SummaryBadge>
              <ButtonRow>
                <OutlineButton onClick={() => { resetAll(); setZoomed(false); }}>Reset</OutlineButton>
              </ButtonRow>
            </SummaryRow>
          </ModalBox>
        </ModalOverlay>
      )}
 
    </Root>
  );
}
 
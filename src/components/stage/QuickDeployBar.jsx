import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { T } from '../../styles/theme';

// ─── Production preset data ───────────────────────────────────────────────────

export const PRODUCTION_PRESETS = {
  '5kg': {
    label: '5 kg',
    sublabel: 'Standard Pack',
    icon: '🌾',
    color: '#059669',
    colorBg: 'rgba(5,150,105,0.09)',
    colorBorder: 'rgba(5,150,105,0.22)',
    estimatedOutput: '~2,160 bags / shift',
    cycleTime: '1.67 s / bag',
    lastDeployed: '09:12 today',
    diff: { speed: '+22%', pressure: '-18%', throughput: '+31%' },
    machines: {
      husker:    { feedRate: '22 bags/min', rollerPressure: '3.2 bar', moistureTarget: '13.5%', rpm: 1450, efficiency: '98.2%' },
      milling:   { millingSpeed: '1,800 rpm', branRemoval: '8%', whiteningIndex: 42, polishingPasses: 3, grainTemp: '38°C' },
      conveyor:  { beltSpeed: '0.85 m/s', loadCapacity: '120 kg/m', transferGap: '180 ms', vibration: '0.6 mm/s', sortAccuracy: '99.4%' },
      palletize: { boxesPerMin: 18, layerPattern: '4×3 grid', stackHeight: '6 layers', armSpeed: '1.2 m/s', weightCheck: '5.02 ± 0.03 kg' },
    },
  },
  '10kg': {
    label: '10 kg',
    sublabel: 'Bulk Pack',
    icon: '🌾',
    color: '#1748C8',
    colorBg: 'rgba(23,72,200,0.09)',
    colorBorder: 'rgba(23,72,200,0.22)',
    estimatedOutput: '~1,080 bags / shift',
    cycleTime: '3.33 s / bag',
    lastDeployed: '2 days ago',
    diff: { speed: '-22%', pressure: '+28%', throughput: '-31%' },
    machines: {
      husker:    { feedRate: '14 bags/min', rollerPressure: '4.1 bar', moistureTarget: '14.0%', rpm: 1100, efficiency: '99.1%' },
      milling:   { millingSpeed: '1,400 rpm', branRemoval: '6%', whiteningIndex: 38, polishingPasses: 2, grainTemp: '41°C' },
      conveyor:  { beltSpeed: '0.55 m/s', loadCapacity: '220 kg/m', transferGap: '320 ms', vibration: '0.9 mm/s', sortAccuracy: '99.7%' },
      palletize: { boxesPerMin: 11, layerPattern: '3×2 grid', stackHeight: '4 layers', armSpeed: '0.8 m/s', weightCheck: '10.05 ± 0.05 kg' },
    },
  },
};

const ALL_MACHINES = [
  { key: 'line1-husker',    label: 'Husker 01',     type: 'husker',    line: 'L1' },
  { key: 'line1-milling',   label: 'Milling 01',    type: 'milling',   line: 'L1' },
  { key: 'line1-conveyor',  label: 'Conveyor 01',   type: 'conveyor',  line: 'L1' },
  { key: 'line1-palletize', label: 'Palletizer 01', type: 'palletize', line: 'L1' },
  { key: 'line2-husker',    label: 'Husker 02',     type: 'husker',    line: 'L2' },
  { key: 'line2-milling',   label: 'Milling 02',    type: 'milling',   line: 'L2' },
  { key: 'line2-conveyor',  label: 'Conveyor 02',   type: 'conveyor',  line: 'L2' },
  { key: 'line2-palletize', label: 'Palletizer 02', type: 'palletize', line: 'L2' },
  { key: 'line3-husker',    label: 'Husker 03',     type: 'husker',    line: 'L3' },
  { key: 'line3-milling',   label: 'Milling 03',    type: 'milling',   line: 'L3' },
  { key: 'line3-conveyor',  label: 'Conveyor 03',   type: 'conveyor',  line: 'L3' },
  { key: 'line3-palletize', label: 'Palletizer 03', type: 'palletize', line: 'L3' },
];

// ─── Animations ───────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const scanBar = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(500%); }
`;

const checkPop = keyframes`
  0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
  60%  { transform: scale(1.3) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const glowGreen = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.4); }
  50%     { box-shadow: 0 0 0 8px rgba(5,150,105,0); }
`;

const shimmerAi = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const dotBreath = keyframes`
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.45; transform: scale(0.65); }
`;

const runningPulse = keyframes`
  0%,100% { opacity: 1; }
  50%     { opacity: 0.5; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const collapseHeight = keyframes`
  from { max-height: 400px; opacity: 1; }
  to   { max-height: 0;   opacity: 0; }
`;

// ─── Styled components ────────────────────────────────────────────────────────

const Wrap = styled.div`
  position: absolute;
  top: 56px;
  left: 14px;
  right: 14px;
  z-index: 28;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  pointer-events: none;
`;

/* ── Main bar ── */

const MainBar = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 6px;
  background: rgba(255,255,255,0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.96);
  border-radius: 12px;
  box-shadow: 0 3px 16px rgba(13,17,23,0.09), 0 1px 3px rgba(13,17,23,0.05);
  pointer-events: all;
  flex-shrink: 0;
`;

const AiBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 7px;
  background: ${(p) => p.$running
    ? 'linear-gradient(135deg,#059669,#047857)'
    : 'linear-gradient(135deg,#0D1117,#1c2a4a)'};
  flex-shrink: 0;
  transition: background 0.4s ease;
`;

const AiDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.$running ? '#fff' : '#4ade80'};
  box-shadow: ${(p) => p.$running ? 'none' : '0 0 7px rgba(74,222,128,0.9)'};
  animation: ${(p) => p.$running ? css`${runningPulse} 1.2s ease infinite` : css`${dotBreath} 2s ease infinite`};
`;

const AiText = styled.span`
  font-size: 0.53rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${(p) => p.$running ? '#fff' : 'transparent'};
  background: ${(p) => p.$running ? 'none' : 'linear-gradient(90deg,#a5f3fc 0%,#818cf8 50%,#a5f3fc 100%)'};
  background-size: 200% auto;
  -webkit-background-clip: ${(p) => p.$running ? 'unset' : 'text'};
  -webkit-text-fill-color: ${(p) => p.$running ? '#fff' : 'transparent'};
  background-clip: ${(p) => p.$running ? 'unset' : 'text'};
  animation: ${(p) => p.$running ? 'none' : css`${shimmerAi} 3s linear infinite`};
`;

const Sep = styled.div`
  width: 1px;
  height: 20px;
  background: ${T.border};
  flex-shrink: 0;
`;

const PickLabel = styled.span`
  font-size: 0.58rem;
  font-weight: 700;
  color: ${T.sub};
  letter-spacing: 0.05em;
  white-space: nowrap;
  flex-shrink: 0;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const PresetBtn = styled.button`
  height: 28px;
  padding: 0 11px;
  border-radius: 7px;
  border: 1px solid ${(p) => p.$on ? p.$col : T.border};
  background: ${(p) => p.$on ? p.$bg : 'transparent'};
  color: ${(p) => p.$on ? p.$col : T.sub};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  cursor: ${(p) => p.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${(p) => p.disabled && !p.$on ? 0.45 : 1};
  transition: all 0.17s cubic-bezier(.34,1.56,.64,1);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.$col};
    color: ${(p) => p.$col};
    background: ${(p) => p.$bg};
    transform: translateY(-1px);
  }

  ${(p) => p.$on && css`box-shadow: 0 2px 8px ${p.$col}30;`}
`;

const ActionBtn = styled.button`
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  border: none;
  background: ${(p) =>
    p.$green   ? 'linear-gradient(135deg,#059669,#10b981)' :
    p.$running ? 'linear-gradient(135deg,#374151,#4B5563)' :
                 'linear-gradient(135deg,#1748C8,#3B6EF0)'};
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: ${(p) => p.disabled ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  flex-shrink: 0;
  animation: ${slideIn} 0.28s cubic-bezier(.34,1.56,.64,1) both;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(23,72,200,0.35);
  }

  ${(p) => p.$green && css`
    animation: ${glowGreen} 1.6s ease 3;
    &:hover:not(:disabled) { box-shadow: 0 4px 14px rgba(5,150,105,0.35); }
  `}
`;

const StartBtn = styled(ActionBtn)`
  background: linear-gradient(135deg,#059669,#10b981);
  animation: ${slideIn} 0.32s cubic-bezier(.34,1.56,.64,1) both;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 16px rgba(5,150,105,0.4);
  }
`;

const ResetBtn = styled.button`
  height: 28px;
  padding: 0 9px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: transparent;
  color: ${T.muted};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.57rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  animation: ${slideIn} 0.25s ease both;
  transition: all 0.15s;

  &:hover { border-color: ${T.sub}; color: ${T.sub}; }
`;

const Spinner = styled.div`
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: ${spin} 0.7s linear infinite;
`;

/* ── Info panel (click-outside to close) ── */

const InfoPanel = styled.div`
  display: flex;
  align-items: stretch;
  background: rgba(255,255,255,0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.96);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 16px rgba(13,17,23,0.09);
  animation: ${fadeUp} 0.22s cubic-bezier(.22,.68,0,1.1) both;
  pointer-events: all;
  flex-shrink: 0;
`;

const InfoCell = styled.div`
  padding: 6px 11px;
  border-right: 1px solid ${T.border};
  &:last-child { border-right: none; }
`;

const InfoKey = styled.div`
  font-size: 0.46rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 2px;
  white-space: nowrap;
`;

const InfoVal = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  color: ${T.text};
  white-space: nowrap;
`;

const DiffVal = styled.span`
  font-size: 0.58rem;
  font-weight: 700;
  color: ${(p) => p.$up ? '#059669' : '#DC2626'};
`;

/* ── Progress panel ── */

const ProgressWrap = styled.div`
  position: absolute;
  top: 96px;
  left: 14px;
  z-index: 28;
  pointer-events: all;
`;

const ProgressPanel = styled.div`
  background: rgba(255,255,255,0.93);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.96);
  border-radius: 13px;
  box-shadow: 0 8px 28px rgba(13,17,23,0.11);
  animation: ${fadeUp} 0.3s cubic-bezier(.22,.68,0,1.1) both;
  min-width: 330px;
  overflow: hidden;
`;

const PHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px 8px;
  cursor: pointer;
  user-select: none;

  &:hover { background: rgba(0,0,0,0.015); }
`;

const PTitle = styled.div`
  font-size: 0.57rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.$done ? '#059669' : T.sub};
  transition: color 0.3s;
`;

const PRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PCount = styled.div`
  font-size: 0.57rem;
  font-weight: 700;
  color: ${T.muted};
`;

const CollapseArrow = styled.div`
  font-size: 0.6rem;
  color: ${T.muted};
  transform: ${(p) => p.$open ? 'rotate(0deg)' : 'rotate(-90deg)'};
  transition: transform 0.22s ease;
  line-height: 1;
`;

const PBody = styled.div`
  overflow: hidden;
  max-height: ${(p) => p.$open ? '320px' : '0'};
  transition: max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.25s ease;
  opacity: ${(p) => p.$open ? 1 : 0};
  padding: ${(p) => p.$open ? '0 13px 10px' : '0 13px'};
`;

const MRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 2.5px 0;
`;

const MLine = styled.div`
  font-size: 0.49rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: ${T.muted};
  width: 18px;
  flex-shrink: 0;
`;

const MName = styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  color: ${(p) => p.$done ? T.text : p.$live ? T.accent : T.muted};
  width: 88px;
  flex-shrink: 0;
  transition: color 0.2s;
`;

const MTrack = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 99px;
  background: ${T.border};
  overflow: hidden;
`;

const MFill = styled.div`
  height: 100%;
  border-radius: 99px;
  width: ${(p) => p.$done ? '100%' : p.$live ? '65%' : '0%'};
  background: ${(p) =>
    p.$done ? 'linear-gradient(90deg,#059669,#10b981)' :
    p.$live ? 'linear-gradient(90deg,#1748C8,#3B6EF0)' : 'transparent'};
  transition: width 0.35s ease, background 0.25s ease;
  position: relative;
  overflow: hidden;

  ${(p) => p.$live && css`
    &::after {
      content: '';
      position: absolute; inset-y: 0; left: 0; width: 35%;
      background: linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent);
      animation: ${scanBar} 0.85s ease infinite;
    }
  `}
`;

const MCheck = styled.div`
  width: 15px; height: 15px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.48rem; font-weight: 900; color: #fff;
  flex-shrink: 0;
  background: ${(p) => p.$done ? '#059669' : p.$live ? T.accent : T.border};
  transition: background 0.2s;
  ${(p) => p.$done && css`animation: ${checkPop} 0.35s cubic-bezier(.34,1.56,.64,1) both;`}
`;

const PSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid ${T.border};
`;

const SBadge = styled.div`
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(5,150,105,0.1);
  border: 1px solid rgba(5,150,105,0.2);
  font-size: 0.55rem; font-weight: 700; color: #059669;
  white-space: nowrap;
`;

const SMeta = styled.div`
  font-size: 0.53rem;
  color: ${T.muted};
  font-weight: 500;
`;

/* ── Confirm modal — absolute inside StageArea so it never clips ── */

const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 90;
  background: rgba(13,17,23,0.28);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  animation: ${overlayIn} 0.18s ease both;
`;

const ModalBox = styled.div`
  width: 400px;
  background: rgba(255,255,255,0.96);
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(221,227,239,0.9),
    0 24px 60px rgba(13,17,23,0.16),
    0 8px 20px rgba(13,17,23,0.08);
  animation: ${modalIn} 0.28s cubic-bezier(.34,1.56,.64,1) both;
`;

const ModalGlow = styled.div`display: none;`;

const ModalTop = styled.div`
  padding: 16px 18px 14px;
  background: linear-gradient(135deg, #1748C8 0%, #3B6EF0 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 130px; height: 130px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -20px; left: 30px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    pointer-events: none;
  }
`;

const ModalEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
`;

const ModalEyebrowDot = styled.div`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.6);
`;

const ModalEyebrowText = styled.span`
  font-size: 0.48rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
`;

const ModalTitle = styled.div`
  font-size: 0.98rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 2px;
`;

const ModalSubTitle = styled.div`
  font-size: 0.58rem;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
`;

const ModalMid = styled.div`
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalWarn = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 10px 12px;
  border-radius: 9px;
  background: rgba(217,119,6,0.06);
  border: 1px solid rgba(217,119,6,0.18);
`;

const ModalWarnIcon = styled.div`
  font-size: 0.78rem;
  flex-shrink: 0;
  margin-top: 1px;
`;

const ModalWarnText = styled.div`
  font-size: 0.62rem;
  color: ${T.sub};
  line-height: 1.55;
  strong { color: ${T.text}; font-weight: 700; }
`;

const ModalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

const ModalStat = styled.div`
  padding: 9px 10px;
  border-radius: 9px;
  background: ${T.bg};
  border: 1px solid ${T.border};
  text-align: center;
`;

const ModalStatKey = styled.div`
  font-size: 0.43rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 4px;
`;

const ModalStatVal = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${T.accent};
  line-height: 1;
`;

const ModalStatSub = styled.div`
  font-size: 0.48rem;
  color: ${T.muted};
  margin-top: 2px;
  font-weight: 500;
`;

const ModalBottom = styled.div`
  padding: 10px 18px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${T.border};
`;

const ModalBottomNote = styled.div`
  font-size: 0.53rem;
  color: ${T.muted};
  font-weight: 500;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 7px;
`;

const ModalCancel = styled.button`
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: transparent;
  color: ${T.sub};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${T.sub};
    color: ${T.text};
    background: rgba(0,0,0,0.02);
  }
`;

const ModalConfirm = styled.button`
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #1748C8, #3B6EF0);
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
  box-shadow: 0 2px 10px rgba(23,72,200,0.3);
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(23,72,200,0.4);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuickDeployBar({ visible = true }) {
  const [selected, setSelected]       = useState(null);
  const [showInfo, setShowInfo]       = useState(false);
  const [deploying, setDeploying]     = useState(false);
  const [doneCount, setDoneCount]     = useState(0);
  const [deployDone, setDeployDone]   = useState(false);
  const [listOpen, setListOpen]       = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [running, setRunning]         = useState(false);   // factory is running
  const [runningPreset, setRunningPreset] = useState(null);

  const timers  = useRef([]);
  const infoRef = useRef(null);
  const barRef  = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Click outside info panel → close it
  useEffect(() => {
    if (!showInfo) return;
    const handler = (e) => {
      if (infoRef.current && !infoRef.current.contains(e.target) &&
          barRef.current  && !barRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showInfo]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const handlePresetClick = (key) => {
    if (deploying || running) return;
    if (selected === key) {
      setSelected(null);
      setShowInfo(false);
    } else {
      setSelected(key);
      setShowInfo(true);
      setDeployDone(false);
      setDoneCount(0);
    }
  };

  // Open confirm modal
  const handleDeployClick = () => {
    setShowConfirm(true);
  };

  // Confirmed — start deploy
  const handleConfirmed = () => {
    setShowConfirm(false);
    setShowInfo(false);
    setDeploying(true);
    setListOpen(true);
    setDoneCount(0);
    clearTimers();

    ALL_MACHINES.forEach((_, i) => {
      const t = setTimeout(() => setDoneCount((c) => c + 1), 260 + i * 190);
      timers.current.push(t);
    });

    const finish = setTimeout(() => {
      setDeploying(false);
      setDeployDone(true);
    }, 260 + ALL_MACHINES.length * 190 + 350);
    timers.current.push(finish);
  };

  // Start production
  const handleStartProduction = () => {
    setRunning(true);
    setRunningPreset(selected);
    setDeployDone(false);
    setDoneCount(0);
    setListOpen(false);
  };

  // Full reset
  const handleReset = () => {
    clearTimers();
    setSelected(null);
    setShowInfo(false);
    setDeploying(false);
    setDoneCount(0);
    setDeployDone(false);
    setListOpen(true);
    setRunning(false);
    setRunningPreset(null);
  };

  if (!visible) return null;

  const preset       = selected ? PRODUCTION_PRESETS[selected] : null;
  const runPreset    = runningPreset ? PRODUCTION_PRESETS[runningPreset] : null;
  const showProgress = deploying || deployDone;

  return (
    <>
      {/* ── Confirm modal ── */}
      {showConfirm && (
        <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}>
          <ModalBox>
            <ModalGlow />

            <ModalTop>
              <ModalEyebrow>
                <ModalEyebrowDot />
                <ModalEyebrowText>Deployment Confirmation</ModalEyebrowText>
              </ModalEyebrow>
              <ModalTitle>Deploy to All Machines?</ModalTitle>
              <ModalSubTitle>AI Quick Deploy · {preset?.label} {preset?.sublabel}</ModalSubTitle>
            </ModalTop>

            <ModalMid>
              <ModalWarn>
                <ModalWarnIcon>⚠️</ModalWarnIcon>
                <ModalWarnText>
                  Reconfigures all <strong>12 machines</strong> across <strong>3 lines</strong> to{' '}
                  <strong>{preset?.label} {preset?.sublabel}</strong> parameters.
                  Running processes will be interrupted.
                </ModalWarnText>
              </ModalWarn>

              <ModalStats>
                <ModalStat>
                  <ModalStatKey>Machines</ModalStatKey>
                  <ModalStatVal>12</ModalStatVal>
                  <ModalStatSub>units</ModalStatSub>
                </ModalStat>
                <ModalStat>
                  <ModalStatKey>Lines</ModalStatKey>
                  <ModalStatVal>3</ModalStatVal>
                  <ModalStatSub>affected</ModalStatSub>
                </ModalStat>
                <ModalStat>
                  <ModalStatKey>Output</ModalStatKey>
                  <ModalStatVal>{preset?.estimatedOutput?.replace('~','').split(' ')[0]}</ModalStatVal>
                  <ModalStatSub>bags / shift</ModalStatSub>
                </ModalStat>
                <ModalStat>
                  <ModalStatKey>Cycle</ModalStatKey>
                  <ModalStatVal>{preset?.cycleTime?.split(' ')[0]}</ModalStatVal>
                  <ModalStatSub>s / bag</ModalStatSub>
                </ModalStat>
              </ModalStats>
            </ModalMid>

            <ModalBottom>
              <ModalBottomNote>Est. ~3s to complete all 12 machines</ModalBottomNote>
              <ModalActions>
                <ModalCancel onClick={() => setShowConfirm(false)}>Cancel</ModalCancel>
                <ModalConfirm onClick={handleConfirmed}>▶ Confirm Deploy</ModalConfirm>
              </ModalActions>
            </ModalBottom>

          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── Main bar row ── */}
      <Wrap>
        <MainBar ref={barRef}>
          {/* Badge — shows RUNNING state if factory is running */}
          <AiBadge $running={running}>
            <AiDot $running={running} />
            <AiText $running={running}>
              {running
                ? `● RUNNING — ${runPreset?.label}`
                : 'AI Quick Deploy'}
            </AiText>
          </AiBadge>

          {!running && (
            <>
              <Sep />
              <PickLabel>Packaging:</PickLabel>
              <BtnGroup>
                {Object.entries(PRODUCTION_PRESETS).map(([key, p]) => (
                  <PresetBtn
                    key={key}
                    $on={selected === key}
                    $col={p.color}
                    $bg={p.colorBg}
                    onClick={() => handlePresetClick(key)}
                    disabled={deploying}
                  >
                    {p.icon} {p.label}
                  </PresetBtn>
                ))}
              </BtnGroup>
            </>
          )}

          {/* Deploy button — only after preset chosen, not yet deployed */}
          {selected && !deployDone && !running && (
            <ActionBtn
              $running={deploying}
              onClick={handleDeployClick}
              disabled={deploying}
            >
              {deploying && <Spinner />}
              {deploying ? 'Deploying...' : '▶ Deploy to All'}
            </ActionBtn>
          )}

          {/* Start Production button — only after deploy done */}
          {deployDone && !running && (
            <StartBtn onClick={handleStartProduction}>
              ▶ Start Production
            </StartBtn>
          )}

          {/* Reset — always available when something is active */}
          {(selected || running) && (
            <ResetBtn onClick={handleReset}>
              {running ? 'Stop' : 'Reset'}
            </ResetBtn>
          )}
        </MainBar>

        {/* Info panel — click outside to close */}
        {showInfo && preset && !showProgress && (
          <InfoPanel ref={infoRef}>
            <InfoCell>
              <InfoKey>Est. Output</InfoKey>
              <InfoVal>{preset.estimatedOutput}</InfoVal>
            </InfoCell>
            <InfoCell>
              <InfoKey>Cycle Time</InfoKey>
              <InfoVal>{preset.cycleTime}</InfoVal>
            </InfoCell>
            <InfoCell>
              <InfoKey>vs Current</InfoKey>
              <InfoVal>
                <DiffVal $up={preset.diff.speed.startsWith('+')}>{preset.diff.speed}</DiffVal>
                {' spd · '}
                <DiffVal $up={preset.diff.throughput.startsWith('+')}>{preset.diff.throughput}</DiffVal>
                {' output'}
              </InfoVal>
            </InfoCell>
            <InfoCell>
              <InfoKey>Last Deployed</InfoKey>
              <InfoVal>{preset.lastDeployed}</InfoVal>
            </InfoCell>
          </InfoPanel>
        )}
      </Wrap>

      {/* ── Progress panel ── */}
      {showProgress && (
        <ProgressWrap>
          <ProgressPanel>
            {/* Clickable header to collapse/expand list */}
            <PHeader onClick={() => setListOpen((o) => !o)}>
              <PTitle $done={deployDone}>
                {deployDone
                  ? `✓ Factory configured — ${preset?.label} mode`
                  : `Deploying · ${preset?.label} mode`}
              </PTitle>
              <PRight>
                <PCount>{Math.min(doneCount, ALL_MACHINES.length)} / {ALL_MACHINES.length}</PCount>
                <CollapseArrow $open={listOpen}>▼</CollapseArrow>
              </PRight>
            </PHeader>

            {/* Collapsible machine list */}
            <PBody $open={listOpen}>
              {ALL_MACHINES.map((m, i) => {
                const isDone = doneCount > i;
                const isLive = doneCount === i && deploying;
                return (
                  <MRow key={m.key}>
                    <MLine>{m.line}</MLine>
                    <MName $done={isDone} $live={isLive}>{m.label}</MName>
                    <MTrack><MFill $done={isDone} $live={isLive} /></MTrack>
                    <MCheck $done={isDone} $live={isLive}>
                      {isDone ? '✓' : isLive ? '·' : ''}
                    </MCheck>
                  </MRow>
                );
              })}

              {deployDone && (
                <PSummary>
                  <SBadge>✦ Ready to run</SBadge>
                  <SMeta>
                    {preset?.estimatedOutput} · {preset?.cycleTime}
                  </SMeta>
                </PSummary>
              )}
            </PBody>
          </ProgressPanel>
        </ProgressWrap>
      )}
    </>
  );
}
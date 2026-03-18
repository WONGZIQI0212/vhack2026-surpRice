import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import logoSrc from './assets/SurpRice_logo.svg';

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const scanDown = keyframes`
  0%   { top: -3%; opacity: 0.7; }
  100% { top: 104%; opacity: 0; }
`;
const scanDownSlow = keyframes`
  0%   { top: -3%; opacity: 0.5; }
  100% { top: 104%; opacity: 0; }
`;
const pulseGreen = keyframes`
  0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 0 0 rgba(0,255,160,0.55); }
  50%      { opacity:0.5; transform:scale(0.8); box-shadow:0 0 0 8px rgba(0,255,160,0); }
`;
const pulseWarn = keyframes`
  0%,100% { box-shadow:0 0 0 0 rgba(255,184,0,0.5); }
  50%      { box-shadow:0 0 0 7px rgba(255,184,0,0); }
`;
const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const rotateRev = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;
const tickerAnim = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;
const logScrollAnim = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;
const barInAnim = keyframes`
  from { width: 0; }
  to   { width: var(--w); }
`;
const countUpAnim = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const traceMoveAnim = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const bootTypeAnim = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;
const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const flickerAnim = keyframes`
  0%,96%,100% { opacity:1; }
  97% { opacity:0.1; }
  98% { opacity:0.9; }
  99% { opacity:0.2; }
`;

// ─── Root ─────────────────────────────────────────────────────────────────────
const Root = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #010408;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BgGrid = styled.div`
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(0,255,160,0.032) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,160,0.032) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none; z-index: 0;
`;
const BgOrb1 = styled.div`
  position: fixed; width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,70,200,0.09) 0%, transparent 68%);
  top: -10%; left: 10%; pointer-events: none; z-index: 0;
`;
const BgOrb2 = styled.div`
  position: fixed; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,255,160,0.06) 0%, transparent 65%);
  bottom: 0; right: 5%; pointer-events: none; z-index: 0;
`;
const ScanA = styled.div`
  position: fixed; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent 8%, rgba(0,255,160,0.22) 50%, transparent 92%);
  animation: ${scanDown} 6s ease-in-out infinite;
  pointer-events: none; z-index: 1;
`;
const ScanB = styled.div`
  position: fixed; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent 8%, rgba(0,100,255,0.18) 50%, transparent 92%);
  animation: ${scanDownSlow} 9s 3s ease-in-out infinite;
  pointer-events: none; z-index: 1;
`;

// ─── Boot overlay ─────────────────────────────────────────────────────────────
const BootOverlay = styled.div`
  position: fixed; inset: 0;
  background: #010408;
  z-index: 999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  transition: opacity 0.6s ease, visibility 0.6s;
  opacity: ${p => p.$done ? 0 : 1};
  visibility: ${p => p.$done ? 'hidden' : 'visible'};
`;
const BootLogoBox = styled.div`
  width: 58px; height: 58px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(0,80,200,0.2), rgba(0,40,140,0.1));
  border: 1px solid rgba(0,100,255,0.3);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 24px rgba(0,80,255,0.22);
  margin-bottom: 8px;
  animation: ${fadeIn} 0.4s ease both;
`;
const BootLogoImg = styled.img`width: 32px; height: 32px;`;
const BootLines = styled.div`
  display: flex; flex-direction: column; gap: 5px;
  width: 380px;
`;
const BootLine = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.57rem;
  color: ${p => p.$ok ? 'rgba(0,255,160,0.7)' : p.$warn ? '#ffb800' : 'rgba(100,160,220,0.4)'};
  letter-spacing: 0.06em;
  overflow: hidden; white-space: nowrap; width: 0;
  animation: ${bootTypeAnim} 0.4s ${p => p.$d}s steps(50, end) forwards;
  display: flex; gap: 8px;
  &::before { content: '>'; color: rgba(0,100,255,0.4); flex-shrink: 0; }
`;
const BootBarWrap = styled.div`
  width: 380px; height: 2px;
  background: rgba(255,255,255,0.05);
  border-radius: 99px; overflow: hidden; margin-top: 6px;
`;
const BootBarFill = styled.div`
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #003acc, #00ffa0);
  width: ${p => p.$pct}%;
  transition: width 0.35s ease;
`;
const BootStatus = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.5rem; color: rgba(0,255,160,0.35);
  letter-spacing: 0.16em; text-transform: uppercase;
  animation: ${fadeIn} 0.4s 2.2s both;
`;

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = styled.header`
  position: relative; z-index: 20;
  height: 50px;
  background: rgba(1,4,8,0.94);
  border-bottom: 1px solid rgba(0,255,160,0.08);
  display: flex; align-items: center;
  padding: 0 20px; gap: 14px;
  flex-shrink: 0;
  animation: ${fadeIn} 0.4s 0.1s both;
`;
const NavLogoBox = styled.div`
  width: 30px; height: 30px; border-radius: 7px;
  background: rgba(0,80,200,0.15);
  border: 1px solid rgba(0,100,255,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
`;
const NavLogoImg = styled.img`width: 18px; height: 18px;`;
const NavBrand = styled.div`
  font-size: 0.82rem; font-weight: 800;
  color: #dce8ff; letter-spacing: -0.01em; flex-shrink: 0;
`;
const NavDivider = styled.div`
  width: 1px; height: 22px;
  background: rgba(255,255,255,0.06); flex-shrink: 0;
`;
const NavPill = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.46rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(0,255,160,0.55);
  background: rgba(0,255,160,0.06);
  border: 1px solid rgba(0,255,160,0.12);
  border-radius: 4px; padding: 3px 9px; flex-shrink: 0;
`;
const NavVitals = styled.div`
  display: flex; align-items: center; gap: 20px;
  flex: 1; justify-content: center;
`;
const NavVital = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 1px;
`;
const NavVitalLabel = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.38rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(100,160,220,0.35);
`;
const NavVitalVal = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.63rem; font-weight: 700;
  color: ${p => p.$warn ? '#ffb800' : p.$ok ? '#00ffa0' : '#dce8ff'};
  letter-spacing: -0.01em;
`;
const NavRight = styled.div`
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0; margin-left: auto;
`;
const NavAvatar = styled.div`
  width: 28px; height: 28px; border-radius: 7px;
  background: linear-gradient(135deg, rgba(0,80,200,0.3), rgba(0,40,140,0.2));
  border: 1px solid rgba(0,100,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem;
`;
const NavUserName = styled.div`
  font-size: 0.62rem; font-weight: 700; color: #dce8ff; line-height: 1;
`;
const NavUserRole = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.4rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,100,255,0.5); margin-top: 1px;
`;
const NavDot = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: #00ffa0; box-shadow: 0 0 8px rgba(0,255,160,0.8);
  animation: ${pulseGreen} 2.5s ease infinite;
`;

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TickerBar = styled.div`
  height: 26px; background: rgba(0,0,0,0.65);
  border-bottom: 1px solid rgba(0,255,160,0.07);
  overflow: hidden; display: flex; align-items: center;
  flex-shrink: 0; position: relative; z-index: 10;
  animation: ${fadeIn} 0.4s 0.2s both;
`;
const TickerTrack = styled.div`
  display: flex; gap: 56px; white-space: nowrap;
  animation: ${tickerAnim} 26s linear infinite;
`;
const TickerItem = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.5rem;
  color: ${p => p.$warn ? '#ffb800' : p.$ok ? 'rgba(0,255,160,0.65)' : 'rgba(130,180,200,0.35)'};
  letter-spacing: 0.07em;
  display: inline-flex; align-items: center; gap: 6px;
  &::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
const Main = styled.main`
  flex: 1; display: flex; flex-direction: column;
  position: relative; z-index: 5;
  padding: 18px 20px 16px; gap: 14px;
  overflow: hidden;
`;

// ─── KPI strip ────────────────────────────────────────────────────────────────
const KpiStrip = styled.div`display: flex; gap: 10px; flex-shrink: 0;`;
const KpiCard = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.4);
  border: 1px solid ${p => p.$warn ? 'rgba(255,184,0,0.12)' : 'rgba(0,255,160,0.07)'};
  border-radius: 10px; padding: 11px 13px;
  display: flex; flex-direction: column; gap: 2px;
  position: relative; overflow: hidden;
  animation: ${fadeUp} 0.5s ${p => p.$d}s cubic-bezier(0.34,1.4,0.64,1) both;
`;
const KpiTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: ${p => p.$c};
  background-size: 200%;
  animation: ${traceMoveAnim} 3.5s linear infinite;
`;
const KpiLabel = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.4rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${p => p.$warn ? 'rgba(255,184,0,0.4)' : 'rgba(0,255,160,0.35)'};
`;
const KpiValue = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1.05rem; font-weight: 700;
  color: ${p => p.$warn ? '#ffb800' : p.$c || '#00ffa0'};
  letter-spacing: -0.02em; line-height: 1;
  animation: ${countUpAnim} 0.4s ${p => p.$d + 0.15}s both;
`;
const KpiUnit = styled.span`font-size: 0.5rem; opacity: 0.4; margin-left: 2px;`;
const KpiSub = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.4rem; color: rgba(100,160,180,0.28); margin-top: 1px;
`;
const KpiBarWrap = styled.div`
  height: 2px; background: rgba(255,255,255,0.04);
  border-radius: 99px; overflow: hidden; margin-top: 5px;
`;
const KpiBarFill = styled.div`
  height: 100%; border-radius: 99px;
  --w: ${p => p.$pct}%;
  width: var(--w);
  background: ${p => p.$c};
  animation: ${barInAnim} 0.8s ${p => p.$d + 0.2}s cubic-bezier(0.34,1.2,0.64,1) both;
`;

// ─── Middle row ───────────────────────────────────────────────────────────────
const MidRow = styled.div`display: flex; gap: 14px; flex: 1; min-height: 0;`;

// ─── Map panel ────────────────────────────────────────────────────────────────
const MapPanel = styled.div`
  flex: 1.2; min-width: 0;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,255,160,0.08);
  border-radius: 14px;
  position: relative; overflow: hidden;
  animation: ${fadeUp} 0.5s 0.35s cubic-bezier(0.34,1.4,0.64,1) both;
`;
const MapTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(0,255,160,0.55) 30%, rgba(0,100,255,0.4) 70%, transparent);
  background-size: 200%;
  animation: ${traceMoveAnim} 3.5s linear infinite;
`;
const MapScanLine = styled.div`
  position: absolute; left: 0; right: 0; height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(0,255,160,0.02), transparent);
  pointer-events: none;
  animation: ${scanDown} 4.5s ease-in-out infinite;
  z-index: 2;
`;
const MapHeader = styled.div`
  position: absolute; top: 0; left: 0; right: 0;
  padding: 11px 13px 0;
  display: flex; align-items: center; justify-content: space-between;
  z-index: 5;
`;
const MapTitle = styled.div`
  font-size: 0.46rem; font-weight: 700;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: rgba(0,255,160,0.45);
  display: flex; align-items: center; gap: 6px;
  &::before { content:''; width:3px; height:10px;
    background: linear-gradient(180deg,#00ffa0,rgba(0,255,160,0.3));
    border-radius: 2px; }
`;
const MapLiveTag = styled.div`
  display: flex; align-items: center; gap: 5px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.44rem; color: rgba(0,255,160,0.5); letter-spacing: 0.12em;
`;
const LiveDot = styled.div`
  width: 5px; height: 5px; border-radius: 50%;
  background: #00ffa0; box-shadow: 0 0 7px rgba(0,255,160,0.8);
  animation: ${pulseGreen} 2s ease infinite;
`;
const MapSVG = styled.svg`
  width: 100%; height: 100%;
  position: absolute; inset: 0;
`;
const HUDCorner = styled.div`
  position: absolute; width: 18px; height: 18px;
  pointer-events: none; z-index: 4;
  ${p => p.$tl && 'top:8px;left:8px;border-top:1.5px solid rgba(0,255,160,0.22);border-left:1.5px solid rgba(0,255,160,0.22);'}
  ${p => p.$tr && 'top:8px;right:8px;border-top:1.5px solid rgba(0,255,160,0.22);border-right:1.5px solid rgba(0,255,160,0.22);'}
  ${p => p.$bl && 'bottom:8px;left:8px;border-bottom:1.5px solid rgba(0,255,160,0.18);border-left:1.5px solid rgba(0,255,160,0.18);'}
  ${p => p.$br && 'bottom:8px;right:8px;border-bottom:1.5px solid rgba(0,255,160,0.18);border-right:1.5px solid rgba(0,255,160,0.18);'}
`;
const CenterRingWrap = styled.div`
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  pointer-events: none; z-index: 3;
`;
const OuterRing = styled.div`
  width: 68px; height: 68px; border-radius: 50%;
  border: 1px solid rgba(0,255,160,0.12);
  position: relative;
  animation: ${rotateSlow} 22s linear infinite;
  &::before {
    content:''; position:absolute; inset:8px; border-radius:50%;
    border: 1px dashed rgba(0,100,255,0.14);
    animation: ${rotateRev} 13s linear infinite;
  }
  &::after {
    content:''; position:absolute; top:-3px; left:50%;
    width:5px; height:5px; border-radius:50%;
    background: rgba(0,255,160,0.9);
    box-shadow: 0 0 10px rgba(0,255,160,0.9);
    transform: translateX(-50%);
  }
`;
const RingLabel = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.37rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(0,255,160,0.25); text-align: center;
`;

// ─── Right column ─────────────────────────────────────────────────────────────
const RightCol = styled.div`
  display: flex; flex-direction: column; gap: 11px;
  width: 270px; flex-shrink: 0;
`;

// Alert panel
const AlertPanel = styled.div`
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,184,0,0.1);
  border-radius: 12px; overflow: hidden; flex-shrink: 0;
  animation: ${slideInRight} 0.5s 0.4s cubic-bezier(0.34,1.4,0.64,1) both;
`;
const PanelHeader = styled.div`
  padding: 9px 12px 8px;
  border-bottom: 1px solid ${p => p.$warn ? 'rgba(255,184,0,0.07)' : 'rgba(0,100,255,0.07)'};
  display: flex; align-items: center; justify-content: space-between;
`;
const PanelTitle = styled.div`
  font-size: 0.45rem; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: ${p => p.$warn ? 'rgba(255,184,0,0.6)' : 'rgba(0,100,255,0.55)'};
  display: flex; align-items: center; gap: 5px;
  &::before {
    content:''; width:3px; height:10px;
    background: ${p => p.$warn
      ? 'linear-gradient(180deg,#ffb800,rgba(255,184,0,0.3))'
      : 'linear-gradient(180deg,#0066ff,rgba(0,100,255,0.3))'};
    border-radius: 2px;
  }
`;
const AlertBadge = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.5rem; font-weight: 700; color: #ffb800;
  background: rgba(255,184,0,0.1);
  border: 1px solid rgba(255,184,0,0.18);
  border-radius: 4px; padding: 1px 7px;
  animation: ${pulseWarn} 2s ease infinite;
`;
const AlertItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border: none; }
  animation: ${fadeUp} 0.4s ${p => p.$d}s both;
`;
const AlertTag = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.42rem; font-weight: 700;
  color: #ffb800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 2px;
`;
const AlertMsg = styled.div`font-size: 0.57rem; color: rgba(200,210,230,0.45); line-height: 1.45;`;
const AlertTime = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.4rem; color: rgba(100,140,200,0.25); letter-spacing: 0.08em; margin-top: 2px;
`;

// Log panel
const LogPanel = styled.div`
  flex: 1; min-height: 0;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,100,255,0.08);
  border-radius: 12px; overflow: hidden;
  animation: ${slideInRight} 0.5s 0.48s cubic-bezier(0.34,1.4,0.64,1) both;
`;
const LogScroller = styled.div`
  height: 130px; overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent, black 18%, black 88%, transparent);
`;
const LogInner = styled.div`animation: ${logScrollAnim} 14s linear infinite;`;
const LogRow = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.46rem;
  color: ${p => p.$warn ? 'rgba(255,184,0,0.5)' : 'rgba(0,255,160,0.32)'};
  line-height: 2; padding: 0 12px;
  display: flex; gap: 7px;
  animation: ${flickerAnim} 10s ${p => p.$f}s infinite;
`;
const LogTs  = styled.span`color: rgba(0,255,160,0.16);`;
const LogTag = styled.span`color: ${p => p.$warn ? 'rgba(255,184,0,0.55)' : 'rgba(0,255,160,0.45)'}; min-width: 46px;`;

// ─── Bottom row ───────────────────────────────────────────────────────────────
const BottomRow = styled.div`
  display: flex; gap: 12px;
  animation: ${fadeUp} 0.5s 0.5s cubic-bezier(0.34,1.4,0.64,1) both;
`;

// Hero card
const HeroCard = styled.div`
  width: 200px; flex-shrink: 0;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(0,100,255,0.1);
  border-radius: 12px; padding: 15px 16px;
  display: flex; flex-direction: column; justify-content: space-between;
  gap: 12px;
`;
const HeroGreeting = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.48rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(0,255,160,0.4); margin-bottom: 5px;
`;
const HeroName = styled.div`
  font-size: 1.1rem; font-weight: 800;
  letter-spacing: -0.025em; color: #dce8ff; line-height: 1.1; margin-bottom: 4px;
`;
const HeroSub = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.46rem; color: rgba(100,140,210,0.4); letter-spacing: 0.05em; line-height: 1.55;
`;
const EnterBtn = styled.button`
  width: 100%; padding: 10px;
  background: linear-gradient(135deg, #003acc, #0055ff);
  border: none; border-radius: 8px; color: #fff;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.58rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0,60,255,0.38), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover { transform: translateY(-1px); box-shadow: 0 7px 24px rgba(0,60,255,0.5); }
  &:active { transform: translateY(0); }
`;
const LogoutBtn = styled.button`
  width: 100%; padding: 9px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; color: rgba(100,140,210,0.38);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.54rem; letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s;
  &:hover { border-color: rgba(255,80,80,0.25); color: rgba(255,80,80,0.5); background: rgba(255,80,80,0.04); }
`;

// Module cards
const ModuleCard = styled.button`
  flex: 1; min-width: 0;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 13px;
  text-align: left; cursor: pointer;
  position: relative; overflow: hidden;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column; gap: 7px;
  animation: ${fadeUp} 0.5s ${p => p.$d}s cubic-bezier(0.34,1.4,0.64,1) both;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0,100,255,0.45);
    box-shadow: 0 8px 28px rgba(0,40,200,0.2);
  }
`;
const ModuleGlow = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,80,255,0.08), transparent);
  pointer-events: none; opacity: 0; transition: opacity 0.2s;
  ${ModuleCard}:hover & { opacity: 1; }
`;
const ModuleTopLine = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: ${p => p.$c};
  background-size: 200%;
  animation: ${traceMoveAnim} 4s ${p => p.$d}s linear infinite;
`;
const ModuleIconBox = styled.div`
  width: 32px; height: 32px; border-radius: 8px;
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem;
`;
const ModuleName = styled.div`
  font-size: 0.7rem; font-weight: 700; color: #dce8ff; letter-spacing: -0.01em;
`;
const ModuleDesc = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.46rem; color: rgba(100,140,210,0.35); line-height: 1.55;
`;
const ModuleFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-top: 2px;
`;
const ModuleStat = styled.div`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.46rem; font-weight: 700;
  color: ${p => p.$c};
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  border-radius: 4px; padding: 2px 7px;
`;
const ModuleArrow = styled.div`
  font-size: 0.62rem; color: rgba(0,100,255,0.3);
  transition: transform 0.2s, color 0.2s;
  ${ModuleCard}:hover & { transform: translateX(3px); color: rgba(0,100,255,0.65); }
`;

// ─── Static data ──────────────────────────────────────────────────────────────
const NODES = [
  {id:'H1',x:14,y:25,l:'HUSKER-01',st:'ok'},
  {id:'H2',x:14,y:48,l:'HUSKER-02',st:'ok'},
  {id:'H3',x:14,y:71,l:'HUSKER-03',st:'warn'},
  {id:'M1',x:34,y:18,l:'MILL-01',  st:'ok'},
  {id:'M2',x:34,y:44,l:'MILL-02',  st:'ok'},
  {id:'M3',x:34,y:70,l:'MILL-03',  st:'ok'},
  {id:'C1',x:56,y:28,l:'CONV-01',  st:'ok'},
  {id:'C2',x:56,y:58,l:'CONV-02',  st:'ok'},
  {id:'P1',x:74,y:36,l:'PAL-01',   st:'ok'},
  {id:'P2',x:74,y:63,l:'PAL-02',   st:'warn'},
  {id:'HB',x:45,y:86,l:'HUB',      st:'ctrl'},
];
const EDGES = [
  ['H1','M1'],['H2','M2'],['H3','M3'],
  ['M1','C1'],['M2','C1'],['M2','C2'],['M3','C2'],
  ['C1','P1'],['C2','P2'],['P1','HB'],['P2','HB'],
  ['HB','M2'],['HB','M3'],
];
const TICKER_DATA = [
  {l:'HUSKER-01',v:'1,244 kg/h',ok:true},{l:'HUSKER-02',v:'1,198 kg/h',ok:true},
  {l:'HUSKER-03',v:'⚠ VIBRATION',warn:true},{l:'MILL-01',v:'96.4% EFF',ok:true},
  {l:'MILL-02',v:'94.1% EFF',ok:true},{l:'CONV-01',v:'2.1 m/s',ok:true},
  {l:'PAL-02',v:'⚠ TORQUE',warn:true},{l:'STORAGE',v:'72% FULL',ok:true},
  {l:'HUB',v:'ONLINE 4ms',ok:true},{l:'OUTPUT',v:'11,204 kg/h',ok:true},
  {l:'UPTIME',v:'99.7%',ok:true},{l:'EFFICIENCY',v:'94.2%',ok:true},
];
const ALERTS = [
  {msg:'HUSKER-03 vibration sensor exceeded threshold — maintenance recommended',time:'08:41:05',d:0.52},
  {msg:'PAL-02 arm torque reading 18% above baseline — review required',         time:'08:41:18',d:0.58},
  {msg:'CONV-01 speed auto-adjusted: 1.8→2.1 m/s by AI planner',                time:'08:41:12',d:0.64},
];
const LOGS = [
  {ts:'08:41:02',tag:'[INFO]',msg:'HUSKER-01 nominal — 1,244 kg/h',       warn:false,f:0},
  {ts:'08:41:05',tag:'[WARN]',msg:'HUSKER-03 vibration threshold exceeded',warn:true, f:1.5},
  {ts:'08:41:09',tag:'[INFO]',msg:'MILL-02 calibration done — 96.4% eff', warn:false,f:3},
  {ts:'08:41:12',tag:'[INFO]',msg:'CONV-01 speed adjusted 1.8→2.1 m/s',  warn:false,f:0.5},
  {ts:'08:41:18',tag:'[WARN]',msg:'PAL-02 torque above baseline',          warn:true, f:2},
  {ts:'08:41:23',tag:'[INFO]',msg:'Storage 72% — dispatch 10:00 set',     warn:false,f:0.8},
  {ts:'08:41:30',tag:'[INFO]',msg:'AI planner: +9% efficiency achieved',   warn:false,f:4},
  {ts:'08:41:35',tag:'[INFO]',msg:'HUB heartbeat OK — 4ms latency',       warn:false,f:1},
  {ts:'08:41:47',tag:'[INFO]',msg:'HUSKER-01 nominal — 1,248 kg/h',       warn:false,f:0.3},
  {ts:'08:41:52',tag:'[WARN]',msg:'HUSKER-03 still elevated — review req', warn:true, f:2.5},
  {ts:'08:41:58',tag:'[INFO]',msg:'CONV-02 maintenance due in 14d',        warn:false,f:1.8},
];
const MODULES = [
  {
    icon:'🖥️', name:'Machine Dashboard',
    desc:'Live telemetry, health scores and predictive maintenance across all lines.',
    stat:'3 Lines Active',
    sc:'rgba(0,100,255,0.6)', sbg:'rgba(0,60,180,0.12)', sb:'rgba(0,100,255,0.14)',
    tc:'linear-gradient(90deg,transparent,rgba(0,100,255,0.5),transparent)',
    ic:'rgba(0,60,180,0.15)', ib:'rgba(0,100,255,0.2)',
    d:0.38, path:'/overall/dashboard',
  },
  {
    icon:'🤖', name:'Machine AI',
    desc:'Simulate new equipment and predict ROI, efficiency gains and risk factors.',
    stat:'4 Models Ready',
    sc:'rgba(0,200,120,0.6)', sbg:'rgba(0,120,80,0.12)', sb:'rgba(0,200,120,0.14)',
    tc:'linear-gradient(90deg,transparent,rgba(0,200,120,0.45),transparent)',
    ic:'rgba(0,100,60,0.15)', ib:'rgba(0,200,120,0.2)',
    d:0.44, path:'/overall/ai-prediction',
  },
  {
    icon:'📊', name:'Production AI',
    desc:'AI production planning: time optimisation, labor scheduling, inventory.',
    stat:'6 Scenarios',
    sc:'rgba(200,140,0,0.65)', sbg:'rgba(120,80,0,0.12)', sb:'rgba(200,140,0,0.18)',
    tc:'linear-gradient(90deg,transparent,rgba(200,140,0,0.5),transparent)',
    ic:'rgba(100,60,0,0.15)', ib:'rgba(200,140,0,0.2)',
    d:0.50, path:'/overall/ai-prediction',
  },
  {
    icon:'⚙️', name:'System Config',
    desc:'Manage lines, sensor thresholds, alert rules and operator permissions.',
    stat:'Config v2.0',
    sc:'rgba(100,100,200,0.6)', sbg:'rgba(60,60,120,0.12)', sb:'rgba(100,100,200,0.14)',
    tc:'linear-gradient(90deg,transparent,rgba(120,120,220,0.45),transparent)',
    ic:'rgba(60,60,120,0.15)', ib:'rgba(100,100,200,0.2)',
    d:0.56, path:'/overall/dashboard',
  },
];
const BOOT_LINES = [
  {msg:'Initialising SurpRice Digital Twin Platform v2.0…', ok:true,  d:0.1},
  {msg:'Connecting to factory telemetry stream…',           ok:true,  d:0.5},
  {msg:'Loading 3D factory model — 11 nodes detected',      ok:true,  d:0.9},
  {msg:'AI prediction engine ready',                        ok:true,  d:1.3},
  {msg:'2 active alerts detected — review recommended',     warn:true,d:1.7},
  {msg:'Session authenticated · Welcome, Operator',         ok:true,  d:2.1},
];
const KPI_DATA = [
  {label:'Total Output',    unit:'kg/h', sub:'↑ +2.4% vs yesterday', pct:74,  c:'#00ffa0', bar:'linear-gradient(90deg,#003acc,#00ffa0)', line:'linear-gradient(90deg,transparent,rgba(0,255,160,0.5),transparent)', d:0.30},
  {label:'Line Efficiency', unit:'%',    sub:'3 production lines',    pct:94,  c:'#4488ff', bar:'linear-gradient(90deg,#003acc,#4488ff)', line:'linear-gradient(90deg,transparent,rgba(0,100,255,0.5),transparent)', d:0.36},
  {label:'System Uptime',   unit:'%',    sub:'30-day rolling avg',    pct:99,  c:'#00aaff', bar:'linear-gradient(90deg,#004488,#00aaff)', line:'linear-gradient(90deg,transparent,rgba(0,170,255,0.5),transparent)', d:0.42},
  {label:'Avg Temperature', unit:'°C',   sub:'All machines nominal',  pct:62,  c:'#00ff88', bar:'linear-gradient(90deg,#004400,#00ff88)', line:'linear-gradient(90deg,transparent,rgba(0,255,136,0.4),transparent)', d:0.48},
  {label:'Active Alerts',   unit:'warn', sub:'HUSKER-03 · PAL-02',   pct:20,  warn:true,   bar:'linear-gradient(90deg,#884400,#ffb800)', line:'linear-gradient(90deg,transparent,rgba(255,184,0,0.5),transparent)', d:0.54},
  {label:'AI Confidence',   unit:'%',    sub:'Prediction engine',     pct:94,  c:'#aa66ff', bar:'linear-gradient(90deg,#1a0066,#8844ff)', line:'linear-gradient(90deg,transparent,rgba(136,68,255,0.5),transparent)',d:0.60},
];

// ─── Factory map ──────────────────────────────────────────────────────────────
function FactoryMap() {
  const nm = Object.fromEntries(NODES.map(n => [n.id, n]));
  const sc = st => st === 'ctrl' ? '#00ffa0' : st === 'warn' ? '#ffb800' : '#0088ff';
  return (
    <MapSVG viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="gn">
          <feGaussianBlur stdDeviation="0.6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gc">
          <feGaussianBlur stdDeviation="1.3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {EDGES.map(([a, b]) => {
        const na = nm[a], nb = nm[b];
        const w = na.st === 'warn' || nb.st === 'warn';
        const c = na.st === 'ctrl' || nb.st === 'ctrl';
        return (
          <line key={`${a}-${b}`}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={w ? 'rgba(255,184,0,0.2)' : c ? 'rgba(0,255,160,0.15)' : 'rgba(0,100,255,0.15)'}
            strokeWidth="0.22" strokeDasharray="0.7,1.1"
          />
        );
      })}
      {NODES.map(n => (
        <g key={n.id} filter={n.st === 'ctrl' ? 'url(#gc)' : 'url(#gn)'}>
          <circle cx={n.x} cy={n.y} r="2" fill="none"
            stroke={sc(n.st)} strokeWidth="0.3" opacity="0.4"/>
          <circle cx={n.x} cy={n.y} r="0.85" fill={sc(n.st)}/>
          <text x={n.x} y={n.y - 2.4} textAnchor="middle" fontSize="1.7"
            fill={n.st === 'warn' ? 'rgba(255,184,0,0.5)' : 'rgba(100,160,255,0.4)'}
            fontFamily="monospace">{n.l}
          </text>
        </g>
      ))}
    </MapSVG>
  );
}

// ─── Live value hook ──────────────────────────────────────────────────────────
function useLive(base, range, ms = 2500) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV(base + Math.floor(Math.random() * range - range / 2)), ms);
    return () => clearInterval(id);
  }, [base, range, ms]);
  return v;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [bootDone, setBootDone] = useState(false);
  const [bootPct,  setBootPct]  = useState(0);

  const output     = useLive(11204, 140);
  const efficiency = useLive(942, 10);
  const uptime     = useLive(997, 4);
  const temp       = useLive(624, 12);

  // Derived KPI values — stable references, no inline Math.random()
  const kpiValues = [
    output.toLocaleString(),
    (efficiency / 10).toFixed(1),
    (uptime / 10).toFixed(1),
    (temp / 10).toFixed(1),
    '2',
    '94.2',
  ];

  useEffect(() => {
    const steps   = [10, 30, 55, 72, 90, 100];
    const timings = [300, 700, 1100, 1500, 1900, 2300];
    timings.forEach((t, i) => setTimeout(() => setBootPct(steps[i]), t));
    setTimeout(() => setBootDone(true), 2700);
  }, []);

  const userName = user?.email === 'guest'
    ? 'Observer'
    : (user?.email?.split('@')[0] || 'Operator')
        .replace(/\./g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

  const isGuest = user?.email === 'guest';

  return (
    <Root>
      <BgGrid /><BgOrb1 /><BgOrb2 />
      <ScanA /><ScanB />

      {/* Boot overlay */}
      <BootOverlay $done={bootDone}>
        <BootLogoBox><BootLogoImg src={logoSrc} alt="SurpRice" /></BootLogoBox>
        <BootLines>
          {BOOT_LINES.map((l, i) => (
            <BootLine key={i} $ok={l.ok} $warn={l.warn} $d={l.d}>{l.msg}</BootLine>
          ))}
        </BootLines>
        <BootBarWrap><BootBarFill $pct={bootPct} /></BootBarWrap>
        <BootStatus>Loading platform… {bootPct}%</BootStatus>
      </BootOverlay>

      {/* Navbar */}
      <Navbar>
        <NavLogoBox><NavLogoImg src={logoSrc} alt="SurpRice" /></NavLogoBox>
        <NavBrand>SurpRice</NavBrand>
        <NavDivider />
        <NavPill>Digital Twin · v2.0</NavPill>

        <NavVitals>
          {[
            {label:'Output',    val:`${output.toLocaleString()} kg/h`, ok:true},
            {label:'Efficiency',val:`${(efficiency/10).toFixed(1)}%`,  ok:true},
            {label:'Uptime',    val:`${(uptime/10).toFixed(1)}%`,      ok:true},
            {label:'Alerts',    val:'2 Warnings',                       warn:true},
            {label:'Sync',      val:'Live · 4ms',                       ok:true},
          ].map(v => (
            <NavVital key={v.label}>
              <NavVitalLabel>{v.label}</NavVitalLabel>
              <NavVitalVal $ok={v.ok} $warn={v.warn}>{v.val}</NavVitalVal>
            </NavVital>
          ))}
        </NavVitals>

        <NavRight>
          <NavDot />
          <NavAvatar>👤</NavAvatar>
          <div>
            <NavUserName>{userName}</NavUserName>
            <NavUserRole>{isGuest ? 'Observer' : 'Operator'}</NavUserRole>
          </div>
        </NavRight>
      </Navbar>

      {/* Ticker */}
      <TickerBar>
        <TickerTrack>
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <TickerItem key={i} $ok={t.ok} $warn={t.warn}>
              {t.l}&nbsp;·&nbsp;{t.v}
            </TickerItem>
          ))}
        </TickerTrack>
      </TickerBar>

      <Main>

        {/* KPI strip */}
        <KpiStrip>
          {KPI_DATA.map((k, i) => (
            <KpiCard key={k.label} $warn={k.warn} $d={k.d}>
              <KpiTopLine $c={k.line} />
              <KpiLabel $warn={k.warn}>{k.label}</KpiLabel>
              <KpiValue $warn={k.warn} $c={k.c} $d={k.d}>
                {kpiValues[i]}<KpiUnit>{k.unit}</KpiUnit>
              </KpiValue>
              <KpiSub>{k.sub}</KpiSub>
              <KpiBarWrap>
                <KpiBarFill $pct={k.pct} $c={k.bar} $d={k.d} />
              </KpiBarWrap>
            </KpiCard>
          ))}
        </KpiStrip>

        {/* Middle */}
        <MidRow>

          {/* Factory map */}
          <MapPanel>
            <MapTopLine />
            <MapScanLine />
            <HUDCorner $tl /><HUDCorner $tr /><HUDCorner $bl /><HUDCorner $br />
            <MapHeader>
              <MapTitle>Live Factory Digital Twin</MapTitle>
              <MapLiveTag><LiveDot />Real-time · 11 Nodes</MapLiveTag>
            </MapHeader>
            <FactoryMap />
            <CenterRingWrap>
              <RingLabel>Control Hub</RingLabel>
              <OuterRing />
              <RingLabel style={{ marginTop: 5 }}>3 Lines · Active</RingLabel>
            </CenterRingWrap>
          </MapPanel>

          {/* Right column */}
          <RightCol>

            <AlertPanel>
              <PanelHeader $warn>
                <PanelTitle $warn>Active Alerts</PanelTitle>
                <AlertBadge>2</AlertBadge>
              </PanelHeader>
              {ALERTS.map((a, i) => (
                <AlertItem key={i} $d={a.d}>
                  <AlertTag>[WARN]</AlertTag>
                  <AlertMsg>{a.msg}</AlertMsg>
                  <AlertTime>{a.time}</AlertTime>
                </AlertItem>
              ))}
            </AlertPanel>

            <LogPanel>
              <PanelHeader>
                <PanelTitle>System Event Log</PanelTitle>
                <LiveDot />
              </PanelHeader>
              <LogScroller>
                <LogInner>
                  {[...LOGS, ...LOGS].map((l, i) => (
                    <LogRow key={i} $warn={l.warn} $f={l.f}>
                      <LogTs>{l.ts}</LogTs>
                      <LogTag $warn={l.warn}>{l.tag}</LogTag>
                      {l.msg}
                    </LogRow>
                  ))}
                </LogInner>
              </LogScroller>
            </LogPanel>

          </RightCol>
        </MidRow>

        {/* Bottom row: hero card + 4 module cards */}
        <BottomRow>

          <HeroCard>
            <div>
              <HeroGreeting>// Welcome back</HeroGreeting>
              <HeroName>{userName}</HeroName>
              <HeroSub>
                SurpRice Digital Twin Platform<br />
                All systems operational
              </HeroSub>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <EnterBtn onClick={() => navigate('/overall/dashboard')}>
                ▶ Enter System
              </EnterBtn>
              <LogoutBtn onClick={onLogout}>
                ⏏ Sign Out
              </LogoutBtn>
            </div>
          </HeroCard>

          {MODULES.map(m => (
            <ModuleCard key={m.name} $d={m.d} onClick={() => navigate(m.path)}>
              <ModuleGlow />
              <ModuleTopLine $c={m.tc} $d={m.d} />
              <ModuleIconBox $bg={m.ic} $border={m.ib}>{m.icon}</ModuleIconBox>
              <ModuleName>{m.name}</ModuleName>
              <ModuleDesc>{m.desc}</ModuleDesc>
              <ModuleFooter>
                <ModuleStat $c={m.sc} $bg={m.sbg} $border={m.sb}>{m.stat}</ModuleStat>
                <ModuleArrow>→</ModuleArrow>
              </ModuleFooter>
            </ModuleCard>
          ))}

        </BottomRow>

      </Main>
    </Root>
  );
}

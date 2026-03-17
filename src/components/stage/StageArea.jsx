import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { T, STATUS_CONFIG } from '../../styles/theme';
import SceneSwitcher from '../layout/SceneSwitcher';
import SmartSearchBar from './SmartSearchBar';
import { StatusBadgeWrap, StatusDot } from './StatusBadge';
import { MOCK_HEALTH_DATA } from '../../data/MockMachineData';
import QuickDeployBar from './QuickDeployBar';

const LINES = [
  { id: 'overall', label: 'Overall' },
  { id: 'line1', label: 'Line 1' },
  { id: 'line2', label: 'Line 2' },
  { id: 'line3', label: 'Line 3' },
];

const ZONE_NAMES = {
  overall: 'All Zones',
  line1: 'Production Line 1',
  line2: 'Production Line 2',
  line3: 'Production Line 3',
  'line1-husker': 'Paddy Husker 01',
  'line1-milling': 'Rice Milling Unit 01',
  'line1-conveyor': 'Conveyor Belt 01',
  'line1-palletize': 'Palletizing Robot 01',
  'line2-husker': 'Paddy Husker 02',
  'line2-milling': 'Rice Milling Unit 02',
  'line2-conveyor': 'Conveyor Belt 02',
  'line2-palletize': 'Palletizing Robot 02',
  'line3-husker': 'Paddy Husker 03',
  'line3-milling': 'Rice Milling Unit 03',
  'line3-conveyor': 'Conveyor Belt 03',
  'line3-palletize': 'Palletizing Robot 03',
};

const CONTROL_HINTS = {
  rotate: 'Drag to rotate the model view.',
  move: 'Use Shift + drag or right-drag to move the camera view.',
  zoom: 'Use mouse wheel or trackpad gesture to zoom in and out.',
};

const StageWrapper = styled.div`
  position: relative;
  height: ${(p) => p.$h}px;
  min-height: 120px;
  flex-shrink: 0;
  margin: 12px 24px 0;
  z-index: 1;
`;

const StageAreaBox = styled.section`
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${T.bg};
  border: 1px solid ${T.border};
  box-shadow:
    0 2px 4px rgba(13, 17, 23, 0.04),
    0 12px 40px rgba(13, 17, 23, 0.08);
  position: relative;
  isolation: isolate;
`;

const SceneViewport = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
`;

const StageGradient = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 85% 75% at 50% 50%,
    transparent 35%,
    ${T.bg} 100%
  );
  pointer-events: none;
  z-index: 6;
  border-radius: 18px;
`;

const StageFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(to bottom, transparent, ${T.bg});
  pointer-events: none;
  z-index: 7;
`;

const ZoneLabel = styled.div`
  position: absolute;
  bottom: 14px;
  left: 14px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${T.muted};
`;

const TopBar = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LineSwitcher = styled.div`
  display: flex;
  gap: 5px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(13, 17, 23, 0.08);
  flex-shrink: 0;
`;

const LinePill = styled.button`
  height: 28px;
  padding: 0 14px;
  border-radius: 999px;
  border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
  white-space: nowrap;
  background: ${(p) =>
    p.$active ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})` : 'transparent'};
  color: ${(p) => (p.$active ? '#fff' : T.muted)};
  box-shadow: ${(p) => (p.$active ? '0 2px 8px rgba(55,102,240,0.3)' : 'none')};

  &:hover {
    color: ${(p) => (p.$active ? '#fff' : T.text)};
    background: ${(p) =>
      p.$active
        ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})`
        : 'rgba(55,102,240,0.08)'};
  }
`;

const InlineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${(p) => STATUS_CONFIG[p.$s].bg};
  border: 1px solid ${(p) => STATUS_CONFIG[p.$s].border};
  border-radius: 20px;
  padding: 5px 13px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${(p) => STATUS_CONFIG[p.$s].color};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: scale(1.02);
  }
`;

const ToolbarWrap = styled.div`
  position: absolute;
  top: 64px;
  right: 14px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 26px rgba(13, 17, 23, 0.10);
`;

const ToolButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid
    ${(p) => (p.$active ? 'rgba(23,72,200,0.18)' : 'rgba(221,227,239,0.92)')};
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, rgba(23,72,200,0.10), rgba(55,102,240,0.14))'
      : 'rgba(255,255,255,0.92)'};
  color: ${(p) => (p.$active ? T.accent : T.muted)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.16s ease;
  box-shadow: ${(p) => (p.$active ? '0 4px 12px rgba(23,72,200,0.12)' : 'none')};

  &:hover {
    color: ${T.text};
    border-color: rgba(23,72,200,0.14);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
  }
`;

const ToolTip = styled.div`
  min-width: 180px;
  max-width: 220px;
  padding: 9px 11px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(13, 17, 23, 0.10);
`;

const ToolTipTitle = styled.div`
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 5px;
`;

const ToolTipText = styled.div`
  font-size: 0.7rem;
  line-height: 1.55;
  color: ${T.sub};
`;

const ResetFlash = styled.div`
  position: absolute;
  inset: 0;
  z-index: 16;
  pointer-events: none;
  background: ${(p) => (p.$show ? 'rgba(255,255,255,0.16)' : 'transparent')};
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transition: opacity 0.25s ease;
`;

const alertRing = `
  @keyframes alertRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); }
    50%     { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
  }
`;

const iconBlink = `
  @keyframes iconBlink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.2; }
  }
`;

const AlertSymbol = styled.div`
  ${alertRing}
  position: absolute;
  top: 66px;
  right: 14px;
  z-index: 25;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(220,38,38,0.12);
  border: 1.5px solid rgba(220,38,38,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  animation: alertRing 0.9s ease infinite;
`;

const AlertIcon = styled.span`
  ${iconBlink}
  animation: iconBlink 0.8s ease infinite;
  color: #f87171;
  font-style: normal;
  font-weight: 900;
  font-size: 0.9rem;
  line-height: 1;
`;

function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M8 6l4-4 4 4" />
      <path d="M8 18l4 4 4-4" />
      <path d="M6 8l-4 4 4 4" />
      <path d="M18 8l4 4-4 4" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
      <path d="M11 8.5v5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export default function StageArea({
  stageH,
  mId,
  currentTab,
  navigate,
  onStatusClick,
  getMachineData,
  showNewMachine,
}) {
  const activeLine = mId?.includes('-') ? mId.split('-')[0] : mId;

  const originalData = MOCK_HEALTH_DATA[mId] || MOCK_HEALTH_DATA.overall;
  const healthData = getMachineData ? getMachineData(mId, originalData) : originalData;
  const currentStatus = healthData.status;

  const showNavigator = true;

  const [toolMode, setToolMode] = useState('rotate');
  const [showTip, setShowTip] = useState(false);
  const [sceneSessionKey, setSceneSessionKey] = useState(0);
  const [showResetFlash, setShowResetFlash] = useState(false);
  const tipTimerRef = useRef(null);

  const tipText = useMemo(() => CONTROL_HINTS[toolMode], [toolMode]);

  useEffect(() => {
    if (!showNavigator) {
      setShowTip(false);
      return;
    }

    const seen = localStorage.getItem('machine-nav-help-seen');
    if (!seen) {
      setShowTip(true);

      const timer = window.setTimeout(() => {
        setShowTip(false);
        localStorage.setItem('machine-nav-help-seen', '1');
      }, 3500);

      return () => window.clearTimeout(timer);
    }
  }, [showNavigator]);

  useEffect(() => {
    return () => {
      if (tipTimerRef.current) {
        window.clearTimeout(tipTimerRef.current);
      }
    };
  }, []);

  const handleModeClick = (mode) => {
    setToolMode(mode);
    setShowTip(true);

    if (tipTimerRef.current) {
      window.clearTimeout(tipTimerRef.current);
    }

    tipTimerRef.current = window.setTimeout(() => {
      setShowTip(false);
    }, 2200);
  };

  const handleResetView = () => {
    setShowResetFlash(true);
    setSceneSessionKey((v) => v + 1);

    window.setTimeout(() => {
      setShowResetFlash(false);
    }, 260);
  };

  return (
    <StageWrapper $h={stageH || 300}>
      <StageAreaBox>
        <TopBar>
          <LineSwitcher>
            {LINES.map((line) => (
              <LinePill
                key={line.id}
                $active={activeLine === line.id}
                onClick={() => navigate(`/${line.id}/${currentTab}`)}
              >
                {line.label}
              </LinePill>
            ))}
          </LineSwitcher>

          <SmartSearchBar mId={mId} currentTab={currentTab} navigate={navigate} />

          <InlineStatus $s={currentStatus} onClick={onStatusClick}>
            <StatusDot $s={currentStatus} />
            {STATUS_CONFIG[currentStatus].label}
          </InlineStatus>
        </TopBar>

        {/* AI Quick Deploy bar — only on Overall view, sits just below TopBar */}
        <QuickDeployBar visible={mId === 'overall' && !showNewMachine} />

        {showNavigator && (
          <ToolbarWrap>
            <Toolbar>
              <ToolButton
                $active={toolMode === 'rotate'}
                onClick={() => handleModeClick('rotate')}
                title="Rotate"
              >
                <RotateIcon />
              </ToolButton>

              <ToolButton
                $active={toolMode === 'move'}
                onClick={() => handleModeClick('move')}
                title="Move"
              >
                <MoveIcon />
              </ToolButton>

              <ToolButton
                $active={toolMode === 'zoom'}
                onClick={() => handleModeClick('zoom')}
                title="Zoom"
              >
                <ZoomIcon />
              </ToolButton>

              <ToolButton onClick={handleResetView} title="Reset view">
                <ResetIcon />
              </ToolButton>
            </Toolbar>

            {showTip && (
              <ToolTip>
                <ToolTipTitle>{toolMode} mode</ToolTipTitle>
                <ToolTipText>{tipText}</ToolTipText>
              </ToolTip>
            )}
          </ToolbarWrap>
        )}

        <SceneViewport key={sceneSessionKey}>
          <SceneSwitcher mId={mId} showNewMachine={showNewMachine} />
        </SceneViewport>

        {mId?.includes('-') && !showNewMachine && (
          <StatusBadgeWrap $s={currentStatus} style={{ top: '35%', right: '10%' }}>
            <div style={{ color: T.muted, fontSize: '0.55rem', marginBottom: '4px' }}>
              LIVE TELEMETRY
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: parseFloat(healthData.temp) >= 65 ? '#dc2626' : T.text,
              }}
            >
              {healthData.temp}
            </div>
            <div style={{ fontSize: '0.6rem', color: T.sub }}>
              Speed: {healthData.speed}
            </div>
          </StatusBadgeWrap>
        )}

        {mId?.includes('-') && parseFloat(healthData.temp) >= 65 && !showNewMachine && (
          <AlertSymbol>
            <AlertIcon>!</AlertIcon>
          </AlertSymbol>
        )}

        <ResetFlash $show={showResetFlash} />
        <StageGradient />
        <StageFade />
        <ZoneLabel>Factory Floor · {ZONE_NAMES[mId] || mId}</ZoneLabel>
      </StageAreaBox>
    </StageWrapper>
  );
}
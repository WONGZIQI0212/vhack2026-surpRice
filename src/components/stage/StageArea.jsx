import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { T } from '../../styles/theme';
import SceneSwitcher from '../layout/SceneSwitcher';
import SmartSearchBar from './SmartSearchBar';
import { StatusBadgeWrap, StatusDot } from './StatusBadge';
import { STATUS_CONFIG } from '../../styles/theme';
import { MOCK_HEALTH_DATA } from '../../data/MockMachineData';

const LINES = [
  { id: 'overall', label: 'Overall' },
  { id: 'line1',   label: 'Line 1'  },
  { id: 'line2',   label: 'Line 2'  },
  { id: 'line3',   label: 'Line 3'  },
];

const ZONE_NAMES = {
  overall:           'All Zones',
  line1:             'Production Line 1',
  line2:             'Production Line 2',
  line3:             'Production Line 3',
  'line1-husker':    'Paddy Husker 01',
  'line1-milling':   'Rice Milling Unit 01',
  'line1-conveyor':  'Conveyor Belt 01',
  'line1-palletize': 'Palletizing Robot 01',
  'line2-husker':    'Paddy Husker 02',
  'line2-milling':   'Rice Milling Unit 02',
  'line2-conveyor':  'Conveyor Belt 02',
  'line2-palletize': 'Palletizing Robot 02',
  'line3-husker':    'Paddy Husker 03',
  'line3-milling':   'Rice Milling Unit 03',
  'line3-conveyor':  'Conveyor Belt 03',
  'line3-palletize': 'Palletizing Robot 03',
};

const StageWrapper = styled.div`
  position: relative;
  height: ${(p) => p.$h}px;
  min-height: 120px;
  flex-shrink: 0;
  margin: 12px 24px 0;
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
    0 2px 4px rgba(13,17,23,0.04),
    0 12px 40px rgba(13,17,23,0.08);
  position: relative;
`;

const StageGradient = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, ${T.bg} 100%);
  pointer-events: none;
  z-index: 6;
  border-radius: 18px;
`;

const StageFade = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
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
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${T.muted};
`;

/* ── Top bar ─────────────────────────────────────────────── */
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
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(13,17,23,0.08);
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
  background: ${(p) => p.$active
    ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})`
    : 'transparent'};
  color: ${(p) => p.$active ? '#fff' : T.muted};
  box-shadow: ${(p) => p.$active ? '0 2px 8px rgba(55,102,240,0.3)' : 'none'};

  &:hover {
    color: ${(p) => p.$active ? '#fff' : T.text};
    background: ${(p) => p.$active
      ? `linear-gradient(135deg, ${T.accent}, ${T.accentM})`
      : 'rgba(55,102,240,0.08)'};
    border-color: transparent !important;
  }
`;

/* Inline status pill — same style as StatusBadge but no absolute position */
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

  &:hover { transform: scale(1.02); }
`;

/* ── Alert ring ──────────────────────────────────────────── */
const alertRing = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); }
  50%     { box-shadow: 0 0 0 8px rgba(220,38,38,0);  }
`;

const iconBlink = keyframes`
  0%,100% { opacity: 1; }
  50%     { opacity: 0.2; }
`;

const AlertSymbol = styled.div`
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
  animation: ${alertRing} 0.9s ease infinite;
`;

const AlertIcon = styled.span`
  animation: ${iconBlink} 0.8s ease infinite;
  color: #f87171;
  font-style: normal;
  font-weight: 900;
  font-size: 0.9rem;
  line-height: 1;
`;

/*
export default function StageArea({
  stageH, mId, currentTab, navigate, status, onStatusClick,
}) {
  const activeLine = mId?.includes('-') ? mId.split('-')[0] : mId;

  return (
    <StageWrapper $h={stageH || 300}>
      <StageAreaBox>

        <TopBar>
          {// Left: line pills }
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

          {// Centre: search bar stretches to fill 
          <SmartSearchBar mId={mId} currentTab={currentTab} navigate={navigate} />

          {// Right: status badge inline }
          <InlineStatus $s={status} onClick={onStatusClick}>
            <StatusDot $s={status} />
            {STATUS_CONFIG[status].label}
          </InlineStatus>
        </TopBar>

        <SceneSwitcher mId={mId} />
        <StageGradient />
        <StageFade />

        <ZoneLabel>
          Factory Floor · {ZONE_NAMES[mId] || mId}
        </ZoneLabel>
      </StageAreaBox>
    </StageWrapper>
  );
}
*/

export default function StageArea({
  stageH, mId, currentTab, navigate, onStatusClick, getMachineData
}) {
  const activeLine = mId?.includes('-') ? mId.split('-')[0] : mId;
  
  const originalData = MOCK_HEALTH_DATA[mId] || MOCK_HEALTH_DATA['overall'];
  const healthData = getMachineData ? getMachineData(mId, originalData) : originalData;
  const currentStatus = healthData.status;
  
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

          {/* 右侧状态按钮：颜色随数据变化 */}
          <InlineStatus $s={currentStatus} onClick={onStatusClick}>
            <StatusDot $s={currentStatus} />
            {STATUS_CONFIG[currentStatus].label}
          </InlineStatus>
        </TopBar>

        {/* 核心：3D 场景切换器 */}
        <SceneSwitcher mId={mId} />

        {/* HUD: machine view only */}
        {mId?.includes('-') && (
          <StatusBadgeWrap $s={currentStatus} style={{ top: '35%', right: '10%' }}>
            <div style={{ color: T.muted, fontSize: '0.55rem', marginBottom: '4px' }}>LIVE TELEMETRY</div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: parseFloat(healthData.temp) >= 65 ? '#dc2626' : T.text,
            }}>
              {healthData.temp}
            </div>
            <div style={{ fontSize: '0.6rem', color: T.sub }}>Speed: {healthData.speed}</div>
          </StatusBadgeWrap>
        )}

        {/* Alert ring — only when temp is high (≥65°C) */}
        {mId?.includes('-') && parseFloat(healthData.temp) >= 65 && (
          <AlertSymbol>
            <AlertIcon>!</AlertIcon>
          </AlertSymbol>
        )}

        <StageGradient />
        <StageFade />
        <ZoneLabel>Factory Floor · {ZONE_NAMES[mId] || mId}</ZoneLabel>
      </StageAreaBox>
    </StageWrapper>
  );
}
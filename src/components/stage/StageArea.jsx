import React from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';
import SceneSwitcher from '../layout/SceneSwitcher';
import SmartSearchBar from './SmartSearchBar';
import StatusBadge from './StatusBadge';

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

export default function StageArea({
  stageH,
  mId,
  currentTab,
  navigate,
  status,
  onStatusClick,
}) {
  return (
    <StageWrapper $h={stageH || 300}>
      <StageAreaBox>
        <SmartSearchBar mId={mId} currentTab={currentTab} navigate={navigate} />

        <SceneSwitcher mId={mId} />

        <StageGradient />
        <StageFade />

        <StatusBadge status={status} onClick={onStatusClick} />

        <ZoneLabel>
          Factory Floor · {mId === 'overall' ? 'All Zones' : 'Assembly Zone A'}
        </ZoneLabel>
      </StageAreaBox>
    </StageWrapper>
  );
}
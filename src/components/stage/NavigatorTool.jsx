import React from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';

const ToolbarWrap = styled.div`
  position: absolute;
  top: 64px;
  right: 14px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
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

export default function NavigatorTool({
  toolMode,
  showTip,
  tipText,
  onModeClick,
  onResetView,
  children,
}) {
  return (
    <ToolbarWrap>
      <Toolbar>
        <ToolButton
          $active={toolMode === 'rotate'}
          onClick={() => onModeClick('rotate')}
          title="Rotate"
        >
          <RotateIcon />
        </ToolButton>

        <ToolButton
          $active={toolMode === 'move'}
          onClick={() => onModeClick('move')}
          title="Move"
        >
          <MoveIcon />
        </ToolButton>

        <ToolButton
          $active={toolMode === 'zoom'}
          onClick={() => onModeClick('zoom')}
          title="Zoom"
        >
          <ZoomIcon />
        </ToolButton>

        <ToolButton onClick={onResetView} title="Reset view">
          <ResetIcon />
        </ToolButton>
      </Toolbar>

      {showTip && (
        <ToolTip>
          <ToolTipTitle>{toolMode} mode</ToolTipTitle>
          <ToolTipText>{tipText}</ToolTipText>
        </ToolTip>
      )}

      {children}
    </ToolbarWrap>
  );
}
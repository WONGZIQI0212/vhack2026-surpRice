import styled, { css } from 'styled-components';
import { STATUS_CONFIG } from '../../styles/theme';
import { pulse, pulseDanger, pulseWarn } from '../../styles/animations';

export const StatusBadgeWrap = styled.div`
  position: absolute;
  top: 66px;
  right: 14px;
  z-index: 20;
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
  transition: all 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

export const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => STATUS_CONFIG[p.$s].color};
  animation: ${(p) =>
    p.$s === 'normal'
      ? css`${pulse} 2s ease infinite`
      : p.$s === 'emergency'
      ? css`${pulseDanger} 1s ease infinite`
      : p.$s === 'warning'
      ? css`${pulseWarn} 1.4s ease infinite`
      : 'none'};
`;

export default function StatusBadge({ status, onClick }) {
  return (
    <StatusBadgeWrap $s={status} onClick={onClick}>
      <StatusDot $s={status} />
      {STATUS_CONFIG[status].label}
    </StatusBadgeWrap>
  );
}
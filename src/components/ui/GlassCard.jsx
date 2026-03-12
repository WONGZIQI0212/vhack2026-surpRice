import styled from 'styled-components';
import { T } from '../../styles/theme';

const GlassCard = styled.div`
  flex: ${(p) => p.$flex || 1};
  display: flex;
  flex-direction: column;
  background: ${T.glass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${T.glassBorder};
  border-radius: 16px;
  padding: 18px 22px 24px 22px;
  box-shadow:
    0 1px 1px rgba(255,255,255,0.8) inset,
    0 4px 24px rgba(13,17,23,0.07),
    0 1px 3px rgba(13,17,23,0.04);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow:
      0 1px 1px rgba(255,255,255,0.8) inset,
      0 8px 32px rgba(13,17,23,0.1),
      0 1px 3px rgba(13,17,23,0.06);
  }
  overflow: visible;
`;

export default GlassCard;
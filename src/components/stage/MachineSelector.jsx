import styled from 'styled-components';
import { T } from '../../styles/theme';

const MachineSelector = styled.select`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 20;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: ${T.text};
  border: 1px solid rgba(255,255,255,0.95);
  padding: 7px 14px;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 12px rgba(13,17,23,0.1);
  transition: all 0.2s;

  &:hover {
    border-color: ${T.accentM};
  }
`;

export default MachineSelector;
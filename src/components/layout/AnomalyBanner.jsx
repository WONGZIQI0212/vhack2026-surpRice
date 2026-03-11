import React from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';

const Banner = styled.div`
  height: 40px;
  background: ${(p) =>
    p.$color === 'red' ? '#b91c1c' :
    p.$color === 'orange' ? '#c2410c' :
    '#059669'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 15;
  position: relative;
  margin: 0 24px 8px 24px;
  border-radius: 8px;
`;

const BannerMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BannerAction = styled.span`
  font-size: 0.7rem;
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export default function AnomalyBanner({ color, message, onClick }) {
  return (
    <Banner $color={color} onClick={onClick}>
      <BannerMessage>
        <span>🔔</span>
        <span>{message}</span>
      </BannerMessage>
      <BannerAction>View Details</BannerAction>
    </Banner>
  );
}
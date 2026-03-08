import React from 'react';
import styled from 'styled-components';
import GlassCard from '../components/ui/GlassCard';
import { T } from '../styles/theme';

const Label = styled.div`
  font-size: 0.58rem;
  color: ${T.muted};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 2.4rem;
  font-weight: 300;
  margin-bottom: 12px;
  letter-spacing: -1.5px;
  color: ${T.text};
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const BarGraph = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 46px;
  margin-top: auto;
`;

const Bar = styled.div`
  flex: 1;
  background: linear-gradient(to top, ${T.accent}, ${T.accentM});
  height: ${(p) => p.h}%;
  opacity: ${(p) => 0.15 + p.i * 0.13};
  border-radius: 3px 3px 0 0;
`;

const DotMatrix = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  width: 140px;
  margin-top: auto;
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => (p.active ? T.accent : 'rgba(180,192,210,0.5)')};
  transition: background 0.3s;
`;

const CircleGauge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(180,192,210,0.4);
  position: relative;
  margin-top: auto;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 2.5px solid ${T.accent};
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(-45deg);
  }
`;

export default function Dashboard({ mId }) {
  const o = mId === 'overall';

  return (
    <>
      <GlassCard>
        <Label>{o ? 'Average Temp' : 'Core Temp'}</Label>
        <Value>{o ? '38.2°' : '42.5°'}</Value>
        <BarGraph>
          {[30, 45, 60, 55, 70, 85, 90].map((h, i) => (
            <Bar key={i} h={h} i={i} />
          ))}
        </BarGraph>
      </GlassCard>

      <GlassCard>
        <Label>Energy Draw</Label>
        <Value>
          {o ? '1.4k' : '12.4'}
          <span style={{ fontSize: '1rem', fontWeight: 400, color: T.sub }}> kWh</span>
        </Value>
        <DotMatrix>
          {Array.from({ length: 20 }).map((_, i) => (
            <Dot key={i} active={o ? i < 16 : i < 8} />
          ))}
        </DotMatrix>
      </GlassCard>

      <GlassCard>
        <Label>Production</Label>
        <Value>{o ? '12.2k' : '850'}</Value>
        <CircleGauge />
      </GlassCard>
    </>
  );
}
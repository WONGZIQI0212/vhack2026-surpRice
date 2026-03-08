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

export default function AIPrediction({ mId }) {
  const o = mId === 'overall';
  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <>
      <GlassCard $flex={1.5}>
        <Label>Forecast Analysis</Label>
        <div
          style={{
            fontSize: '0.875rem',
            lineHeight: '2.5',
            borderTop: `1px solid rgba(200,210,225,0.5)`,
            paddingTop: '12px',
          }}
        >
          <div style={row}>
            <span style={{ color: T.sub }}>Est. Profit</span>
            <b style={{ color: T.success, fontWeight: 600 }}>
              {o ? '+$45,000' : '+$12,400'}
            </b>
          </div>

          <div style={row}>
            <span style={{ color: T.sub }}>Required Labor</span>
            <span style={{ fontWeight: 500 }}>{o ? '18 Total' : '2 Operators'}</span>
          </div>

          <div style={row}>
            <span style={{ color: T.sub }}>Location Map</span>
            <span style={{ fontWeight: 500 }}>{o ? 'All Sectors' : 'Zone A-4'}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <Label>Capacity Limits</Label>
        <div
          style={{
            fontSize: '0.875rem',
            lineHeight: '2.5',
            borderTop: `1px solid rgba(200,210,225,0.5)`,
            paddingTop: '12px',
          }}
        >
          <div style={row}>
            <span style={{ color: T.sub }}>Cycle Time</span>
            <span style={{ fontWeight: 500 }}>12H / 8.5H</span>
          </div>

          <div style={row}>
            <span style={{ color: T.sub }}>Storage Space</span>
            <span style={{ fontWeight: 500 }}>85%</span>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
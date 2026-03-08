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

export default function Maintenance() {
  return (
    <>
      <GlassCard>
        <Label>Recent Logs</Label>
        <div
          style={{
            borderTop: `1px solid rgba(200,210,225,0.5)`,
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {[
            ['01 Mar', 'Fluid Replacement'],
            ['15 Feb', 'Sensor Calibration'],
          ].map(([d, t]) => (
            <div
              key={d}
              style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}
            >
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: T.muted,
                  minWidth: 48,
                }}
              >
                {d}
              </span>
              <span style={{ fontSize: '0.85rem', color: T.sub }}>{t}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <Label>Next Scheduled Check</Label>
        <Value style={{ color: T.danger, fontSize: '2.2rem' }}>14 MAR</Value>

        <button
          style={{
            width: 'fit-content',
            background: 'transparent',
            color: T.text,
            border: `1px solid rgba(200,210,225,0.7)`,
            padding: '9px 22px',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: '0.63rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderRadius: '8px',
            transition: 'all 0.18s',
            marginTop: 'auto',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = T.accent;
            e.currentTarget.style.color = T.accent;
            e.currentTarget.style.background = 'rgba(29,72,200,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200,210,225,0.7)';
            e.currentTarget.style.color = T.text;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Modify Date
        </button>
      </GlassCard>
    </>
  );
}
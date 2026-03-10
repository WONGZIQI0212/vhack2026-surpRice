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

const PREDICTIONS = {

  overall: {
    profit: '+$45,000',
    labor: '18 Operators',
    zone: 'Entire Factory',
    cycle: '12H / 8.5H',
    storage: '85%'
  },

  line1: {
  profit: '+$45,300',
  labor: '6 Operators',
  zone: 'Production Line 1',
  cycle: '3.2H avg',
  storage: '72%'
},
line2: {
  profit: '+$42,700',
  labor: '6 Operators',
  zone: 'Production Line 2',
  cycle: '3.1H avg',
  storage: '68%'
},
line3: {
  profit: '+$43,800',
  labor: '6 Operators',
  zone: 'Production Line 3',
  cycle: '3.2H avg',
  storage: '70%'
}

};

export default function AIPrediction({ mId }) {

  const data = PREDICTIONS[mId] || PREDICTIONS.overall;

  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <>
      <GlassCard $flex={1.5}>
        <Label>AI Forecast Analysis</Label>

        <div style={{
          fontSize: '0.875rem',
          lineHeight: '2.5',
          borderTop: `1px solid rgba(200,210,225,0.5)`,
          paddingTop: '12px'
        }}>

          <div style={row}>
            <span style={{color:T.sub}}>Est. Profit</span>
            <b style={{color:T.success}}>{data.profit}</b>
          </div>

          <div style={row}>
            <span style={{color:T.sub}}>Required Labor</span>
            <span>{data.labor}</span>
          </div>

          <div style={row}>
            <span style={{color:T.sub}}>Production Zone</span>
            <span>{data.zone}</span>
          </div>

        </div>
      </GlassCard>

      <GlassCard>
        <Label>Capacity Limits</Label>

        <div style={{
          fontSize:'0.875rem',
          lineHeight:'2.5',
          borderTop:`1px solid rgba(200,210,225,0.5)`,
          paddingTop:'12px'
        }}>

          <div style={row}>
            <span style={{color:T.sub}}>Cycle Time</span>
            <span>{data.cycle}</span>
          </div>

          <div style={row}>
            <span style={{color:T.sub}}>Storage Space</span>
            <span>{data.storage}</span>
          </div>

        </div>
      </GlassCard>
    </>
  );
}
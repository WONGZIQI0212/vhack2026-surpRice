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

  'line1-husker': {
    profit: '+$12,400',
    labor: '2 Operators',
    zone: 'Line 1 Husking',
    cycle: '3.2H',
    storage: '68%'
  },

  'line1-milling': {
    profit: '+$15,200',
    labor: '2 Operators',
    zone: 'Line 1 Milling',
    cycle: '2.6H',
    storage: '72%'
  },

  'line1-conveyor': {
    profit: '+$8,200',
    labor: '1 Technician',
    zone: 'Line 1 Conveyor',
    cycle: 'Continuous',
    storage: '60%'
  },

  'line1-palletize': {
    profit: '+$9,800',
    labor: '1 Supervisor',
    zone: 'Line 1 Packaging',
    cycle: '1.9H',
    storage: '77%'
  },

  'line2-husker': {
    profit: '+$11,900',
    labor: '2 Operators',
    zone: 'Line 2 Husking',
    cycle: '3.1H',
    storage: '66%'
  },

  'line2-milling': {
    profit: '+$14,700',
    labor: '2 Operators',
    zone: 'Line 2 Milling',
    cycle: '2.5H',
    storage: '71%'
  },

  'line2-conveyor': {
    profit: '+$7,900',
    labor: '1 Technician',
    zone: 'Line 2 Conveyor',
    cycle: 'Continuous',
    storage: '59%'
  },

  'line2-palletize': {
    profit: '+$9,100',
    labor: '1 Supervisor',
    zone: 'Line 2 Packaging',
    cycle: '1.8H',
    storage: '75%'
  },

  'line3-husker': {
    profit: '+$12,100',
    labor: '2 Operators',
    zone: 'Line 3 Husking',
    cycle: '3.0H',
    storage: '67%'
  },

  'line3-milling': {
    profit: '+$15,000',
    labor: '2 Operators',
    zone: 'Line 3 Milling',
    cycle: '2.7H',
    storage: '70%'
  },

  'line3-conveyor': {
    profit: '+$8,000',
    labor: '1 Technician',
    zone: 'Line 3 Conveyor',
    cycle: 'Continuous',
    storage: '61%'
  },

  'line3-palletize': {
    profit: '+$8,700',
    labor: '1 Supervisor',
    zone: 'Line 3 Packaging',
    cycle: '1.9H',
    storage: '74%'
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
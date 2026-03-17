import React, { useState } from 'react';
import styled from 'styled-components';
import { T } from '../styles/theme';

// Container
const Card = styled.div`
  background: rgba(255,255,255,0.75);
  border-radius: 16px;
  padding: 18px;
  border: 1px solid rgba(200,210,225,0.4);
`;

const Title = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 14px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(200,210,225,0.5);
  font-size: 0.65rem;
`;

const Button = styled.button`
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, ${T.accent}, ${T.accentM});
  color: white;
  font-weight: 700;
  font-size: 0.65rem;
  cursor: pointer;
`;

const Section = styled.div`
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(248,249,253,0.9);
`;

const Label = styled.div`
  font-size: 0.55rem;
  color: ${T.muted};
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${T.text};
`;

export default function AIProductionPlanner() {
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [result, setResult] = useState(null);

  const runAI = () => {
    // Fake AI logic (replace with real backend later)
    const fastest = Math.ceil(target / 1200); // faster throughput
    const economic = Math.ceil(target / 800);

    setResult({
      fastest,
      economic,
      bottleneck: 'Packaging Line',
      labor: 'Move 2 workers from Milling → Packaging',
      raw: `${Math.round(target * 1.1)} kg raw material needed`,
      storage: `${Math.round(target * 0.6)} kg storage required`
    });
  };

  return (
    <Card>
      <Title>AI Production Planner</Title>

      <InputRow>
        <Input
          placeholder="Target Output (kg)"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <Input
          placeholder="Deadline (days)"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </InputRow>

      <Button onClick={runAI}>
        ▶ Run AI Planning
      </Button>

      {result && (
        <>
          {/* Time */}
          <Section>
            <Label>Time Planning</Label>
            <Value>⚡ Fastest: {result.fastest} days</Value>
            <Value>💰 Economic: {result.economic} days</Value>
          </Section>

          {/* Labor */}
          <Section>
            <Label>Labor Dynamics</Label>
            <Value>🚧 Bottleneck: {result.bottleneck}</Value>
            <Value>🔄 {result.labor}</Value>
          </Section>

          {/* Storage */}
          <Section>
            <Label>Storage & Inventory</Label>
            <Value>🌾 {result.raw}</Value>
            <Value>📦 {result.storage}</Value>
          </Section>
        </>
      )}
    </Card>
  );
}
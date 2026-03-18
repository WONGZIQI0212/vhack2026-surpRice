import React, { useState } from 'react';
import styled from 'styled-components';

import AIPrediction from './AIPrediction'; // your original
import AIProductionPlanner from './AIProductionPlanner'; // new

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SwitchPanel = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(200,210,225,0.5);
  background: ${p => p.active ? '#1748C8' : '#ffffff'};
  font-weight: 700;
  cursor: pointer;
`;

export default function AIModuleSwitcher({ mId }) {
  const [mode, setMode] = useState('machine');

  return (
    <Wrapper>

      {/* Selection Panel */}
      <SwitchPanel>
        <Tab active={mode === 'machine'} onClick={() => setMode('machine')}>
          🤖 Machine AI
        </Tab>

        <Tab active={mode === 'production'} onClick={() => setMode('production')}>
          📊 Production AI
        </Tab>
      </SwitchPanel>

      {/* Dynamic Page */}
      {mode === 'machine' ? (
        <AIPrediction mId={mId} />
      ) : (
        <AIProductionPlanner />
      )}

    </Wrapper>
  );
}
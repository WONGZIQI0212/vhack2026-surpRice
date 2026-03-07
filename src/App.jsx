import React, { Suspense } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

// ==========================================
// 1. MINIMALIST THEME & COLORS
// ==========================================
const THEME = {
  bg: '#F4F4F0',      // Clean Beige for the whole page
  stage: '#000000',   // Pure Black strictly for the 3D model background
  text: '#1A1A1A',    // Dark Charcoal for readability
  subtext: '#8E8E93', // Muted Gray for labels
  border: '#E5E5E0',  // Very light gray/beige for subtle dividers
  white: '#FFFFFF',   // White for high-contrast elements (Dropdown)
};

// ==========================================
// 2. STYLED COMPONENTS (LAYOUT & UI)
// ==========================================
const PageContainer = styled.div`
  width: 100vw; 
  height: 100vh; 
  display: flex; 
  flex-direction: column;
  background-color: ${THEME.bg}; 
  color: ${THEME.text}; 
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
`;

const Header = styled.header` 
  height: 8vh; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
`;

const Title = styled.h1` 
  font-family: 'Brush Script MT', cursive; 
  font-size: 2.2rem; 
  margin: 0; 
`;

// 3D Stage optimized for perfect first-glance display
const StageArea = styled.section`
  height: 42vh; 
  background: ${THEME.stage}; 
  position: relative;
  margin: 0 30px; 
  border-radius: 20px; 
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// High-contrast Dropdown against the black stage
const MachineSelector = styled.select`
  position: absolute; 
  top: 20px; 
  left: 20px; 
  z-index: 20;
  background: ${THEME.white}; 
  color: ${THEME.text}; 
  border: none;
  padding: 10px 16px; 
  border-radius: 8px; 
  font-size: 0.75rem; 
  font-weight: 600;
  text-transform: uppercase; 
  letter-spacing: 1px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  cursor: pointer; 
  outline: none;
`;

// The Single-Line Clickable Tabs
const TabBar = styled.nav`
  height: 8vh; 
  display: flex; 
  justify-content: center; 
  gap: 50px; 
  align-items: center;
`;

const TabLink = styled(NavLink)`
  text-decoration: none; 
  font-size: 0.8rem; 
  font-weight: 600; 
  color: ${THEME.subtext};
  letter-spacing: 1px; 
  text-transform: uppercase; 
  transition: all 0.2s ease;
  padding-bottom: 4px;
  
  &.active { 
    color: ${THEME.text}; 
    border-bottom: 2px solid ${THEME.text}; 
  }
`;

const ContentArea = styled.main`
  flex: 1; 
  padding: 10px 60px 40px 60px; 
  display: flex; 
  gap: 50px;
`;

const Panel = styled.div` 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
`;

const Label = styled.div` 
  font-size: 0.65rem; 
  color: ${THEME.subtext}; 
  letter-spacing: 1.5px; 
  text-transform: uppercase; 
  margin-bottom: 10px; 
`;

const Value = styled.div` 
  font-size: 2.6rem; 
  font-weight: 300; 
  margin-bottom: 15px; 
  letter-spacing: -1px; 
`;

// ==========================================
// 3. UNIQUE DATA GRAPHS
// ==========================================

// Bar Graph (For Temperature)
const BarGraph = styled.div` display: flex; align-items: flex-end; gap: 4px; height: 50px; `;
const Bar = styled.div` flex: 1; background: ${THEME.text}; height: ${props => props.h}%; opacity: ${props => 0.15 + (props.i * 0.12)}; `;

// Dot Matrix (For Energy)
const DotMatrix = styled.div` display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; width: 140px; `;
const Dot = styled.div` width: 5px; height: 5px; border-radius: 50%; background: ${props => props.active ? THEME.text : THEME.border}; `;

// Minimal Circle Gauge (For Production)
const CircleGauge = styled.div`
  width: 45px; height: 45px; border-radius: 50%; border: 2px solid ${THEME.border}; position: relative;
  &::after {
    content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
    border-radius: 50%; border: 2px solid ${THEME.text}; border-top-color: transparent; border-right-color: transparent; transform: rotate(-45deg);
  }
`;

// ==========================================
// 4. PAGE COMPONENTS (Dynamic based on Machine ID)
// ==========================================

const Dashboard = ({ mId }) => {
  const isOverall = mId === 'overall';
  return (
    <>
      <Panel>
        <Label>{isOverall ? 'Average Temp' : 'Core Temp'}</Label>
        <Value>{isOverall ? '38.2°' : '42.5°'}</Value>
        <BarGraph>{[30, 45, 60, 55, 70, 85, 90].map((h, i) => <Bar key={i} h={h} i={i} />)}</BarGraph>
      </Panel>
      <Panel>
        <Label>Energy Draw</Label>
        <Value>{isOverall ? '1.4k' : '12.4'}<span style={{fontSize: '1rem', fontWeight: 400}}> kWh</span></Value>
        <DotMatrix>
          {Array.from({length: 20}).map((_, i) => <Dot key={i} active={isOverall ? i < 16 : i < 8} />)}
        </DotMatrix>
      </Panel>
      <Panel>
        <Label>Production</Label>
        <Value>{isOverall ? '12.2k' : '850'}</Value>
        <CircleGauge />
      </Panel>
    </>
  );
};

const AIPrediction = ({ mId }) => {
  const isOverall = mId === 'overall';
  return (
    <>
      <Panel style={{flex: 1.5}}>
        <Label>Forecast Analysis</Label>
        <div style={{fontSize: '0.9rem', lineHeight: '2.4', borderTop: `1px solid ${THEME.border}`, paddingTop: '10px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Est. Profit</span> <b>{isOverall ? '+$45,000' : '+$12,400'}</b></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Required Labor</span> <span>{isOverall ? '18 Total' : '2 Operators'}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Location Map</span> <span>{isOverall ? 'All Sectors' : 'Zone A-4'}</span></div>
        </div>
      </Panel>
      <Panel>
        <Label>Capacity Limits</Label>
        <div style={{fontSize: '0.9rem', lineHeight: '2.4', borderTop: `1px solid ${THEME.border}`, paddingTop: '10px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Cycle Time</span> <span>12H / 8.5H</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Storage Space</span> <span>85%</span></div>
        </div>
      </Panel>
    </>
  );
};

const Maintenance = ({ mId }) => (
  <>
    <Panel>
      <Label>Recent Logs</Label>
      <div style={{fontSize: '0.85rem', color: THEME.subtext, lineHeight: '2'}}>
        <div>• 01 Mar — Fluid Replacement</div>
        <div>• 15 Feb — Sensor Calibration</div>
      </div>
    </Panel>
    <Panel>
      <Label>Next Scheduled Check</Label>
      <Value style={{color: '#9E5B5B'}}>14 MAR</Value>
      <button style={{width: 'fit-content', background: 'transparent', color: THEME.text, border: `1px solid ${THEME.border}`, padding: '10px 24px', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase'}}>
        Modify Date
      </button>
    </Panel>
  </>
);

// ==========================================
// 5. MAIN LAYOUT & ROUTING
// ==========================================

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mId } = useParams();

  // Keep the user on the same tab when they change machines
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  return (
    <PageContainer>
      <Header>
        <Title>SurPrice</Title>
      </Header>

      <StageArea>
        {/* White Dropdown on Black Background */}
        <MachineSelector value={mId} onChange={(e) => navigate(`/${e.target.value}/${currentTab}`)}>
          <option value="overall">Overall Factory</option>
          <option value="machine1">Machine 01 — Assembly</option>
        </MachineSelector>
        
        <Suspense fallback={null}>
          <Spline 
            scene="https://prod.spline.design/nDF7deJlJwIYwXKr/scene.splinecode" 
          />
        </Suspense>
      </StageArea>

      {/* Single Line Tabs */}
      <TabBar>
        <TabLink to={`/${mId}/dashboard`}>Dashboard</TabLink>
        <TabLink to={`/${mId}/ai-prediction`}>AI Prediction</TabLink>
        <TabLink to={`/${mId}/maintenance`}>Maintenance Schedule</TabLink>
      </TabBar>

      {/* Data Panels */}
      <ContentArea>
        <Routes>
          <Route path="dashboard" element={<Dashboard mId={mId} />} />
          <Route path="ai-prediction" element={<AIPrediction mId={mId} />} />
          <Route path="maintenance" element={<Maintenance mId={mId} />} />
        </Routes>
      </ContentArea>
    </PageContainer>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic Route to handle Machine selection and Tab selection */}
        <Route path="/:mId/*" element={<MainLayout />} />
        
        {/* Default redirect to Overall Factory -> Dashboard */}
        <Route path="*" element={<Navigate to="/overall/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
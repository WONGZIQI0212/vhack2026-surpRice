import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import logoSrc from './assets/SurpRice_logo.svg';

const T = {
  bg:          '#E8ECF4',
  surface:     '#FFFFFF',
  text:        '#0D1117',
  sub:         '#5C6A82',
  muted:       '#9AA5B4',
  border:      '#DDE3EF',
  accent:      '#1748C8',
  accentM:     '#3B6EF0',
  accentL:     '#EBF0FF',
  success:     '#059669',
  danger:      '#DC2626',
  warning:     '#D97706',
  glass:       'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.85)',
};

const SCENES = {
  overall:  'https://prod.spline.design/nDF7deJlJwIYwXKr/scene.splinecode',
  machine1: 'https://prod.spline.design/lWhrYq26d-TrYsUE/scene.splinecode',
};

const CAM_START = { x: 900, y: 600, z: 900 };
const CAM_END   = { x: 450, y: 280, z: 450 };

const STATUS_CONFIG = {
  normal:    { label: 'Normal',         color: T.success, bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.2)'  },
  warning:   { label: 'Warning',        color: T.warning, bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.25)' },
  emergency: { label: 'Emergency Stop', color: T.danger,  bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)' },
  offline:   { label: 'Offline',        color: T.muted,   bg: 'rgba(154,165,180,0.1)', border: 'rgba(154,165,180,0.3)'},
};
const STATUSES = ['normal', 'warning', 'emergency', 'offline'];

// ==========================================
// GLOBAL
// ==========================================
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${T.bg}; color: ${T.text};
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    user-select: none;
  }
  ::selection { background: rgba(55,102,240,0.15); }
`;

// ==========================================
// KEYFRAMES
// ==========================================
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.5); }
  60%     { box-shadow: 0 0 0 5px rgba(5,150,105,0); }
`;
const pulseDanger = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); }
  60%     { box-shadow: 0 0 0 6px rgba(220,38,38,0); }
`;
const pulseWarn = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.5); }
  60%     { box-shadow: 0 0 0 5px rgba(217,119,6,0); }
`;

// ==========================================
// PAGE SHELL
// ==========================================
const PageContainer = styled.div`
  width: 100vw; height: 100vh;
  display: flex; flex-direction: column;
  background: ${T.bg}; overflow: hidden;
  animation: ${fadeUp} 0.5s cubic-bezier(.22,.68,0,1.1) both;
`;

// ==========================================
// HEADER
// ==========================================
const Header = styled.header`
  height: 7vh; flex-shrink: 0;
  display: flex; justify-content: center; align-items: center;
  background: ${T.surface}; border-bottom: 1px solid ${T.border};
  position: relative; z-index: 10;
  box-shadow: 0 1px 0 ${T.border}, 0 4px 20px rgba(13,17,23,0.05);
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, ${T.accent}, ${T.accentM} 60%, transparent);
  }
`;

/* Brand lockup: logo + title + pipe + tagline */
const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const LogoImg = styled.img`
  height: 28px;
  width: auto;
  object-fit: contain;
  margin-right: 10px;
  display: block;
`;

const Title = styled.h1`
  font-family: 'Raleway', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin: 0;
  background: linear-gradient(120deg, ${T.text} 0%, ${T.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TitlePipe = styled.span`
  font-size: 0.85rem;
  color: ${T.border};
  margin: 0 12px;
  font-weight: 300;
  -webkit-text-fill-color: ${T.border};
`;

const TitleSub = styled.span`
  font-family: 'Raleway', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: ${T.muted};
  font-style: normal;
`;

const HeaderLeft  = styled.div`position: absolute; left: 24px; display: flex; align-items: center;`;
const VersionChip = styled.div`font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentL}; border: 1px solid rgba(55,102,240,0.2); border-radius: 4px; padding: 2px 7px;`;
const HeaderRight = styled.div`position: absolute; right: 24px; display: flex; align-items: center; gap: 10px;`;
const LivePill    = styled.div`display: flex; align-items: center; gap: 6px; background: rgba(5,150,105,0.07); border: 1px solid rgba(5,150,105,0.18); border-radius: 20px; padding: 4px 11px; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.success};`;
const GreenDot    = styled.span`width: 6px; height: 6px; border-radius: 50%; background: ${T.success}; animation: ${pulse} 2s ease infinite; display: inline-block; flex-shrink: 0;`;
const Clock       = styled.div`font-size: 0.62rem; font-weight: 500; color: ${T.muted}; letter-spacing: 0.04em; font-variant-numeric: tabular-nums;`;

// ==========================================
// RESIZABLE BODY
// ==========================================
const ResizableBody = styled.div`flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;`;

const StageWrapper = styled.div`
  position: relative; height: ${p => p.$h}px;
  min-height: 120px; flex-shrink: 0; margin: 12px 24px 0;
`;
const StageArea = styled.section`
  width: 100%; height: 100%; border-radius: 18px; overflow: hidden;
  display: flex; justify-content: center; align-items: center;
  background: ${T.bg}; border: 1px solid ${T.border};
  box-shadow: 0 2px 4px rgba(13,17,23,0.04), 0 12px 40px rgba(13,17,23,0.08);
  position: relative;
`;
const SceneLayer = styled.div`
  position: absolute; inset: 0;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity ${p => p.$visible ? '0.6s' : '0.3s'} ease;
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};
`;
const StageGradient = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, ${T.bg} 100%);
  pointer-events: none; z-index: 6; border-radius: 18px;
`;
const StageFade = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0; height: 70px;
  background: linear-gradient(to bottom, transparent, ${T.bg});
  pointer-events: none; z-index: 7;
`;
const LoadingOverlay = styled.div`
  position: absolute; inset: 0; z-index: 15;
  display: flex; align-items: center; justify-content: center;
  opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 0.3s ease; pointer-events: none;
`;
const LoadingSpinner = styled.div`
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid ${T.border}; border-top-color: ${T.accent};
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const MachineSelector = styled.select`
  position: absolute; top: 14px; left: 14px; z-index: 20;
  background: rgba(255,255,255,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  color: ${T.text}; border: 1px solid rgba(255,255,255,0.95); padding: 7px 14px; border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; cursor: pointer; outline: none;
  box-shadow: 0 2px 12px rgba(13,17,23,0.1); transition: all 0.2s;
  &:hover { border-color: ${T.accentM}; }
`;
const ZoneLabel = styled.div`
  position: absolute; bottom: 14px; left: 14px; z-index: 20;
  background: rgba(255,255,255,0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.9); border-radius: 8px;
  padding: 4px 10px; font-size: 0.56rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${T.muted};
`;
const StatusBadge = styled.div`
  position: absolute; top: 14px; right: 14px; z-index: 20;
  display: flex; align-items: center; gap: 7px;
  background: ${p => STATUS_CONFIG[p.$s].bg}; border: 1px solid ${p => STATUS_CONFIG[p.$s].border};
  border-radius: 20px; padding: 5px 13px; font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; color: ${p => STATUS_CONFIG[p.$s].color};
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  cursor: pointer; transition: all 0.2s; &:hover { transform: scale(1.02); }
`;
const StatusDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  background: ${p => STATUS_CONFIG[p.$s].color};
  animation: ${p =>
    p.$s === 'normal'    ? css`${pulse} 2s ease infinite` :
    p.$s === 'emergency' ? css`${pulseDanger} 1s ease infinite` :
    p.$s === 'warning'   ? css`${pulseWarn} 1.4s ease infinite` : 'none'
  };
`;
const DragHandle = styled.div`
  height: 18px; flex-shrink: 0; margin: 0 24px;
  display: flex; align-items: center; justify-content: center;
  cursor: ns-resize; position: relative; z-index: 8;
  &::after {
    content: ''; width: 48px; height: 4px;
    background: ${p => p.$dragging ? T.accent : T.border};
    border-radius: 3px; transition: background 0.2s, width 0.2s;
  }
  &:hover::after { background: ${T.accentM}; width: 64px; }
`;
const BottomSection = styled.div`flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 80px;`;
const TabBar = styled.nav`
  height: 7vh; flex-shrink: 0; display: flex; justify-content: flex-start;
  padding: 0 32px; gap: 40px; align-items: center;
  background: ${T.surface}; border-bottom: 1px solid ${T.border};
  position: relative; z-index: 9; box-shadow: 0 4px 16px rgba(13,17,23,0.04);
`;
const TabShimmer = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(55,102,240,0.25) 40%, rgba(55,102,240,0.25) 60%, transparent);
`;
const TabLink = styled(NavLink)`
  text-decoration: none; font-size: 0.68rem; font-weight: 700;
  color: ${T.muted}; letter-spacing: 0.12em; text-transform: uppercase;
  transition: color 0.18s; padding-bottom: 5px; position: relative;
  &::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, ${T.accent}, ${T.accentM}); border-radius: 2px;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.24s cubic-bezier(.34,1.56,.64,1);
  }
  &:hover { color: ${T.text}; }
  &.active { color: ${T.accent}; &::after { transform: scaleX(1); } }
`;
const ContentArea = styled.main`flex: 1; padding: 12px 24px 16px 24px; display: flex; gap: 12px; overflow: hidden;`;

// ==========================================
// GLASS CARDS
// ==========================================
const GlassCard = styled.div`
  flex: ${p => p.$flex || 1}; display: flex; flex-direction: column;
  background: ${T.glass}; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${T.glassBorder}; border-radius: 16px; padding: 18px 22px;
  box-shadow: 0 1px 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(13,17,23,0.07), 0 1px 3px rgba(13,17,23,0.04);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 1px 1px rgba(255,255,255,0.8) inset, 0 8px 32px rgba(13,17,23,0.1), 0 1px 3px rgba(13,17,23,0.06); }
`;
const Label      = styled.div`font-size: 0.58rem; color: ${T.muted}; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;`;
const Value      = styled.div`font-size: 2.4rem; font-weight: 300; margin-bottom: 12px; letter-spacing: -1.5px; color: ${T.text}; line-height: 1; font-variant-numeric: tabular-nums;`;
const BarGraph   = styled.div`display: flex; align-items: flex-end; gap: 4px; height: 46px; margin-top: auto;`;
const Bar        = styled.div`flex: 1; background: linear-gradient(to top, ${T.accent}, ${T.accentM}); height: ${p => p.h}%; opacity: ${p => 0.15 + p.i * 0.13}; border-radius: 3px 3px 0 0;`;
const DotMatrix  = styled.div`display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; width: 140px; margin-top: auto;`;
const Dot        = styled.div`width: 5px; height: 5px; border-radius: 50%; background: ${p => p.active ? T.accent : 'rgba(180,192,210,0.5)'}; transition: background 0.3s;`;
const CircleGauge= styled.div`width: 44px; height: 44px; border-radius: 50%; border: 2px solid rgba(180,192,210,0.4); position: relative; margin-top: auto; &::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border-radius: 50%; border: 2.5px solid ${T.accent}; border-top-color: transparent; border-right-color: transparent; transform: rotate(-45deg); }`;

// ==========================================
// PAGES
// ==========================================
const Dashboard = ({ mId }) => {
  const o = mId === 'overall';
  return (
    <>
      <GlassCard>
        <Label>{o ? 'Average Temp' : 'Core Temp'}</Label>
        <Value>{o ? '38.2°' : '42.5°'}</Value>
        <BarGraph>{[30,45,60,55,70,85,90].map((h,i)=><Bar key={i} h={h} i={i}/>)}</BarGraph>
      </GlassCard>
      <GlassCard>
        <Label>Energy Draw</Label>
        <Value>{o?'1.4k':'12.4'}<span style={{fontSize:'1rem',fontWeight:400,color:T.sub}}> kWh</span></Value>
        <DotMatrix>{Array.from({length:20}).map((_,i)=><Dot key={i} active={o?i<16:i<8}/>)}</DotMatrix>
      </GlassCard>
      <GlassCard>
        <Label>Production</Label>
        <Value>{o?'12.2k':'850'}</Value>
        <CircleGauge />
      </GlassCard>
    </>
  );
};

const AIPrediction = ({ mId }) => {
  const o = mId === 'overall';
  const row = { display:'flex', justifyContent:'space-between', alignItems:'center' };
  return (
    <>
      <GlassCard $flex={1.5}>
        <Label>Forecast Analysis</Label>
        <div style={{fontSize:'0.875rem',lineHeight:'2.5',borderTop:`1px solid rgba(200,210,225,0.5)`,paddingTop:'12px'}}>
          <div style={row}><span style={{color:T.sub}}>Est. Profit</span><b style={{color:T.success,fontWeight:600}}>{o?'+$45,000':'+$12,400'}</b></div>
          <div style={row}><span style={{color:T.sub}}>Required Labor</span><span style={{fontWeight:500}}>{o?'18 Total':'2 Operators'}</span></div>
          <div style={row}><span style={{color:T.sub}}>Location Map</span><span style={{fontWeight:500}}>{o?'All Sectors':'Zone A-4'}</span></div>
        </div>
      </GlassCard>
      <GlassCard>
        <Label>Capacity Limits</Label>
        <div style={{fontSize:'0.875rem',lineHeight:'2.5',borderTop:`1px solid rgba(200,210,225,0.5)`,paddingTop:'12px'}}>
          <div style={row}><span style={{color:T.sub}}>Cycle Time</span><span style={{fontWeight:500}}>12H / 8.5H</span></div>
          <div style={row}><span style={{color:T.sub}}>Storage Space</span><span style={{fontWeight:500}}>85%</span></div>
        </div>
      </GlassCard>
    </>
  );
};

const Maintenance = () => (
  <>
    <GlassCard>
      <Label>Recent Logs</Label>
      <div style={{borderTop:`1px solid rgba(200,210,225,0.5)`,paddingTop:'12px',display:'flex',flexDirection:'column',gap:10}}>
        {[['01 Mar','Fluid Replacement'],['15 Feb','Sensor Calibration']].map(([d,t])=>(
          <div key={d} style={{display:'flex',gap:14,alignItems:'baseline'}}>
            <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.08em',color:T.muted,minWidth:48}}>{d}</span>
            <span style={{fontSize:'0.85rem',color:T.sub}}>{t}</span>
          </div>
        ))}
      </div>
    </GlassCard>
    <GlassCard>
      <Label>Next Scheduled Check</Label>
      <Value style={{color:T.danger,fontSize:'2.2rem'}}>14 MAR</Value>
      <button style={{width:'fit-content',background:'transparent',color:T.text,border:`1px solid rgba(200,210,225,0.7)`,padding:'9px 22px',cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'0.63rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:'8px',transition:'all 0.18s',marginTop:'auto'}}
        onMouseOver={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;e.currentTarget.style.background='rgba(29,72,200,0.05)';}}
        onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(200,210,225,0.7)';e.currentTarget.style.color=T.text;e.currentTarget.style.background='transparent';}}
      >Modify Date</button>
    </GlassCard>
  </>
);

// ==========================================
// LIVE CLOCK
// ==========================================
const LiveClock = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Clock>
      {time.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} · {time.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
    </Clock>
  );
};

// ==========================================
// ZOOM ANIMATION
// ==========================================
function animateZoom(app) {
  try {
    const cam = app.findObjectByName('Camera');
    if (!cam) return;
    cam.position.x = CAM_START.x;
    cam.position.y = CAM_START.y;
    cam.position.z = CAM_START.z;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      cam.position.x = CAM_START.x + (CAM_END.x - CAM_START.x) * ease;
      cam.position.y = CAM_START.y + (CAM_END.y - CAM_START.y) * ease;
      cam.position.z = CAM_START.z + (CAM_END.z - CAM_START.z) * ease;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } catch (_) {}
}

// ==========================================
// SCENE SWITCHER
// ==========================================
const SceneSwitcher = ({ mId }) => {
  const appOverall  = useRef(null);
  const appMachine1 = useRef(null);
  const prevMId     = useRef(null);
  const [loading, setLoading] = useState({ overall: true, machine1: true });

  const handleLoadOverall = (app) => {
    appOverall.current = app;
    setLoading(l => ({ ...l, overall: false }));
    animateZoom(app);
  };
  const handleLoadMachine1 = (app) => {
    appMachine1.current = app;
    setLoading(l => ({ ...l, machine1: false }));
  };

  useEffect(() => {
    if (prevMId.current === null) { prevMId.current = mId; return; }
    if (prevMId.current === mId) return;
    prevMId.current = mId;
    const app = mId === 'overall' ? appOverall.current : appMachine1.current;
    if (app) animateZoom(app);
  }, [mId]);

  const isOverall = mId === 'overall';
  const isLoading = isOverall ? loading.overall : loading.machine1;

  return (
    <>
      <SceneLayer $visible={isOverall}>
        <Suspense fallback={null}>
          <Spline scene={SCENES.overall} onLoad={handleLoadOverall} />
        </Suspense>
      </SceneLayer>
      <SceneLayer $visible={!isOverall}>
        <Suspense fallback={null}>
          <Spline scene={SCENES.machine1} onLoad={handleLoadMachine1} />
        </Suspense>
      </SceneLayer>
      <LoadingOverlay $visible={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
    </>
  );
};

// ==========================================
// MAIN LAYOUT
// ==========================================
const MainLayout = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { mId }    = useParams();
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  const bodyRef  = useRef(null);
  const [stageH, setStageH] = useState(null);
  const dragging = useRef(false);
  const startY   = useRef(0);
  const startH   = useRef(0);

  useEffect(() => {
    if (bodyRef.current) setStageH(Math.round(bodyRef.current.clientHeight * 0.52));
  }, []);

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    startY.current   = e.clientY;
    startH.current   = stageH || 0;
    document.body.style.cursor = 'ns-resize';
    e.preventDefault();
  }, [stageH]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !bodyRef.current) return;
      const delta = e.clientY - startY.current;
      const bodyH = bodyRef.current.clientHeight;
      setStageH(Math.max(80, Math.min(bodyH - 80, startH.current + delta)));
    };
    const onUp = () => { dragging.current = false; document.body.style.cursor = ''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const [statusIdx, setStatusIdx] = useState(0);
  const status = STATUSES[statusIdx];

  return (
    <>
      <GlobalStyle />
      <PageContainer>

        <Header>
          <HeaderLeft><VersionChip>v2.4</VersionChip></HeaderLeft>

          <BrandGroup>
            <LogoImg src={logoSrc} alt="SurpRice Logo" />
            <Title>SurpRice</Title>
            <TitlePipe>|</TitlePipe>
            <TitleSub>Factory Intelligence</TitleSub>
          </BrandGroup>

          <HeaderRight>
            <LivePill><GreenDot />Live</LivePill>
            <LiveClock />
          </HeaderRight>
        </Header>

        <ResizableBody ref={bodyRef}>
          <StageWrapper $h={stageH || 300}>
            <StageArea>
              <MachineSelector value={mId} onChange={e => navigate(`/${e.target.value}/${currentTab}`)}>
                <option value="overall">Overall Factory</option>
                <option value="machine1">Machine 01 — Assembly</option>
              </MachineSelector>

              <SceneSwitcher mId={mId} />

              <StageGradient />
              <StageFade />

              <StatusBadge $s={status} onClick={() => setStatusIdx(i => (i+1) % STATUSES.length)}>
                <StatusDot $s={status} />
                {STATUS_CONFIG[status].label}
              </StatusBadge>

              <ZoneLabel>Factory Floor · {mId === 'overall' ? 'All Zones' : 'Assembly Zone A'}</ZoneLabel>
            </StageArea>
          </StageWrapper>

          <DragHandle $dragging={dragging.current} onMouseDown={onMouseDown} />

          <BottomSection>
            <TabBar>
              <TabShimmer />
              <TabLink to={`/${mId}/dashboard`}>Dashboard</TabLink>
              <TabLink to={`/${mId}/ai-prediction`}>AI Prediction</TabLink>
              <TabLink to={`/${mId}/maintenance`}>Maintenance Schedule</TabLink>
            </TabBar>
            <ContentArea>
              <Routes>
                <Route path="dashboard"     element={<Dashboard mId={mId}/>}/>
                <Route path="ai-prediction" element={<AIPrediction mId={mId}/>}/>
                <Route path="maintenance"   element={<Maintenance/>}/>
              </Routes>
            </ContentArea>
          </BottomSection>
        </ResizableBody>

      </PageContainer>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:mId/*" element={<MainLayout />}/>
        <Route path="*" element={<Navigate to="/overall/dashboard" replace />}/>
      </Routes>
    </BrowserRouter>
  );
}

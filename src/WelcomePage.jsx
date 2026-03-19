import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Spline from '@splinetool/react-spline';
import { SCENES } from './styles/theme';

// ─── Error boundary — prevents Spline crash from killing the whole page ───────
class SplineErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return this.props.fallback || null;
    return this.props.children;
  }
}

// ─── Keyframes ─────────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const scanDown = keyframes`0%{top:-4%;opacity:.6}100%{top:105%;opacity:0}`;
const pulseG   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}50%{box-shadow:0 0 0 6px rgba(16,185,129,0)}`;
const pulseA   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.4)}50%{box-shadow:0 0 0 6px rgba(245,158,11,0)}`;
const ticker   = keyframes`0%{transform:translateX(0)}100%{transform:translateX(-50%)}`;
const logScrl  = keyframes`0%{transform:translateY(0)}100%{transform:translateY(-50%)}`;
const barIn    = keyframes`from{width:0}to{width:var(--w)}`;
const countUp  = keyframes`from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}`;
const traceM   = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const bootType = keyframes`from{width:0}to{width:100%}`;
const slideR   = keyframes`from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}`;
const shimmer  = keyframes`0%,96%,100%{opacity:1}97.5%{opacity:.3}`;
const spinKf   = keyframes`to{transform:rotate(360deg)}`;

// ─── Palette tokens ───────────────────────────────────────────────────────────
// bg:       #f8fafc  (near-white page)
// surface:  #ffffff  (cards)
// surface2: #f1f5f9  (alternate panels / ticker)
// border:   #e2e8f0
// text:     #0f172a
// textMid:  #475569
// textDim:  #94a3b8
// accent:   #2563eb  (blue primary)
// accentG:  #10b981  (green success)
// accentA:  #f59e0b  (amber warning)
// accentP:  #7c3aed  (purple profit)

const D = {
  score:78, status:'warning', speed:'11.1k kg/h',
  l1:92, l2:92, l3:91,
  avgTemp:'38.7', maxTemp:'41.6', avgVib:'1.0', maxVib:'1.3', avgLoad:'79.7', anomalies:2,
  risk:54, profit:125000, demand14:180, cap14:122, gap:48,
  a1t:'Consolidate Maintenance Window',
  a1d:'Combine Line 2 & 3 maintenance on Day 10 to avoid capacity deficit.',
  a1c:'RM 500', a1i:'Prevents est. RM 3,200 emergency shutdown cost',
  a2t:'Packaging Stock Alert',
  a2d:'Packaging bags will run out by Day 12 due to demand surge.',
  a2c:'RM 2,800', a2i:'Early procurement ensures continuous production',
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f1f5f9;
  font-family: 'Plus Jakarta Sans','DM Sans',sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
`;

// Subtle dot-grid background
const BgGrid = styled.div`
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.5;
`;
const BgOrb1 = styled.div`position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 68%);top:-12%;left:6%;pointer-events:none;z-index:0;`;
const BgOrb2 = styled.div`position:fixed;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 65%);bottom:0;right:4%;pointer-events:none;z-index:0;`;
const ScanA  = styled.div`position:fixed;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent 8%,rgba(37,99,235,.12) 50%,transparent 92%);animation:${scanDown} 7s ease-in-out infinite;pointer-events:none;z-index:1;`;

// Boot overlay — white
const BootOvl  = styled.div`position:fixed;inset:0;background:#f8fafc;z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;transition:opacity .6s ease,visibility .6s;opacity:${p=>p.$done?0:1};visibility:${p=>p.$done?'hidden':'visible'};`;
const BootIcon = styled.div`width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 4px 20px rgba(37,99,235,.14);margin-bottom:8px;animation:${fadeIn} .4s ease both;`;
const BootLines= styled.div`display:flex;flex-direction:column;gap:5px;width:420px;`;
const BootLine = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.54rem;color:${p=>p.$warn?'#d97706':'#2563eb'};letter-spacing:.06em;overflow:hidden;white-space:nowrap;width:0;animation:${bootType} .4s ${p=>p.$d}s steps(55,end) forwards;display:flex;gap:8px;&::before{content:'>';color:#94a3b8;flex-shrink:0}`;
const BootBar  = styled.div`width:420px;height:2px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-top:6px;`;
const BootFill = styled.div`height:100%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#10b981);width:${p=>p.$pct}%;transition:width .35s ease;`;
const BootStat = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.44rem;color:#94a3b8;letter-spacing:.16em;text-transform:uppercase;animation:${fadeIn} .4s 2.2s both;`;

// Navbar
const Navbar   = styled.header`position:relative;z-index:20;height:46px;flex-shrink:0;background:#ffffff;border-bottom:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06);display:flex;align-items:center;padding:0 18px;gap:12px;animation:${fadeIn} .4s .1s both;`;
const NavLogo  = styled.div`width:28px;height:28px;border-radius:7px;font-size:.85rem;background:linear-gradient(135deg,#dbeafe,#eff6ff);border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;flex-shrink:0;`;
const NavBrand = styled.div`font-size:.8rem;font-weight:800;color:#0f172a;flex-shrink:0;`;
const NavSep   = styled.div`width:1px;height:20px;background:#e2e8f0;flex-shrink:0;`;
const NavTag   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;padding:2px 8px;flex-shrink:0;`;
const NavVitals= styled.div`display:flex;align-items:center;gap:22px;flex:1;justify-content:center;`;
const NavVital = styled.div`display:flex;flex-direction:column;align-items:center;gap:1px;`;
const NavVLabel= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.34rem;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8;`;
const NavVValue= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.58rem;font-weight:700;color:${p=>p.$warn?'#d97706':p.$ok?'#059669':'#0f172a'};`;
const NavRight = styled.div`display:flex;align-items:center;gap:9px;flex-shrink:0;margin-left:auto;`;
const NavAvatar= styled.div`width:26px;height:26px;border-radius:7px;font-size:.68rem;background:linear-gradient(135deg,#dbeafe,#eff6ff);border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;`;
const NavUName = styled.div`font-size:.6rem;font-weight:700;color:#0f172a;line-height:1;`;
const NavURole = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.36rem;letter-spacing:.12em;text-transform:uppercase;color:#2563eb;margin-top:1px;`;
const GreenDot = styled.div`width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px rgba(16,185,129,.6);animation:${pulseG} 2.5s ease infinite;`;
const SmallDot = styled.div`width:5px;height:5px;border-radius:50%;background:#10b981;box-shadow:0 0 5px rgba(16,185,129,.5);animation:${pulseG} 2s ease infinite;`;

// Ticker
const TickerWrap = styled.div`height:22px;background:#f8fafc;border-bottom:1px solid #e2e8f0;overflow:hidden;display:flex;align-items:center;flex-shrink:0;z-index:10;`;
const TickerTrack= styled.div`display:flex;gap:50px;white-space:nowrap;animation:${ticker} 28s linear infinite;`;
const TickerItem = styled.span`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.46rem;color:${p=>p.$warn?'#d97706':p.$ok?'#059669':'#64748b'};letter-spacing:.07em;display:inline-flex;align-items:center;gap:5px;&::before{content:'';width:3px;height:3px;border-radius:50%;background:currentColor;flex-shrink:0}`;

// Main
const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 5;
  padding: 10px 16px 10px;
  gap: 8px;
  overflow: hidden;
`;

// KPI strip
const KpiStrip    = styled.div`display:flex;gap:8px;flex-shrink:0;`;
const KpiCard     = styled.div`
  flex:1;
  background:#ffffff;
  border:1px solid ${p=>p.$warn?'#fde68a':'#e2e8f0'};
  border-radius:10px;
  padding:12px 14px 10px;
  display:flex;flex-direction:column;gap:2px;
  position:relative;overflow:hidden;
  box-shadow:0 1px 4px rgba(0,0,0,.05);
  animation:${fadeUp} .5s ${p=>p.$d}s cubic-bezier(.34,1.4,.64,1) both;
`;
const KpiTopLine  = styled.div`position:absolute;top:0;left:0;right:0;height:3px;background:${p=>p.$c};border-radius:10px 10px 0 0;`;
const KpiLabel    = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.46rem;letter-spacing:.14em;text-transform:uppercase;color:${p=>p.$warn?'#d97706':'#64748b'};margin-top:2px;`;
const KpiValue    = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:2rem;font-weight:700;letter-spacing:-.03em;line-height:1;color:${p=>p.$warn?'#d97706':p.$c||'#0f172a'};animation:${countUp} .4s ${p=>p.$d+.15}s both;`;
const KpiUnit     = styled.span`font-size:.62rem;opacity:.5;margin-left:3px;font-weight:500;`;
const KpiSub      = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.4rem;color:#94a3b8;margin-top:2px;`;
const KpiBarTrack = styled.div`height:3px;background:#f1f5f9;border-radius:99px;overflow:hidden;margin-top:7px;`;
const KpiBarFill  = styled.div`height:100%;border-radius:99px;--w:${p=>p.$pct}%;width:var(--w);background:${p=>p.$c};animation:${barIn} .8s ${p=>p.$d+.2}s cubic-bezier(.34,1.2,.64,1) both;`;

// Middle row
const MidRow = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  min-height: 0;
`;

// Map panel — Spline 3D
const MapPanel    = styled.div`flex:1;min-width:0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;position:relative;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05);animation:${fadeUp} .5s .3s cubic-bezier(.34,1.4,.64,1) both;`;
const MapTopLn    = styled.div`position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#2563eb,#10b981);border-radius:12px 12px 0 0;z-index:6;`;
const MapHeader   = styled.div`position:absolute;top:0;left:0;right:0;padding:9px 11px 0;display:flex;align-items:center;justify-content:space-between;z-index:6;background:linear-gradient(to bottom,rgba(248,250,252,.95) 60%,transparent);`;
const MapTitle    = styled.div`font-size:.43rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#2563eb;display:flex;align-items:center;gap:5px;&::before{content:'';width:3px;height:9px;background:linear-gradient(180deg,#2563eb,#93c5fd);border-radius:2px}`;
const MapLiveTag  = styled.div`display:flex;align-items:center;gap:4px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.38rem;color:#64748b;letter-spacing:.1em;`;
const SplineWrap  = styled.div`position:absolute;inset:0;z-index:1;`;
const MapFooter   = styled.div`position:absolute;bottom:0;left:0;right:0;padding:0 10px 8px;display:flex;justify-content:center;gap:5px;z-index:6;background:linear-gradient(to top,rgba(248,250,252,.9) 50%,transparent);`;
const LineBadge   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.37rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;padding:2px 6px;`;
const SplineLoader= styled.div`position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:#f8fafc;transition:opacity .4s;opacity:${p=>p.$hide?0:1};pointer-events:${p=>p.$hide?'none':'auto'};`;
const SpinnerRing = styled.div`width:26px;height:26px;border-radius:50%;border:2px solid #e2e8f0;border-top-color:#2563eb;animation:${spinKf} .75s linear infinite;`;
const SplineFallback = styled.div`position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#f8fafc;`;
const SplineFallbackIcon = styled.div`font-size:2rem;opacity:.3;`;
const SplineFallbackText = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;color:#94a3b8;letter-spacing:.1em;`;

// Shared panel
const Panel     = styled.div`flex:1;min-width:0;min-height:0;background:#ffffff;border:1px solid ${p=>p.$warn?'#fde68a':'#e2e8f0'};border-radius:12px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 1px 4px rgba(0,0,0,.05);animation:${slideR} .5s ${p=>p.$d||.4}s cubic-bezier(.34,1.4,.64,1) both;`;
const PanelHead = styled.div`padding:8px 11px 7px;border-bottom:1px solid ${p=>p.$warn?'#fde68a':'#f1f5f9'};display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:${p=>p.$warn?'#fffbeb':'#f8fafc'};`;
const PanelTitle= styled.div`font-size:.43rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${p=>p.$warn?'#d97706':'#2563eb'};display:flex;align-items:center;gap:5px;&::before{content:'';width:3px;height:9px;background:${p=>p.$warn?'linear-gradient(180deg,#f59e0b,#fde68a)':'linear-gradient(180deg,#2563eb,#93c5fd)'};border-radius:2px}`;
const AlertBadge= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.46rem;font-weight:700;color:#d97706;background:#fef3c7;border:1px solid #fde68a;border-radius:4px;padding:1px 6px;animation:${pulseA} 2s ease infinite;`;
const PanelBody = styled.div`flex:1;min-height:0;overflow:hidden;`;

// Advisor rows
const AlertRow  = styled.div`padding:7px 11px;border-bottom:1px solid #f1f5f9;&:last-child{border:none}`;
const AlertTag  = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.39rem;font-weight:700;color:${p=>p.$blue?'#2563eb':'#d97706'};letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;`;
const AlertMsg  = styled.div`font-size:.51rem;color:#334155;line-height:1.45;`;
const AlertMeta = styled.div`font-size:.43rem;color:#64748b;margin-top:2px;line-height:1.35;`;
const AlertTime = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.37rem;color:#94a3b8;letter-spacing:.08em;margin-top:2px;`;

// Log rows
const LogScroller= styled.div`height:100%;overflow:hidden;mask-image:linear-gradient(to bottom,transparent,black 12%,black 88%,transparent);`;
const LogTrack  = styled.div`animation:${logScrl} 14s linear infinite;`;
const LogLine   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.43rem;color:${p=>p.$warn?'#d97706':'#475569'};line-height:1.9;padding:0 11px;display:flex;gap:7px;animation:${shimmer} 10s ${p=>p.$f}s infinite;`;
const LogTime   = styled.span`color:#94a3b8;`;
const LogTagEl  = styled.span`color:${p=>p.$warn?'#f59e0b':'#2563eb'};min-width:44px;font-weight:600;`;

// Bottom row
const BottomRow = styled.div`display:flex;gap:8px;flex-shrink:0;animation:${fadeUp} .5s .5s cubic-bezier(.34,1.4,.64,1) both;`;
const HeroCard  = styled.div`width:188px;flex-shrink:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;box-shadow:0 1px 4px rgba(0,0,0,.05);`;
const HeroGreet = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;letter-spacing:.2em;text-transform:uppercase;color:#10b981;margin-bottom:3px;`;
const HeroName  = styled.div`font-size:.95rem;font-weight:800;letter-spacing:-.025em;color:#0f172a;line-height:1.1;margin-bottom:2px;`;
const HeroSub   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.41rem;color:#64748b;letter-spacing:.03em;line-height:1.6;`;
const PrimaryBtn= styled.button`width:100%;padding:9px;background:linear-gradient(135deg,#1d4ed8,#2563eb);border:none;border-radius:7px;color:#fff;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.53rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;box-shadow:0 3px 12px rgba(37,99,235,.3),inset 0 1px 0 rgba(255,255,255,.1);transition:transform .15s,box-shadow .15s;&:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,.4)}&:active{transform:translateY(0)}`;
const GhostBtn  = styled.button`width:100%;padding:8px;background:transparent;border:1px solid #e2e8f0;border-radius:7px;color:#94a3b8;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.48rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s;&:hover{border-color:#fca5a5;color:#ef4444;background:#fef2f2}`;

const ModuleCard= styled.button`flex:1;min-width:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:11px 12px;text-align:left;cursor:pointer;position:relative;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s;display:flex;flex-direction:column;gap:5px;box-shadow:0 1px 3px rgba(0,0,0,.04);&:hover{transform:translateY(-2px);border-color:#bfdbfe;box-shadow:0 6px 20px rgba(37,99,235,.1)}`;
const ModuleGlow= styled.div`position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 0%,rgba(37,99,235,.04),transparent);pointer-events:none;opacity:0;transition:opacity .2s;${ModuleCard}:hover &{opacity:1}`;
const ModuleTopLn=styled.div`position:absolute;top:0;left:0;right:0;height:3px;background:${p=>p.$c};border-radius:10px 10px 0 0;`;
const ModuleIcon= styled.div`width:28px;height:28px;border-radius:7px;background:${p=>p.$bg};border:1px solid ${p=>p.$border};display:flex;align-items:center;justify-content:center;font-size:.85rem;`;
const ModuleName= styled.div`font-size:.62rem;font-weight:700;color:#0f172a;letter-spacing:-.01em;`;
const ModuleDesc= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.39rem;color:#64748b;line-height:1.5;`;
const ModuleFoot= styled.div`display:flex;align-items:center;justify-content:space-between;margin-top:1px;`;
const ModuleStat= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.41rem;font-weight:700;color:${p=>p.$c};background:${p=>p.$bg};border:1px solid ${p=>p.$border};border-radius:4px;padding:1px 6px;`;
const ModuleArrow=styled.div`font-size:.56rem;color:#94a3b8;transition:transform .2s,color .2s;${ModuleCard}:hover &{transform:translateX(3px);color:#2563eb}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [bootDone,     setBootDone]     = useState(false);
  const [bootPct,      setBootPct]      = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(()=>{
    const steps=[10,30,55,72,90,100], timings=[300,700,1100,1500,1900,2300];
    timings.forEach((t,i)=>setTimeout(()=>setBootPct(steps[i]),t));
    setTimeout(()=>setBootDone(true),2700);
  },[]);

  const userName = !user||user.email==='guest' ? 'Observer'
    : (user.email.split('@')[0]||'Operator').replace(/\./g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const isGuest = !user||user.email==='guest';

  const BOOT_LINES = [
    {msg:'Initialising SurpRice Digital Twin Platform v2.0…',                   d:.10},
    {msg:'Connecting factory telemetry — 3 lines · 12 machines',                d:.50},
    {msg:`Overall health: ${D.score}/100 · Status: ${D.status}`, warn:true,     d:.90},
    {msg:`L1:${D.l1} · L2:${D.l2} · L3:${D.l3} · Output: ${D.speed}`,         d:1.30},
    {msg:`AI Advisor: 2 actions · Day-14 gap +${D.gap}% · Risk: ${D.risk}/100`,warn:true,d:1.70},
    {msg:'Session authenticated · Welcome, Operator',                            d:2.10},
  ];

  const TICKER_ITEMS = [
    {l:'OVERALL HEALTH',v:`${D.score}/100 · ${D.status}`,warn:true},
    {l:'OUTPUT',v:D.speed,ok:true},{l:'LINE 1',v:`Score ${D.l1} · normal`,ok:true},
    {l:'LINE 2',v:`Score ${D.l2} · normal`,ok:true},{l:'LINE 3',v:`Score ${D.l3} · normal`,ok:true},
    {l:'AVG TEMP',v:`${D.avgTemp}°C  max ${D.maxTemp}°C`,ok:true},{l:'AVG VIB',v:`${D.avgVib} mm/s`,ok:true},
    {l:'AVG LOAD',v:`${D.avgLoad}%`,ok:true},{l:'ANOMALIES',v:`${D.anomalies} this hour`,warn:true},
    {l:'AI RISK',v:`${D.risk}/100`,warn:true},{l:'DAY-14 GAP',v:`${D.demand14} vs ${D.cap14} (+${D.gap}%)`,warn:true},
    {l:'30D PROFIT',v:`RM ${D.profit.toLocaleString()}`,ok:true},
  ];

  const KPI_ITEMS = [
    {label:'Overall Health',  val:`${D.score}`,unit:'/100',sub:`Status: ${D.status}`,         pct:D.score,warn:true, bar:'linear-gradient(90deg,#f59e0b,#fbbf24)',   topC:'linear-gradient(90deg,#f59e0b,#fbbf24)',   d:.28},
    {label:'Factory Output',  val:'11.1k',     unit:'kg/h',sub:'All 3 lines combined',         pct:82,     c:'#2563eb',bar:'linear-gradient(90deg,#2563eb,#60a5fa)', topC:'linear-gradient(90deg,#2563eb,#60a5fa)',   d:.33},
    {label:'Avg Temperature', val:D.avgTemp,   unit:'°C',  sub:`Max ${D.maxTemp}°C this hour`, pct:48,     c:'#059669', bar:'linear-gradient(90deg,#059669,#34d399)', topC:'linear-gradient(90deg,#059669,#34d399)',   d:.38},
    {label:'Avg Vibration',   val:D.avgVib,    unit:'mm/s',sub:`Max ${D.maxVib} mm/s`,         pct:33,     c:'#059669', bar:'linear-gradient(90deg,#059669,#34d399)', topC:'linear-gradient(90deg,#059669,#34d399)',   d:.43},
    {label:'AI Risk Index',   val:`${D.risk}`, unit:'/100',sub:`Day-14 gap +${D.gap}%`,        pct:D.risk, warn:true,  bar:'linear-gradient(90deg,#f59e0b,#fbbf24)',   topC:'linear-gradient(90deg,#f59e0b,#fbbf24)',   d:.48},
    {label:'30D Profit Est.', val:'125k',       unit:'RM',  sub:'2 AI actions pending',         pct:68,     c:'#7c3aed', bar:'linear-gradient(90deg,#7c3aed,#a78bfa)', topC:'linear-gradient(90deg,#7c3aed,#a78bfa)',   d:.53},
  ];

  const ALERT_ITEMS = [
    {blue:true, tag:'[AI ADVISOR]',msg:`${D.a1t} — ${D.a1d}`,meta:`Cost: ${D.a1c} · ${D.a1i}`,time:'Day 10 window'},
    {blue:true, tag:'[AI ADVISOR]',msg:`${D.a2t} — ${D.a2d}`,meta:`Cost: ${D.a2c} · ${D.a2i}`,time:'Before Day 12'},
    {blue:false,tag:'[ANOMALY]',   msg:'2 anomalies — temp spike at 09:22, load spike at 09:41',meta:'Line 3 vib 2.88 mm/s at 09:27',time:'09:22 · 09:27 · 09:41'},
  ];

  const LOG_ITEMS = [
    {ts:'09:00',tag:'[INFO]',msg:`Factory: ${D.speed} · Health: ${D.score}/100`,    warn:false,f:0  },
    {ts:'09:05',tag:'[INFO]',msg:`Line 1 score ${D.l1}/100 · normal`,               warn:false,f:1  },
    {ts:'09:09',tag:'[INFO]',msg:`Line 2 score ${D.l2}/100 · normal`,               warn:false,f:3  },
    {ts:'09:12',tag:'[INFO]',msg:`Line 3 score ${D.l3}/100 · normal`,               warn:false,f:.5 },
    {ts:'09:22',tag:'[WARN]',msg:'Anomaly — overall temp spike at min 22',           warn:true, f:2  },
    {ts:'09:27',tag:'[WARN]',msg:'Line 3 vibration 2.88 mm/s at min 27',            warn:true, f:.8 },
    {ts:'09:30',tag:'[INFO]',msg:`AI Advisor: ${D.a1t}`,                            warn:false,f:4  },
    {ts:'09:35',tag:'[INFO]',msg:`AI Advisor: ${D.a2t}`,                            warn:false,f:1  },
    {ts:'09:41',tag:'[WARN]',msg:'Anomaly — load spike 88% at min 41',              warn:true, f:1.2},
    {ts:'09:52',tag:'[WARN]',msg:'Line 3 vibration 3.14 mm/s at min 52',            warn:true, f:2.8},
    {ts:'09:58',tag:'[INFO]',msg:`30d profit RM ${D.profit.toLocaleString()} · Risk ${D.risk}/100`,warn:false,f:1.8},
  ];

  const MODULE_ITEMS = [
    {icon:'🖥️',name:'Machine Dashboard',desc:`Monitor all 12 machines. Score ${D.score}/100. All normal.`,              stat:'All Normal',      sc:'#2563eb', sbg:'#eff6ff', sb:'#bfdbfe', tc:'linear-gradient(90deg,#2563eb,#60a5fa)', ic:'#eff6ff', ib:'#bfdbfe', d:.38,path:'/overall/dashboard'},
    {icon:'🤖',name:'Machine AI',        desc:`Predict ROI & upgrades. L1:${D.l1} L2:${D.l2} L3:${D.l3}.`,              stat:'4 Models Ready',  sc:'#059669', sbg:'#ecfdf5', sb:'#a7f3d0', tc:'linear-gradient(90deg,#059669,#34d399)', ic:'#ecfdf5', ib:'#a7f3d0', d:.44,path:'/overall/ai-prediction'},
    {icon:'📊',name:'Production AI',     desc:`2 actions pending. Day-14: ${D.demand14} vs ${D.cap14}. RM ${D.profit.toLocaleString()}.`,stat:`+${D.gap}% Day-14`,sc:'#d97706', sbg:'#fffbeb', sb:'#fde68a', tc:'linear-gradient(90deg,#f59e0b,#fbbf24)', ic:'#fffbeb', ib:'#fde68a', d:.50,path:'/overall/ai-prediction'},
    {icon:'⚙️',name:'System Config',    desc:'3 lines · 12 machines · thresholds & operator access. v2.0.',              stat:'12 Machines',     sc:'#7c3aed', sbg:'#f5f3ff', sb:'#ddd6fe', tc:'linear-gradient(90deg,#7c3aed,#a78bfa)', ic:'#f5f3ff', ib:'#ddd6fe', d:.56,path:'/overall/dashboard'},
  ];

  return (
    <Root>
      <BgGrid/><BgOrb1/><BgOrb2/><ScanA/>

      {/* Boot */}
      <BootOvl $done={bootDone}>
        <BootIcon>🌾</BootIcon>
        <BootLines>{BOOT_LINES.map((l,i)=><BootLine key={i} $warn={l.warn} $d={l.d}>{l.msg}</BootLine>)}</BootLines>
        <BootBar><BootFill $pct={bootPct}/></BootBar>
        <BootStat>Loading platform… {bootPct}%</BootStat>
      </BootOvl>

      {/* Navbar */}
      <Navbar>
        <NavLogo>🌾</NavLogo>
        <NavBrand>SurpRice</NavBrand>
        <NavSep/>
        <NavTag>Digital Twin · v2.0</NavTag>
        <NavVitals>
          {[
            {label:'Overall',  val:`${D.score}/100`,      warn:true},
            {label:'Output',   val:D.speed,                ok:true},
            {label:'Avg Temp', val:`${D.avgTemp}°C`,       ok:true},
            {label:'Anomalies',val:`${D.anomalies} active`,warn:true},
            {label:'Risk Idx', val:`${D.risk}/100`,        warn:true},
          ].map(v=>(
            <NavVital key={v.label}>
              <NavVLabel>{v.label}</NavVLabel>
              <NavVValue $ok={v.ok} $warn={v.warn}>{v.val}</NavVValue>
            </NavVital>
          ))}
        </NavVitals>
        <NavRight>
          <GreenDot/>
          <NavAvatar>👤</NavAvatar>
          <div><NavUName>{userName}</NavUName><NavURole>{isGuest?'Observer':'Operator'}</NavURole></div>
        </NavRight>
      </Navbar>

      {/* Ticker */}
      <TickerWrap>
        <TickerTrack>
          {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
            <TickerItem key={i} $ok={t.ok} $warn={t.warn}>{t.l}&nbsp;·&nbsp;{t.v}</TickerItem>
          ))}
        </TickerTrack>
      </TickerWrap>

      <Main>

        {/* Row 1 — KPI cards */}
        <KpiStrip>
          {KPI_ITEMS.map(k=>(
            <KpiCard key={k.label} $warn={k.warn} $d={k.d}>
              <KpiTopLine $c={k.topC}/>
              <KpiLabel $warn={k.warn}>{k.label}</KpiLabel>
              <KpiValue $warn={k.warn} $c={k.c} $d={k.d}>{k.val}<KpiUnit>{k.unit}</KpiUnit></KpiValue>
              <KpiSub>{k.sub}</KpiSub>
              <KpiBarTrack><KpiBarFill $pct={k.pct} $c={k.bar} $d={k.d}/></KpiBarTrack>
            </KpiCard>
          ))}
        </KpiStrip>

        {/* Row 2 — Map | AI Advisor | Event Log */}
        <MidRow>

          {/* Live Factory Digital Twin — Spline 3D */}
          <MapPanel>
            <MapTopLn/>
            <MapHeader>
              <MapTitle>Live Factory Digital Twin</MapTitle>
              <MapLiveTag><SmallDot/>12 Machines · 3 Lines</MapLiveTag>
            </MapHeader>

            {/* Spline 3D scene */}
            <SplineWrap>
              <SplineErrorBoundary fallback={
                <SplineFallback>
                  <SplineFallbackIcon>🏭</SplineFallbackIcon>
                  <SplineFallbackText>3D scene unavailable</SplineFallbackText>
                </SplineFallback>
              }>
                <Suspense fallback={null}>
                  <Spline
                    scene={SCENES.factory}
                    onLoad={() => setSplineLoaded(true)}
                  />
                </Suspense>
              </SplineErrorBoundary>
            </SplineWrap>

            {/* Loading state — fades out once Spline is ready */}
            <SplineLoader $hide={splineLoaded}>
              <SpinnerRing />
            </SplineLoader>

            {/* Line score badges pinned to bottom */}
            <MapFooter>
              <LineBadge>L1 · {D.l1}</LineBadge>
              <LineBadge>L2 · {D.l2}</LineBadge>
              <LineBadge>L3 · {D.l3}</LineBadge>
            </MapFooter>
          </MapPanel>

          <Panel $warn $d={0.36}>
            <PanelHead $warn>
              <PanelTitle $warn>AI Advisor + Anomalies</PanelTitle>
              <AlertBadge>{ALERT_ITEMS.length}</AlertBadge>
            </PanelHead>
            <PanelBody>
              {ALERT_ITEMS.map((a,i)=>(
                <AlertRow key={i}>
                  <AlertTag $blue={a.blue}>{a.tag}</AlertTag>
                  <AlertMsg>{a.msg}</AlertMsg>
                  <AlertMeta>{a.meta}</AlertMeta>
                  <AlertTime>{a.time}</AlertTime>
                </AlertRow>
              ))}
            </PanelBody>
          </Panel>

          <Panel $d={0.42}>
            <PanelHead>
              <PanelTitle>System Event Log</PanelTitle>
              <SmallDot/>
            </PanelHead>
            <PanelBody>
              <LogScroller>
                <LogTrack>
                  {[...LOG_ITEMS,...LOG_ITEMS].map((l,i)=>(
                    <LogLine key={i} $warn={l.warn} $f={l.f}>
                      <LogTime>{l.ts}</LogTime>
                      <LogTagEl $warn={l.warn}>{l.tag}</LogTagEl>
                      {l.msg}
                    </LogLine>
                  ))}
                </LogTrack>
              </LogScroller>
            </PanelBody>
          </Panel>

        </MidRow>

        {/* Row 3 — Hero card + module cards */}
        <BottomRow>
          <HeroCard>
            <div>
              <HeroGreet>// Welcome back</HeroGreet>
              <HeroName>{userName}</HeroName>
              <HeroSub>
                Health: {D.score}/100 · {D.status}<br/>
                Output: {D.speed}<br/>
                2 AI actions pending
              </HeroSub>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <PrimaryBtn onClick={()=>navigate('/overall/dashboard')}>▶ Enter System</PrimaryBtn>
              <GhostBtn onClick={onLogout}>⏏ Sign Out</GhostBtn>
            </div>
          </HeroCard>

          {MODULE_ITEMS.map(m=>(
            <ModuleCard key={m.name} onClick={()=>navigate(m.path)}>
              <ModuleGlow/>
              <ModuleTopLn $c={m.tc}/>
              <ModuleIcon $bg={m.ic} $border={m.ib}>{m.icon}</ModuleIcon>
              <ModuleName>{m.name}</ModuleName>
              <ModuleDesc>{m.desc}</ModuleDesc>
              <ModuleFoot>
                <ModuleStat $c={m.sc} $bg={m.sbg} $border={m.sb}>{m.stat}</ModuleStat>
                <ModuleArrow>→</ModuleArrow>
              </ModuleFoot>
            </ModuleCard>
          ))}
        </BottomRow>

      </Main>
    </Root>
  );
}

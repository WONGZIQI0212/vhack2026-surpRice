import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// ─── Keyframes ─────────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const scanDown = keyframes`0%{top:-4%;opacity:.7}100%{top:105%;opacity:0}`;
const pulseG   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(0,255,160,.5)}50%{box-shadow:0 0 0 7px rgba(0,255,160,0)}`;
const pulseA   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(255,184,0,.5)}50%{box-shadow:0 0 0 7px rgba(255,184,0,0)}`;
const rotFwd   = keyframes`from{transform:rotate(0)}to{transform:rotate(360deg)}`;
const rotRev   = keyframes`from{transform:rotate(0)}to{transform:rotate(-360deg)}`;
const ticker   = keyframes`0%{transform:translateX(0)}100%{transform:translateX(-50%)}`;
const logScrl  = keyframes`0%{transform:translateY(0)}100%{transform:translateY(-50%)}`;
const barIn    = keyframes`from{width:0}to{width:var(--w)}`;
const countUp  = keyframes`from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}`;
const traceM   = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const bootType = keyframes`from{width:0}to{width:100%}`;
const slideR   = keyframes`from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}`;
const flicker  = keyframes`0%,96%,100%{opacity:1}97.5%{opacity:.1}`;

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

// ─── Root — 100vh, no scroll ──────────────────────────────────────────────────
const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #010408;
  font-family: 'Plus Jakarta Sans','DM Sans',sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BgGrid = styled.div`position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(0,255,160,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,160,.03) 1px,transparent 1px);background-size:52px 52px;`;
const BgOrb1 = styled.div`position:fixed;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(0,70,200,.09) 0%,transparent 68%);top:-10%;left:8%;pointer-events:none;z-index:0;`;
const BgOrb2 = styled.div`position:fixed;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,160,.06) 0%,transparent 65%);bottom:0;right:4%;pointer-events:none;z-index:0;`;
const ScanA  = styled.div`position:fixed;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 8%,rgba(0,255,160,.2) 50%,transparent 92%);animation:${scanDown} 6s ease-in-out infinite;pointer-events:none;z-index:1;`;
const ScanB  = styled.div`position:fixed;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent 8%,rgba(0,100,255,.15) 50%,transparent 92%);animation:${scanDown} 9s 3s ease-in-out infinite;pointer-events:none;z-index:1;`;

// Boot
const BootOvl  = styled.div`position:fixed;inset:0;background:#010408;z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;transition:opacity .6s ease,visibility .6s;opacity:${p=>p.$done?0:1};visibility:${p=>p.$done?'hidden':'visible'};`;
const BootIcon = styled.div`width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,rgba(0,80,200,.2),rgba(0,40,140,.1));border:1px solid rgba(0,100,255,.3);display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 0 22px rgba(0,80,255,.22);margin-bottom:8px;animation:${fadeIn} .4s ease both;`;
const BootLines= styled.div`display:flex;flex-direction:column;gap:5px;width:420px;`;
const BootLine = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.55rem;color:${p=>p.$warn?'#ffb800':'rgba(0,255,160,.72)'};letter-spacing:.06em;overflow:hidden;white-space:nowrap;width:0;animation:${bootType} .4s ${p=>p.$d}s steps(55,end) forwards;display:flex;gap:8px;&::before{content:'>';color:rgba(0,100,255,.4);flex-shrink:0}`;
const BootBar  = styled.div`width:420px;height:2px;background:rgba(255,255,255,.05);border-radius:99px;overflow:hidden;margin-top:6px;`;
const BootFill = styled.div`height:100%;border-radius:99px;background:linear-gradient(90deg,#003acc,#00ffa0);width:${p=>p.$pct}%;transition:width .35s ease;`;
const BootStat = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.46rem;color:rgba(0,255,160,.32);letter-spacing:.16em;text-transform:uppercase;animation:${fadeIn} .4s 2.2s both;`;

// Navbar
const Navbar   = styled.header`position:relative;z-index:20;height:46px;flex-shrink:0;background:rgba(1,4,8,.95);border-bottom:1px solid rgba(0,255,160,.08);display:flex;align-items:center;padding:0 18px;gap:12px;animation:${fadeIn} .4s .1s both;`;
const NavLogo  = styled.div`width:28px;height:28px;border-radius:7px;font-size:.85rem;background:rgba(0,80,200,.15);border:1px solid rgba(0,100,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;`;
const NavBrand = styled.div`font-size:.8rem;font-weight:800;color:#dce8ff;flex-shrink:0;`;
const NavSep   = styled.div`width:1px;height:20px;background:rgba(255,255,255,.06);flex-shrink:0;`;
const NavTag   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.44rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(0,255,160,.55);background:rgba(0,255,160,.06);border:1px solid rgba(0,255,160,.12);border-radius:4px;padding:2px 8px;flex-shrink:0;`;
const NavVitals= styled.div`display:flex;align-items:center;gap:20px;flex:1;justify-content:center;`;
const NavVital = styled.div`display:flex;flex-direction:column;align-items:center;gap:1px;`;
const NavVLabel= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.35rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(100,160,220,.32);`;
const NavVValue= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.6rem;font-weight:700;color:${p=>p.$warn?'#ffb800':p.$ok?'#00ffa0':'#dce8ff'};`;
const NavRight = styled.div`display:flex;align-items:center;gap:9px;flex-shrink:0;margin-left:auto;`;
const NavAvatar= styled.div`width:26px;height:26px;border-radius:7px;font-size:.68rem;background:linear-gradient(135deg,rgba(0,80,200,.3),rgba(0,40,140,.2));border:1px solid rgba(0,100,255,.3);display:flex;align-items:center;justify-content:center;`;
const NavUName = styled.div`font-size:.6rem;font-weight:700;color:#dce8ff;line-height:1;`;
const NavURole = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.38rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,100,255,.5);margin-top:1px;`;
const GreenDot = styled.div`width:7px;height:7px;border-radius:50%;background:#00ffa0;box-shadow:0 0 8px rgba(0,255,160,.8);animation:${pulseG} 2.5s ease infinite;`;
const SmallDot = styled.div`width:5px;height:5px;border-radius:50%;background:#00ffa0;box-shadow:0 0 7px rgba(0,255,160,.8);animation:${pulseG} 2s ease infinite;`;

// Ticker
const TickerWrap = styled.div`height:22px;background:rgba(0,0,0,.65);border-bottom:1px solid rgba(0,255,160,.07);overflow:hidden;display:flex;align-items:center;flex-shrink:0;z-index:10;`;
const TickerTrack= styled.div`display:flex;gap:50px;white-space:nowrap;animation:${ticker} 28s linear infinite;`;
const TickerItem = styled.span`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.48rem;color:${p=>p.$warn?'#ffb800':p.$ok?'rgba(0,255,160,.65)':'rgba(130,180,200,.35)'};letter-spacing:.07em;display:inline-flex;align-items:center;gap:6px;&::before{content:'';width:3px;height:3px;border-radius:50%;background:currentColor;flex-shrink:0}`;

// Main — fills height, column flex, no overflow
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
const KpiCard     = styled.div`flex:1;background:rgba(0,0,0,.42);border:1px solid ${p=>p.$warn?'rgba(255,184,0,.12)':'rgba(0,255,160,.07)'};border-radius:10px;padding:12px 14px 10px;display:flex;flex-direction:column;gap:2px;position:relative;overflow:hidden;animation:${fadeUp} .5s ${p=>p.$d}s cubic-bezier(.34,1.4,.64,1) both;`;
const KpiTopLine  = styled.div`position:absolute;top:0;left:0;right:0;height:2px;background:${p=>p.$c};background-size:200%;animation:${traceM} 3.5s linear infinite;`;
const KpiLabel    = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.48rem;letter-spacing:.16em;text-transform:uppercase;color:${p=>p.$warn?'rgba(255,184,0,.5)':'rgba(0,255,160,.45)'};`;
const KpiValue    = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:2rem;font-weight:700;letter-spacing:-.03em;line-height:1;color:${p=>p.$warn?'#ffb800':p.$c||'#00ffa0'};animation:${countUp} .4s ${p=>p.$d+.15}s both;`;
const KpiUnit     = styled.span`font-size:.65rem;opacity:.45;margin-left:3px;`;
const KpiSub      = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;color:rgba(100,160,180,.28);margin-top:2px;`;
const KpiBarTrack = styled.div`height:3px;background:rgba(255,255,255,.05);border-radius:99px;overflow:hidden;margin-top:7px;`;
const KpiBarFill  = styled.div`height:100%;border-radius:99px;--w:${p=>p.$pct}%;width:var(--w);background:${p=>p.$c};animation:${barIn} .8s ${p=>p.$d+.2}s cubic-bezier(.34,1.2,.64,1) both;`;

// Middle row — 3 columns side by side, fills remaining space
const MidRow = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  min-height: 0;
`;

// Map panel
const MapPanel  = styled.div`flex:1;min-width:0;background:rgba(0,0,0,.35);border:1px solid rgba(0,255,160,.08);border-radius:12px;position:relative;overflow:hidden;animation:${fadeUp} .5s .3s cubic-bezier(.34,1.4,.64,1) both;`;
const MapTopLn  = styled.div`position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(0,255,160,.5) 30%,rgba(0,100,255,.4) 70%,transparent);background-size:200%;animation:${traceM} 3.5s linear infinite;`;
const MapScanLn = styled.div`position:absolute;left:0;right:0;height:60px;background:linear-gradient(to bottom,transparent,rgba(0,255,160,.02),transparent);pointer-events:none;animation:${scanDown} 4.5s ease-in-out infinite;z-index:2;`;
const MapHeader = styled.div`position:absolute;top:0;left:0;right:0;padding:9px 11px 0;display:flex;align-items:center;justify-content:space-between;z-index:5;`;
const MapTitle  = styled.div`font-size:.44rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,255,160,.5);display:flex;align-items:center;gap:5px;&::before{content:'';width:3px;height:9px;background:linear-gradient(180deg,#00ffa0,rgba(0,255,160,.3));border-radius:2px}`;
const MapLiveTag= styled.div`display:flex;align-items:center;gap:4px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.4rem;color:rgba(0,255,160,.5);letter-spacing:.1em;`;
const MapSvg    = styled.svg`width:100%;height:100%;position:absolute;inset:0;`;
const HudCorner = styled.div`position:absolute;width:12px;height:12px;pointer-events:none;z-index:4;${p=>p.$tl&&'top:6px;left:6px;border-top:1.5px solid rgba(0,255,160,.2);border-left:1.5px solid rgba(0,255,160,.2);'}${p=>p.$tr&&'top:6px;right:6px;border-top:1.5px solid rgba(0,255,160,.2);border-right:1.5px solid rgba(0,255,160,.2);'}${p=>p.$bl&&'bottom:6px;left:6px;border-bottom:1.5px solid rgba(0,255,160,.16);border-left:1.5px solid rgba(0,255,160,.16);'}${p=>p.$br&&'bottom:6px;right:6px;border-bottom:1.5px solid rgba(0,255,160,.16);border-right:1.5px solid rgba(0,255,160,.16);'}`;
const RingWrap  = styled.div`position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;pointer-events:none;z-index:3;`;
const Ring      = styled.div`width:44px;height:44px;border-radius:50%;border:1px solid rgba(0,255,160,.14);position:relative;animation:${rotFwd} 22s linear infinite;&::before{content:'';position:absolute;inset:6px;border-radius:50%;border:1px dashed rgba(0,100,255,.14);animation:${rotRev} 13s linear infinite}&::after{content:'';position:absolute;top:-2px;left:50%;width:3px;height:3px;border-radius:50%;background:rgba(0,255,160,.9);box-shadow:0 0 6px rgba(0,255,160,.9);transform:translateX(-50%)}`;
const RingLabel = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.32rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(0,255,160,.24);text-align:center;`;
const LineBadgeRow= styled.div`position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:5;pointer-events:none;`;
const LineBadge = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.38rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(0,255,160,.7);background:rgba(0,0,0,.55);border:1px solid rgba(0,255,160,.18);border-radius:4px;padding:2px 6px;`;

// Shared side panel
const Panel     = styled.div`flex:1;min-width:0;min-height:0;background:rgba(0,0,0,.36);border:1px solid ${p=>p.$warn?'rgba(255,184,0,.1)':'rgba(0,100,255,.08)'};border-radius:12px;overflow:hidden;display:flex;flex-direction:column;animation:${slideR} .5s ${p=>p.$d||.4}s cubic-bezier(.34,1.4,.64,1) both;`;
const PanelHead = styled.div`padding:8px 11px 7px;border-bottom:1px solid ${p=>p.$warn?'rgba(255,184,0,.07)':'rgba(0,100,255,.07)'};display:flex;align-items:center;justify-content:space-between;flex-shrink:0;`;
const PanelTitle= styled.div`font-size:.44rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${p=>p.$warn?'rgba(255,184,0,.6)':'rgba(0,100,255,.52)'};display:flex;align-items:center;gap:5px;&::before{content:'';width:3px;height:9px;background:${p=>p.$warn?'linear-gradient(180deg,#ffb800,rgba(255,184,0,.3))':'linear-gradient(180deg,#0066ff,rgba(0,100,255,.3))'};border-radius:2px}`;
const AlertBadge= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.48rem;font-weight:700;color:#ffb800;background:rgba(255,184,0,.1);border:1px solid rgba(255,184,0,.18);border-radius:4px;padding:1px 6px;animation:${pulseA} 2s ease infinite;`;
const PanelBody = styled.div`flex:1;min-height:0;overflow:hidden;`;

// Advisor
const AlertRow  = styled.div`padding:7px 11px;border-bottom:1px solid rgba(255,255,255,.03);&:last-child{border:none}`;
const AlertTag  = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.4rem;font-weight:700;color:${p=>p.$blue?'rgba(0,140,255,.7)':'#ffb800'};letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;`;
const AlertMsg  = styled.div`font-size:.52rem;color:rgba(200,210,230,.42);line-height:1.4;`;
const AlertMeta = styled.div`font-size:.44rem;color:rgba(160,180,220,.26);margin-top:2px;line-height:1.35;`;
const AlertTime = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.38rem;color:rgba(100,140,200,.22);letter-spacing:.08em;margin-top:2px;`;

// Log
const LogScroller= styled.div`height:100%;overflow:hidden;mask-image:linear-gradient(to bottom,transparent,black 12%,black 88%,transparent);`;
const LogTrack  = styled.div`animation:${logScrl} 14s linear infinite;`;
const LogLine   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.44rem;color:${p=>p.$warn?'rgba(255,184,0,.5)':'rgba(0,255,160,.3)'};line-height:1.9;padding:0 11px;display:flex;gap:7px;animation:${flicker} 10s ${p=>p.$f}s infinite;`;
const LogTime   = styled.span`color:rgba(0,255,160,.15);`;
const LogTagEl  = styled.span`color:${p=>p.$warn?'rgba(255,184,0,.55)':'rgba(0,255,160,.42)'};min-width:44px;`;

// Bottom row
const BottomRow = styled.div`display:flex;gap:8px;flex-shrink:0;animation:${fadeUp} .5s .5s cubic-bezier(.34,1.4,.64,1) both;`;
const HeroCard  = styled.div`width:188px;flex-shrink:0;background:rgba(0,0,0,.42);border:1px solid rgba(0,100,255,.1);border-radius:10px;padding:12px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;`;
const HeroGreet = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.44rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(0,255,160,.38);margin-bottom:3px;`;
const HeroName  = styled.div`font-size:.95rem;font-weight:800;letter-spacing:-.025em;color:#dce8ff;line-height:1.1;margin-bottom:2px;`;
const HeroSub   = styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;color:rgba(100,140,210,.36);letter-spacing:.04em;line-height:1.55;`;
const PrimaryBtn= styled.button`width:100%;padding:9px;background:linear-gradient(135deg,#003acc,#0055ff);border:none;border-radius:7px;color:#fff;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.55rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 18px rgba(0,60,255,.38),inset 0 1px 0 rgba(255,255,255,.08);transition:transform .15s,box-shadow .15s;&:hover{transform:translateY(-1px);box-shadow:0 7px 24px rgba(0,60,255,.5)}&:active{transform:translateY(0)}`;
const GhostBtn  = styled.button`width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,.06);border-radius:7px;color:rgba(100,140,210,.36);font-family:'JetBrains Mono','Fira Code',monospace;font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s;&:hover{border-color:rgba(255,80,80,.25);color:rgba(255,80,80,.5);background:rgba(255,80,80,.04)}`;
const ModuleCard= styled.button`flex:1;min-width:0;background:rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:11px 12px;text-align:left;cursor:pointer;position:relative;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s;display:flex;flex-direction:column;gap:5px;&:hover{transform:translateY(-2px);border-color:rgba(0,100,255,.42);box-shadow:0 8px 26px rgba(0,40,200,.2)}`;
const ModuleGlow= styled.div`position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 0%,rgba(0,80,255,.07),transparent);pointer-events:none;opacity:0;transition:opacity .2s;${ModuleCard}:hover &{opacity:1}`;
const ModuleTopLn=styled.div`position:absolute;top:0;left:0;right:0;height:1px;background:${p=>p.$c};background-size:200%;animation:${traceM} 4s ${p=>p.$d}s linear infinite;`;
const ModuleIcon= styled.div`width:28px;height:28px;border-radius:7px;background:${p=>p.$bg};border:1px solid ${p=>p.$border};display:flex;align-items:center;justify-content:center;font-size:.85rem;`;
const ModuleName= styled.div`font-size:.64rem;font-weight:700;color:#dce8ff;letter-spacing:-.01em;`;
const ModuleDesc= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.4rem;color:rgba(100,140,210,.3);line-height:1.5;`;
const ModuleFoot= styled.div`display:flex;align-items:center;justify-content:space-between;margin-top:1px;`;
const ModuleStat= styled.div`font-family:'JetBrains Mono','Fira Code',monospace;font-size:.42rem;font-weight:700;color:${p=>p.$c};background:${p=>p.$bg};border:1px solid ${p=>p.$border};border-radius:4px;padding:1px 6px;`;
const ModuleArrow=styled.div`font-size:.58rem;color:rgba(0,100,255,.28);transition:transform .2s,color .2s;${ModuleCard}:hover &{transform:translateX(3px);color:rgba(0,100,255,.62)}`;

// ─── Factory map ──────────────────────────────────────────────────────────────
const MAP_NODES = [
  {id:'L1H',x:12,y:16,l:'L1-HSK'},{id:'L1M',x:30,y:12,l:'L1-MIL'},
  {id:'L1C',x:50,y:16,l:'L1-CNV'},{id:'L1P',x:70,y:12,l:'L1-PAL'},
  {id:'L2H',x:12,y:42,l:'L2-HSK'},{id:'L2M',x:30,y:38,l:'L2-MIL'},
  {id:'L2C',x:50,y:42,l:'L2-CNV'},{id:'L2P',x:70,y:38,l:'L2-PAL'},
  {id:'L3H',x:12,y:68,l:'L3-HSK'},{id:'L3M',x:30,y:64,l:'L3-MIL'},
  {id:'L3C',x:50,y:68,l:'L3-CNV'},{id:'L3P',x:70,y:64,l:'L3-PAL'},
  {id:'HUB',x:88,y:42,l:'CTRL'},
];
const MAP_EDGES = [
  ['L1H','L1M'],['L1M','L1C'],['L1C','L1P'],['L1P','HUB'],
  ['L2H','L2M'],['L2M','L2C'],['L2C','L2P'],['L2P','HUB'],
  ['L3H','L3M'],['L3M','L3C'],['L3C','L3P'],['L3P','HUB'],
];

function FactoryMap() {
  const nm = Object.fromEntries(MAP_NODES.map(n=>[n.id,n]));
  return (
    <MapSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="wgn"><feGaussianBlur stdDeviation=".55" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="wgh"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {[{t:'LINE 1',y:6},{t:'LINE 2',y:32},{t:'LINE 3',y:58}].map(({t,y})=>(
        <text key={t} x="1" y={y} fontSize="1.8" fill="rgba(0,255,160,.16)" fontFamily="monospace">{t}</text>
      ))}
      {MAP_EDGES.map(([a,b])=>{
        const na=nm[a],nb=nm[b];
        return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke={b==='HUB'?'rgba(0,255,160,.15)':'rgba(0,100,255,.15)'} strokeWidth=".22" strokeDasharray=".7,1.1"/>;
      })}
      {MAP_NODES.map(n=>{
        const isHub=n.id==='HUB',c=isHub?'#00ffa0':'#0088ff';
        return (
          <g key={n.id} filter={isHub?'url(#wgh)':'url(#wgn)'}>
            <circle cx={n.x} cy={n.y} r="2.1" fill="none" stroke={c} strokeWidth=".28" opacity=".4"/>
            <circle cx={n.x} cy={n.y} r=".88" fill={c}/>
            <text x={n.x} y={n.y-2.5} textAnchor="middle" fontSize="1.65" fill="rgba(100,160,255,.38)" fontFamily="monospace">{n.l}</text>
          </g>
        );
      })}
    </MapSvg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WelcomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [bootDone, setBootDone] = useState(false);
  const [bootPct,  setBootPct]  = useState(0);

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
    {label:'Overall Health',  val:`${D.score}`,unit:'/100',sub:`Status: ${D.status}`,         pct:D.score,warn:true,bar:'linear-gradient(90deg,#884400,#ffb800)',line:'linear-gradient(90deg,transparent,rgba(255,184,0,.5),transparent)',d:.28},
    {label:'Factory Output',  val:'11.1k',     unit:'kg/h',sub:'All 3 lines combined',         pct:82,     c:'#4488ff',bar:'linear-gradient(90deg,#003acc,#4488ff)',line:'linear-gradient(90deg,transparent,rgba(0,100,255,.5),transparent)',d:.33},
    {label:'Avg Temperature', val:D.avgTemp,   unit:'°C',  sub:`Max ${D.maxTemp}°C this hour`, pct:48,     c:'#00ff88',bar:'linear-gradient(90deg,#004400,#00ff88)',line:'linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)',d:.38},
    {label:'Avg Vibration',   val:D.avgVib,    unit:'mm/s',sub:`Max ${D.maxVib} mm/s`,         pct:33,     c:'#00ff88',bar:'linear-gradient(90deg,#004400,#00ff88)',line:'linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)',d:.43},
    {label:'AI Risk Index',   val:`${D.risk}`, unit:'/100',sub:`Day-14 gap +${D.gap}%`,        pct:D.risk, warn:true,  bar:'linear-gradient(90deg,#884400,#ffb800)',line:'linear-gradient(90deg,transparent,rgba(255,184,0,.5),transparent)',d:.48},
    {label:'30D Profit Est.', val:'125k',       unit:'RM',  sub:'2 AI actions pending',         pct:68,     c:'#aa66ff',bar:'linear-gradient(90deg,#1a0066,#8844ff)',line:'linear-gradient(90deg,transparent,rgba(136,68,255,.5),transparent)',d:.53},
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
    {icon:'🖥️',name:'Machine Dashboard',desc:`Monitor all 12 machines. Score ${D.score}/100. All normal.`,             stat:'All Normal',      sc:'rgba(0,100,255,.6)',  sbg:'rgba(0,60,180,.12)', sb:'rgba(0,100,255,.14)', tc:'linear-gradient(90deg,transparent,rgba(0,100,255,.5),transparent)',  ic:'rgba(0,60,180,.15)', ib:'rgba(0,100,255,.2)', d:.38,path:'/overall/dashboard'},
    {icon:'🤖',name:'Machine AI',       desc:`Predict ROI & upgrades. L1:${D.l1} L2:${D.l2} L3:${D.l3}.`,             stat:'4 Models Ready',  sc:'rgba(0,200,120,.6)',  sbg:'rgba(0,120,80,.12)', sb:'rgba(0,200,120,.14)', tc:'linear-gradient(90deg,transparent,rgba(0,200,120,.45),transparent)', ic:'rgba(0,100,60,.15)', ib:'rgba(0,200,120,.2)', d:.44,path:'/overall/ai-prediction'},
    {icon:'📊',name:'Production AI',    desc:`2 actions pending. Day-14: ${D.demand14} vs ${D.cap14}. RM ${D.profit.toLocaleString()}.`,stat:`+${D.gap}% Day-14`,sc:'rgba(200,140,0,.65)', sbg:'rgba(120,80,0,.12)',  sb:'rgba(200,140,0,.18)', tc:'linear-gradient(90deg,transparent,rgba(200,140,0,.5),transparent)',  ic:'rgba(100,60,0,.15)', ib:'rgba(200,140,0,.2)', d:.50,path:'/overall/ai-prediction'},
    {icon:'⚙️',name:'System Config',   desc:'3 lines · 12 machines · thresholds & operator access. v2.0.',             stat:'12 Machines',     sc:'rgba(100,100,200,.6)',sbg:'rgba(60,60,120,.12)',sb:'rgba(100,100,200,.14)',tc:'linear-gradient(90deg,transparent,rgba(120,120,220,.45),transparent)',ic:'rgba(60,60,120,.15)',ib:'rgba(100,100,200,.2)',d:.56,path:'/overall/dashboard'},
  ];

  return (
    <Root>
      <BgGrid/><BgOrb1/><BgOrb2/><ScanA/><ScanB/>

      <BootOvl $done={bootDone}>
        <BootIcon>🌾</BootIcon>
        <BootLines>{BOOT_LINES.map((l,i)=><BootLine key={i} $warn={l.warn} $d={l.d}>{l.msg}</BootLine>)}</BootLines>
        <BootBar><BootFill $pct={bootPct}/></BootBar>
        <BootStat>Loading platform… {bootPct}%</BootStat>
      </BootOvl>

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
              <KpiTopLine $c={k.line}/>
              <KpiLabel $warn={k.warn}>{k.label}</KpiLabel>
              <KpiValue $warn={k.warn} $c={k.c} $d={k.d}>{k.val}<KpiUnit>{k.unit}</KpiUnit></KpiValue>
              <KpiSub>{k.sub}</KpiSub>
              <KpiBarTrack><KpiBarFill $pct={k.pct} $c={k.bar} $d={k.d}/></KpiBarTrack>
            </KpiCard>
          ))}
        </KpiStrip>

        {/* Row 2 — THREE COLUMNS: Map | AI Advisor | Event Log */}
        <MidRow>

          {/* Live Factory Digital Twin */}
          <MapPanel>
            <MapTopLn/><MapScanLn/>
            <HudCorner $tl/><HudCorner $tr/><HudCorner $bl/><HudCorner $br/>
            <MapHeader>
              <MapTitle>Live Factory Digital Twin</MapTitle>
              <MapLiveTag><SmallDot/>12 Machines · 3 Lines</MapLiveTag>
            </MapHeader>
            <FactoryMap/>
            <RingWrap>
              <RingLabel>Ctrl Hub</RingLabel>
              <Ring/>
              <RingLabel style={{marginTop:3}}>Output {D.speed}</RingLabel>
            </RingWrap>
            <LineBadgeRow>
              <LineBadge>L1 · {D.l1}</LineBadge>
              <LineBadge>L2 · {D.l2}</LineBadge>
              <LineBadge>L3 · {D.l3}</LineBadge>
            </LineBadgeRow>
          </MapPanel>

          {/* AI Advisor + Anomalies */}
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

          {/* System Event Log */}
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

        {/* Row 3 — Hero card + module cards (unchanged) */}
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
              <ModuleTopLn $c={m.tc} $d={m.d}/>
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

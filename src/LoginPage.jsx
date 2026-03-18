import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import logoSrc from './assets/SurpRice_logo.svg';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const shimmer = keyframes`
  0%   { background-position: -400% center; }
  100% { background-position:  400% center; }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
`;

const scanLine = keyframes`
  0%   { top: 0%; opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
`;

const traceMove = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─── Root ─────────────────────────────────────────────────────────────────────
const Root = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #06080f;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
`;

// Geometric background grid
const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(23, 72, 200, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 72, 200, 0.06) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
  z-index: 0;
`;

// Radial glow behind card
const GlowOrb = styled.div`
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(23, 72, 200, 0.18) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
`;

// Second accent orb top-right
const GlowOrbAccent = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 180, 120, 0.12) 0%, transparent 65%);
  top: -80px;
  right: -60px;
  pointer-events: none;
  z-index: 0;
`;

// Decorative rotating ring
const RingDecor = styled.div`
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  border: 1px solid rgba(23, 72, 200, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 25px;
    border-radius: 50%;
    border: 1px dashed rgba(23, 72, 200, 0.08);
    animation: ${rotateSlow} 40s linear infinite;
  }
`;

// Scan line effect on bg
const ScanLineDecor = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(23,72,200,0.18), transparent);
  animation: ${scanLine} 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
`;

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 420px;
  background: rgba(12, 16, 28, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: 40px 38px 36px;
  box-shadow:
    0 0 0 1px rgba(23,72,200,0.15),
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 2px 0 rgba(255,255,255,0.04) inset;
  overflow: hidden;
  animation: ${fadeSlideUp} 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;

// Animated top border trace
const CardTopTrace = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #1748C8 30%, #10b47a 70%, transparent);
  background-size: 300% auto;
  animation: ${traceMove} 4s linear infinite;
`;

// Inner card scan
const CardScan = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, rgba(23,72,200,0.025), transparent);
  pointer-events: none;
  animation: ${scanLine} 5s ease-in-out infinite;
  z-index: 0;
`;

// Corner accent top-right
const CornerAccent = styled.div`
  position: absolute;
  top: 0; right: 0;
  width: 80px; height: 80px;
  border-top: 1.5px solid rgba(23,72,200,0.3);
  border-right: 1.5px solid rgba(23,72,200,0.3);
  border-radius: 0 24px 0 0;
  pointer-events: none;
`;

const CornerAccentBL = styled.div`
  position: absolute;
  bottom: 0; left: 0;
  width: 60px; height: 60px;
  border-bottom: 1.5px solid rgba(16,180,120,0.2);
  border-left: 1.5px solid rgba(16,180,120,0.2);
  border-radius: 0 0 0 24px;
  pointer-events: none;
`;

// ─── Branding ─────────────────────────────────────────────────────────────────
const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
  animation: ${fadeSlideUp} 0.55s 0.05s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;

const LogoWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(23,72,200,0.2), rgba(16,180,120,0.1));
  border: 1px solid rgba(23,72,200,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(23,72,200,0.2);
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const Title = styled.div`
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #e8ecf4 30%, #8aaeff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

const TitleSub = styled.div`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #1748C8;
`;

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  margin-bottom: 26px;
  animation: ${fadeIn} 0.5s 0.2s both;
`;

// ─── Labels + status ──────────────────────────────────────────────────────────
const SystemLabel = styled.div`
  text-align: center;
  margin-bottom: 6px;
  animation: ${fadeSlideUp} 0.5s 0.1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
`;

const SystemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #e8ecf4;
  letter-spacing: 0.02em;
  margin-bottom: 5px;
`;

const SystemSubtitle = styled.div`
  font-size: 0.62rem;
  color: rgba(180, 192, 220, 0.55);
  letter-spacing: 0.04em;
  line-height: 1.5;
  margin-bottom: 22px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s 0.15s both;
`;

const StatusDot = styled.div`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #10b47a;
  box-shadow: 0 0 8px rgba(16,180,122,0.7);
  animation: ${pulseDot} 2s ease infinite;
`;

const StatusText = styled.div`
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #10b47a;
`;

// ─── Form fields ──────────────────────────────────────────────────────────────
const FieldWrap = styled.div`
  position: relative;
  margin-bottom: 12px;
  animation: ${fadeSlideUp} 0.5s ${p => p.$delay}s cubic-bezier(0.34, 1.2, 0.64, 1) both;
`;

const FieldIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  opacity: 0.4;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 13px 14px 13px 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${p => p.$focused
    ? 'rgba(23,72,200,0.6)'
    : 'rgba(255,255,255,0.08)'};
  border-radius: 11px;
  color: #e8ecf4;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: ${p => p.$focused
    ? '0 0 0 3px rgba(23,72,200,0.12)'
    : 'none'};

  &::placeholder {
    color: rgba(180,192,220,0.3);
    font-size: 0.75rem;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(12,16,28,0.95) inset;
    -webkit-text-fill-color: #e8ecf4;
  }
`;

// ─── Buttons ──────────────────────────────────────────────────────────────────
const LoginBtn = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  border: none;
  border-radius: 11px;
  background: ${p => p.$disabled
    ? 'rgba(23,72,200,0.25)'
    : 'linear-gradient(135deg, #1748C8, #3766f0)'};
  background-size: 200% auto;
  color: ${p => p.$disabled ? 'rgba(255,255,255,0.3)' : '#fff'};
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${p => p.$disabled ? 'none' : '0 6px 20px rgba(23,72,200,0.4)'};
  transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
  position: relative;
  overflow: hidden;
  animation: ${fadeSlideUp} 0.5s 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;

  &:hover:not([disabled]) {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(23,72,200,0.5);
  }

  &:active:not([disabled]) {
    transform: translateY(0);
  }

  /* Shimmer sweep on hover */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transform: translateX(-100%);
    transition: transform 0.4s;
  }
  &:hover::after {
    transform: translateX(100%);
  }
`;

const GuestBtn = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 11px;
  color: rgba(180,192,220,0.6);
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  animation: ${fadeSlideUp} 0.5s 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;

  &:hover {
    border-color: rgba(23,72,200,0.45);
    color: #8aaeff;
    background: rgba(23,72,200,0.06);
  }
`;

// ─── Footer tag ───────────────────────────────────────────────────────────────
const FooterTag = styled.div`
  text-align: center;
  margin-top: 22px;
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.1);
  animation: ${fadeIn} 0.5s 0.5s both;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) return;
    onLogin({ email });
    navigate('/overall/dashboard');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const canSubmit = email.length > 0 && password.length > 0;

  return (
    <Root>
      <GridBg />
      <GlowOrb />
      <GlowOrbAccent />
      <RingDecor />
      <ScanLineDecor />

      <Card>
        <CardTopTrace />
        <CardScan />
        <CornerAccent />
        <CornerAccentBL />

        {/* Branding */}
        <BrandGroup>
          <LogoWrap>
            <LogoImg src={logoSrc} alt="SurpRice Logo" />
          </LogoWrap>
          <TitleGroup>
            <Title>SurpRice</Title>
            <TitleSub>Factory Intelligence</TitleSub>
          </TitleGroup>
        </BrandGroup>

        <Divider />

        <SystemLabel>
          <SystemTitle>AI Factory Optimizer</SystemTitle>
          <SystemSubtitle>
            Intelligent Production Planning &amp; Machine Optimization
          </SystemSubtitle>
        </SystemLabel>

        <StatusRow>
          <StatusDot />
          <StatusText>All Systems Operational</StatusText>
        </StatusRow>

        {/* Email */}
        <FieldWrap $delay={0.18}>
          <FieldIcon>✉</FieldIcon>
          <StyledInput
            type="email"
            placeholder="Email address"
            value={email}
            $focused={focusField === 'email'}
            onFocus={() => setFocusField('email')}
            onBlur={() => setFocusField(null)}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FieldWrap>

        {/* Password */}
        <FieldWrap $delay={0.23}>
          <FieldIcon>🔒</FieldIcon>
          <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            $focused={focusField === 'password'}
            onFocus={() => setFocusField('password')}
            onBlur={() => setFocusField(null)}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FieldWrap>

        <LoginBtn
          onClick={handleLogin}
          $disabled={!canSubmit}
          disabled={!canSubmit}
        >
          Enter System
        </LoginBtn>

        <GuestBtn onClick={() => { onLogin({ email: 'guest' }); navigate('/overall/dashboard'); }}>
          Continue as Guest
        </GuestBtn>

        <FooterTag>SurpRice · Secure Access · v2.0</FooterTag>
      </Card>
    </Root>
  );
}

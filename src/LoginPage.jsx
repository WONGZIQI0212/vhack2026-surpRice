import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
`;

const scanLine = keyframes`
  0%   { top: 0%; opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
`;

const traceMove = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
`;

// ─── Root ─────────────────────────────────────────────────────────────────────
const Root = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
`;

// Subtle dot-grid background
const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
`;

// Soft blue glow behind card
const GlowOrb = styled.div`
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
`;

// Accent green orb top-right
const GlowOrbAccent = styled.div`
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%);
  top: -80px;
  right: -60px;
  pointer-events: none;
  z-index: 0;
`;

// Decorative ring
const RingDecor = styled.div`
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  border: 1px solid rgba(37,99,235,0.08);
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
    border: 1px dashed rgba(37,99,235,0.06);
    animation: ${rotateSlow} 40s linear infinite;
  }
`;

// Scan line over background
const ScanLineDecor = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(37,99,235,0.1), transparent);
  animation: ${scanLine} 7s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
`;

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 420px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 40px 38px 36px;
  box-shadow:
    0 4px 6px rgba(0,0,0,.04),
    0 20px 60px rgba(37,99,235,.08),
    0 1px 0 rgba(255,255,255,.9) inset;
  overflow: hidden;
  animation: ${fadeSlideUp} 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) both;
`;

// Animated top gradient bar
const CardTopTrace = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #10b981, #2563eb);
  background-size: 300% auto;
  animation: ${traceMove} 4s linear infinite;
  border-radius: 24px 24px 0 0;
`;

// Corner accent top-right
const CornerAccent = styled.div`
  position: absolute;
  top: 0; right: 0;
  width: 80px; height: 80px;
  border-top: 1.5px solid rgba(37,99,235,.15);
  border-right: 1.5px solid rgba(37,99,235,.15);
  border-radius: 0 24px 0 0;
  pointer-events: none;
`;

const CornerAccentBL = styled.div`
  position: absolute;
  bottom: 0; left: 0;
  width: 60px; height: 60px;
  border-bottom: 1.5px solid rgba(16,185,129,.15);
  border-left: 1.5px solid rgba(16,185,129,.15);
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
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(37,99,235,.14);
  flex-shrink: 0;
  animation: ${float} 4s ease-in-out infinite;
`;

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #0f172a;
  line-height: 1;
`;

const TitleSub = styled.div`
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #2563eb;
`;

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin-bottom: 26px;
  animation: ${fadeIn} 0.5s 0.2s both;
`;

// ─── System info ──────────────────────────────────────────────────────────────
const SystemLabel = styled.div`
  text-align: center;
  animation: ${fadeSlideUp} 0.5s 0.1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
`;

const SystemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.01em;
  margin-bottom: 5px;
`;

const SystemSubtitle = styled.div`
  font-size: 0.6rem;
  color: #64748b;
  letter-spacing: 0.03em;
  line-height: 1.6;
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
  background: #10b981;
  box-shadow: 0 0 7px rgba(16,185,129,.55);
  animation: ${pulseDot} 2s ease infinite;
`;

const StatusText = styled.div`
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #10b981;
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
  font-size: 0.78rem;
  opacity: 0.35;
  pointer-events: none;
`;

const FieldLabel = styled.div`
  font-size: 0.48rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 5px;
  padding-left: 2px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 14px 12px 40px;
  background: ${p => p.$focused ? '#ffffff' : '#f8fafc'};
  border: 1.5px solid ${p => p.$focused ? '#2563eb' : '#e2e8f0'};
  border-radius: 10px;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: ${p => p.$focused
    ? '0 0 0 3px rgba(37,99,235,.1)'
    : '0 1px 2px rgba(0,0,0,.04)'};

  &::placeholder {
    color: #94a3b8;
    font-size: 0.74rem;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f8fafc inset;
    -webkit-text-fill-color: #0f172a;
  }
`;

// ─── Buttons ──────────────────────────────────────────────────────────────────
const LoginBtn = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: ${p => p.$disabled
    ? '#e2e8f0'
    : 'linear-gradient(135deg, #1d4ed8, #2563eb)'};
  color: ${p => p.$disabled ? '#94a3b8' : '#ffffff'};
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${p => p.$disabled ? 'none' : '0 4px 14px rgba(37,99,235,.3), inset 0 1px 0 rgba(255,255,255,.12)'};
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
  overflow: hidden;
  animation: ${fadeSlideUp} 0.5s 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;

  &:hover:not([disabled]) {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(37,99,235,.38);
  }
  &:active:not([disabled]) {
    transform: translateY(0);
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
    transform: translateX(-100%);
    transition: transform 0.4s;
  }
  &:hover::after { transform: translateX(100%); }
`;

const GuestBtn = styled.button`
  width: 100%;
  padding: 11px;
  margin-top: 10px;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  animation: ${fadeSlideUp} 0.5s 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;

  &:hover {
    border-color: #bfdbfe;
    color: #2563eb;
    background: #eff6ff;
  }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────
const FooterTag = styled.div`
  text-align: center;
  margin-top: 22px;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cbd5e1;
  animation: ${fadeIn} 0.5s 0.5s both;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
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
          <FieldLabel>Email address</FieldLabel>
          <FieldIcon>✉</FieldIcon>
          <StyledInput
            type="email"
            placeholder="you@company.com"
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
          <FieldLabel>Password</FieldLabel>
          <FieldIcon>🔒</FieldIcon>
          <StyledInput
            type="password"
            placeholder="••••••••"
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
          ▶ Enter System
        </LoginBtn>

        <GuestBtn
          onClick={() => { onLogin({ email: 'guest' }); navigate('/overall/dashboard'); }}
        >
          Continue as Guest
        </GuestBtn>

        <FooterTag>SurpRice · Secure Access · v2.0</FooterTag>
      </Card>
    </Root>
  );
}
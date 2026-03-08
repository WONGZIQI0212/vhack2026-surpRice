import React from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';
import { pulse } from '../../styles/animations';
import logoSrc from '../../assets/SurpRice_logo.svg';

const HeaderWrap = styled.header`
  height: 7vh;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${T.surface};
  border-bottom: 1px solid ${T.border};
  position: relative;
  z-index: 10;
  box-shadow: 0 1px 0 ${T.border}, 0 4px 20px rgba(13,17,23,0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${T.accent}, ${T.accentM} 60%, transparent);
  }
`;

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

const HeaderLeft = styled.div`
  position: absolute;
  left: 24px;
  display: flex;
  align-items: center;
`;

const VersionChip = styled.div`
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.accent};
  background: ${T.accentL};
  border: 1px solid rgba(55,102,240,0.2);
  border-radius: 4px;
  padding: 2px 7px;
`;

const HeaderRight = styled.div`
  position: absolute;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LivePill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(5,150,105,0.07);
  border: 1px solid rgba(5,150,105,0.18);
  border-radius: 20px;
  padding: 4px 11px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.success};
`;

const GreenDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${T.success};
  animation: ${pulse} 2s ease infinite;
  display: inline-block;
  flex-shrink: 0;
`;

const Clock = styled.div`
  font-size: 0.62rem;
  font-weight: 500;
  color: ${T.muted};
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
`;

const LiveClock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Clock>
      {time.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}{' '}
      ·{' '}
      {time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </Clock>
  );
};

export default function Header() {
  return (
    <HeaderWrap>
      <HeaderLeft>
        <VersionChip>v2.4</VersionChip>
      </HeaderLeft>

      <BrandGroup>
        <LogoImg src={logoSrc} alt="SurpRice Logo" />
        <Title>SurpRice</Title>
        <TitlePipe>|</TitlePipe>
        <TitleSub>Factory Intelligence</TitleSub>
      </BrandGroup>

      <HeaderRight>
        <LivePill>
          <GreenDot />
          Live
        </LivePill>
        <LiveClock />
      </HeaderRight>
    </HeaderWrap>
  );
}
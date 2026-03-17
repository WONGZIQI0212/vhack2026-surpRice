import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { T } from '../../styles/theme';

const ZONE_NAMES = {
  overall: 'All Zones',
  line1: 'Production Line 1',
  line2: 'Production Line 2',
  line3: 'Production Line 3',
  'line1-husker': 'Paddy Husker 01',
  'line1-milling': 'Rice Milling Unit 01',
  'line1-conveyor': 'Conveyor Belt 01',
  'line1-palletize': 'Palletizing Robot 01',
  'line2-husker': 'Paddy Husker 02',
  'line2-milling': 'Rice Milling Unit 02',
  'line2-conveyor': 'Conveyor Belt 02',
  'line2-palletize': 'Palletizing Robot 02',
  'line3-husker': 'Paddy Husker 03',
  'line3-milling': 'Rice Milling Unit 03',
  'line3-conveyor': 'Conveyor Belt 03',
  'line3-palletize': 'Palletizing Robot 03',
};

const ChatShell = styled.div`
  position: relative;
  width: 52px;
  display: flex;
  justify-content: flex-end;
`;

const MiniChatButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.94);
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 10px 24px rgba(13, 17, 23, 0.12),
    0 2px 6px rgba(13, 17, 23, 0.05);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  color: ${T.accent};

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      0 14px 28px rgba(13, 17, 23, 0.14),
      0 2px 8px rgba(13, 17, 23, 0.06);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
  }
`;

const MiniBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: #fff;
  font-size: 0.52rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.28);
`;

const FloatingPanel = styled.div`
  position: fixed;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
  width: 338px;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.18),
    0 8px 22px rgba(15, 23, 42, 0.08);
  animation: popIn 0.2s ease;
  z-index: 999999;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ChatHeader = styled.div`
  padding: 12px 12px 10px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.62) 100%);
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const ChatTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ChatTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, ${T.accent}, ${T.accentM});
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.76rem;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(55, 102, 240, 0.22);
`;

const ChatTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  color: ${T.text};
`;

const ChatSub = styled.div`
  margin-top: 2px;
  font-size: 0.61rem;
  color: ${T.sub};
  line-height: 1.35;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.18);
  color: #059669;
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.92);
  background: rgba(255,255,255,0.94);
  color: ${T.muted};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    color: ${T.text};
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
  }
`;

const ChatBody = styled.div`
  padding: 10px 10px 8px;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: 160px;
  max-height: 330px;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.85);
    border-radius: 999px;
  }
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
`;

const UserBubble = styled.div`
  max-width: 84%;
  padding: 10px 12px;
  border-radius: 15px;
  font-size: 0.68rem;
  line-height: 1.55;
  border: 1px solid rgba(55,102,240,0.18);
  background: linear-gradient(135deg, rgba(55,102,240,0.10), rgba(55,102,240,0.18));
  color: ${T.text};
  box-shadow: 0 4px 12px rgba(13, 17, 23, 0.05);
`;

const AssistantBubble = styled.div`
  max-width: 86%;
  padding: 10px 12px;
  border-radius: 15px;
  font-size: 0.68rem;
  line-height: 1.55;
  border: 1px solid rgba(226,232,240,0.85);
  background: rgba(255,255,255,0.94);
  color: ${T.sub};
  box-shadow: 0 4px 12px rgba(13, 17, 23, 0.05);
`;

const InsightCard = styled.div`
  width: 100%;
  border-radius: 16px;
  padding: 12px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%);
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow:
    0 10px 22px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.85);
`;

const InsightTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`;

const InsightTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightEmoji = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(55,102,240,0.08);
  font-size: 0.95rem;
`;

const InsightTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  color: ${T.text};
  line-height: 1.25;
`;

const InsightSub = styled.div`
  margin-top: 2px;
  font-size: 0.58rem;
  color: ${T.muted};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const RiskBadge = styled.div`
  flex-shrink: 0;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 0.54rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) =>
    p.$risk === 'high' ? '#b91c1c' : p.$risk === 'medium' ? '#b45309' : '#047857'};
  background: ${(p) =>
    p.$risk === 'high'
      ? 'rgba(239,68,68,0.10)'
      : p.$risk === 'medium'
        ? 'rgba(245,158,11,0.12)'
        : 'rgba(16,185,129,0.10)'};
  border: 1px solid
    ${(p) =>
      p.$risk === 'high'
        ? 'rgba(239,68,68,0.18)'
        : p.$risk === 'medium'
          ? 'rgba(245,158,11,0.18)'
          : 'rgba(16,185,129,0.18)'};
`;

const InsightText = styled.div`
  font-size: 0.67rem;
  line-height: 1.6;
  color: ${T.sub};
  margin-bottom: 11px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 11px;
`;

const MetricCard = styled.div`
  border-radius: 12px;
  padding: 8px;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(226,232,240,0.9);
`;

const MetricLabel = styled.div`
  font-size: 0.53rem;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;

const MetricValue = styled.div`
  font-size: 0.76rem;
  font-weight: 800;
  color: ${T.text};
`;

const TrendWrap = styled.div`
  margin-bottom: 11px;
`;

const TrendLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const TrendLabel = styled.div`
  font-size: 0.58rem;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const TrendHint = styled.div`
  font-size: 0.58rem;
  color: ${T.sub};
`;

const TrendBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 52px;
  padding: 8px 8px 6px;
  border-radius: 12px;
  background: rgba(248,250,252,0.95);
  border: 1px solid rgba(226,232,240,0.9);
`;

const TrendBar = styled.div`
  flex: 1;
  border-radius: 999px;
  height: ${(p) => p.$h}%;
  min-height: 10px;
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(180deg, rgba(59,130,246,0.92), rgba(37,99,235,0.72))'
      : 'linear-gradient(180deg, rgba(191,219,254,0.9), rgba(147,197,253,0.55))'};
  box-shadow: ${(p) => (p.$active ? '0 6px 14px rgba(37,99,235,0.18)' : 'none')};
`;

const InsightFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 2px;
`;

const Confidence = styled.div`
  font-size: 0.6rem;
  color: ${T.sub};
`;

const ConfidenceStrong = styled.span`
  font-weight: 800;
  color: ${T.text};
`;

const ActionPill = styled.div`
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(55,102,240,0.08);
  border: 1px solid rgba(55,102,240,0.14);
  color: ${T.accent};
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const ChatFooter = styled.div`
  padding: 10px;
  border-top: 1px solid rgba(226, 232, 240, 0.72);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QuickActionWrap = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const QuickAction = styled.button`
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, rgba(55,102,240,0.12), rgba(55,102,240,0.18))'
      : 'rgba(248,250,252,0.95)'};
  color: ${(p) => (p.$active ? T.accent : T.muted)};
  font-size: 0.58rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;

  &:hover {
    color: ${T.text};
    transform: translateY(-1px);
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FakeInput = styled.div`
  flex: 1;
  height: 40px;
  border-radius: 13px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: ${T.sub};
  font-size: 0.66rem;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);
`;

const SendBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 13px;
  border: none;
  background: linear-gradient(135deg, ${T.accent}, ${T.accentM});
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(55, 102, 240, 0.22);
  transition: transform 0.16s ease;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    width: 15px;
    height: 15px;
    stroke: currentColor;
  }
`;

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

function buildTrendBars(risk = 'low') {
  if (risk === 'high') return [34, 42, 48, 55, 69, 81, 92];
  if (risk === 'medium') return [28, 31, 35, 42, 47, 54, 61];
  return [20, 22, 21, 24, 26, 25, 27];
}

function createInsightCard(action, { mId, healthData, currentStatus }) {
  const machineName = ZONE_NAMES[mId] || mId;
  const tempValue = parseFloat(healthData?.temp || '0');
  const speed = healthData?.speed || 'Normal';

  if (action === 'Root cause') {
    const risk = mId === 'overall' ? 'medium' : tempValue >= 65 ? 'high' : 'low';
    return {
      role: 'assistant',
      kind: 'insight',
      emoji: risk === 'high' ? '🚨' : risk === 'medium' ? '🧠' : '✅',
      title: 'Root Cause Analysis',
      subtitle: mId === 'overall' ? 'Factory-wide inference' : machineName,
      risk,
      text:
        mId === 'overall'
          ? 'AI clustering indicates the highest abnormality concentration around Line 2, especially where thermal load and throughput variability move together.'
          : tempValue >= 65
            ? `${machineName} shows signs of overload stress. Probable causes include airflow restriction, motor strain, bearing friction, or unstable input feed.`
            : `${machineName} does not show a dominant failure signature. Current sensor behaviour remains close to expected baseline.`,
      metrics: [
        { label: 'Temp', value: healthData?.temp || '--' },
        { label: 'Speed', value: speed },
        { label: 'Risk', value: risk.toUpperCase() },
      ],
      bars: buildTrendBars(risk),
      confidence: risk === 'high' ? 91 : risk === 'medium' ? 84 : 76,
      action: risk === 'high' ? 'Inspect now' : 'Monitor pattern',
    };
  }

  if (action === 'Maintenance tips') {
    const risk = tempValue >= 65 ? 'high' : 'low';
    return {
      role: 'assistant',
      kind: 'insight',
      emoji: '🛠️',
      title: 'Maintenance Recommendation',
      subtitle: mId === 'overall' ? 'Operational recommendation' : machineName,
      risk,
      text:
        tempValue >= 65
          ? 'Preventive maintenance should be prioritised. Inspect ventilation path, bearing condition, cooling efficiency, and load balance before the next production surge.'
          : 'No urgent maintenance escalation needed. Keep the current PM cycle, validate sensor consistency, and compare with the historical trend window.',
      metrics: [
        { label: 'Priority', value: tempValue >= 65 ? 'HIGH' : 'NORMAL' },
        { label: 'Window', value: tempValue >= 65 ? '< 24h' : 'Scheduled' },
        { label: 'Status', value: currentStatus?.toUpperCase?.() || 'LIVE' },
      ],
      bars: buildTrendBars(risk),
      confidence: tempValue >= 65 ? 89 : 78,
      action: tempValue >= 65 ? 'Create PM ticket' : 'Keep schedule',
    };
  }

  if (action === 'Trend summary') {
    const risk = mId === 'overall' ? 'medium' : tempValue >= 65 ? 'high' : 'low';
    return {
      role: 'assistant',
      kind: 'insight',
      emoji: '📈',
      title: 'Trend Analysis',
      subtitle: mId === 'overall' ? 'Recent monitoring window' : machineName,
      risk,
      text:
        mId === 'overall'
          ? 'The recent trend shows Line 2 risk increasing faster than Line 1 and Line 3. The deviation pattern suggests a growing operational imbalance rather than a one-off spike.'
          : tempValue >= 65
            ? `${machineName} shows a rising heat profile while speed remains ${speed}. This combination usually indicates sustained operating stress instead of a random fluctuation.`
            : `${machineName} remains stable. Temperature and speed behaviour stay within a healthy range, with no strong anomaly drift detected.`,
      metrics: [
        { label: 'Trend', value: risk === 'high' ? 'UP' : risk === 'medium' ? 'WATCH' : 'STABLE' },
        { label: 'Drift', value: risk === 'high' ? '+18%' : risk === 'medium' ? '+9%' : '+2%' },
        { label: 'Window', value: '7D' },
      ],
      bars: buildTrendBars(risk),
      confidence: risk === 'high' ? 93 : risk === 'medium' ? 86 : 80,
      action: risk === 'high' ? 'Escalate trend' : 'Continue observe',
    };
  }

  if (action === 'Next step') {
    const high = currentStatus === 'critical' || tempValue >= 65;
    const risk = high ? 'high' : 'medium';
    return {
      role: 'assistant',
      kind: 'insight',
      emoji: high ? '⚡' : '🧭',
      title: 'AI Suggested Next Step',
      subtitle: mId === 'overall' ? 'Decision support' : machineName,
      risk,
      text: high
        ? 'Recommended next step: escalate the alert, assign inspection to the affected asset, and verify whether production load should be reduced temporarily.'
        : 'Recommended next step: continue observation, compare against historical baseline, and validate anomaly probability during the next operating cycle.',
      metrics: [
        { label: 'Response', value: high ? 'FAST' : 'NORMAL' },
        { label: 'Owner', value: high ? 'Ops + Maint' : 'Ops' },
        { label: 'Impact', value: high ? 'MED-HIGH' : 'LOW' },
      ],
      bars: buildTrendBars(risk),
      confidence: high ? 90 : 82,
      action: high ? 'Escalate issue' : 'Review later',
    };
  }

  return {
    role: 'assistant',
    kind: 'text',
    text: 'Monitoring remains active.',
  };
}

function buildInitialMessages(mId, healthData, currentStatus) {
  return [
    {
      role: 'assistant',
      kind: 'text',
      text:
        mId === 'overall'
          ? '🤖 AI monitoring is live across the factory. Ask for root cause, trend summary, or next-step recommendations.'
          : `🤖 ${ZONE_NAMES[mId] || mId} is connected to the AI assistant. Live anomaly analysis is ready.`,
    },
    createInsightCard('Trend summary', { mId, healthData, currentStatus }),
  ];
}

export default function AiChatBox({ mId, healthData, currentStatus }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() =>
    buildInitialMessages(mId, healthData, currentStatus)
  );
  const [activeAction, setActiveAction] = useState('');
  const [position, setPosition] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth - 378 : 900,
    y: 88,
  });

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const quickActions = useMemo(
    () => ['Root cause', 'Maintenance tips', 'Trend summary', 'Next step'],
    []
  );

  useEffect(() => {
    setMessages(buildInitialMessages(mId, healthData, currentStatus));
    setActiveAction('');
  }, [mId, healthData, currentStatus]);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;

      const panelWidth = 338;
      const panelHeight = 540;

      const nextX = e.clientX - dragOffsetRef.current.x;
      const nextY = e.clientY - dragOffsetRef.current.y;

      const boundedX = Math.max(12, Math.min(window.innerWidth - panelWidth - 12, nextX));
      const boundedY = Math.max(12, Math.min(window.innerHeight - panelHeight - 12, nextY));

      setPosition({ x: boundedX, y: boundedY });
    };

    const onUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const openPanel = () => {
    setOpen(true);
    setPosition({
      x: Math.max(16, window.innerWidth - 370),
      y: 72,
    });
  };

  const startDrag = (e) => {
    draggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleQuickAction = (action) => {
    const insightCard = createInsightCard(action, { mId, healthData, currentStatus });

    setActiveAction(action);
    setMessages((prev) => [
      ...prev,
      { role: 'user', kind: 'text', text: action },
      insightCard,
    ]);
  };

  const handleFakeSend = () => {
    setActiveAction('Trend summary');
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        kind: 'text',
        text: mId?.includes('-')
          ? `Give me the latest AI insight for ${ZONE_NAMES[mId] || mId}`
          : 'Give me the latest factory insight',
      },
      createInsightCard('Trend summary', { mId, healthData, currentStatus }),
    ]);
  };

  const renderMessage = (msg, idx) => {
    if (msg.role === 'user') {
      return (
        <MessageRow key={idx} $role="user">
          <UserBubble>{msg.text}</UserBubble>
        </MessageRow>
      );
    }

    if (msg.kind === 'insight') {
      return (
        <MessageRow key={idx} $role="assistant">
          <InsightCard>
            <InsightTop>
              <InsightTitleWrap>
                <InsightEmoji>{msg.emoji}</InsightEmoji>
                <div>
                  <InsightTitle>{msg.title}</InsightTitle>
                  <InsightSub>{msg.subtitle}</InsightSub>
                </div>
              </InsightTitleWrap>

              <RiskBadge $risk={msg.risk}>{msg.risk} risk</RiskBadge>
            </InsightTop>

            <InsightText>{msg.text}</InsightText>

            <MetricGrid>
              {msg.metrics.map((metric, i) => (
                <MetricCard key={i}>
                  <MetricLabel>{metric.label}</MetricLabel>
                  <MetricValue>{metric.value}</MetricValue>
                </MetricCard>
              ))}
            </MetricGrid>

            <TrendWrap>
              <TrendLabelRow>
                <TrendLabel>AI trend signal</TrendLabel>
                <TrendHint>Recent pattern</TrendHint>
              </TrendLabelRow>
              <TrendBars>
                {msg.bars.map((bar, i) => (
                  <TrendBar
                    key={i}
                    $h={bar}
                    $active={i === msg.bars.length - 1 || i === msg.bars.length - 2}
                  />
                ))}
              </TrendBars>
            </TrendWrap>

            <InsightFooter>
              <Confidence>
                Confidence: <ConfidenceStrong>{msg.confidence}%</ConfidenceStrong>
              </Confidence>
              <ActionPill>{msg.action}</ActionPill>
            </InsightFooter>
          </InsightCard>
        </MessageRow>
      );
    }

    return (
      <MessageRow key={idx} $role="assistant">
        <AssistantBubble>{msg.text}</AssistantBubble>
      </MessageRow>
    );
  };

  const portalContent =
    open && typeof document !== 'undefined'
      ? createPortal(
          <FloatingPanel $x={position.x} $y={position.y}>
            <ChatHeader onMouseDown={startDrag}>
              <ChatTopRow>
                <ChatTitleWrap>
                  <ChatAvatar>AI</ChatAvatar>
                  <div>
                    <ChatTitle>24/7 AI Assistant</ChatTitle>
                    <ChatSub>Smart anomaly analysis · drag to move</ChatSub>
                  </div>
                </ChatTitleWrap>

                <HeaderActions>
                  <LiveBadge>
                    <LiveDot />
                    Active
                  </LiveBadge>
                  <IconButton onClick={() => setOpen(false)} title="Minimize">
                    <MinimizeIcon />
                  </IconButton>
                </HeaderActions>
              </ChatTopRow>
            </ChatHeader>

            <ChatBody>
              <MessageList>
                {messages.map((msg, idx) => renderMessage(msg, idx))}
              </MessageList>
            </ChatBody>

            <ChatFooter>
              <QuickActionWrap>
                {quickActions.map((action) => (
                  <QuickAction
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    $active={activeAction === action}
                  >
                    {action}
                  </QuickAction>
                ))}
              </QuickActionWrap>

              <InputRow>
                <FakeInput>Ask AI about this machine...</FakeInput>
                <SendBtn onClick={handleFakeSend} aria-label="Send">
                  <SendIcon />
                </SendBtn>
              </InputRow>
            </ChatFooter>
          </FloatingPanel>,
          document.body
        )
      : null;

  return (
    <>
      <ChatShell>
        <MiniChatButton onClick={openPanel} title="Open AI Assistant">
          <ChatIcon />
          <MiniBadge>AI</MiniBadge>
        </MiniChatButton>
      </ChatShell>

      {portalContent}
    </>
  );
}
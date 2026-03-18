import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { T } from '../styles/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MACHINE_MAINTENANCE = {
  'line1-husker': {
    id: 'line1-husker',
    name: '⚙️ Line 1 · Paddy Husker 01',
    line: 'line1',
    nextScheduled: '18 Apr 2026',
    urgency: 'healthy',
    confidence: 92,
    lastAction: { date: '02 Mar 2026', action: 'Roller Alignment' },
    aiInsight: 'Vibration trend suggests normal wear. No action needed.',
    history: [
      { date: '02 Mar 2026', action: 'Roller Alignment', reason: 'Scheduled maintenance', health: 95 },
      { date: '20 Feb 2026', action: 'Bearing Lubrication', reason: 'Preventive', health: 88 },
      { date: '05 Feb 2026', action: 'Belt Tension Check', reason: 'Routine', health: 90 },
    ],
    healthTrend: [95, 88, 90, 92, 91],
  },
  'line1-milling': {
    id: 'line1-milling',
    name: '⚙️ Line 1 · Rice Milling 01',
    line: 'line1',
    nextScheduled: '22 Apr 2026',
    urgency: 'healthy',
    confidence: 88,
    lastAction: { date: '01 Mar 2026', action: 'Blade Inspection' },
    aiInsight: 'Blade wear within limits. Next check recommended in 30 days.',
    history: [
      { date: '01 Mar 2026', action: 'Blade Inspection', reason: 'Scheduled', health: 94 },
      { date: '16 Feb 2026', action: 'Sensor Calibration', reason: 'Accuracy drift', health: 86 },
    ],
    healthTrend: [94, 86, 89, 90, 91],
  },
  'line1-conveyor': {
    id: 'line1-conveyor',
    name: '⚙️ Line 1 · Conveyor Belt 01',
    line: 'line1',
    nextScheduled: '15 Apr 2026',
    urgency: 'dueSoon',
    confidence: 76,
    lastAction: { date: '27 Feb 2026', action: 'Belt Replacement' },
    aiInsight: 'Belt tension slightly low. Monitor vibration.',
    history: [
      { date: '27 Feb 2026', action: 'Belt Replacement', reason: 'Wear detected', health: 82 },
      { date: '10 Feb 2026', action: 'Motor Inspection', reason: 'Routine', health: 90 },
    ],
    healthTrend: [82, 90, 88, 85, 80],
  },
  'line1-palletize': {
    id: 'line1-palletize',
    name: '🤖 Line 1 · Palletizing Robot 01',
    line: 'line1',
    nextScheduled: '19 Apr 2026',
    urgency: 'healthy',
    confidence: 94,
    lastAction: { date: '25 Feb 2026', action: 'Arm Calibration' },
    aiInsight: 'Grip sensor offset corrected. Normal operation.',
    history: [
      { date: '25 Feb 2026', action: 'Arm Calibration', reason: 'Position drift', health: 96 },
      { date: '08 Feb 2026', action: 'Grip Sensor Reset', reason: 'False triggers', health: 92 },
    ],
    healthTrend: [96, 92, 94, 95, 95],
  },
  'line2-husker': {
    id: 'line2-husker',
    name: '⚙️ Line 2 · Paddy Husker 02',
    line: 'line2',
    nextScheduled: '20 Apr 2026',
    urgency: 'healthy',
    confidence: 95,
    lastAction: { date: '03 Mar 2026', action: 'Roller Replacement' },
    aiInsight: 'New rollers installed. Performance optimal.',
    history: [
      { date: '03 Mar 2026', action: 'Roller Replacement', reason: 'Worn out', health: 98 },
      { date: '18 Feb 2026', action: 'Lubrication Service', reason: 'Preventive', health: 92 },
    ],
    healthTrend: [98, 92, 94, 95, 96],
  },
  'line2-milling': {
    id: 'line2-milling',
    name: '⚙️ Line 2 · Rice Milling 02',
    line: 'line2',
    nextScheduled: '23 Apr 2026',
    urgency: 'healthy',
    confidence: 90,
    lastAction: { date: '28 Feb 2026', action: 'Blade Sharpening' },
    aiInsight: 'Blade sharpness restored. Efficiency +3%.',
    history: [
      { date: '28 Feb 2026', action: 'Blade Sharpening', reason: 'Reduced output', health: 91 },
      { date: '14 Feb 2026', action: 'Sensor Calibration', reason: 'Routine', health: 87 },
    ],
    healthTrend: [91, 87, 89, 92, 93],
  },
  'line2-conveyor': {
    id: 'line2-conveyor',
    name: '⚙️ Line 2 · Conveyor Belt 02',
    line: 'line2',
    nextScheduled: '17 Apr 2026',
    urgency: 'critical',
    confidence: 82,
    lastAction: { date: '26 Feb 2026', action: 'Belt Alignment' },
    aiInsight: 'Vibration spikes detected. Possible bearing failure.',
    history: [
      { date: '26 Feb 2026', action: 'Belt Alignment', reason: 'Tracking issue', health: 74 },
      { date: '09 Feb 2026', action: 'Motor Cleaning', reason: 'Overheating', health: 80 },
    ],
    healthTrend: [74, 80, 78, 70, 65],
  },
  'line2-palletize': {
    id: 'line2-palletize',
    name: '🤖 Line 2 · Palletizing Robot 02',
    line: 'line2',
    nextScheduled: '21 Apr 2026',
    urgency: 'healthy',
    confidence: 97,
    lastAction: { date: '24 Feb 2026', action: 'Joint Lubrication' },
    aiInsight: 'Arm joints in good condition.',
    history: [
      { date: '24 Feb 2026', action: 'Joint Lubrication', reason: 'Scheduled', health: 98 },
      { date: '07 Feb 2026', action: 'Grip Sensor Reset', reason: 'Calibration', health: 96 },
    ],
    healthTrend: [98, 96, 97, 97, 98],
  },
  'line3-husker': {
    id: 'line3-husker',
    name: '⚙️ Line 3 · Paddy Husker 03',
    line: 'line3',
    nextScheduled: '19 Apr 2026',
    urgency: 'healthy',
    confidence: 93,
    lastAction: { date: '04 Mar 2026', action: 'Roller Inspection' },
    aiInsight: 'No anomalies detected.',
    history: [
      { date: '04 Mar 2026', action: 'Roller Inspection', reason: 'Routine', health: 94 },
      { date: '19 Feb 2026', action: 'Bearing Oil Change', reason: 'Preventive', health: 91 },
    ],
    healthTrend: [94, 91, 92, 93, 94],
  },
  'line3-milling': {
    id: 'line3-milling',
    name: '⚙️ Line 3 · Rice Milling 03',
    line: 'line3',
    nextScheduled: '24 Apr 2026',
    urgency: 'healthy',
    confidence: 89,
    lastAction: { date: '02 Mar 2026', action: 'Blade Calibration' },
    aiInsight: 'Blade alignment optimal.',
    history: [
      { date: '02 Mar 2026', action: 'Blade Calibration', reason: 'Scheduled', health: 92 },
      { date: '17 Feb 2026', action: 'Sensor Replacement', reason: 'Faulty', health: 85 },
    ],
    healthTrend: [92, 85, 88, 90, 91],
  },
  'line3-conveyor': {
    id: 'line3-conveyor',
    name: '⚙️ Line 3 · Conveyor Belt 03',
    line: 'line3',
    nextScheduled: '18 Apr 2026',
    urgency: 'dueSoon',
    confidence: 80,
    lastAction: { date: '25 Feb 2026', action: 'Motor Alignment' },
    aiInsight: 'Motor current stable. Belt tracking OK.',
    history: [
      { date: '25 Feb 2026', action: 'Motor Alignment', reason: 'Vibration', health: 86 },
      { date: '11 Feb 2026', action: 'Belt Replacement', reason: 'Worn', health: 90 },
    ],
    healthTrend: [86, 90, 88, 84, 82],
  },
  'line3-palletize': {
    id: 'line3-palletize',
    name: '🤖 Line 3 · Palletizing Robot 03',
    line: 'line3',
    nextScheduled: '16 Apr 2026',
    urgency: 'critical',
    confidence: 96,
    lastAction: { date: '23 Feb 2026', action: 'Arm Reset' },
    aiInsight: 'Thermal anomaly detected. Motor temperature high.',
    history: [
      { date: '23 Feb 2026', action: 'Arm Reset', reason: 'Stuck', health: 62 },
      { date: '06 Feb 2026', action: 'Grip Calibration', reason: 'Misalignment', health: 70 },
      { date: '20 Jan 2026', action: 'Motor Inspection', reason: 'Overheating', health: 58 },
    ],
    healthTrend: [62, 70, 65, 60, 55],
  },
};

const LINES = ['line1', 'line2', 'line3'];

const URGENCY_CONFIG = {
  critical: { label: '🔴 Critical', color: T.danger, bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.2)' },
  dueSoon:  { label: '🟠 Due Soon', color: T.warning, bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.2)' },
  healthy:  { label: '🟢 Healthy', color: T.success, bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.2)' },
};

const computeKPI = () => {
  const all = Object.values(MACHINE_MAINTENANCE);
  const budget = 3200;
  const savedLoss = 15400;
  const highRisk = all.filter(m => m.urgency === 'critical').length;
  return { budget, savedLoss, highRisk };
};

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const PageWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const KPICard = styled(GlassCard)`
  padding: 16px 18px;
`;

const KPILabel = styled.div`
  font-size: 0.56rem;
  color: ${T.muted};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 700;
`;

const KPIValue = styled.div`
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1;
  color: ${(p) => p.$color || T.text};
`;

const KPISub = styled.div`
  margin-top: 6px;
  font-size: 0.7rem;
  color: ${T.sub};
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 8px;
`;

const TableCard = styled(GlassCard)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.7rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: rgba(255,255,255,0.6);
  border-bottom: 1px solid ${T.border};
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.6rem;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(221,227,239,0.6);
  color: ${T.text};
`;

const GroupRow = styled.tr`
  background: rgba(200,210,225,0.12);
  td {
    padding: 8px 16px;
    font-weight: 700;
    color: ${T.sub};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.6rem;
  }
`;

const UrgencyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
  background: ${(p) => URGENCY_CONFIG[p.$urgency].bg};
  color: ${(p) => URGENCY_CONFIG[p.$urgency].color};
  border: 1px solid ${(p) => URGENCY_CONFIG[p.$urgency].border};
  white-space: nowrap;
`;

const DueTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.55rem;
  font-weight: 600;
  background: ${(p) => (p.$urgency === 'critical' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)')};
  color: ${(p) => (p.$urgency === 'critical' ? T.danger : T.warning)};
  white-space: nowrap;
`;

const ConfidenceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(23,72,200,0.08);
  color: ${T.accent};
  font-size: 0.55rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 8px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${T.border};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.6rem;
  font-weight: 600;
  color: ${T.sub};
  cursor: pointer;
  transition: all 0.15s;
  margin-right: 6px;
  &:hover {
    border-color: ${T.accent};
    color: ${T.accent};
    background: rgba(23,72,200,0.04);
  }
`;

const RescheduleButton = styled(ActionButton)`
  background: ${(p) => (p.$loading ? 'rgba(23,72,200,0.1)' : 'transparent')};
  color: ${(p) => (p.$loading ? T.accent : T.sub)};
  border-color: ${(p) => (p.$loading ? T.accent : T.border)};
  cursor: ${(p) => (p.$loading ? 'wait' : 'pointer')};
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${T.success};
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.7rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: slideIn 0.2s ease;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ExportButton = styled.button`
  background: transparent;
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.65rem;
  font-weight: 600;
  color: ${T.sub};
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  &:hover {
    border-color: ${T.accent};
    color: ${T.accent};
  }
`;

const MachineDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const InfoCard = styled(GlassCard)`
  min-height: 220px;
`;

const BigDate = styled.div`
  font-size: 2.4rem;
  font-weight: 300;
  line-height: 1;
  margin: 12px 0 8px;
  color: ${(p) => (p.$urgency === 'critical' ? T.danger : p.$urgency === 'dueSoon' ? T.warning : T.text)};
`;

const InsightBox = styled.div`
  margin: 16px 0;
  padding: 12px;
  background: rgba(23,72,200,0.06);
  border-radius: 10px;
  border-left: 3px solid ${T.accent};
  font-size: 0.75rem;
  color: ${T.sub};
  line-height: 1.6;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  color: ${T.text};
  cursor: pointer;
  input {
    width: 16px;
    height: 16px;
    accent-color: ${T.accent};
  }
  span {
    flex: 1;
  }
  .done {
    text-decoration: line-through;
    color: ${T.muted};
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const TimelineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${T.accent};
  margin-top: 4px;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineDate = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${T.text};
`;

const TimelineAction = styled.div`
  font-size: 0.7rem;
  color: ${T.sub};
`;

const TimelineReason = styled.div`
  font-size: 0.6rem;
  color: ${T.muted};
  margin-top: 2px;
`;

const TrendDots = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 20px;
  margin-top: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$value > 85 ? T.success : p.$value > 70 ? T.warning : T.danger)};
  opacity: ${(p) => 0.7 + 0.3 * (p.index / 5)};
`;

const ModifyButton = styled.button`
  background: transparent;
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.65rem;
  font-weight: 600;
  color: ${T.text};
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 16px;
  &:hover {
    border-color: ${T.accent};
    color: ${T.accent};
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Maintenance({ mId }) {
  const navigate = useNavigate();
  const [rescheduling, setRescheduling] = useState(null);
  const [toast, setToast] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showExportToast, setShowExportToast] = useState(false);

  const isOverall = mId === 'overall';
  const isLine = ['line1', 'line2', 'line3'].includes(mId);
  const isMachine = mId?.includes('-') && !isLine && !isOverall;

  const allMachines = Object.values(MACHINE_MAINTENANCE);
  const kpi = computeKPI();

  const handleReschedule = (machineId) => {
    setRescheduling(machineId);
    setTimeout(() => {
      const machine = MACHINE_MAINTENANCE[machineId];
      if (machine) {
        const oldDate = new Date(machine.nextScheduled);
        const newDate = new Date(oldDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        machine.nextScheduled = newDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        machine.urgency = 'dueSoon';
      }
      setRescheduling(null);
      setToast(`✨ AI rescheduled maintenance for ${MACHINE_MAINTENANCE[machineId]?.name}. Saved RM 500.`);
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2000);
  };

  const handleTaskToggle = (taskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  if (isMachine && MACHINE_MAINTENANCE[mId]) {
    const machine = MACHINE_MAINTENANCE[mId];
    const tasks = [
      { id: 'task1', label: 'Check bearing wear' },
      { id: 'task2', label: 'Replace lubricant' },
      { id: 'task3', label: 'Calibrate sensors' },
    ];

    return (
      <PageWrap>
        <MachineDetailGrid>
          <InfoCard>
            <SectionTitle>📅 Next Scheduled</SectionTitle>
            <BigDate $urgency={machine.urgency}>{machine.nextScheduled}</BigDate>
            <InsightBox>
              <strong>🤖 AI Insight</strong>
              <div style={{ marginTop: 4 }}>{machine.aiInsight}</div>
            </InsightBox>

            <SectionTitle style={{ marginTop: 16 }}>✅ AI Recommended Action Plan</SectionTitle>
            <CheckboxList>
              {tasks.map(task => (
                <CheckboxItem key={task.id}>
                  <input
                    type="checkbox"
                    checked={!!completedTasks[task.id]}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <span className={completedTasks[task.id] ? 'done' : ''}>{task.label}</span>
                </CheckboxItem>
              ))}
            </CheckboxList>

            <ModifyButton>📅 Modify Date</ModifyButton>
          </InfoCard>

          <InfoCard>
            <SectionTitle>📋 Maintenance History</SectionTitle>
            <Timeline>
              {machine.history.map((item, idx) => (
                <TimelineItem key={idx}>
                  <TimelineDot />
                  <TimelineContent>
                    <TimelineDate>{item.date}</TimelineDate>
                    <TimelineAction>{item.action}</TimelineAction>
                    <TimelineReason>{item.reason}</TimelineReason>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <SectionTitle style={{ marginTop: 16 }}>📊 Health Trend (Last 5)</SectionTitle>
            <TrendDots>
              {machine.healthTrend.map((val, i) => (
                <Dot key={i} $value={val} index={i} title={`Health: ${val}`} />
              ))}
            </TrendDots>
          </InfoCard>
        </MachineDetailGrid>

        {toast && <Toast>{toast}</Toast>}
      </PageWrap>
    );
  }

  let filteredMachines = allMachines;
  if (isLine) {
    filteredMachines = allMachines.filter(m => m.line === mId);
  }

  const urgencyOrder = { critical: 0, dueSoon: 1, healthy: 2 };
  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return a.nextScheduled.localeCompare(b.nextScheduled);
  });

  const renderOverallTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>Machine</Th>
          <Th>Urgency</Th>
          <Th>Next Scheduled</Th>
          <Th>Last Action</Th>
          <Th>🤖 AI Insight</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {LINES.map(line => {
          const lineMachines = sortedMachines.filter(m => m.line === line);
          if (lineMachines.length === 0) return null;
          return (
            <React.Fragment key={line}>
              <GroupRow>
                <td colSpan="6">—— {line.toUpperCase()} ——</td>
              </GroupRow>
              {lineMachines.map(machine => (
                <tr key={machine.id}>
                  <Td>{machine.name}</Td>
                  <Td>
                    <UrgencyBadge $urgency={machine.urgency}>{URGENCY_CONFIG[machine.urgency].label}</UrgencyBadge>
                    {machine.urgency !== 'healthy' && (
                      <DueTag $urgency={machine.urgency}>
                        {machine.urgency === 'critical' ? '⏳ Overdue' : '⏳ Due soon'}
                      </DueTag>
                    )}
                  </Td>
                  <Td>
                    <span style={{ fontWeight: machine.urgency === 'critical' ? 700 : 400, color: machine.urgency === 'critical' ? T.danger : T.text }}>
                      {machine.nextScheduled}
                    </span>
                    <ConfidenceBadge>🧠 {machine.confidence}%</ConfidenceBadge>
                  </Td>
                  <Td>{machine.lastAction.date}: {machine.lastAction.action}</Td>
                  <Td style={{ color: T.sub, fontStyle: 'italic', maxWidth: '200px' }}>{machine.aiInsight}</Td>
                  <Td>
                    <RescheduleButton
                      onClick={() => handleReschedule(machine.id)}
                      disabled={rescheduling === machine.id}
                      $loading={rescheduling === machine.id}
                    >
                      {rescheduling === machine.id ? '...' : '✨ AI Reschedule'}
                    </RescheduleButton>
                    <ActionButton onClick={() => navigate(`/${machine.id}/maintenance`)}>
                      View Details
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  );

  const renderLineTable = () => (
    <Table>
      <thead>
        <tr>
          <Th>Machine</Th>
          <Th>Urgency</Th>
          <Th>Next Scheduled</Th>
          <Th>Last Action</Th>
          <Th>🤖 AI Insight</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {sortedMachines.map(machine => (
          <tr key={machine.id}>
            <Td>{machine.name}</Td>
            <Td>
              <UrgencyBadge $urgency={machine.urgency}>{URGENCY_CONFIG[machine.urgency].label}</UrgencyBadge>
              {machine.urgency !== 'healthy' && (
                <DueTag $urgency={machine.urgency}>
                  {machine.urgency === 'critical' ? '⏳ Overdue' : '⏳ Due soon'}
                </DueTag>
              )}
            </Td>
            <Td>
              <span style={{ fontWeight: machine.urgency === 'critical' ? 700 : 400, color: machine.urgency === 'critical' ? T.danger : T.text }}>
                {machine.nextScheduled}
              </span>
              <ConfidenceBadge>🧠 {machine.confidence}%</ConfidenceBadge>
            </Td>
            <Td>{machine.lastAction.date}: {machine.lastAction.action}</Td>
            <Td style={{ color: T.sub, fontStyle: 'italic', maxWidth: '200px' }}>{machine.aiInsight}</Td>
            <Td>
              <RescheduleButton
                onClick={() => handleReschedule(machine.id)}
                disabled={rescheduling === machine.id}
                $loading={rescheduling === machine.id}
              >
                {rescheduling === machine.id ? '...' : '✨ AI Reschedule'}
              </RescheduleButton>
              <ActionButton onClick={() => navigate(`/${machine.id}/maintenance`)}>
                View Details
              </ActionButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <PageWrap>
      <KPIGrid>
        <KPICard>
          <KPILabel>💰 Monthly Maintenance Budget</KPILabel>
          <KPIValue>RM {kpi.budget.toLocaleString()}</KPIValue>
          <KPISub>Estimated for next 30 days</KPISub>
        </KPICard>
        <KPICard>
          <KPILabel>🛡️ Downtime Loss Avoided</KPILabel>
          <KPIValue $color={T.success}>RM {kpi.savedLoss.toLocaleString()}</KPIValue>
          <KPISub>Thanks to AI‑optimized schedule</KPISub>
        </KPICard>
        <KPICard>
          <KPILabel>⚠️ High‑Risk Tasks</KPILabel>
          <KPIValue $color={kpi.highRisk > 0 ? T.danger : T.text}>{kpi.highRisk}</KPIValue>
          <KPISub>Critical machines require attention</KPISub>
        </KPICard>
      </KPIGrid>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SectionTitle>
          {isOverall ? 'All Machines · Grouped by Line' : `Line ${mId.slice(-1)} Maintenance Schedule`}
        </SectionTitle>
        <ExportButton onClick={handleExport}>
          📤 Export CSV
        </ExportButton>
      </div>

      <TableCard>
        {isOverall ? renderOverallTable() : renderLineTable()}
      </TableCard>

      {showExportToast && (
        <Toast>✅ Maintenance schedule exported as CSV.</Toast>
      )}
      {toast && <Toast>{toast}</Toast>}
    </PageWrap>
  );
}
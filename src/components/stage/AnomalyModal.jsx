import React, { useState } from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';

// 样式定义
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 680px;
  max-width: 92vw;
  max-height: 82vh;
  background: ${T.surface};
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);

  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${T.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: ${T.muted};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${T.text};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid ${T.border};
`;

const FilterPill = styled.button`
  background: ${(p) => (p.$active ? T.accent : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : T.muted)};
  border: 1px solid ${(p) => (p.$active ? T.accent : T.border)};
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: ${(p) => (p.$active ? T.accent : T.accentL)};
    border-color: ${T.accentM};
  }
`;

const Content = styled.div`
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${T.muted};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const AlertCard = styled.div`
  background: ${(p) =>
    p.$severity === 'alert'
      ? 'linear-gradient(135deg, #7f1d1d, #b91c1c)'
      : p.$severity === 'warning'
      ? 'linear-gradient(135deg, #92400e, #b45309)'
      : 'transparent'};
  color: ${(p) => (p.$severity ? 'white' : T.text)};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border: ${(p) => (p.$severity ? 'none' : `1px solid ${T.border}`)};
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

const AlertDesc = styled.div`
  font-size: 0.75rem;
  opacity: 0.92;
`;

const ViewButton = styled.button`
  background: ${(p) => (p.$primary ? T.accent : 'transparent')};
  color: ${(p) => (p.$primary ? '#fff' : 'white')};
  border: 1px solid ${(p) => (p.$primary ? T.accent : 'rgba(255,255,255,0.5)')};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$primary ? T.accentM : 'rgba(255,255,255,0.2)')};
  }
`;

const HistoricalItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${T.muted};
  padding: 8px 0;
  border-bottom: 1px dashed ${T.border};
  gap: 16px;

  span:first-child {
    flex: 1;
    color: ${T.text};
  }

  span:last-child {
    white-space: nowrap;
  }
`;

const EmptyState = styled.div`
  padding: 10px 0;
  font-size: 0.78rem;
  color: ${T.muted};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${T.accent};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* AI Trend Analysis */
const TrendCard = styled.div`
  background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08));
  border: 1px solid rgba(59,130,246,0.16);
  border-radius: 18px;
  padding: 16px;
`;

const TrendHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const TrendTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TrendTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${T.text};
`;

const TrendSubtitle = styled.div`
  font-size: 0.75rem;
  color: ${T.muted};
  line-height: 1.45;
`;

const RiskBadge = styled.div`
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${(p) =>
    p.$risk === 'High'
      ? 'rgba(185,28,28,0.12)'
      : p.$risk === 'Medium'
      ? 'rgba(180,83,9,0.12)'
      : 'rgba(5,150,105,0.12)'};
  color: ${(p) =>
    p.$risk === 'High'
      ? '#b91c1c'
      : p.$risk === 'Medium'
      ? '#b45309'
      : '#059669'};
`;

const TrendBody = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const SparkWrap = styled.div`
  background: rgba(255,255,255,0.65);
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 12px;
`;

const SparkTitle = styled.div`
  font-size: 0.72rem;
  color: ${T.muted};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const SparkSvg = styled.svg`
  width: 100%;
  height: 88px;
  display: block;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const MetricCard = styled.div`
  background: rgba(255,255,255,0.72);
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 12px;
`;

const MetricLabel = styled.div`
  font-size: 0.68rem;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  font-weight: 700;
`;

const MetricValue = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${T.text};
`;

const MetricHint = styled.div`
  font-size: 0.72rem;
  color: ${T.muted};
  margin-top: 4px;
  line-height: 1.35;
`;

const InsightBox = styled.div`
  margin-top: 14px;
  background: rgba(255,255,255,0.62);
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 12px 14px;
`;

const InsightLabel = styled.div`
  font-size: 0.68rem;
  color: ${T.muted};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const InsightText = styled.div`
  font-size: 0.78rem;
  color: ${T.text};
  line-height: 1.55;
`;

// 详情视图组件
const DetailView = ({ machineId, data, onBack, onAction }) => {
  const [actionTaken, setActionTaken] = useState(null);

  if (!data) return null;

  const handleAction = (action) => {
    setActionTaken(action);
    setTimeout(() => {
      onAction(action);
    }, 1000);
  };

  return (
    <div>
      <BackButton onClick={onBack}>← Back to list</BackButton>
      <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>{machineId}</h3>

      <div
        style={{
          background: '#f3f4f6',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '16px',
        }}
      >
        <p style={{ marginBottom: '8px' }}>
          <strong>Reason:</strong> {data.reason}
        </p>
        <p>
          <strong>Data:</strong> {data.data}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        {data.solutions.map((sol) => (
          <div key={sol.action}>
            <button
              onClick={() => handleAction(sol.action)}
              disabled={actionTaken}
              style={{
                width: '100%',
                padding: '12px',
                background: sol.action === 'emergency' ? '#b91c1c' : T.accent,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: actionTaken ? 'default' : 'pointer',
                opacity: actionTaken ? 0.7 : 1,
              }}
            >
              {actionTaken === sol.action
                ? '✅ ' + (sol.action === 'maintenance' ? 'Maintenance Contacted' : 'Machine Stopped')
                : sol.label}
            </button>
            <p style={{ fontSize: '0.7rem', color: T.muted, marginTop: '4px' }}>
              {sol.consequence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const alertsData = [
  {
    id: 'alert-1',
    machineId: 'line3-palletize',
    title: 'Line 3 · Palletizing Robot',
    description: 'CRITICAL: Motor temperature exceeded safe limit',
    severity: 'alert',
  },
];

const warningsData = [
  {
    id: 'warning-1',
    machineId: 'line2-conveyor',
    title: 'Line 2 · Conveyor Belt',
    description: 'WARNING: Abnormal vibration detected',
    severity: 'warning',
  },
];

const mockHistoricalAlerts = [
  {
    id: 'h1',
    machineId: 'line3-palletize',
    machine: 'Line 3 · Palletizing Robot',
    issue: '🔴 Motor temperature spike',
    time: '17 Mar 2026 · 03:14',
  },
  {
    id: 'h2',
    machineId: 'line2-conveyor',
    machine: 'Line 2 · Conveyor Belt',
    issue: '🟠 Abnormal vibration detected',
    time: '17 Mar 2026 · 01:42',
  },
  {
    id: 'h3',
    machineId: 'line1-milling',
    machine: 'Line 1 · Milling Machine',
    issue: '🟡 Throughput drop detected',
    time: '16 Mar 2026 · 18:21',
  },
  {
    id: 'h4',
    machineId: 'line3-husker',
    machine: 'Line 3 · Husker',
    issue: '🟠 Temperature above baseline',
    time: '16 Mar 2026 · 14:06',
  },
  {
    id: 'h5',
    machineId: 'line2-palletize',
    machine: 'Line 2 · Palletizing Robot',
    issue: '🟡 Robot arm calibration drift',
    time: '16 Mar 2026 · 11:32',
  },
  {
    id: 'h6',
    machineId: 'line1-conveyor',
    machine: 'Line 1 · Conveyor',
    issue: '🟠 Short vibration spike',
    time: '15 Mar 2026 · 20:14',
  },
  {
    id: 'h7',
    machineId: 'line2-milling',
    machine: 'Line 2 · Milling',
    issue: '🟡 Unexpected RPM fluctuation',
    time: '15 Mar 2026 · 16:55',
  },
  {
    id: 'h8',
    machineId: 'line3-conveyor',
    machine: 'Line 3 · Conveyor',
    issue: '🟠 Sensor noise detected',
    time: '15 Mar 2026 · 13:07',
  },
];

const trendAnalysisData = {
  overall: {
    title: 'Factory-wide anomaly trend increasing',
    subtitle: 'AI compares recent abnormal patterns against the last 7-day baseline.',
    risk: 'High',
    prediction: '2 machines may require intervention within 24 hours',
    rootCause: 'Recurring vibration instability and thermal overload pattern',
    action: 'Prioritize Line 3 motor inspection, then Line 2 belt alignment check',
    insight:
      'AI detected a rising anomaly frequency driven mainly by Line 2 vibration irregularities and Line 3 temperature spikes. Pattern similarity suggests developing mechanical stress rather than isolated sensor noise.',
    series: [22, 28, 26, 34, 41, 48, 57],
  },
  line1: {
    title: 'Line 1 trend stable',
    subtitle: 'Historical anomalies remain within normal operating deviation.',
    risk: 'Low',
    prediction: 'Low failure probability over the next 24 hours',
    rootCause: 'No strong recurring anomaly signature detected',
    action: 'Continue routine monitoring',
    insight:
      'AI found only minor isolated deviations on Line 1, with no repeating pattern severe enough to indicate emerging machine degradation.',
    series: [8, 10, 9, 11, 10, 9, 10],
  },
  line2: {
    title: 'Recurring vibration anomaly detected',
    subtitle: 'AI identified repeated warning-level conveyor signatures over 7 days.',
    risk: 'Medium',
    prediction: 'Failure risk may rise within 12–24 hours if not inspected',
    rootCause: 'Possible belt misalignment or bearing wear progression',
    action: 'Schedule maintenance inspection on conveyor alignment',
    insight:
      'Trend analysis shows repeated vibration spikes on the conveyor subsystem with gradually increasing intensity. The pattern is consistent with progressive misalignment rather than a one-time operational fluctuation.',
    series: [14, 17, 19, 23, 26, 29, 35],
  },
  line3: {
    title: 'Escalating thermal anomaly pattern',
    subtitle: 'AI detected critical temperature deviation on the palletizing robot motor.',
    risk: 'High',
    prediction: 'Critical failure risk elevated in the next 6–12 hours',
    rootCause: 'Likely overload, poor cooling, or bearing wear',
    action: 'Immediate inspection or emergency stop recommended',
    insight:
      'AI found a strong upward trend in thermal anomalies on Line 3. Historical matching suggests the current temperature behaviour resembles early-stage motor failure scenarios.',
    series: [18, 21, 24, 31, 39, 52, 68],
  },
};

function getDetailData(machineId) {
  if (machineId === 'line3-palletize') {
    return {
      reason: 'Bearing wear due to prolonged overload',
      data: 'Temperature: 74°C, Vibration: 3.8 mm/s',
      solutions: [
        {
          label: 'Contact Maintenance',
          consequence: 'Yield decreases by 10%, maintenance cost RM 200',
          action: 'maintenance',
        },
        {
          label: 'Emergency Stop Machine',
          consequence: 'Complete halt of line, zero yield, prevents total motor failure',
          action: 'emergency',
        },
      ],
    };
  }

  if (machineId === 'line2-conveyor') {
    return {
      reason: 'Belt misalignment causing friction',
      data: 'Temperature: 54°C, Vibration: 2.1 mm/s',
      solutions: [
        {
          label: 'Contact Maintenance',
          consequence: 'Yield decreases by 5%, maintenance cost RM 150',
          action: 'maintenance',
        },
        {
          label: 'Emergency Stop Machine',
          consequence: 'Complete halt of line, zero yield, prevents belt damage',
          action: 'emergency',
        },
      ],
    };
  }

  return null;
}

function getTrendData(currentFilter) {
  return trendAnalysisData[currentFilter] || trendAnalysisData.overall;
}

function buildPolylinePoints(values, width = 260, height = 70, padding = 8) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

function HistoricalTrendAnalysis({ currentFilter }) {
  const data = getTrendData(currentFilter);
  const points = buildPolylinePoints(data.series);
  const latest = data.series[data.series.length - 1];
  const previous = data.series[data.series.length - 2];
  const delta = latest - previous;
  const changeLabel = `${delta >= 0 ? '+' : ''}${delta} vs previous day`;

  return (
    <div>
      <SectionTitle>🤖 Historical Trend Analysis</SectionTitle>

      <TrendCard>
        <TrendHeader>
          <TrendTitleWrap>
            <TrendTitle>{data.title}</TrendTitle>
            <TrendSubtitle>{data.subtitle}</TrendSubtitle>
          </TrendTitleWrap>
          <RiskBadge $risk={data.risk}>{data.risk} Risk</RiskBadge>
        </TrendHeader>

        <TrendBody>
          <SparkWrap>
            <SparkTitle>7-Day Trend Signal</SparkTitle>
            <SparkSvg viewBox="0 0 260 70" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                points="8,62 252,62"
              />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {data.series.map((value, index) => {
                const max = Math.max(...data.series);
                const min = Math.min(...data.series);
                const range = max - min || 1;
                const x = 8 + (index * (260 - 16)) / (data.series.length - 1);
                const y = 70 - 8 - ((value - min) / range) * (70 - 16);

                return (
                  <circle
                    key={`${value}-${index}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#2563eb"
                  />
                );
              })}
            </SparkSvg>
          </SparkWrap>

          <MetricGrid>
            <MetricCard>
              <MetricLabel>Predicted Risk</MetricLabel>
              <MetricValue>{data.risk}</MetricValue>
              <MetricHint>{data.prediction}</MetricHint>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Trend Shift</MetricLabel>
              <MetricValue>{changeLabel}</MetricValue>
              <MetricHint>Based on recent anomaly score movement</MetricHint>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Likely Root Cause</MetricLabel>
              <MetricValue style={{ fontSize: '0.82rem', lineHeight: 1.35 }}>
                {data.rootCause}
              </MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Recommended Action</MetricLabel>
              <MetricValue style={{ fontSize: '0.82rem', lineHeight: 1.35 }}>
                {data.action}
              </MetricValue>
            </MetricCard>
          </MetricGrid>
        </TrendBody>

        <InsightBox>
          <InsightLabel>AI Insight</InsightLabel>
          <InsightText>{data.insight}</InsightText>
        </InsightBox>
      </TrendCard>
    </div>
  );
}

export default function AnomalyModal({
  isOpen,
  onClose,
  filter,
  onFilterChange,
  onViewDetails,
  historicalAlerts = [],
  onResolveAlert,
}) {
  const [currentFilter, setCurrentFilter] = useState(filter || 'overall');
  const [view, setView] = useState('list');
  const [selectedMachine, setSelectedMachine] = useState(null);

  if (!isOpen) return null;

  const handleFilter = (f) => {
    setCurrentFilter(f);
    if (onFilterChange) onFilterChange(f);
  };

  const handleViewDetails = (machineId) => {
    setSelectedMachine(machineId);
    setView('detail');
    if (onViewDetails) onViewDetails(machineId);
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedMachine(null);
  };

  const handleAction = (action) => {
    if (onResolveAlert) onResolveAlert(selectedMachine, action);
    handleBackToList();
  };

  const filteredAlerts = alertsData.filter((a) => {
    if (currentFilter === 'overall') return true;
    if (currentFilter === 'line1') return a.machineId.startsWith('line1');
    if (currentFilter === 'line2') return a.machineId.startsWith('line2');
    if (currentFilter === 'line3') return a.machineId.startsWith('line3');
    return true;
  });

  const filteredWarnings = warningsData.filter((w) => {
    if (currentFilter === 'overall') return true;
    if (currentFilter === 'line1') return w.machineId.startsWith('line1');
    if (currentFilter === 'line2') return w.machineId.startsWith('line2');
    if (currentFilter === 'line3') return w.machineId.startsWith('line3');
    return true;
  });

  const historySource =
    historicalAlerts?.length > 0 ? historicalAlerts : mockHistoricalAlerts;

  const filteredHistory = historySource.filter((item) => {
    if (currentFilter === 'overall') return true;
    if (currentFilter === 'line1') return item.machineId?.startsWith('line1');
    if (currentFilter === 'line2') return item.machineId?.startsWith('line2');
    if (currentFilter === 'line3') return item.machineId?.startsWith('line3');
    return true;
  });

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Anomaly Detection</Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        {view === 'list' ? (
          <>
            <FilterBar>
              {['overall', 'line1', 'line2', 'line3'].map((f) => (
                <FilterPill
                  key={f}
                  $active={currentFilter === f}
                  onClick={() => handleFilter(f)}
                >
                  {f === 'overall' ? 'Overall' : f.toUpperCase()}
                </FilterPill>
              ))}
            </FilterBar>

            <Content>
              {filteredAlerts.length > 0 && (
                <div>
                  <SectionTitle>🔴 Alert</SectionTitle>
                  {filteredAlerts.map((item) => (
                    <AlertCard key={item.id} $severity="alert">
                      <AlertInfo>
                        <AlertTitle>{item.title}</AlertTitle>
                        <AlertDesc>{item.description}</AlertDesc>
                      </AlertInfo>
                      <ViewButton
                        $primary
                        onClick={() => handleViewDetails(item.machineId)}
                      >
                        View Details
                      </ViewButton>
                    </AlertCard>
                  ))}
                </div>
              )}

              {filteredWarnings.length > 0 && (
                <div>
                  <SectionTitle>🟠 Warning</SectionTitle>
                  {filteredWarnings.map((item) => (
                    <AlertCard key={item.id} $severity="warning">
                      <AlertInfo>
                        <AlertTitle>{item.title}</AlertTitle>
                        <AlertDesc>{item.description}</AlertDesc>
                      </AlertInfo>
                      <ViewButton onClick={() => handleViewDetails(item.machineId)}>
                        View Details
                      </ViewButton>
                    </AlertCard>
                  ))}
                </div>
              )}

              <HistoricalTrendAnalysis currentFilter={currentFilter} />

              <div>
                <SectionTitle>📋 Historical Anomaly Detection</SectionTitle>

                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <HistoricalItem key={item.id}>
                      <span>{item.machine} – {item.issue}</span>
                      <span>{item.time}</span>
                    </HistoricalItem>
                  ))
                ) : (
                  <EmptyState>No historical anomaly record for this line.</EmptyState>
                )}
              </div>
            </Content>
          </>
        ) : (
          <Content>
            <DetailView
              machineId={selectedMachine}
              data={getDetailData(selectedMachine)}
              onBack={handleBackToList}
              onAction={handleAction}
            />
          </Content>
        )}
      </Modal>
    </Overlay>
  );
}
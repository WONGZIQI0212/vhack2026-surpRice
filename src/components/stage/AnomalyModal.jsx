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
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
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
  &:hover { color: ${T.text}; }
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
  gap: 16px;
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
    p.$severity === 'alert' ? 'linear-gradient(135deg, #7f1d1d, #b91c1c)' :
    p.$severity === 'warning' ? 'linear-gradient(135deg, #92400e, #b45309)' :
    'transparent'};
  color: ${(p) => (p.$severity ? 'white' : T.text)};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border: ${(p) => p.$severity ? 'none' : `1px solid ${T.border}`};
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
  opacity: 0.9;
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
  padding: 6px 0;
  border-bottom: 1px dashed ${T.border};
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
      <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
        <p style={{ marginBottom: '8px' }}><strong>Reason:</strong> {data.reason}</p>
        <p><strong>Data:</strong> {data.data}</p>
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
              {actionTaken === sol.action ? '✅ ' + (sol.action === 'maintenance' ? 'Maintenance Contacted' : 'Machine Stopped') : sol.label}
            </button>
            <p style={{ fontSize: '0.7rem', color: T.muted, marginTop: '4px' }}>{sol.consequence}</p>
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

const getDetailData = (machineId) => {
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
};

export default function AnomalyModal({ isOpen, onClose, filter, onFilterChange, onViewDetails, historicalAlerts,
    onResolveAlert,  }) {
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

  const filteredAlerts = alertsData.filter(a => {
    if (currentFilter === 'overall') return true;
    if (currentFilter === 'line1') return a.machineId.startsWith('line1');
    if (currentFilter === 'line2') return a.machineId.startsWith('line2');
    if (currentFilter === 'line3') return a.machineId.startsWith('line3');
    return true;
  });

  const filteredWarnings = warningsData.filter(w => {
    if (currentFilter === 'overall') return true;
    if (currentFilter === 'line1') return w.machineId.startsWith('line1');
    if (currentFilter === 'line2') return w.machineId.startsWith('line2');
    if (currentFilter === 'line3') return w.machineId.startsWith('line3');
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
                      <ViewButton $primary onClick={() => handleViewDetails(item.machineId)}>
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

              <div>
              <SectionTitle>📋 Historical Anomaly Detection</SectionTitle>
    {historicalAlerts.map((item) => (
      <HistoricalItem key={item.id}>
        <span>{item.machine} – {item.issue}</span>
        <span>{item.time}</span>
      </HistoricalItem>
    ))}
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
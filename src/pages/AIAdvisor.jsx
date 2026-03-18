import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import { T } from '../styles/theme';
import { getAdvisorData, actions as mockActions } from '../data/mockAdvisorData';

// Animation for KPI number update
const pulseNumber = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.02); color: ${T.success}; }
  100% { opacity: 1; transform: scale(1); }
`;

const PageWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const KPICard = styled(GlassCard)`
  padding: 18px 20px;
  min-height: auto;
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
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1px;
  color: ${(p) => p.$color || T.text};
  font-variant-numeric: tabular-nums;
  animation: ${(p) => (p.$animate ? pulseNumber : 'none')} 0.6s ease;
`;

const KPISub = styled.div`
  margin-top: 8px;
  font-size: 0.7rem;
  color: ${T.sub};
`;

const ChartCard = styled(GlassCard)`
  padding: 18px 20px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ChartTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.muted};
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SliderLabel = styled.span`
  font-size: 0.65rem;
  color: ${T.sub};
`;

const Slider = styled.input`
  width: 200px;
  accent-color: ${T.accent};
`;

const SliderValue = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${T.accent};
  min-width: 40px;
`;

const ConflictBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
  background: rgba(220,38,38,0.1);
  color: ${T.danger};
  border: 1px solid rgba(220,38,38,0.2);
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
`;

const ActionCard = styled(GlassCard)`
  padding: 16px;
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${T.text};
  margin-bottom: 10px;
`;

const ActionDesc = styled.div`
  font-size: 0.7rem;
  color: ${T.sub};
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ActionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.65rem;
  color: ${T.muted};
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: ${(p) =>
    p.$approved
      ? 'linear-gradient(135deg, #059669, #10b981)'
      : `linear-gradient(135deg, ${T.accent}, ${T.accentM})`};
  color: white;
  font-weight: 700;
  font-size: 0.65rem;
  cursor: ${(p) => (p.$approved ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$approved ? 0.8 : 1)};
  transition: transform 0.1s, opacity 0.2s;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(23,72,200,0.3);
  }
`;

export default function AIAdvisor({ mId }) {
  const [multiplier, setMultiplier] = useState(1.0);
  const [data, setData] = useState(() => getAdvisorData(1.0));
  const [approvedActions, setApprovedActions] = useState([]);
  const [animateKPI, setAnimateKPI] = useState(false);

  // Update data and trigger KPI animation when slider changes
  useEffect(() => {
    setData(getAdvisorData(multiplier));
    setAnimateKPI(true);
    const timer = setTimeout(() => setAnimateKPI(false), 800);
    return () => clearTimeout(timer);
  }, [multiplier]);

  const chartData = data.labels.map((label, i) => ({
    name: label,
    capacity: data.capacity[i],
    demand: data.demand[i],
  }));

  const handleApprove = (actionId) => {
    setApprovedActions((prev) => [...prev, actionId]);
  };

  return (
    <PageWrap>
      {/* KPI Cards */}
      <KPIGrid>
        <KPICard>
          <KPILabel>💰 30‑Day Net Profit</KPILabel>
          <KPIValue $animate={animateKPI}>
            RM {data.kpi.profit30d.toLocaleString()}
          </KPIValue>
          <KPISub>Based on current production plan</KPISub>
        </KPICard>
        <KPICard>
          <KPILabel>🛡️ AI‑Recovered Loss</KPILabel>
          <KPIValue $color={T.success} $animate={animateKPI}>
            RM {data.kpi.aiSaved.toLocaleString()}
          </KPIValue>
          <KPISub>Through optimized maintenance/procurement</KPISub>
        </KPICard>
        <KPICard>
          <KPILabel>⚠️ Capacity Risk Index</KPILabel>
          <KPIValue $color={data.kpi.riskIndex > 30 ? T.warning : T.success} $animate={animateKPI}>
            {data.kpi.riskIndex}%
          </KPIValue>
          <KPISub>Probability of demand exceeding safe capacity</KPISub>
        </KPICard>
      </KPIGrid>

      {/* Demand vs Capacity Chart + What‑If Slider */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>📈 Demand vs Safe Capacity · Next 30 Days</ChartTitle>
          <SliderWrapper>
            <SliderLabel>Market volatility simulation</SliderLabel>
            <Slider
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            />
            <SliderValue>+{Math.round((multiplier - 1) * 100)}%</SliderValue>
          </SliderWrapper>
        </ChartHeader>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,210,225,0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke={T.accent}
                strokeWidth={2}
                dot={false}
                name="Safe Capacity"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Market Demand"
              />
              {/* Highlight areas where demand exceeds capacity */}
              {chartData.map((entry, index) => {
                if (entry.demand > entry.capacity) {
                  return (
                    <ReferenceArea
                      key={index}
                      x1={entry.name}
                      x2={entry.name}
                      y1={0}
                      y2={Math.max(entry.demand, entry.capacity)}
                      fill={T.danger}
                      fillOpacity={0.12}
                    />
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conflict hint */}
        {data.demand[14] > data.capacity[14] && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <ConflictBadge>
              ⚠️ Day 14 capacity deficit {Math.round((data.demand[14] - data.capacity[14]) / data.capacity[14] * 100)}%
            </ConflictBadge>
          </div>
        )}
      </ChartCard>

      {/* AI Action Cards */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>⚡ AI Strategic Recommendations</ChartTitle>
        </ChartHeader>
        <ActionGrid>
          {mockActions.map((action) => {
            const approved = approvedActions.includes(action.id);
            return (
              <ActionCard key={action.id}>
                <ActionTitle>
                  <span>{action.type === 'maintenance' ? '🔧' : '📦'}</span>
                  {action.title}
                </ActionTitle>
                <ActionDesc>{action.description}</ActionDesc>
                <ActionMeta>
                  <span>💰 Cost {action.cost}</span>
                  <span>✨ {action.impact}</span>
                </ActionMeta>
                <ActionButton
                  onClick={() => handleApprove(action.id)}
                  $approved={approved}
                  disabled={approved}
                >
                  {approved ? '✅ Approved' : '▶ Approve & Create Work Order'}
                </ActionButton>
              </ActionCard>
            );
          })}
        </ActionGrid>
      </ChartCard>
    </PageWrap>
  );
}
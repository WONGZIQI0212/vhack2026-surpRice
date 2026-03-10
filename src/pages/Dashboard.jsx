import React from 'react';
import styled from 'styled-components';
import GlassCard from '../components/ui/GlassCard';
import { T } from '../styles/theme';
import { MOCK_HEALTH_DATA } from '../data/MockMachineData';

const Label = styled.div`
  font-size: 0.58rem;
  color: ${T.muted};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 2.4rem;
  font-weight: 300;
  margin-bottom: 12px;
  letter-spacing: -1.5px;
  color: ${(p) => (p.$warning ? T.danger : T.text)}; // 状态异常时文字变色
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
`;

const BarGraph = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 46px;
  margin-top: auto;
`;

const Bar = styled.div`
  flex: 1;
  background: ${(p) => (p.$warning ? `linear-gradient(to top, ${T.danger}, #ff8080)` : `linear-gradient(to top, ${T.accent}, ${T.accentM})`)};
  height: ${(p) => p.h}%;
  opacity: ${(p) => 0.2 + p.i * 0.12};
  border-radius: 3px 3px 0 0;
  transition: all 0.5s ease;
`;

const DotMatrix = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  width: 140px;
  margin-top: auto;
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => (p.active ? (p.$warning ? T.danger : T.accent) : 'rgba(180,192,210,0.3)')};
  transition: background 0.3s;
`;

const CircleGauge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(180,192,210,0.4);
  position: relative;
  margin-top: auto;

  &::after {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    border-radius: 50%;
    border: 2.5px solid ${(p) => (p.$warning ? T.danger : T.accent)};
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(${(p) => -45 + (p.$score || 0) * 2}deg); // 角度随分数变化
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

export default function Dashboard({ mId }) {
  // 1. 获取对应数据，如果没有则 fallback 到 overall
  const data = MOCK_HEALTH_DATA[mId] || MOCK_HEALTH_DATA['overall'];
  const isOverall = mId === 'overall';
  const isWarning = data.status !== 'normal';

  // 2. 处理显示数值 (处理带有单位的字符串)
  const displaySpeed = data.speed.split(' ')[0];
  const unit = data.speed.split(' ')[1] || 'kg/h';

  return (
    <>
      {/* 模块 1: 温度 */}
      <GlassCard>
        <Label>{isOverall ? 'Average Temp' : 'Core Temp'}</Label>
        <Value $warning={isWarning}>{data.temp}</Value>
        <BarGraph>
          {/* 使用数据中的 metrics 数组渲染图表，如果没有则生成一组默认值 */}
          {(data.metrics || [40, 50, 60, 70, 80, 90, 100]).map((h, i) => (
            <Bar key={i} h={h} i={i} $warning={isWarning} />
          ))}
        </BarGraph>
      </GlassCard>

      {/* 模块 2: 能耗 / 振动 (如果是单机，可以显示更具体的振动数据) */}
      <GlassCard>
        <Label>{isOverall ? 'Factory Energy Draw' : 'Vibration Level'}</Label>
        <Value>
          {isOverall ? '1.4k' : data.vibration?.split(' ')[0] || '12.4'}
          <span style={{ fontSize: '0.8rem', fontWeight: 400, color: T.sub }}>
            {' '}{isOverall ? 'kWh' : 'mm/s'}
          </span>
        </Value>
        <DotMatrix>
          {Array.from({ length: 20 }).map((_, i) => (
            <Dot 
              key={i} 
              active={isOverall ? i < 16 : i < (parseFloat(data.vibration) * 4 || 8)} 
              $warning={isWarning}
            />
          ))}
        </DotMatrix>
      </GlassCard>

      {/* 模块 3: 产量 / 健康评分 */}
      <GlassCard>
        <Label>{isOverall ? 'Total Production' : 'Health Score'}</Label>
        <Value $warning={isWarning}>
          {isOverall ? data.speed : `${data.healthScore}%`}
        </Value>
        <CircleGauge $warning={isWarning} $score={data.healthScore} />
      </GlassCard>
    </>
  );
}
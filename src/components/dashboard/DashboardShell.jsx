import React, { useMemo } from "react";
import styled from "styled-components";
import GlassCard from "../ui/GlassCard";
import { T, STATUS_CONFIG } from "../../styles/theme";
import { MOCK_HEALTH_DATA, getLineHealth } from "../../data/MockMachineData";
import { getMinuteDataById, getMinuteStats } from "../../data/mockMinuteData";
import { useAnomaly } from "../../context/AnomalyContext";

import SummaryCard, { AccentText } from "./SummaryCard";
import ChartCard from "./ChartCard";
import MinuteTableCard from "./MinuteTableCard";
import {
  AIMaintenanceInsightCard,
  PerformanceDistributionCard,
} from "./InsightCard";

/* =========================
   Layout
========================= */
const PageWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.muted};
  padding-left: 2px;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  gap: 12px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.div`
  font-size: 0.56rem;
  color: ${T.muted};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 700;
`;

const BigValue = styled.div`
  font-size: ${(p) => (p.$hero ? "3rem" : "2rem")};
  font-weight: ${(p) => (p.$hero ? 300 : 400)};
  line-height: 1;
  letter-spacing: -1.6px;
  font-variant-numeric: tabular-nums;
  color: ${(p) =>
    p.$tone === "danger"
      ? T.danger
      : p.$tone === "warning"
      ? T.warning
      : p.$tone === "success"
      ? T.success
      : T.text};
`;

const SmallSub = styled.div`
  margin-top: 8px;
  font-size: 0.74rem;
  color: ${T.sub};
  line-height: 1.6;
`;

const HeroTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${(p) => STATUS_CONFIG[p.$s].bg};
  border: 1px solid ${(p) => STATUS_CONFIG[p.$s].border};
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => STATUS_CONFIG[p.$s].color};
`;

const ChipDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => STATUS_CONFIG[p.$s].color};
`;

const MiniPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.62rem;
  font-weight: 700;
  color: ${T.sub};
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(221, 227, 239, 0.8);
`;

const HeroDivider = styled.div`
  height: 1px;
  background: rgba(221, 227, 239, 0.8);
  margin: 14px 0 14px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(180, 192, 210, 0.18);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${(p) => p.$v}%;
  height: 100%;
  border-radius: 999px;
  background: ${(p) =>
    p.$tone === "danger"
      ? `linear-gradient(90deg, ${T.danger}, #f87171)`
      : p.$tone === "warning"
      ? `linear-gradient(90deg, ${T.warning}, #fbbf24)`
      : `linear-gradient(90deg, ${T.success}, #34d399)`};
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const MetricBox = styled.div`
  border-radius: 14px;
  padding: 12px 12px 10px;
  background: rgba(255, 255, 255, 0.38);
  border: 1px solid rgba(221, 227, 239, 0.7);
`;

const MetricLabel = styled.div`
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.muted};
`;

const MetricValue = styled.div`
  margin-top: 8px;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${(p) =>
    p.$tone === "danger"
      ? T.danger
      : p.$tone === "warning"
      ? T.warning
      : p.$tone === "success"
      ? T.success
      : T.text};
`;

const HeroChartWrap = styled.div`
  margin-top: 18px;
  height: 165px;
`;

const AnalyticsHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const AnalyticsHint = styled.div`
  font-size: 0.72rem;
  color: ${T.sub};
`;

const TableSectionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function getPoints(values, width, height) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * (height - 22) - 11;
    return `${x},${y}`;
  });
}

function HeroLineChart({ values, tone = "accent", id = "hero-chart" }) {
  const W = 640;
  const H = 165;
  const pts = getPoints(values, W, H);

  if (!pts.length) return null;

  const areaPath = `M${pts[0]} L${pts.join(" L")} L${W},${H} L0,${H} Z`;
  const linePath = `M${pts.join(" L")}`;

  const color =
    tone === "danger"
      ? T.danger
      : tone === "warning"
      ? T.warning
      : tone === "success"
      ? T.success
      : T.accent;

  return (
    <HeroChartWrap>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`hero-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill={`url(#hero-fill-${id})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </HeroChartWrap>
  );
}

export default function DashboardShell({ mId }) {
  const { getMachineData } = useAnomaly() || {};

  const isOverall = mId === "overall";
  const isLine = ["line1", "line2", "line3"].includes(mId);

  const lineHealth = isLine ? getLineHealth(mId) : null;
  const originalData =
    lineHealth || MOCK_HEALTH_DATA[mId] || MOCK_HEALTH_DATA.overall;
  const data = getMachineData ? getMachineData(mId, originalData) : originalData;

  const minuteRows = useMemo(() => getMinuteDataById(mId), [mId]);
  const stats = useMemo(() => getMinuteStats(minuteRows), [minuteRows]);

  const status = data.status;
  const tone =
    status === "emergency"
      ? "danger"
      : status === "warning"
      ? "warning"
      : "success";

  const latest = minuteRows[minuteRows.length - 1] || {};

  const tempValues = minuteRows.map((r) => Number(r.temp));
  const vibValues = minuteRows.map((r) => Number(r.vibration));
  const loadValues = minuteRows.map((r) => Number(r.load));
  const energyValues = minuteRows.map((r) => Number(r.energy));

  const tempTone =
    Number(stats.avgTemp) > 65
      ? "danger"
      : Number(stats.avgTemp) > 55
      ? "warning"
      : "success";

  const maxTempTone =
    Number(stats.maxTemp) > 65
      ? "danger"
      : Number(stats.maxTemp) > 55
      ? "warning"
      : "success";

  const vibTone =
    Number(stats.avgVibration) > 3
      ? "danger"
      : Number(stats.avgVibration) > 1.5
      ? "warning"
      : "success";

  const loadTone = Number(latest.load) > 85 ? "warning" : "success";

  const anomalyTone =
    stats.anomalyCount > 2
      ? "danger"
      : stats.anomalyCount > 0
      ? "warning"
      : "success";

  return (
    <PageWrap>
      <Section>
        <SectionTitle>Operations Overview</SectionTitle>

        <HeroGrid>
          <GlassCard style={{ minHeight: 320 }}>
            <HeroTop>
              <div>
                <Label>{isOverall ? "Factory Health" : "Machine Health"}</Label>
                <BigValue $hero $tone={tone}>
                  {data.healthScore}%
                </BigValue>
                <SmallSub>
                  {isOverall ? "Overall production environment" : `Asset: ${mId}`} is
                  currently in{" "}
                  <AccentText $tone={tone}>
                    {STATUS_CONFIG[status].label}
                  </AccentText>{" "}
                  condition.
                </SmallSub>
              </div>

              <HeroMeta>
                <StatusChip $s={status}>
                  <ChipDot $s={status} />
                  {STATUS_CONFIG[status].label}
                </StatusChip>

                <MiniPill>
                  Last 60 min
                </MiniPill>
              </HeroMeta>
            </HeroTop>

            <HeroDivider />

            <SmallSub>
              Live operating load remains at{" "}
              <AccentText $tone={loadTone}>
                {latest.load?.toFixed?.(1) ?? "--"}%
              </AccentText>
              , while current energy draw is{" "}
              <AccentText>
                {latest.energy?.toFixed?.(1) ?? "--"} kWh
              </AccentText>
              . Recent trend shows{" "}
              <AccentText $tone={tone}>
                {status === "emergency"
                  ? "critical instability"
                  : status === "warning"
                  ? "early warning signals"
                  : "stable operating behavior"}
              </AccentText>
              .
            </SmallSub>

            <div style={{ marginTop: 14 }}>
              <ProgressTrack>
                <ProgressFill $v={data.healthScore} $tone={tone} />
              </ProgressTrack>
            </div>

            <MetricRow>
              <MetricBox>
                <MetricLabel>Live Temp</MetricLabel>
                <MetricValue
                  $tone={
                    Number(latest.temp) > 65
                      ? "danger"
                      : Number(latest.temp) > 55
                      ? "warning"
                      : "success"
                  }
                >
                  {latest.temp?.toFixed?.(1) ?? "--"} °C
                </MetricValue>
              </MetricBox>

              <MetricBox>
                <MetricLabel>Live Vibration</MetricLabel>
                <MetricValue
                  $tone={
                    Number(latest.vibration) > 3
                      ? "danger"
                      : Number(latest.vibration) > 1.5
                      ? "warning"
                      : "success"
                  }
                >
                  {latest.vibration?.toFixed?.(2) ?? "--"} mm/s
                </MetricValue>
              </MetricBox>

              <MetricBox>
                <MetricLabel>Line Speed</MetricLabel>
                <MetricValue>{latest.speed ?? "--"}</MetricValue>
              </MetricBox>
            </MetricRow>

            <HeroLineChart
              values={tempValues.length ? tempValues : [0, 0]}
              tone={maxTempTone}
              id={`hero-${mId}`}
            />
          </GlassCard>

          <KPIGrid>
            <SummaryCard
              label="Average Temp"
              value={`${stats.avgTemp}°C`}
              tone={tempTone}
              sub={
                <>
                  Peak reached{" "}
                  <AccentText $tone={maxTempTone}>{stats.maxTemp}°C</AccentText>
                </>
              }
            />

            <SummaryCard
              label="Average Vibration"
              value={`${stats.avgVibration} mm/s`}
              tone={vibTone}
              sub={
                <>
                  Latest reading{" "}
                  <AccentText
                    $tone={
                      Number(latest.vibration) > 3
                        ? "danger"
                        : Number(latest.vibration) > 1.5
                        ? "warning"
                        : "success"
                    }
                  >
                    {latest.vibration?.toFixed?.(2) ?? "--"} mm/s
                  </AccentText>
                </>
              }
            />

            <SummaryCard
              label="Anomaly Events"
              value={`${stats.anomalyCount}`}
              tone={anomalyTone}
              sub={
                <>
                  Detected in last <AccentText>60 minutes</AccentText>
                </>
              }
            />

            <SummaryCard
              label="Efficiency"
              value={isOverall ? "92.4%" : "88.7%"}
              tone="success"
              sub={
                <>
                  Current workload at{" "}
                  <AccentText $tone={loadTone}>
                    {latest.load?.toFixed?.(1) ?? "--"}%
                  </AccentText>
                </>
              }
            />
          </KPIGrid>
        </HeroGrid>
      </Section>

      <Section>
        <AnalyticsHeader>
          <SectionTitle>Trend Analytics</SectionTitle>
          <AnalyticsHint>
            Machine telemetry visualized by severity and recent usage pattern
          </AnalyticsHint>
        </AnalyticsHeader>

        <Grid2>
          <ChartCard
            label="Temperature Trend"
            value={stats.avgTemp}
            unit="°C"
            sub={
              <>
                Thermal pattern over last <AccentText>60 minutes</AccentText>
              </>
            }
            tone={maxTempTone}
            type="line"
            values={tempValues}
            id="temp"
          />

          <ChartCard
            label="Vibration Trend"
            value={stats.avgVibration}
            unit="mm/s"
            sub="Mechanical stability monitoring"
            tone={vibTone}
            type="line"
            values={vibValues}
            id="vibration"
          />
        </Grid2>

        <Grid2>
          <ChartCard
            label="Load Trend"
            value={stats.avgLoad}
            unit="%"
            sub="Workload fluctuation across recent minute readings"
            tone="accent"
            type="line"
            values={loadValues}
            id="load"
          />

          <ChartCard
            label="Energy Trend"
            value={latest.energy?.toFixed?.(1) ?? "--"}
            unit="kWh"
            sub="Current draw versus recent usage pattern"
            type="bar"
            values={energyValues}
            barToneResolver={(_, i) => (i > 8 ? "warning" : "accent")}
          />
        </Grid2>
      </Section>

      <Section>
        <SectionTitle>Decision Support</SectionTitle>
        <Grid2>
          <AIMaintenanceInsightCard status={status} />
          <PerformanceDistributionCard
            stats={stats}
            healthScore={data.healthScore}
          />
        </Grid2>
      </Section>

      <Section>
        <SectionTitle>Minute-Level Monitoring</SectionTitle>
        <TableSectionCard>
          <MinuteTableCard rows={minuteRows} />
        </TableSectionCard>
      </Section>
    </PageWrap>
  );
}
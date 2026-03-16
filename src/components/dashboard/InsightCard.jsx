import React from "react";
import styled from "styled-components";
import { T } from "../../styles/theme";
import GlassCard from "../ui/GlassCard";

const Label = styled.div`
  font-size: 0.56rem;
  color: ${T.muted};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 700;
`;

const SmallSub = styled.div`
  margin-top: 8px;
  font-size: 0.74rem;
  color: ${T.sub};
  line-height: 1.5;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 9px;
  border-radius: 999px;
  background: rgba(180, 192, 210, 0.2);
  overflow: hidden;
  margin-top: 12px;
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

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InsightItem = styled.div`
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid
    ${(p) =>
      p.$danger
        ? "rgba(220,38,38,0.18)"
        : p.$warn
        ? "rgba(217,119,6,0.18)"
        : "rgba(23,72,200,0.12)"};
  background: ${(p) =>
    p.$danger
      ? "rgba(220,38,38,0.06)"
      : p.$warn
      ? "rgba(217,119,6,0.06)"
      : "rgba(23,72,200,0.04)"};
`;

const InsightTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${T.text};
`;

const InsightDesc = styled.div`
  margin-top: 6px;
  font-size: 0.74rem;
  line-height: 1.6;
  color: ${T.sub};
`;

export function AIMaintenanceInsightCard({ status }) {
  return (
    <GlassCard style={{ minHeight: 230 }}>
      <Label>AI Maintenance Insights</Label>

      <InsightList>
        <InsightItem $danger={status === "emergency"} $warn={status === "warning"}>
          <InsightTitle>
            {status === "emergency"
              ? "Critical anomaly pattern detected"
              : status === "warning"
              ? "Preventive maintenance recommended"
              : "System operating within normal threshold"}
          </InsightTitle>

          <InsightDesc>
            {status === "emergency"
              ? "Multiple risky spikes were detected across vibration and load readings. Immediate inspection is recommended to prevent unplanned shutdown."
              : status === "warning"
              ? "Rising thermal and vibration trends suggest component wear. Schedule inspection for bearings, alignment, or lubrication."
              : "All core metrics remain in acceptable range. Continue automated observation and standard maintenance cycle."}
          </InsightDesc>
        </InsightItem>

        <InsightItem>
          <InsightTitle>Recommended action</InsightTitle>
          <InsightDesc>
            Check components with highest stress exposure, especially where load
            and vibration rise together. Prioritize units showing repeated anomaly flags.
          </InsightDesc>
        </InsightItem>
      </InsightList>
    </GlassCard>
  );
}

export function PerformanceDistributionCard({ stats, healthScore }) {
  return (
    <GlassCard style={{ minHeight: 230 }}>
      <Label>Performance Distribution</Label>
      <SmallSub>Metrics colored by severity to improve readability</SmallSub>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <SmallSub style={{ marginTop: 0 }}>Temperature Severity</SmallSub>
          <ProgressTrack>
            <ProgressFill
              $v={Math.min((Number(stats.maxTemp) / 80) * 100, 100)}
              $tone={Number(stats.maxTemp) > 65 ? "danger" : "warning"}
            />
          </ProgressTrack>
        </div>

        <div>
          <SmallSub style={{ marginTop: 0 }}>Vibration Severity</SmallSub>
          <ProgressTrack>
            <ProgressFill
              $v={Math.min((Number(stats.maxVibration) / 5) * 100, 100)}
              $tone={Number(stats.maxVibration) > 3 ? "danger" : "warning"}
            />
          </ProgressTrack>
        </div>

        <div>
          <SmallSub style={{ marginTop: 0 }}>Health Confidence</SmallSub>
          <ProgressTrack>
            <ProgressFill
              $v={healthScore}
              $tone={
                healthScore < 70
                  ? "danger"
                  : healthScore < 90
                  ? "warning"
                  : "success"
              }
            />
          </ProgressTrack>
        </div>
      </div>
    </GlassCard>
  );
}
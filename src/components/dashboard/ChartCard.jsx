import React from "react";
import styled from "styled-components";
import GlassCard from "../ui/GlassCard";
import { T } from "../../styles/theme";

const Card = styled(GlassCard)`
  min-height: 255px;
  padding: 18px 20px 18px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-size: 0.56rem;
  color: ${T.muted};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 800;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const BigValue = styled.div`
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -1px;
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

const Unit = styled.span`
  font-size: 0.82rem;
  color: ${T.sub};
`;

const SmallSub = styled.div`
  font-size: 0.73rem;
  line-height: 1.5;
  color: ${T.sub};
  max-width: 90%;
`;

const StatusText = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${(p) =>
    p.$tone === "danger"
      ? T.danger
      : p.$tone === "warning"
      ? T.warning
      : p.$tone === "success"
      ? T.success
      : T.muted};
  white-space: nowrap;
`;

const ChartWrap = styled.div`
  margin-top: 16px;
  height: 145px;
`;

const Footer = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const FooterItem = styled.div`
  font-size: 0.68rem;
  color: ${T.sub};
`;

const FooterStrong = styled.span`
  color: ${T.text};
  font-weight: 700;
`;

const BarRow = styled.div`
  height: 145px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding-top: 8px;
`;

const Bar = styled.div`
  flex: 1;
  border-radius: 8px 8px 4px 4px;
  height: ${(p) => p.$h}%;
  min-height: 12px;
  background: ${(p) =>
    p.$tone === "danger"
      ? "rgba(220,38,38,0.82)"
      : p.$tone === "warning"
      ? "rgba(217,119,6,0.78)"
      : p.$tone === "success"
      ? "rgba(5,150,105,0.78)"
      : "rgba(23,72,200,0.72)"};
`;

function toneColor(tone) {
  if (tone === "danger") return T.danger;
  if (tone === "warning") return T.warning;
  if (tone === "success") return T.success;
  return T.accent;
}

function toneLabel(tone) {
  if (tone === "danger") return "Critical";
  if (tone === "warning") return "Warning";
  if (tone === "success") return "Healthy";
  return "Normal";
}

function getPoints(values, width, height) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * (height - 20) - 10;
    return { x, y, value: v };
  });
}

function linePath(points) {
  if (!points.length) return "";
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
}

function areaPath(points, width, height) {
  if (!points.length) return "";
  return `M ${points[0].x} ${height} L ${points
    .map((p) => `${p.x} ${p.y}`)
    .join(" L ")} L ${points[points.length - 1].x} ${height} Z`;
}

function MinimalLineChart({ values, tone, id }) {
  const W = 360;
  const H = 145;
  const color = toneColor(tone);
  const pts = getPoints(values, W, H);

  if (!pts.length) return null;

  const last = pts[pts.length - 1];

  return (
    <ChartWrap>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[25, 50, 75].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={(H * y) / 100}
            x2={W}
            y2={(H * y) / 100}
            stroke="rgba(160,174,192,0.18)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath(pts, W, H)} fill={`url(#area-${id})`} />
        <path
          d={linePath(pts)}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === pts.length - 1 ? 3.2 : 0}
            fill={color}
          />
        ))}

        <circle
          cx={last.x}
          cy={last.y}
          r="6"
          fill={color}
          opacity="0.12"
        />
      </svg>
    </ChartWrap>
  );
}

function MinimalBarChart({ values, barToneResolver }) {
  if (!values.length) return null;

  const shown = values.slice(-12);
  const max = Math.max(...shown, 1);

  return (
    <ChartWrap>
      <BarRow>
        {shown.map((v, i) => {
          const tone = barToneResolver ? barToneResolver(v, i) : "accent";
          const h = Math.max(12, (v / max) * 100);
          return <Bar key={i} $h={h} $tone={tone} />;
        })}
      </BarRow>
    </ChartWrap>
  );
}

export default function ChartCard({
  label,
  value,
  unit,
  sub,
  tone = "accent",
  type = "line",
  values = [],
  id = "chart",
  barToneResolver,
}) {
  const latest = values.length ? values[values.length - 1] : "--";
  const peak = values.length ? Math.max(...values) : "--";

  return (
    <Card>
      <Header>
        <TitleBlock>
          <Label>{label}</Label>

          <ValueRow>
            <BigValue $tone={tone}>{value}</BigValue>
            {unit && <Unit>{unit}</Unit>}
          </ValueRow>

          <SmallSub>{sub}</SmallSub>
        </TitleBlock>

        <StatusText $tone={tone}>{toneLabel(tone)}</StatusText>
      </Header>

      {type === "line" ? (
        <MinimalLineChart values={values} tone={tone} id={id} />
      ) : (
        <MinimalBarChart values={values} barToneResolver={barToneResolver} />
      )}

      <Footer>
        <FooterItem>
          Latest <FooterStrong>{latest}</FooterStrong>
        </FooterItem>
        <FooterItem>
          Peak <FooterStrong>{peak}</FooterStrong>
        </FooterItem>
      </Footer>
    </Card>
  );
}
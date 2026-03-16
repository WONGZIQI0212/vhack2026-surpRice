import React from "react";
import styled from "styled-components";
import GlassCard from "../ui/GlassCard";
import { T } from "../../styles/theme";

const Label = styled.div`
  font-size: 0.56rem;
  color: ${T.muted};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 700;
`;

const BigValue = styled.div`
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1.2px;
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
  line-height: 1.5;
`;

export const AccentText = styled.span`
  color: ${(p) =>
    p.$tone === "danger"
      ? T.danger
      : p.$tone === "warning"
      ? T.warning
      : p.$tone === "success"
      ? T.success
      : T.accent};
  font-weight: 700;
`;

export default function SummaryCard({ label, value, sub, tone }) {
  return (
    <GlassCard style={{ minHeight: 155 }}>
      <Label>{label}</Label>
      <BigValue $tone={tone}>{value}</BigValue>
      <SmallSub>{sub}</SmallSub>
    </GlassCard>
  );
}
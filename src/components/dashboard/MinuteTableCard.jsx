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

const TableWrap = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid rgba(221, 227, 239, 0.8);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.38);
`;

const Table = styled.table`
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.8);
  text-align: left;
  padding: 12px 14px;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.muted};
  border-bottom: 1px solid ${T.border};
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.78rem;
  color: ${T.text};
  border-bottom: 1px solid rgba(221, 227, 239, 0.6);
  font-variant-numeric: tabular-nums;
`;

const RowBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => (p.$alert ? T.danger : T.success)};
  background: ${(p) =>
    p.$alert ? "rgba(220,38,38,0.08)" : "rgba(5,150,105,0.08)"};
  border: 1px solid
    ${(p) =>
      p.$alert ? "rgba(220,38,38,0.16)" : "rgba(5,150,105,0.16)"};
`;

export default function MinuteTableCard({ rows = [] }) {
  return (
    <GlassCard style={{ minHeight: 340 }}>
      <Label>Recent Telemetry Table</Label>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Temp</Th>
              <Th>Vibration</Th>
              <Th>Speed</Th>
              <Th>Load</Th>
              <Th>Energy</Th>
              <Th>Status</Th>
            </tr>
          </thead>

          <tbody>
            {rows.slice(-20).reverse().map((row) => (
              <tr key={row.time}>
                <Td>{row.time}</Td>

                <Td
                  style={{
                    color:
                      row.temp > 65
                        ? T.danger
                        : row.temp > 55
                        ? T.warning
                        : T.text,
                  }}
                >
                  {row.temp.toFixed(1)} °C
                </Td>

                <Td
                  style={{
                    color:
                      row.vibration > 3
                        ? T.danger
                        : row.vibration > 1.5
                        ? T.warning
                        : T.text,
                  }}
                >
                  {row.vibration.toFixed(2)} mm/s
                </Td>

                <Td>{row.speed}</Td>

                <Td style={{ color: row.load > 85 ? T.warning : T.text }}>
                  {row.load.toFixed(1)}%
                </Td>

                <Td>{row.energy.toFixed(1)} kWh</Td>

                <Td>
                  <RowBadge $alert={row.anomaly}>
                    {row.anomaly ? "Anomaly" : "Normal"}
                  </RowBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </GlassCard>
  );
}
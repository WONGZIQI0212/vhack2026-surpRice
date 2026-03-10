import React from 'react';
import styled from 'styled-components';
import GlassCard from '../components/ui/GlassCard';
import { T } from '../styles/theme';

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
  color: ${T.text};
  line-height: 1;
`;

const LOGS = {

'line1-husker':[
['02 Mar','Roller Alignment'],
['20 Feb','Bearing Lubrication']
],

'line1-milling':[
['01 Mar','Blade Inspection'],
['16 Feb','Sensor Calibration']
],

'line1-conveyor':[
['27 Feb','Belt Replacement'],
['10 Feb','Motor Inspection']
],

'line1-palletize':[
['25 Feb','Robot Arm Calibration'],
['08 Feb','Grip Sensor Reset']
],

'line2-husker':[
['03 Mar','Roller Replacement'],
['18 Feb','Lubrication Service']
],

'line2-milling':[
['28 Feb','Blade Sharpening'],
['14 Feb','Sensor Calibration']
],

'line2-conveyor':[
['26 Feb','Belt Alignment'],
['09 Feb','Motor Cleaning']
],

'line2-palletize':[
['24 Feb','Robot Joint Lubrication'],
['07 Feb','Grip Sensor Reset']
],

'line3-husker':[
['04 Mar','Roller Inspection'],
['19 Feb','Bearing Oil Change']
],

'line3-milling':[
['02 Mar','Blade Calibration'],
['17 Feb','Sensor Replacement']
],

'line3-conveyor':[
['25 Feb','Motor Alignment'],
['11 Feb','Belt Replacement']
],

'line3-palletize':[
['23 Feb','Robot Arm Reset'],
['06 Feb','Grip Calibration']
]

};

const NEXT_CHECK = {

'line1-husker':'18 MAR',
'line1-milling':'22 MAR',
'line1-conveyor':'15 MAR',
'line1-palletize':'19 MAR',

'line2-husker':'20 MAR',
'line2-milling':'23 MAR',
'line2-conveyor':'17 MAR',
'line2-palletize':'21 MAR',

'line3-husker':'19 MAR',
'line3-milling':'24 MAR',
'line3-conveyor':'18 MAR',
'line3-palletize':'16 MAR'

};

export default function Maintenance({mId}){

const logs = LOGS[mId] || [['01 Mar','System Inspection']];
const next = NEXT_CHECK[mId] || '20 MAR';

return(
<>
<GlassCard>

<Label>Recent Maintenance</Label>

<div style={{
borderTop:`1px solid rgba(200,210,225,0.5)`,
paddingTop:'12px',
display:'flex',
flexDirection:'column',
gap:10
}}>

{logs.map(([d,t])=>(
<div key={d} style={{display:'flex',gap:14}}>

<span style={{
fontSize:'0.62rem',
fontWeight:700,
letterSpacing:'0.08em',
color:T.muted,
minWidth:48
}}>
{d}
</span>

<span style={{fontSize:'0.85rem',color:T.sub}}>
{t}
</span>

</div>
))}

</div>
</GlassCard>

<GlassCard>

<Label>Next Scheduled Check</Label>

<Value style={{color:T.danger}}>
{next}
</Value>

<button style={{
width:'fit-content',
background:'transparent',
color:T.text,
border:`1px solid rgba(200,210,225,0.7)`,
padding:'9px 22px',
cursor:'pointer',
fontSize:'0.63rem',
fontWeight:700,
letterSpacing:'0.12em',
textTransform:'uppercase',
borderRadius:'8px'
}}>
Modify Date
</button>

</GlassCard>
</>
);
}
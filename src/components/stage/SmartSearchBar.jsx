import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { T } from '../../styles/theme';

const MACHINES = [
  { value: 'overall',         label: 'Overall Factory',      line: null,     lineId: 'overall'         },
  { value: 'line1-husker',    label: 'Paddy Husker 01',      line: 'Line 1', lineId: 'line1-husker'    },
  { value: 'line1-milling',   label: 'Rice Milling Unit 01', line: 'Line 1', lineId: 'line1-milling'   },
  { value: 'line1-conveyor',  label: 'Conveyor Belt 01',     line: 'Line 1', lineId: 'line1-conveyor'  },
  { value: 'line1-palletize', label: 'Palletizing Robot 01', line: 'Line 1', lineId: 'line1-palletize' },
  { value: 'line2-husker',    label: 'Paddy Husker 02',      line: 'Line 2', lineId: 'line2-husker'    },
  { value: 'line2-milling',   label: 'Rice Milling Unit 02', line: 'Line 2', lineId: 'line2-milling'   },
  { value: 'line2-conveyor',  label: 'Conveyor Belt 02',     line: 'Line 2', lineId: 'line2-conveyor'  },
  { value: 'line2-palletize', label: 'Palletizing Robot 02', line: 'Line 2', lineId: 'line2-palletize' },
  { value: 'line3-husker',    label: 'Paddy Husker 03',      line: 'Line 3', lineId: 'line3-husker'    },
  { value: 'line3-milling',   label: 'Rice Milling Unit 03', line: 'Line 3', lineId: 'line3-milling'   },
  { value: 'line3-conveyor',  label: 'Conveyor Belt 03',     line: 'Line 3', lineId: 'line3-conveyor'  },
  { value: 'line3-palletize', label: 'Palletizing Robot 03', line: 'Line 3', lineId: 'line3-palletize' },
];

const FONT = "'Plus Jakarta Sans', sans-serif";

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 999px;
  padding: 0 16px;
  height: 36px;
  box-shadow: 0 2px 12px rgba(13,17,23,0.08);
  transition: all 0.2s;

  &:focus-within {
    border-color: ${T.accentM};
    box-shadow: 0 4px 16px rgba(55,102,240,0.15);
    border-radius: 12px;
  }
`;

const SearchIcon = styled.span`
  color: ${T.muted};
  margin-right: 8px;
  font-size: 0.8rem;
  flex-shrink: 0;
  line-height: 1;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${FONT};
  font-size: 0.78rem;
  font-weight: 500;
  color: ${T.text};

  &::placeholder {
    font-family: ${FONT};
    color: ${T.muted};
    font-weight: 400;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.98);
  border: 1px solid ${T.border};
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(13,17,23,0.12);
  overflow: hidden;
  z-index: 50;
`;

const DropdownInner = styled.div`
  max-height: 280px;
  overflow-y: auto;
  padding: 6px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
`;

const GroupLabel = styled.div`
  padding: 8px 16px 4px;
  font-family: ${FONT};
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.muted};
`;

const Divider = styled.div`
  height: 1px;
  background: ${T.border};
  margin: 4px 0;
  opacity: 0.4;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-family: ${FONT};
  font-size: 0.82rem;
  font-weight: ${(p) => p.$active ? 600 : 400};
  color: ${(p) => p.$active ? T.accent : T.text};
  background: ${(p) => p.$active ? 'rgba(55,102,240,0.07)' : 'transparent'};
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: rgba(55,102,240,0.07); }
`;

const Check = styled.span`
  font-size: 0.65rem;
  color: ${T.accent};
  flex-shrink: 0;
`;

const Empty = styled.div`
  padding: 16px;
  font-family: ${FONT};
  font-size: 0.8rem;
  color: ${T.muted};
  text-align: center;
`;

export default function SmartSearchBar({ mId, currentTab, navigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const ref = useRef(null);

  const filtered    = MACHINES.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()));
  const topItems    = filtered.filter((m) => !m.line);
  const line1Items  = filtered.filter((m) => m.line === 'Line 1');
  const line2Items  = filtered.filter((m) => m.line === 'Line 2');
  const line3Items  = filtered.filter((m) => m.line === 'Line 3');

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (machine) => {
    setQuery('');
    setOpen(false);
    navigate(`/${machine.lineId}/${currentTab}`);
  };

  const isActive = (m) => mId === m.lineId || (mId === 'overall' && !m.line);

  const renderGroup = (label, items, divider) => {
    if (!items.length) return null;
    return (
      <>
        {divider && <Divider />}
        <GroupLabel>{label}</GroupLabel>
        {items.map((m) => (
          <Item key={m.value} $active={isActive(m)} onClick={() => handleSelect(m)}>
            {m.label}
            {isActive(m) && <Check>✓</Check>}
          </Item>
        ))}
      </>
    );
  };

  return (
    <SearchContainer ref={ref}>
      <InputWrapper>
        <SearchIcon>🔍</SearchIcon>
        <Input
          placeholder="Search machines..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onClick={() => setOpen(true)}
        />
      </InputWrapper>

      {open && (
        <Dropdown>
          <DropdownInner>
            {filtered.length === 0 ? (
              <Empty>No machines found</Empty>
            ) : (
              <>
                {topItems.map((m) => (
                  <Item key={m.value} $active={mId === 'overall'} onClick={() => handleSelect(m)}>
                    {m.label}
                    {mId === 'overall' && <Check>✓</Check>}
                  </Item>
                ))}
                {renderGroup('Line 1', line1Items, topItems.length > 0)}
                {renderGroup('Line 2', line2Items, line1Items.length > 0 || topItems.length > 0)}
                {renderGroup('Line 3', line3Items, line2Items.length > 0 || line1Items.length > 0 || topItems.length > 0)}
              </>
            )}
          </DropdownInner>
        </Dropdown>
      )}
    </SearchContainer>
  );
}
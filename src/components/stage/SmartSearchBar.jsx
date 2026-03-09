import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { T } from '../../styles/theme';

const MACHINES = [
  { value: 'overall', label: 'Overall Factory' },
  { value: 'machine1', label: 'Machine 01 — Assembly' },
  { value: 'conveyor', label: 'Conveyor Belt' },
  { value: 'valve', label: 'Funnel Valve' },
  { value: 'motor', label: 'Drive Motor' },
  { value: 'pump', label: 'Hydraulic Pump' },
  { value: 'sensor', label: 'Temperature Sensor' },
];

const SearchContainer = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 30;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${T.glassBorder};
  border-radius: 12px;
  padding: 0 16px;
  height: 44px;
  box-shadow: 0 4px 16px rgba(13, 17, 23, 0.1);
  transition: box-shadow 0.2s;

  &:focus-within {
    box-shadow: 0 6px 20px rgba(55, 102, 240, 0.15);
    border-color: ${T.accentM};
  }
`;

const SearchIcon = styled.span`
  color: ${T.muted};
  margin-right: 10px;
  font-size: 1.1rem;
  line-height: 1;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  color: ${T.text};
  &::placeholder {
    color: ${T.muted};
    font-weight: 400;
    opacity: 0.7;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 52px; 
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${T.glassBorder};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(13, 17, 23, 0.15);
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  z-index: 31;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
`;

const DropdownItem = styled.li`
  padding: 10px 18px;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${T.text};
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: rgba(55, 102, 240, 0.08);
  }

  ${({ $active }) =>
    $active &&
    `
    background: rgba(55, 102, 240, 0.12);
    font-weight: 600;
    color: ${T.accent};
  `}
`;

const ActiveIndicator = styled.span`
  font-size: 0.7rem;
  color: ${T.accent};
  margin-left: 8px;
`;

export default function SmartSearchBar({ mId, currentTab, navigate }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMachines, setFilteredMachines] = useState(MACHINES);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const filtered = MACHINES.filter((m) =>
      m.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredMachines(filtered);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (machine) => {
    setInputValue('');
    setShowDropdown(false);
    navigate(`/${machine.value}/${currentTab}`);
  };

  const handleInputClick = () => {
    setShowDropdown(true);
  };

  return (
    <SearchContainer ref={wrapperRef}>
      <InputWrapper>
        <SearchIcon>🔍</SearchIcon>
        <Input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
      </InputWrapper>

      {showDropdown && (
        <Dropdown>
          {filteredMachines.length > 0 ? (
            filteredMachines.map((machine) => (
              <DropdownItem
                key={machine.value}
                onClick={() => handleSelect(machine)}
                $active={machine.value === mId}
              >
                {machine.label}
                {machine.value === mId && <ActiveIndicator>✓</ActiveIndicator>}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem $active={false} style={{ cursor: 'default', color: T.muted }}>
              No machines found
            </DropdownItem>
          )}
        </Dropdown>
      )}
    </SearchContainer>
  );
}
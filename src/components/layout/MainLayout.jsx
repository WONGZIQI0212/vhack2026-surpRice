import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import GlobalStyle from '../../styles/globalStyle';
import { fadeUp } from '../../styles/animations';
import { T, STATUSES } from '../../styles/theme';

import Header from './Header';
import StageArea from '../stage/StageArea';

import Dashboard from '../../pages/Dashboard';
import AIPrediction from '../../pages/AIPrediction';
import Maintenance from '../../pages/Maintenance';

// 根据实际文件路径调整导入
import AnomalyBanner from './AnomalyBanner';               // 如果 AnomalyBanner 与 MainLayout 同目录
import AnomalyModal from '../stage/AnomalyModal';          // 如果 AnomalyModal 在 stage 目录
import useAnomalyMode from '../../hooks/useAnomalyMode';
import { AnomalyContext } from '../../context/AnomalyContext';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${T.bg};
  overflow: hidden;
  animation: ${fadeUp} 0.5s cubic-bezier(.22,.68,0,1.1) both;
`;

const ResizableBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const DragHandle = styled.div`
  height: 18px;
  flex-shrink: 0;
  margin: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  position: relative;
  z-index: 8;

  &::after {
    content: '';
    width: 48px;
    height: 4px;
    background: ${(p) => (p.$dragging ? T.accent : T.border)};
    border-radius: 3px;
    transition: background 0.2s, width 0.2s;
  }

  &:hover::after {
    background: ${T.accentM};
    width: 64px;
  }
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 80px;
`;

const TabBar = styled.nav`
  height: 7vh;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  padding: 0 32px;
  gap: 40px;
  align-items: center;
  background: ${T.surface};
  border-bottom: 1px solid ${T.border};
  position: relative;
  z-index: 9;
  box-shadow: 0 4px 16px rgba(13,17,23,0.04);
`;

const TabShimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(55,102,240,0.25) 40%,
    rgba(55,102,240,0.25) 60%,
    transparent
  );
`;

const TabLink = styled(NavLink)`
  text-decoration: none;
  font-size: 0.68rem;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.18s;
  padding-bottom: 5px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${T.accent}, ${T.accentM});
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.24s cubic-bezier(.34,1.56,.64,1);
  }

  &:hover {
    color: ${T.text};
  }

  &.active {
    color: ${T.accent};
  }

  &.active::after {
    transform: scaleX(1);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 12px 24px 16px 24px;
  display: flex;
  gap: 12px;
  overflow-y: auto; 
`;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mId } = useParams();
  const currentTab = location.pathname.split('/')[2] || 'dashboard';

  const bodyRef = useRef(null);
  const [stageH, setStageH] = useState(null);

  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const [statusIdx, setStatusIdx] = useState(0);
  const status = STATUSES[statusIdx];

  const {
    isAnomaly,
    anomalyTriggered,
    triggerAnomaly,
    resetAnomaly,
    getBannerInfo,
    getMachineStatus,
    getMachineData,
  } = useAnomalyMode();

  const bannerInfo = getBannerInfo(mId);
  const [showModal, setShowModal] = useState(false);
  const [modalFilter, setModalFilter] = useState('overall');
  const [historicalAlerts, setHistoricalAlerts] = useState([]);

  const handleResolveAlert = (machineId, action) => {
    const newEntry = {
      id: Date.now(),
      machine: machineId === 'line3-palletize' ? 'Line 3 · Palletizing Robot' : 'Line 2 · Conveyor Belt',
      issue: action === 'maintenance' ? 'Maintenance contacted' : 'Emergency stop',
      time: 'just now',
    };
    setHistoricalAlerts(prev => [newEntry, ...prev]);
  };
  
  
  // 初始化 3D 区域高度
  useEffect(() => {
    if (bodyRef.current) {
      setStageH(Math.round(bodyRef.current.clientHeight * 0.52));
    }
  }, []);

  // 当异常触发时自动打开弹窗
  useEffect(() => {
    if (anomalyTriggered) {
      setShowModal(true);
    }
  }, [anomalyTriggered]);

  const handleBannerClick = () => {
    setShowModal(true);
  };

  const handleViewDetails = (machineId) => {
    navigate(`/${machineId}/ai-prediction`);
  };

  const onMouseDown = useCallback(
    (e) => {
      dragging.current = true;
      startY.current = e.clientY;
      startH.current = stageH || 0;
      document.body.style.cursor = 'ns-resize';
      e.preventDefault();
    },
    [stageH]
  );

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !bodyRef.current) return;

      const delta = e.clientY - startY.current;
      const bodyH = bodyRef.current.clientHeight;

      setStageH(Math.max(80, Math.min(bodyH - 80, startH.current + delta)));
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const anomalyValue = {
    getMachineData,   // 提供给子组件
  };
  
  return (
    <AnomalyContext.Provider value={anomalyValue}>
      <GlobalStyle />
      <PageContainer>
        <Header />

        <ResizableBody ref={bodyRef}>
          <StageArea
            stageH={stageH}
            mId={mId}
            currentTab={currentTab}
            navigate={navigate}
            status={status}
            onStatusClick={() => setStatusIdx((i) => (i + 1) % STATUSES.length)}
            getMachineData={getMachineData}   // ✅ 修正为 getMachineData
          />

          <DragHandle $dragging={dragging.current} onMouseDown={onMouseDown} />

          <BottomSection>
            <TabBar>
              <TabShimmer />
              <TabLink to={`/${mId}/dashboard`}>Dashboard</TabLink>
              <TabLink to={`/${mId}/ai-prediction`}>AI Prediction</TabLink>
              <TabLink to={`/${mId}/maintenance`}>Maintenance Schedule</TabLink>
            </TabBar>

            <AnomalyBanner
              color={bannerInfo.color}
              message={bannerInfo.message}
              onClick={() => setShowModal(true)}
            />

            <ContentArea>
              <Routes>
                <Route path="dashboard" element={<Dashboard mId={mId} />} />
                <Route path="ai-prediction" element={<AIPrediction mId={mId} />} />
                <Route path="maintenance" element={<Maintenance mId={mId} />} />
              </Routes>
            </ContentArea>
          </BottomSection>
        </ResizableBody>

        <AnomalyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          filter={modalFilter}
          onFilterChange={setModalFilter}
          onViewDetails={handleViewDetails}
          historicalAlerts={historicalAlerts}
          onResolveAlert={handleResolveAlert}
        />
        <button
          onClick={triggerAnomaly}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            opacity: 0.1,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 999,
          }}
          title="Trigger Anomaly"
        />
      </PageContainer>
    </AnomalyContext.Provider>
  );
}
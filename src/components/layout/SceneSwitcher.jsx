import React, { Suspense, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Spline from '@splinetool/react-spline';
import { SCENES } from '../../styles/theme';
import { animateZoom } from '../../styles/animations';

const SceneLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity ${(p) => (p.$visible ? '0.6s' : '0.3s')} ease;
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #DDE3EF;
  border-top-color: #1748C8;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function SceneSwitcher({ mId }) {
  const appOverall = useRef(null);
  const appMachine1 = useRef(null);
  const prevMId = useRef(null);
  const [loading, setLoading] = useState({ overall: true, machine1: true });

  const handleLoadOverall = (app) => {
    appOverall.current = app;
    setLoading((l) => ({ ...l, overall: false }));
    animateZoom(app);
  };

  const handleLoadMachine1 = (app) => {
    appMachine1.current = app;
    setLoading((l) => ({ ...l, machine1: false }));
  };

  useEffect(() => {
    if (prevMId.current === null) {
      prevMId.current = mId;
      return;
    }

    if (prevMId.current === mId) return;

    prevMId.current = mId;

    const app = mId === 'overall' ? appOverall.current : appMachine1.current;
    if (app) animateZoom(app);
  }, [mId]);

  const isOverall = mId === 'overall';
  const isLoading = isOverall ? loading.overall : loading.machine1;

  return (
    <>
      <SceneLayer $visible={isOverall}>
        <Suspense fallback={null}>
          <Spline scene={SCENES.overall} onLoad={handleLoadOverall} />
        </Suspense>
      </SceneLayer>

      <SceneLayer $visible={!isOverall}>
        <Suspense fallback={null}>
          <Spline scene={SCENES.machine1} onLoad={handleLoadMachine1} />
        </Suspense>
      </SceneLayer>

      <LoadingOverlay $visible={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
    </>
  );
}
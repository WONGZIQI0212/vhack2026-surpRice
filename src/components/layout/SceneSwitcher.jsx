import React, { Suspense, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Spline from '@splinetool/react-spline';
import { SCENES } from '../../styles/theme';

// ─── Keyframe animations ─────────────────────────────────────────────────────

const zoomInEnter = keyframes`
  from { opacity: 0; transform: scale(1.12); }
  to   { opacity: 1; transform: scale(1); }
`;

const zoomOutExit = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(1.08); }
`;

const zoomOutBack = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.94); }
`;

const zoomInBack = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Styled layer ─────────────────────────────────────────────────────────────

const SceneLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: ${(p) => (p.$active ? 'auto' : 'none')};
  z-index: ${(p) => (p.$active ? 2 : 1)};
  transform-origin: center center;
  will-change: transform, opacity;

  ${(p) => p.$state === 'entering-machine' && css`
    animation: ${zoomInEnter} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  `}
  ${(p) => p.$state === 'exiting-to-machine' && css`
    animation: ${zoomOutExit} 0.5s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  `}
  ${(p) => p.$state === 'entering-factory' && css`
    animation: ${zoomInBack} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  `}
  ${(p) => p.$state === 'exiting-to-factory' && css`
    animation: ${zoomOutBack} 0.45s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  `}
  ${(p) => p.$state === 'idle-visible' && css`
    opacity: 1;
    transform: scale(1);
  `}
  ${(p) => p.$state === 'idle-hidden' && css`
    opacity: 0;
    transform: scale(1);
    pointer-events: none;
  `}
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
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIGGER_OBJECTS = {
  overall: 'TriggerOverall',
  line1:   'TriggerLine1',
  line2:   'TriggerLine2',
  line3:   'TriggerLine3',
};

const MACHINE_IDS = [
  'line1-husker', 'line1-milling', 'line1-conveyor', 'line1-palletize',
  'line2-husker', 'line2-milling', 'line2-conveyor', 'line2-palletize',
  'line3-husker', 'line3-milling', 'line3-conveyor', 'line3-palletize',
];

const isFactory = (id) => id in TRIGGER_OBJECTS;
const isNewMachine = (id) => id === 'new-machine';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SceneSwitcher({ mId, showNewMachine }) {
  const factoryApp   = useRef(null);
  const factoryReady = useRef(false);
  const pendingMId   = useRef(null);
  const triggerTimer = useRef(null);

  const [activeMId, setActiveMId] = useState(mId);
  const prevMId = useRef(mId);

  // Track previous showNewMachine to detect toggle
  const prevShowNew = useRef(false);

  const [states, setStates] = useState(() => {
    const s = { factory: isFactory(mId) ? 'idle-visible' : 'idle-hidden', 'new-machine': 'idle-hidden' };
    MACHINE_IDS.forEach((id) => { s[id] = mId === id ? 'idle-visible' : 'idle-hidden'; });
    return s;
  });

  const [loaded, setLoaded] = useState({ factory: false, 'new-machine': false });
  const markLoaded = (key) => setLoaded((l) => ({ ...l, [key]: true }));

  // ── Spline trigger ───────────────────────────────────────────────────────
  const doTrigger = (app, id) => {
    const objName = TRIGGER_OBJECTS[id];
    if (!app || !objName) return;
    if (triggerTimer.current) { clearTimeout(triggerTimer.current); triggerTimer.current = null; }
    try { app.emitEvent('mouseDown', objName); } catch (e) { console.warn('[Spline]', e); }
  };

  const handleFactoryLoad = (app) => {
    factoryApp.current = app;
    markLoaded('factory');
    triggerTimer.current = setTimeout(() => {
      factoryReady.current = true;
      const target = pendingMId.current || mId;
      if (isFactory(target)) doTrigger(app, target);
      pendingMId.current = null;
      triggerTimer.current = null;
    }, 800);
  };

  // ── Handle showNewMachine toggle ─────────────────────────────────────────
  useEffect(() => {
    const prev = prevShowNew.current;
    prevShowNew.current = showNewMachine;

    if (showNewMachine && !prev) {
      // Switch to new-machine scene
      const currentActive = activeMId;
      setStates((s) => ({ ...s, [currentActive]: 'exiting-to-machine' }));
      setTimeout(() => {
        setActiveMId('new-machine');
        setStates((s) => ({
          ...s,
          [currentActive]: 'idle-hidden',
          'new-machine': 'entering-machine',
        }));
        setTimeout(() => {
          setStates((s) => ({ ...s, 'new-machine': 'idle-visible' }));
        }, 750);
      }, 400);
    } else if (!showNewMachine && prev) {
      // Switch back to original scene
      setStates((s) => ({ ...s, 'new-machine': 'exiting-to-factory' }));
      setTimeout(() => {
        setActiveMId(mId);
        setStates((s) => ({
          ...s,
          'new-machine': 'idle-hidden',
          [isFactory(mId) ? 'factory' : mId]: 'entering-factory',
        }));
        setTimeout(() => {
          const key = isFactory(mId) ? 'factory' : mId;
          setStates((s) => ({ ...s, [key]: 'idle-visible' }));
          if (isFactory(mId) && factoryReady.current) doTrigger(factoryApp.current, mId);
        }, 650);
      }, 400);
    }
  }, [showNewMachine]);

  // ── mId transition orchestration ─────────────────────────────────────────
  useEffect(() => {
    const next = mId;
    const prev = prevMId.current;
    prevMId.current = next;

    if (next === prev) return;
    if (showNewMachine) return; // don't interfere while showing new machine

    const goingToMachine = !isFactory(next);
    const goingToFactory = isFactory(next);
    const fromMachine    = !isFactory(prev);

    const EXIT_DURATION = goingToMachine ? 500 : 450;
    const ENTER_DELAY   = EXIT_DURATION - 100;

    if (goingToMachine) {
      setStates((s) => ({
        ...s,
        factory: 'exiting-to-machine',
        [next]: 'idle-hidden',
      }));
      setTimeout(() => {
        setActiveMId(next);
        setStates((s) => ({
          ...s,
          factory: 'idle-hidden',
          [prev]: 'idle-hidden',
          [next]: 'entering-machine',
        }));
        setTimeout(() => {
          setStates((s) => ({ ...s, [next]: 'idle-visible' }));
        }, 750);
      }, ENTER_DELAY);
    } else if (goingToFactory) {
      if (fromMachine) {
        setStates((s) => ({ ...s, [prev]: 'exiting-to-factory' }));
      }
      setTimeout(() => {
        setActiveMId(next);
        setStates((s) => ({
          ...s,
          [prev]: 'idle-hidden',
          factory: 'entering-factory',
        }));
        setTimeout(() => {
          setStates((s) => ({ ...s, factory: 'idle-visible' }));
        }, 650);
      }, ENTER_DELAY);

      if (isFactory(next)) {
        if (!factoryReady.current) { pendingMId.current = next; }
        else {
          if (triggerTimer.current) clearTimeout(triggerTimer.current);
          triggerTimer.current = setTimeout(() => {
            doTrigger(factoryApp.current, next);
            triggerTimer.current = null;
          }, ENTER_DELAY + 80);
        }
      }
    }
  }, [mId]);

  useEffect(() => () => { if (triggerTimer.current) clearTimeout(triggerTimer.current); }, []);

  const currentIsFactory  = isFactory(activeMId);
  const currentIsNewMachine = activeMId === 'new-machine';
  const isLoading =
    currentIsFactory    ? !loaded.factory :
    currentIsNewMachine ? !loaded['new-machine'] :
    !loaded[activeMId];

  return (
    <>
      {/* Factory scene */}
      <SceneLayer $state={states.factory} $active={currentIsFactory}>
        <Suspense fallback={null}>
          <Spline scene={SCENES.factory} onLoad={handleFactoryLoad} />
        </Suspense>
      </SceneLayer>

      {/* Individual machine scenes */}
      {MACHINE_IDS.map((id) => (
        <SceneLayer key={id} $state={states[id]} $active={activeMId === id}>
          <Suspense fallback={null}>
            <Spline scene={SCENES[id]} onLoad={() => markLoaded(id)} />
          </Suspense>
        </SceneLayer>
      ))}

      {/* New machine preview scene (green) */}
      <SceneLayer $state={states['new-machine']} $active={currentIsNewMachine}>
        <Suspense fallback={null}>
          <Spline
            scene={SCENES['new-machine']}
            onLoad={() => markLoaded('new-machine')}
          />
        </Suspense>
      </SceneLayer>

      <LoadingOverlay $visible={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
    </>
  );
}
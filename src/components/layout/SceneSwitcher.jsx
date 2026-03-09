import React, { Suspense, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Spline from '@splinetool/react-spline';
import { SCENES } from '../../styles/theme';

// ─── Keyframe animations ─────────────────────────────────────────────────────

// Machine scene enters: starts zoomed-in (scale 1.12), eases out to normal.
// Combined with fade-in → feels like camera lands inside the machine.
const zoomInEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(1.12);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Factory scene exits toward machine: zooms slightly toward camera as it fades.
const zoomOutExit = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.08);
  }
`;

// Machine scene exits: shrinks away as camera pulls back to factory.
const zoomOutBack = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.94);
  }
`;

// Factory scene re-enters: grows in from slightly smaller.
const zoomInBack = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ─── Styled layer ─────────────────────────────────────────────────────────────
// $state: 'idle' | 'entering-machine' | 'exiting-to-machine' |
//         'entering-factory' | 'exiting-to-factory'
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

const isFactory = (mId) => mId in TRIGGER_OBJECTS;

// ─── Component ────────────────────────────────────────────────────────────────
export default function SceneSwitcher({ mId }) {
  const factoryApp   = useRef(null);
  const factoryReady = useRef(false);
  const pendingMId   = useRef(null);
  const triggerTimer = useRef(null);

  // Which scene is actually rendered as active
  const [activeMId, setActiveMId] = useState(mId);
  const prevMId = useRef(mId);

  // Animation state per scene key
  // key → 'idle-visible' | 'idle-hidden' | 'entering-machine' | 'exiting-to-machine' | 'entering-factory' | 'exiting-to-factory'
  const [states, setStates] = useState(() => {
    const s = { factory: isFactory(mId) ? 'idle-visible' : 'idle-hidden' };
    MACHINE_IDS.forEach((id) => { s[id] = mId === id ? 'idle-visible' : 'idle-hidden'; });
    return s;
  });

  const [loaded, setLoaded] = useState({ factory: false });
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

  // ── Transition orchestration ─────────────────────────────────────────────
  useEffect(() => {
    const next = mId;
    const prev = prevMId.current;
    prevMId.current = next;

    if (next === prev) return;

    const goingToMachine  = !isFactory(next);
    const goingToFactory  = isFactory(next);
    const fromMachine     = !isFactory(prev);

    // Exit duration must match the CSS animation duration above
    const EXIT_DURATION = goingToMachine ? 500 : 450;
    const ENTER_DELAY   = EXIT_DURATION - 100; // slight overlap for smoothness

    if (goingToMachine) {
      // Factory zooms toward camera while fading out
      // Machine scene grows in from a zoomed state
      setStates((s) => ({
        ...s,
        factory: 'exiting-to-machine',
        [next]: 'idle-hidden', // reset first in case it was mid-animation
      }));

      setTimeout(() => {
        setActiveMId(next);
        setStates((s) => ({
          ...s,
          factory: 'idle-hidden',
          [prev]: 'idle-hidden',
          [next]: 'entering-machine',
        }));
        // After enter animation, settle to idle
        setTimeout(() => {
          setStates((s) => ({ ...s, [next]: 'idle-visible' }));
        }, 750);
      }, ENTER_DELAY);

    } else if (goingToFactory) {
      // Machine shrinks away while factory grows back in
      if (fromMachine) {
        setStates((s) => ({
          ...s,
          [prev]: 'exiting-to-factory',
        }));
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

      // Fire Spline line trigger slightly after factory starts entering
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

  const currentIsFactory = isFactory(activeMId);
  const isLoading = currentIsFactory ? !loaded.factory : !loaded[activeMId];

  return (
    <>
      <SceneLayer
        $state={states.factory}
        $active={currentIsFactory}
      >
        <Suspense fallback={null}>
          <Spline scene={SCENES.factory} onLoad={handleFactoryLoad} />
        </Suspense>
      </SceneLayer>

      {MACHINE_IDS.map((id) => (
        <SceneLayer
          key={id}
          $state={states[id]}
          $active={activeMId === id}
        >
          <Suspense fallback={null}>
            <Spline scene={SCENES[id]} onLoad={() => markLoaded(id)} />
          </Suspense>
        </SceneLayer>
      ))}

      <LoadingOverlay $visible={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
    </>
  );
}
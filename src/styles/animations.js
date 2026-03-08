import { keyframes } from 'styled-components';
import { CAM_START, CAM_END } from './theme';

export const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.5); }
  60%     { box-shadow: 0 0 0 5px rgba(5,150,105,0); }
`;

export const pulseDanger = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); }
  60%     { box-shadow: 0 0 0 6px rgba(220,38,38,0); }
`;

export const pulseWarn = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.5); }
  60%     { box-shadow: 0 0 0 5px rgba(217,119,6,0); }
`;

export function animateZoom(app) {
  try {
    const cam = app.findObjectByName('Camera');
    if (!cam) return;

    cam.position.x = CAM_START.x;
    cam.position.y = CAM_START.y;
    cam.position.z = CAM_START.z;

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      cam.position.x = CAM_START.x + (CAM_END.x - CAM_START.x) * ease;
      cam.position.y = CAM_START.y + (CAM_END.y - CAM_START.y) * ease;
      cam.position.z = CAM_START.z + (CAM_END.z - CAM_START.z) * ease;

      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  } catch (_) {
    // keep silent
  }
}
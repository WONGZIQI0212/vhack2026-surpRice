export const T = {
  bg: '#E8ECF4',
  surface: '#FFFFFF',
  text: '#0D1117',
  sub: '#5C6A82',
  muted: '#9AA5B4',
  border: '#DDE3EF',
  accent: '#1748C8',
  accentM: '#3B6EF0',
  accentL: '#EBF0FF',
  success: '#059669',
  danger: '#DC2626',
  warning: '#D97706',
  glass: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.85)',
};

export const SCENES = {
  overall: 'https://prod.spline.design/nDF7deJlJwIYwXKr/scene.splinecode',
  machine1: 'https://prod.spline.design/lWhrYq26d-TrYsUE/scene.splinecode',
};

export const CAM_START = { x: 900, y: 600, z: 900 };
export const CAM_END = { x: 450, y: 280, z: 450 };

export const STATUS_CONFIG = {
  normal: {
    label: 'Normal',
    color: T.success,
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.2)',
  },
  warning: {
    label: 'Warning',
    color: T.warning,
    bg: 'rgba(217,119,6,0.08)',
    border: 'rgba(217,119,6,0.25)',
  },
  emergency: {
    label: 'Emergency Stop',
    color: T.danger,
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.25)',
  },
  offline: {
    label: 'Offline',
    color: T.muted,
    bg: 'rgba(154,165,180,0.1)',
    border: 'rgba(154,165,180,0.3)',
  },
};

export const STATUSES = ['normal', 'warning', 'emergency', 'offline'];
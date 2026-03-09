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
  // Main factory view — line switching via Spline states
  factory: 'https://prod.spline.design/nDF7deJlJwIYwXKr/scene.splinecode',

  // Individual machine scenes
  'line1-husker':    'https://prod.spline.design/IlPBQkMCAY7iZSUb/scene.splinecode',
  'line1-milling':   'https://prod.spline.design/aelfdoTlZ9EBTIPv/scene.splinecode',
  'line1-conveyor':  'https://prod.spline.design/H71agx1zdRbh0xBG/scene.splinecode',
  'line1-palletize': 'https://prod.spline.design/uEyyF7uNTF0FguMI/scene.splinecode',

  'line2-husker':    'https://prod.spline.design/3pxGh3Du-mX8WEkX/scene.splinecode',
  'line2-milling':   'https://prod.spline.design/eyCPx8BMlqcWsH0T/scene.splinecode',
  'line2-conveyor':  'https://prod.spline.design/sfMdFYfn1G1y9UAC/scene.splinecode',
  'line2-palletize': 'https://prod.spline.design/udBqHMtMsL5FS3S6/scene.splinecode',

  'line3-husker':    'https://prod.spline.design/bhiygTtsfOo5RnzK/scene.splinecode',
  'line3-milling':   'https://prod.spline.design/E1yPSylDXpxES12h/scene.splinecode',
  'line3-conveyor':  'https://prod.spline.design/AVnDlm8ldubSYRp3/scene.splinecode',
  'line3-palletize': 'https://prod.spline.design/xBjY82aX8ga9IQxV/scene.splinecode',
};

export const CAM_START = { x: 900, y: 600, z: 900 };
export const CAM_END   = { x: 450, y: 280, z: 450 };

export const STATUS_CONFIG = {
  normal:    { label: 'Normal',         color: T.success, bg: 'rgba(5,150,105,0.08)',   border: 'rgba(5,150,105,0.2)'   },
  warning:   { label: 'Warning',        color: T.warning, bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.25)'  },
  emergency: { label: 'Emergency Stop', color: T.danger,  bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)'  },
  offline:   { label: 'Offline',        color: T.muted,   bg: 'rgba(154,165,180,0.1)',  border: 'rgba(154,165,180,0.3)' },
};

export const STATUSES = ['normal', 'warning', 'emergency', 'offline'];
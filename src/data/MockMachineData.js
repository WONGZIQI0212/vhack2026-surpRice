import { T } from '../styles/theme'; // 确保路径正确以引用颜色

export const MOCK_HEALTH_DATA = {
  overall: {
    status: 'normal',
    temp: '38.2°C',
    speed: '12.4k kg/h',
    healthScore: 98,
    metrics: [40, 45, 42, 48, 44, 50, 47]
  },

  // LINE 1
  'line1-husker': {
    status: 'warning',
    temp: '62.4°C',
    speed: '450 kg/h',
    vibration: '2.4 mm/s',
    healthScore: 72,
    metrics: [60, 65, 70, 85, 82, 90, 88]
  },

  'line1-milling': {
    status: 'normal',
    temp: '42.1°C',
    speed: '820 kg/h',
    vibration: '0.8 mm/s',
    healthScore: 95,
    metrics: [30, 32, 31, 35, 33, 34, 32]
  },

  'line1-conveyor': {
    status: 'normal',
    temp: '36.5°C',
    speed: '1.2 m/s',
    vibration: '0.5 mm/s',
    healthScore: 97,
    metrics: [25, 28, 27, 29, 30, 28, 27]
  },

  'line1-palletize': {
    status: 'normal',
    temp: '40.8°C',
    speed: '18 boxes/min',
    vibration: '0.6 mm/s',
    healthScore: 96,
    metrics: [33, 35, 34, 36, 37, 35, 34]
  },

  // LINE 2
  'line2-husker': {
    status: 'normal',
    temp: '55.2°C',
    speed: '460 kg/h',
    vibration: '1.6 mm/s',
    healthScore: 88,
    metrics: [50, 52, 55, 58, 56, 54, 53]
  },

  'line2-milling': {
    status: 'normal',
    temp: '43.5°C',
    speed: '800 kg/h',
    vibration: '0.9 mm/s',
    healthScore: 93,
    metrics: [31, 30, 32, 34, 33, 35, 34]
  },

  'line2-conveyor': {
    status: 'warning',
    temp: '48.3°C',
    speed: '1.0 m/s',
    vibration: '1.9 mm/s',
    healthScore: 76,
    metrics: [40, 45, 47, 55, 60, 62, 65]
  },

  'line2-palletize': {
    status: 'normal',
    temp: '39.4°C',
    speed: '17 boxes/min',
    vibration: '0.7 mm/s',
    healthScore: 94,
    metrics: [32, 33, 35, 36, 34, 33, 32]
  },

  // LINE 3
  'line3-husker': {
    status: 'normal',
    temp: '54.7°C',
    speed: '455 kg/h',
    vibration: '1.4 mm/s',
    healthScore: 90,
    metrics: [48, 50, 52, 54, 53, 51, 50]
  },

  'line3-milling': {
    status: 'normal',
    temp: '41.9°C',
    speed: '810 kg/h',
    vibration: '0.7 mm/s',
    healthScore: 96,
    metrics: [29, 30, 31, 33, 32, 31, 30]
  },

  'line3-conveyor': {
    status: 'normal',
    temp: '37.8°C',
    speed: '1.3 m/s',
    vibration: '0.6 mm/s',
    healthScore: 95,
    metrics: [26, 27, 28, 29, 30, 28, 27]
  },

  'line3-palletize': {
    status: 'emergency',
    temp: '72.6°C',
    speed: '12 boxes/min',
    vibration: '3.5 mm/s',
    healthScore: 58,
    metrics: [70, 75, 80, 85, 90, 95, 97]
  }
};
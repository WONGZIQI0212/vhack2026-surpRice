import { useState, useCallback } from 'react';

// 定义受影响的机器
const AFFECTED_MACHINES = {
  warning: 'line2-conveyor',
  alert: 'line3-palletize',
};

const ANOMALY_OVERRIDES = {
  'line2-conveyor': {
    status: 'warning',
    temp: '54.7°C',
    vibration: '2.1 mm/s',
    healthScore: 76,
    metrics: [55, 58, 62, 67, 70, 74, 76],
  },
  'line3-palletize': {
    status: 'emergency',
    temp: '74.2°C',
    vibration: '3.8 mm/s',
    healthScore: 58,
    metrics: [62, 65, 70, 76, 82, 90, 97],
  },
};

const ACTIVE_ANOMALIES = [
  {
    id: 'warning-1',
    machineId: 'line2-conveyor',
    machine: 'Line 2 · Conveyor Belt',
    issue: 'Abnormal vibration detected',
    severity: 'warning',
  },
  {
    id: 'alert-1',
    machineId: 'line3-palletize',
    machine: 'Line 3 · Palletizing Robot',
    issue: 'Motor temperature exceeded safe limit',
    severity: 'alert',
  },
];

const formatTime = (date = new Date()) => {
  return date.toLocaleString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function useAnomalyMode() {
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [anomalyTriggered, setAnomalyTriggered] = useState(false);

  // 历史异常记录
  const [historicalAlerts, setHistoricalAlerts] = useState([
    {
      id: 'history-1',
      machineId: 'line1-husker',
      machine: 'Line 1 · Husker',
      issue: 'Minor temperature spike',
      severity: 'warning',
      time: '15 Mar 2026, 10:14 AM',
      status: 'resolved',
      actionTaken: 'maintenance',
    },
    {
      id: 'history-2',
      machineId: 'line2-milling',
      machine: 'Line 2 · Milling',
      issue: 'Short vibration fluctuation',
      severity: 'warning',
      time: '16 Mar 2026, 03:42 PM',
      status: 'resolved',
      actionTaken: 'inspection',
    },
  ]);

  const pushActiveAnomaliesToHistory = useCallback(() => {
    const now = formatTime();

    setHistoricalAlerts((prev) => {
      const existingActiveMachineIds = prev
        .filter((item) => item.status === 'active')
        .map((item) => item.machineId);

      const newItems = ACTIVE_ANOMALIES
        .filter((item) => !existingActiveMachineIds.includes(item.machineId))
        .map((item) => ({
          ...item,
          time: now,
          status: 'active',
          actionTaken: null,
        }));

      return [...newItems, ...prev];
    });
  }, []);

  // 触发异常
  const triggerAnomaly = useCallback(() => {
    setIsAnomaly(true);
    setAnomalyTriggered(true);
    pushActiveAnomaliesToHistory();
  }, [pushActiveAnomaliesToHistory]);

  // 重置异常
  const resetAnomaly = useCallback(() => {
    setIsAnomaly(false);
    setAnomalyTriggered(false);
  }, []);

  // 处理 alert / warning 后更新历史
  const resolveAlert = useCallback((machineId, action) => {
    setHistoricalAlerts((prev) =>
      prev.map((item) =>
        item.machineId === machineId && item.status === 'active'
          ? {
              ...item,
              status: 'resolved',
              actionTaken: action,
              time: formatTime(),
            }
          : item
      )
    );

    // 如果两个 active anomaly 都已经被处理，就退出 anomaly mode
    setTimeout(() => {
      setHistoricalAlerts((current) => {
        const stillActive = current.some((item) => item.status === 'active');
        if (!stillActive) {
          setIsAnomaly(false);
          setAnomalyTriggered(false);
        }
        return current;
      });
    }, 0);
  }, []);

  // 根据当前视图获取横幅状态
  const getBannerInfo = useCallback((currentView) => {
    if (!isAnomaly) {
      return {
        color: 'orange',
        message: 'Factory health degraded — review recommended',
      };
    }

    switch (currentView) {
      case 'overall':
        return {
          color: 'red',
          message: 'Problem Detected: 1 Alert, 1 Warning',
        };
      case 'line1':
        return {
          color: 'orange',
          message: '⚠ Line 1 health degraded — review recommended',
        };
      case 'line2':
        return {
          color: 'orange',
          message: 'Line 2 Warning: Conveyor Belt Issue',
        };
      case 'line3':
        return {
          color: 'red',
          message: 'Line 3 Alert: Palletizing Robot Critical',
        };
      default:
        if (currentView === AFFECTED_MACHINES.warning) {
          return {
            color: 'orange',
            message: 'Warning: Conveyor Belt Issue',
          };
        }
        if (currentView === AFFECTED_MACHINES.alert) {
          return {
            color: 'red',
            message: 'Alert: Palletizing Robot Critical',
          };
        }
        return {
          color: 'orange',
          message: '⚠ Machine health degraded — review recommended',
        };
    }
  }, [isAnomaly]);

  // 获取受影响机器的状态
  const getMachineStatus = useCallback((machineId) => {
    if (!isAnomaly) return null;
    if (machineId === AFFECTED_MACHINES.warning) return 'warning';
    if (machineId === AFFECTED_MACHINES.alert) return 'emergency';
    return null;
  }, [isAnomaly]);

  const getMachineData = useCallback((machineId, originalData) => {
    if (!isAnomaly) return originalData;
    const override = ANOMALY_OVERRIDES[machineId];
    if (!override) return originalData;
    return { ...originalData, ...override };
  }, [isAnomaly]);

  return {
    isAnomaly,
    anomalyTriggered,
    triggerAnomaly,
    resetAnomaly,
    getBannerInfo,
    getMachineStatus,
    getMachineData,
    affectedMachines: AFFECTED_MACHINES,
    historicalAlerts,
    resolveAlert,
  };
}
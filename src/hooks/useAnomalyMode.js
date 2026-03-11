import { useState, useCallback } from 'react';

// 定义受影响的机器
const AFFECTED_MACHINES = {
  warning: 'line2-conveyor',   // Line 2 Conveyor Belt
  alert: 'line3-palletize',    // Line 3 Palletizing Robot
};

export default function useAnomalyMode() {
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [anomalyTriggered, setAnomalyTriggered] = useState(false); // 是否已触发（用于控制弹窗自动弹出）

  // 触发异常（由隐藏按钮调用）
  const triggerAnomaly = useCallback(() => {
    if (!isAnomaly) {
      setIsAnomaly(true);
      setAnomalyTriggered(true);
    }
  }, [isAnomaly]);

  // 重置异常（可选，用于演示后恢复）
  const resetAnomaly = useCallback(() => {
    setIsAnomaly(false);
    setAnomalyTriggered(false);
  }, []);

  // 根据当前视图获取横幅状态
  const getBannerInfo = useCallback((currentView) => {
    if (!isAnomaly) {
      return {
        color: 'green',
        message: 'All machines in good condition',
      };
    }

    // 异常模式下，根据视图返回不同信息
    switch (currentView) {
      case 'overall':
        return {
          color: 'red',
          message: 'Problem Detected: 1 Alert, 1 Warning',
        };
      case 'line1':
        return {
          color: 'green',
          message: 'Line 1 in good condition',
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
        // 如果是具体机器，根据机器返回
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
          color: 'green',
          message: 'Machine in good condition',
        };
    }
  }, [isAnomaly]);

  // 获取受影响机器的状态（用于覆盖原始数据）
  const getMachineStatus = useCallback((machineId) => {
    if (!isAnomaly) return null; // 返回 null 表示不覆盖
    if (machineId === AFFECTED_MACHINES.warning) return 'warning';
    if (machineId === AFFECTED_MACHINES.alert) return 'emergency'; // alert 对应 emergency
    return null;
  }, [isAnomaly]);

  return {
    isAnomaly,
    anomalyTriggered,
    triggerAnomaly,
    resetAnomaly,
    getBannerInfo,
    getMachineStatus,
    affectedMachines: AFFECTED_MACHINES,
  };
}
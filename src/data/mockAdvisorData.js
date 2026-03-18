// Base capacity (affected by machine health) for the next 30 days
const baseCapacity = [
    150, 150, 150, 148, 145, 142, 140, 138, 135, 132,
    130, 128, 125, 122, 120, 118, 115, 112, 110, 108,
    105, 105, 105, 105, 105, 105, 105, 105, 105, 105
  ];
  
  // Base market demand (influenced by holidays/events)
  const baseDemand = [
    120, 122, 125, 130, 135, 140, 145, 150, 155, 160,
    165, 170, 175, 180, 185, 190, 195, 200, 205, 210,
    215, 220, 225, 230, 235, 240, 245, 250, 255, 260
  ];
  
  export const getAdvisorData = (multiplier = 1.0) => {
    const demand = baseDemand.map(v => Math.round(v * multiplier));
    return {
      labels: Array.from({ length: 30 }, (_, i) => `D+${i + 1}`),
      capacity: baseCapacity,
      demand,
      kpi: {
        profit30d: 125000,
        aiSaved: Math.round(15000 * (multiplier - 1) * 10), // Simulated AI‑recovered loss
        riskIndex: Math.min(100, Math.round((demand[14] / baseCapacity[14] - 1) * 100)),
      },
    };
  };
  
  export const actions = [
    {
      id: 1,
      title: 'Consolidate Maintenance Window',
      description: 'To avoid the capacity deficit on Day 14, combine Line 2 & Line 3 maintenance on Day 10.',
      cost: 'RM 500',
      impact: 'Prevents an estimated RM 3,200 emergency shutdown cost',
      type: 'maintenance',
    },
    {
      id: 2,
      title: 'Packaging Stock Alert',
      description: 'Packaging bags will run out by Day 12 due to the demand surge.',
      cost: 'RM 2,800',
      impact: 'Early procurement ensures continuous production',
      type: 'supply',
    },
  ];
import { create } from 'zustand';

export const useSimStore = create((set, get) => ({
  salary: 45000,
  savings: 0,
  stress: 50,
  risk: 30,
  happiness: 50,
  emergencyFund: 0,
  month: 1,
  buildings: [],
  monthlyExpense: 0,
  addBuilding: (type, x = 0, z = 0) => {
    const costs = {
      smallApartment: 8000,
      luxuryApartment: 20000,
      publicTransport: 2000,
      carGarage: 12000,
      insuranceCenter: 2000,
      investmentTower: 5000,
      emergencyVault: 0
    };
    const cost = costs[type] || 0;
    set((s) => {
      const newSavings = s.savings - cost;
      // update state
      return {
        savings: newSavings,
        buildings: [...s.buildings, { type, x, z }],
        monthlyExpense: s.monthlyExpense + cost
      };
    });
  },
  advanceMonth: () => {
    set((s) => ({
      month: s.month + 1,
      savings: s.savings + s.salary - s.monthlyExpense,
      emergencyFund: s.emergencyFund + Math.round((s.salary - s.monthlyExpense) * 0.7),
      stress: Math.min(100, s.stress + (s.monthlyExpense > s.salary * 0.6 ? 8 : s.monthlyExpense > s.salary * 0.4 ? 3 : -2)),
      happiness: Math.max(0, Math.min(100, s.happiness + (s.salary - s.monthlyExpense > 5000 ? 2 : s.salary - s.monthlyExpense > 1000 ? 0 : -3)))
    }));
  },
  reset: () => set({
    salary: 45000,
    savings: 0,
    stress: 50,
    risk: 30,
    happiness: 50,
    emergencyFund: 0,
    month: 1,
    buildings: [],
    monthlyExpense: 0
  })
}));

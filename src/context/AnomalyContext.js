// context/AnomalyContext.js
import { createContext, useContext } from 'react';

export const AnomalyContext = createContext(null);

export const useAnomaly = () => useContext(AnomalyContext);
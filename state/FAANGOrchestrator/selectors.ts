import { useSelector } from 'react-redux';
import { State } from '../types';

export const useFAANGOrchestratorData = () => {
  return useSelector((state: State) => state.FAANGOrchestrator.data);
};
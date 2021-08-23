import { useSelector } from 'react-redux';
import { State } from '../types';

export const useOrchestratorData = () => {
  return useSelector((state: State) => state.orchestrator.data);
};

export const useOrchestratorLoading = () => {
  return useSelector((state: State) => state.orchestrator.loading);
}
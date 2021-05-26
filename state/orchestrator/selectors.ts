import { useSelector } from "react-redux";

export const useOrchestratorData = () => {
  return useSelector((state: any) => state.orchestrator.data);
}
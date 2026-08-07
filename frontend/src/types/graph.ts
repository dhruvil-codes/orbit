export interface GraphExecutionState {
  executionId: string;
  opportunityId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  currentNode: string;
  strategicScore?: number;
}

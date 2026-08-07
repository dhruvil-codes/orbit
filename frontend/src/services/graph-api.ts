import { GraphExecutionState } from "@/types/graph";

export async function triggerGraphExecution(opportunityId: string): Promise<GraphExecutionState> {
  const response = await fetch(`/api/v1/graph/trigger?opportunity_id=${opportunityId}`, {
    method: 'POST',
  });
  return response.json();
}

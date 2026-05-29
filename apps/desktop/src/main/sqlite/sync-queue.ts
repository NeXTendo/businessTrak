export class SyncQueue {
  enqueue(item: any) {
    // Add item to local queue
  }

  async process() {
    // Process queued items when online
  }
}
export interface QueuedAction {
  id: string; module: string; action: string;
  payload: unknown; createdAt: string; attempts: number;
}
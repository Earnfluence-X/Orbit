import { isOnline } from './utils';

interface QueueProcessor {
  processItem: (query: string) => Promise<void>;
}

class OfflineQueueService {
  private processor: QueueProcessor | null = null;

  setProcessor(processor: QueueProcessor): void {
    this.processor = processor;
  }

  setupListeners(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => this.onConnectionRestored());
    window.addEventListener('offline', () => {
      console.log('ORBIT: Offline mode activated');
    });
  }

  private onConnectionRestored(): void {
    console.log('ORBIT: Connection restored - processing queue');
    this.processQueue();
  }

  async processQueue(): Promise<void> {
    if (!this.processor) return;
    const queueData = localStorage.getItem('orbit-offline-queue');
    if (!queueData) return;

    const queue: { id: string; query: string; timestamp: string }[] =
      JSON.parse(queueData);

    if (queue.length === 0) return;
    if (!isOnline()) return;

    for (const item of queue) {
      try {
        await this.processor.processItem(item.query);
        // Remove from queue on success
        const current =
          JSON.parse(localStorage.getItem('orbit-offline-queue') || '[]') ||
          [];
        const updated = current.filter(
          (q: { id: string }) => q.id !== item.id
        );
        localStorage.setItem('orbit-offline-queue', JSON.stringify(updated));
      } catch {
        console.error('Failed to process queued item:', item.id);
        break;
      }
    }
  }

  addToQueue(query: string): void {
    const queueData = localStorage.getItem('orbit-offline-queue');
    const queue: { id: string; query: string; timestamp: string }[] = queueData
      ? JSON.parse(queueData)
      : [];

    queue.push({
      id: `offline_${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem('orbit-offline-queue', JSON.stringify(queue));
  }
}

export const offlineQueue = new OfflineQueueService();

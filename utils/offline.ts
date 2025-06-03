import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// This is a simple offline support implementation
// In a production app, you would use a more robust solution like Redux Offline,
// Watermelon DB, or a custom implementation with background sync

type QueuedAction = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
};

class OfflineSupport {
  private isOnline: boolean = true;
  private queue: QueuedAction[] = [];
  private STORAGE_KEY = '@floatr_offline_queue';
  private listeners: Array<(isOnline: boolean) => void> = [];
  private unsubscribe: (() => void) | null = null;
  
  constructor() {
    this.loadQueue();
    this.setupNetworkListener();
  }
  
  private async loadQueue() {
    try {
      const queue = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (queue) {
        this.queue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }
  
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }
  
  private setupNetworkListener() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      const newIsOnline = state.isConnected && state.isInternetReachable;
      
      if (newIsOnline !== this.isOnline) {
        this.isOnline = newIsOnline;
        
        // Notify listeners
        this.listeners.forEach(listener => listener(this.isOnline));
        
        // Process queue when coming back online
        if (this.isOnline) {
          this.processQueue();
        }
      }
    });
  }
  
  public addNetworkListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.isOnline);
    
    // Return a function to remove the listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  public getIsOnline(): boolean {
    return this.isOnline;
  }
  
  public async enqueueAction(type: string, payload: any, maxRetries: number = 3) {
    const action: QueuedAction = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };
    
    this.queue.push(action);
    await this.saveQueue();
    
    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue();
    }
    
    return action.id;
  }
  
  public async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return;
    
    const actionsToProcess = [...this.queue];
    const successfulActions: string[] = [];
    const failedActions: string[] = [];
    
    for (const action of actionsToProcess) {
      try {
        // In a real implementation, you would have a mapping of action types to handlers
        // For example:
        // await this.actionHandlers[action.type](action.payload);
        
        // For now, we'll just simulate success
        console.log(`Processing offline action: ${action.type}`, action.payload);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mark as successful
        successfulActions.push(action.id);
      } catch (error) {
        console.error(`Error processing offline action ${action.type}:`, error);
        
        // Increment retry count
        action.retryCount++;
        
        if (action.retryCount >= action.maxRetries) {
          // Max retries reached, remove from queue
          failedActions.push(action.id);
        }
      }
    }
    
    // Remove successful and failed actions from queue
    this.queue = this.queue.filter(
      action => !successfulActions.includes(action.id) && !failedActions.includes(action.id)
    );
    
    await this.saveQueue();
  }
  
  public async clearQueue() {
    this.queue = [];
    await this.saveQueue();
  }
  
  public getQueueLength(): number {
    return this.queue.length;
  }
  
  public getQueue(): QueuedAction[] {
    return [...this.queue];
  }
  
  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export const offlineSupport = new OfflineSupport();

// Usage example:
// // Add a network listener
// const removeListener = offlineSupport.addNetworkListener((isOnline) => {
//   console.log('Network status changed:', isOnline ? 'online' : 'offline');
// });

// // Enqueue an action to be processed when online
// offlineSupport.enqueueAction('SEND_MESSAGE', { 
//   chatId: '123', 
//   message: 'Hello!',
//   timestamp: Date.now()
// });

// // Clean up when component unmounts
// useEffect(() => {
//   return () => {
//     removeListener();
//   };
// }, []);
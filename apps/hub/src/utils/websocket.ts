/**
 * WebSocket Utility for Real-time Features
 * Supports collaborative activities and live progress updates
 */

export interface WebSocketMessage {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  timestamp: number;
  userId?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export class RealtimeWebSocket {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts: number = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualDisconnect: boolean = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config,
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.config.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.config.onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.config.onDisconnect?.();
        
        // Attempt reconnection if not manual disconnect
        if (!this.isManualDisconnect && 
            this.reconnectAttempts < (this.config.maxReconnectAttempts || 5)) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualDisconnect = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(message: Omit<WebSocketMessage, 'timestamp'>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  /**
   * Get connection state
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get ready state
   */
  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

/**
 * Real-time collaboration manager for learning activities
 */
export class CollaborationManager {
  private ws: RealtimeWebSocket | null = null;
  private currentRoom: string | null = null;

  /**
   * Join a collaborative room
   */
  joinRoom(roomId: string, userId: string): void {
    this.currentRoom = roomId;
    
    this.ws = new RealtimeWebSocket({
      url: `wss://api.jigyasu.app/collaborate/${roomId}`,
      onMessage: (message) => this.handleMessage(message),
      onConnect: () => {
        this.ws?.send({
          type: 'join',
          payload: { roomId, userId },
        });
      },
    });

    this.ws.connect();
  }

  /**
   * Leave current room
   */
  leaveRoom(): void {
    if (this.ws) {
      this.ws.send({
        type: 'leave',
        payload: { roomId: this.currentRoom },
      });
      this.ws.disconnect();
      this.ws = null;
    }
    this.currentRoom = null;
  }

  /**
   * Broadcast progress update
   */
  broadcastProgress(moduleId: string, progress: number): void {
    this.ws?.send({
      type: 'progress_update',
      payload: { moduleId, progress },
    });
  }

  /**
   * Broadcast wonder moment
   */
  broadcastWonder(moduleId: string, timestamp: number): void {
    this.ws?.send({
      type: 'wonder_moment',
      payload: { moduleId, timestamp },
    });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'user_joined':
        break;
      case 'user_left':
        break;
      case 'progress_update':
        break;
      case 'wonder_moment':
        break;
      default:
    }
  }
}

/**
 * Live progress tracker for parent-child co-learning
 */
export class LiveProgressTracker {
  private ws: RealtimeWebSocket | null = null;

  /**
   * Start tracking progress
   */
  startTracking(familyId: string): void {
    this.ws = new RealtimeWebSocket({
      url: `wss://api.jigyasu.app/progress/${familyId}`,
      onMessage: (message) => this.handleMessage(message),
    });

    this.ws.connect();
  }

  /**
   * Stop tracking
   */
  stopTracking(): void {
    if (this.ws) {
      this.ws.disconnect();
      this.ws = null;
    }
  }

  /**
   * Update progress
   */
  updateProgress(moduleId: string, progress: number): void {
    this.ws?.send({
      type: 'update_progress',
      payload: { moduleId, progress },
    });
  }

  /**
   * Handle progress updates
   */
  private handleMessage(message: WebSocketMessage): void {
    if (message.type === 'family_progress') {
      // Update UI with family progress
    }
  }
}

// Singleton instances
export const collaborationManager = new CollaborationManager();
export const liveProgressTracker = new LiveProgressTracker();

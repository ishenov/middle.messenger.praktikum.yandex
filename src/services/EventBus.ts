 
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
type Listener = (..._args: any[]) => void;

export class EventBus {
  private listeners: Record<string, Listener[]> = {};

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Listener): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    
    this.listeners[event].forEach(function(listener) {
      listener(...args);
    });
  }
}

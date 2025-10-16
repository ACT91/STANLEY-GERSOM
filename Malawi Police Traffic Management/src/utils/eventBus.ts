// Simple event bus for real-time updates
type EventCallback = () => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback());
  }
}

export const eventBus = new EventBus();

// Event types
export const EVENTS = {
  VIOLATION_CREATED: 'violation_created',
  VIOLATION_UPDATED: 'violation_updated',
  OFFICER_CREATED: 'officer_created',
  OFFICER_UPDATED: 'officer_updated',
  VEHICLE_UPDATED: 'vehicle_updated',
  DATA_REFRESH: 'data_refresh'
};
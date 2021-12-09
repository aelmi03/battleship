const Pubsub = {
  events: {},

  subscribe(eventName, eventHandler) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(eventHandler);
  },

  publish(eventName, eventData) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((eventHandler) => eventHandler(eventData));
    }
  },
  unsubscribe(eventName, eventHandler) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        // eslint-disable-next-line comma-dangle
        (eventHandlerName) => eventHandlerName !== eventHandler
      );
    }
  },
};

export default Pubsub;

export const logger = {
  debug: (...args) => {
    if (import.meta.env.VITE_DEBUG_LOGGING === 'true') {
      console.debug('[DEBUG]', ...args);
    }
  },
  error: (error) => {
    console.error('[ERROR]', {
      code: error.code,
      message: error.message,
      time: new Date().toISOString()
    });
  }
}; 
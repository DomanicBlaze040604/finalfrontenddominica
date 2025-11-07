/**
 * Global Error Handler
 * Prevents any unhandled errors from crashing the app
 */

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser behavior
});

// Handle general errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  event.preventDefault(); // Prevent default browser behavior
});

// Log when error handler is loaded
console.log('✅ Global error handler initialized');

export {};

/**
 * Global setup for Playwright tests
 * Ensures both frontend and backend are ready before tests run
 */
const { chromium } = require('@playwright/test');

async function waitForBackend(retries = 30, delay = 1000) {
  const backendUrl = 'http://127.0.0.1:3001/api/todos';
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(backendUrl);
      if (response.ok || response.status === 404) {
        // Backend is responding
        console.log('✓ Backend API is ready');
        return;
      }
    } catch (error) {
      // Backend not ready yet
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error('Backend API failed to start within timeout period');
}

async function globalSetup() {
  console.log('Waiting for backend API to be ready...');
  await waitForBackend();
  console.log('All services ready - starting tests');
}

module.exports = globalSetup;

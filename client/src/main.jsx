import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// global error hooks (pre-render)
window.onerror = (msg, src, line, col, err) => {
  console.error('Global onerror:', msg, err);
};
window.onunhandledrejection = (evt) => {
  console.error('Unhandled rejection:', evt.reason);
};

const rootEl = document.getElementById('root');
console.log('Root element:', rootEl);

if (!rootEl) {
  console.error('Root element #root not found!');
  document.body.innerHTML = '<h1>ERROR: Root element not found</h1>';
} else {
  try {
    console.log('Creating React root...');
    const root = createRoot(rootEl);
    console.log('Rendering App...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('Render complete');
  } catch (err) {
    console.error('Error during render:', err);
    rootEl.innerHTML = '<h1>Render Error: ' + (err.message || err) + '</h1>';
  }
}

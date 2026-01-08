import './setupAxios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider userId={localStorage.getItem('userId')}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
);

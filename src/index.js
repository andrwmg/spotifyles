import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';

const root = ReactDOM.createRoot(document.getElementById('root'));

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: '40px',
      fontFamily: 'Poppins'
    },
    button: {
      fontSize: 12
    }
  },
  palette: {
    mode: 'dark',
  },
});

root.render(
  // <React.StrictMode>
    <PlaylistProvider>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </PlaylistProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

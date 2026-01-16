import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./components/theme";
import config from "./config";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={config.BASE_URL}>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
      </ThemeProvider>
  </BrowserRouter>
);


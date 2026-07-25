import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from './store/store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Helmet>
          <title>Caper Sports - Premium Sports Clothing</title>
          <meta name="description" content="Discover premium sports clothing and gear for your active lifestyle" />
        </Helmet>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

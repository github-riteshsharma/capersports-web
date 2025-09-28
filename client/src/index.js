import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { store } from './store/store';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Helmet>
          <title>CaperSports - Premium Sports Clothing</title>
          <meta name="description" content="Discover premium sports clothing and gear for your active lifestyle" />
        </Helmet>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
          bodyClassName="text-sm"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

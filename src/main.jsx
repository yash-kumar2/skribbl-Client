// index.js or main.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'
import { GlobalProvider } from './GlobalContext';

ReactDOM.render(
    <GlobalProvider>
    <Router>
        <App />
    </Router></GlobalProvider>,

    document.getElementById('root')
);

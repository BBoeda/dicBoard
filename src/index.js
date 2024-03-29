/* index.js */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import {AppProvider} from './AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
    <AppProvider>
        <BrowserRouter>
            <Header/>
            <App/>
            <Footer/>
        </BrowserRouter>
    </AppProvider>
</React.StrictMode>);
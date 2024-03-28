/* App.js */
import {Route, Routes} from "react-router-dom";
import BoardList from "./routes/BoardList";
import Home from "./routes/Home";
import Login from "./routes/Login";
import React from "react";
import { Helmet } from 'react-helmet';
import BoardDetail from "./routes/BoardDetail";
import BoardWrite from './routes/BoardWrite';
import BoardUpdate from "./routes/BoardUpdate";
import './App.css';

function App() {
    return (
        <div>
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"/>
            </Helmet>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/board" element={<BoardList/>}/>
                <Route path="/board/:idx" element={<BoardDetail/>}/>
                <Route path="/write" element={<BoardWrite />} />
                <Route path="/update/:idx" element={<BoardUpdate />} />
            </Routes>
        </div>
    );
}

export default App;
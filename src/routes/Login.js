/* Login.js */
import axios from 'axios';
import React, {useContext, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../AppContext';

const Login = () => {
    const navigate = useNavigate();

    const [loginInfo, setLoginInfo] = useState({
        email: "", password: "",
    });
    const [isLoggedIn, setIsLoggedIn] = useContext(AppContext);

    const handleChange = e => { // e is now included as a parameter
        setLoginInfo({
            ...loginInfo, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async event => {
        //console.log(`Email: ${loginInfo.email}, Password: ${loginInfo.password}`);

        const response = await axios.post('/login', loginInfo);
        // 여기서 로그인 처리 로직을 작성하세요.
        if (response.data.resultCode === 'OK') {
            const username = response.data.data.username;
            setIsLoggedIn(true);

            navigate('/board', {
                state: {
                    username: username
                },
            });


        } else {
            alert('관리자에게 등록 후 사용하세요');
            navigate('/');
        }
    };

    return (<div className={"login-container"}>
        <h2 className={"login-h2"}>Login</h2>
        <div className={"login-div"}>
            <label>Email: </label>
            <input type="email" name="email" value={loginInfo.email} onChange={handleChange}/>
        </div>
        <div className={"login-div"}>
            <label>Password: </label>
            <input type="password" name="password" value={loginInfo.password} onChange={handleChange}/>
        </div>
        <div>
            <button className={"login-button"} onClick={handleSubmit}>Login</button>
        </div>
    </div>);
};

export default Login;
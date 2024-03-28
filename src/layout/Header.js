/* Header.js */
import React, {useContext, useState} from 'react';
import { AppContext } from '../AppContext';
import {useNavigate} from "react-router-dom";

const Header = () => {
    // 로그인 상태. 실제 구현에서는 로그인 로직에서 설정할 것입니다.

    const [isLoggedIn, setIsLoggedIn] = useContext(AppContext);
    const navigate = useNavigate();

    const goToLogout = (boardIdx) => {
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        // <header>
        //     <a href="/">홈</a>
        //     &nbsp;&nbsp;|&nbsp;&nbsp;
        //     {/*<a href="/board">게시판</a>*/}
        //     <hr/>
        // </header>
        <header>
            {isLoggedIn ? (
                // 로그인 후에 보여줄 링크:
                <>
                    <a href="/board">동의어</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a onClick={() => goToLogout()}>로그아웃</a>
                </>
            ) : (
                // 로그인 전에 보여줄 링크:
                <a href="/">로그인</a>
            )}


            <hr/>
        </header>
    );
};

export default Header;
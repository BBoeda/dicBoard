import React, {createContext, useState} from 'react';

export const AppContext = createContext();

export const AppProvider = (props) => {
    //상태 공유를 위한 페이지 설정
    //const [sharedState, setSharedState] = useState('Not Login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AppContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
            {props.children}
        </AppContext.Provider>
    );
}
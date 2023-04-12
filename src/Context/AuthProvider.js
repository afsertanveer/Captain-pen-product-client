import React, { createContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export const AuthContext = createContext();
const AuthProvider = ({children}) => {

    const [curUser,setCurUser] = useState('');
    const settingUser = (user)=>{
        const username = user.username;
        const password = user.password;
        fetch(`http://localhost:5000/users/${username}`,{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.length>0){
                setCurUser(data[0].username);
                const dbPass = data[0].password;
                if(password===dbPass){
                    localStorage.setItem('username',user.username);
                    setCurUser(data[0].username);
                }else{
                    setCurUser('');
                }
            }
        })
        .catch(err=>setCurUser(''))
    }
    useEffect(()=>{
        const currentUser = localStorage.getItem('username');
        setCurUser(currentUser);
    },[curUser])
    const authInfo = {
        curUser,
        settingUser
    }
    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
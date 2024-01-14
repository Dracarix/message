// import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
// import React, { useEffect } from 'react';
import {  Navigate, Outlet} from 'react-router-dom';

const PrivateAuth = () => {
    const {isAuth} = useAuth();
    // const db = getFirestore();
    // const searchValue = 'Ergy'
    // useEffect(()=> {
    //     setTimeout(async ()=> {
    //         const q = query(
    //             collection(db, "users"),
    //             where("name", "==" , searchValue)
    //           );
    //           const querySnapshot = await getDocs(q);
    //           try {

    //             console.log('Query Snapshot:', querySnapshot);
    //             // ... (остальной код)
    //           } catch (error) {
    //             console.error('Firestore Error:', error);
    //           }
    //     })
        
    // },[isAuth])
    if(isAuth){
        return <Outlet />
    }
        
    return <Navigate to='loading'/>
};

export default PrivateAuth;
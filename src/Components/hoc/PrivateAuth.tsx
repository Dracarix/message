import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useAuth, useHaveAuth } from 'hooks/use-auth';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAuth = () => {
    const { user } = useHaveAuth();
    const {id} = useAuth()

    useEffect(() => {
        console.log(user);
        console.log(id)
    }, [user]);

    return user === null ? (
        <IsLoadingBig />
    ) : user === 'none' ? (
        <Navigate to="/login" />
    ) : (
        <Outlet />
    );
};
export default PrivateAuth;

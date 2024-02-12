import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useHaveAuth } from 'hooks/use-auth';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAuth = () => {
    const { user } = useHaveAuth();

    useEffect(() => {
        console.log(user);
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

import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useHaveAuth } from 'hooks/use-auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAuth = () => {
    const { user } = useHaveAuth();



    return user === null || user === undefined ? (
        <IsLoadingBig />
    ) : user === 'none' ? (
        <Navigate to="/login" />
    ) : (
        <Outlet />
    );
};
export default PrivateAuth;

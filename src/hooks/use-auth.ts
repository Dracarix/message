
import { useAppSelector } from "./use-redux";

export const useAuth = () => {
    const {email, token, id, fullName, firstName, lastName, photoURL} = useAppSelector(state => state.user);
    return{
        isAuth: !!email,
        email,
        token,
        id,
        fullName,
        firstName, 
        lastName,
        photoURL
    }
}
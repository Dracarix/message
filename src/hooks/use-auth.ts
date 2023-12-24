import { useSelector } from "react-redux"
import { RootStateType } from "../store/store";

export const useAuth = () => {
    const {email, token, id} = useSelector((state:RootStateType) => state.user);
    return{
        isAuth: !!email,
        email,
        token,
        id,
    }
}
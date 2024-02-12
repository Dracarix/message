import { useEffect, useState } from "react";
import { useAppSelector } from "./use-redux";
import { Auth, User, getAuth, onAuthStateChanged } from "firebase/auth";
type AuthState = {
    user: User | null | string;
  };
export const useAuth = () => {
    const {email, token, id, fullName, firstName, lastName, photoURL} = useAppSelector(state => state.user);
    return {
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
export const useHaveAuth = () => {
  const auth: Auth = getAuth();
    const [authState, setAuthState] = useState<AuthState>({
        user: null ,
      });
    useEffect(()=> {
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setTimeout(()=>{
            if(user){
                setAuthState({ user });

            }else{
              
                setAuthState({ user: "none" });
              }
          }, 3000)

        });
      });
      return authState;
}
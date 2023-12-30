import { useEffect } from 'react';

import 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from 'store/users/user.slice';


export const useUser = () => {
    const dispatch = useDispatch();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
      }));
      } else {
        dispatch(setUser({
            email:'',
            token:'',
            id:0,
            name:'',
          }));
          
      }
    });

  useEffect(() => {
    unsubscribe();
  }, [auth, dispatch, unsubscribe]);

};

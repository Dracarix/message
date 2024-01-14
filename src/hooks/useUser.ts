import { useEffect } from 'react';

import 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { removeUser, setUser } from 'store/users/user.slice';
import { useAppDispatch } from './use-redux';


export const useUser = () => {
    const dispatch = useAppDispatch();
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
        dispatch(removeUser());
   
      }
    });

  useEffect(() => {
    unsubscribe();
  }, [unsubscribe]);
};
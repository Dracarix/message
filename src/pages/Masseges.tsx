import { getAuth } from 'firebase/auth';
import { useAuth } from 'hooks/use-auth';
import { useEffect } from 'react';

const Masseges = () => {
    const {name ,email , isAuth} = useAuth();
    const auth = getAuth()
    const user = auth.currentUser;
    useEffect(()=> {

    },[auth, isAuth, user]);
  return (
    <div>
      Hello {name}
      <br/>
      and {email}
    </div>
  );
};

export default Masseges;
import { getAuth } from 'firebase/auth';
import { useAuth } from 'hooks/use-auth';
import { useEffect } from 'react';

const Masseges = () => {
    const {name ,email , isAuth} = useAuth();
    const auth = getAuth()
    useEffect(()=> {
        

    },[]);
  return (
    <div>
      Hello {name}
      <br/>
      and {email}
    </div>
  );
};

export default Masseges;
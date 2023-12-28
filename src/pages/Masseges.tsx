import { useAuth } from 'hooks/use-auth';
import { useEffect } from 'react';

const Masseges = () => {
    const {email , isAuth} = useAuth();
    useEffect(()=> {
        console.log(isAuth)
    },[]);
  return (
    <div>
      Hello {email}
    </div>
  );
};

export default Masseges;
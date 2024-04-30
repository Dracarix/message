import {  useAppSelector } from 'hooks/use-redux';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    const {error} = useAppSelector((state) => state.errorReducer);

    return (
    <div>
      {error && error}
      <Link to='/message/'>На главную страницу</Link>
    </div>
  );
};

export {ErrorPage};
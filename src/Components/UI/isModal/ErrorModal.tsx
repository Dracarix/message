import { useAppSelector } from "hooks/use-redux";
import useHandlerErr from "hooks/useHandlerErr";

const ErrorModal = () => {
    const {error} = useAppSelector(state => state.process);
    
    const errorMessage = useHandlerErr(error);



return (
    <h4
    style={{fontSize: '20px'}}>{error && errorMessage}</h4>
);
};
export default ErrorModal;
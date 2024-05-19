import { ReactComponent as Daw } from "../../../svg/dawMess.svg";
import { ReactComponent as DoubleDaw } from "../../../svg/doubleDawMess.svg";

type Checking = {
    cheeeeeck: boolean,
    className?: string
}
const CheckIcon = ({cheeeeeck, className}:Checking) => {
return (
    <div className={className}>
        {cheeeeeck 
            ? <DoubleDaw width="28" height="18" />
            : <Daw width="17" height="16"/>
        }
    </div>
);
};
export default CheckIcon;
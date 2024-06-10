import { useAuth } from "hooks/use-auth";
import { ReactComponent as Daw } from "../../../svg/dawMess.svg";
import { ReactComponent as DoubleDaw } from "../../../svg/doubleDawMess.svg";
import { MessagesType } from "types/user";

type Checking = {
    cheeeeeck: boolean,
    className?: string,
    thisWord: MessagesType['word']
}
const CheckIcon = ({cheeeeeck, className, thisWord}:Checking) => {
    const {id} = useAuth()
    const idMess = thisWord.senderId;
    const styleEdit:React.CSSProperties = {
        display:'flex',
        textAlign:'center',
        justifyContent: 'start',
        gap:'4px'
    }

    return (
        <div className={className}>
            {idMess 
                && cheeeeeck 
                    ?<div style={styleEdit}>
                        {idMess === id.toString()
                            && <DoubleDaw width="28" height="16" />
                        }
                        
                        {thisWord.edited && thisWord.edited === true  && <ChechOtherUser cheeeeeck={true}/>}
                    </div> 
                    :<div style={styleEdit}>
                        {idMess === id.toString()
                            && <Daw width="17" height="16"/>
                        }
                        
                        {thisWord.edited && thisWord.edited === true  && <ChechOtherUser cheeeeeck={true}/>}
                    </div> 
                
            }
            {
            }
        </div>
    );
};
interface CheckingOther {
    cheeeeeck?: boolean,
    className?: string
}
const ChechOtherUser = ({ cheeeeeck, className}:CheckingOther) => {
    return (
        <div className={className}>
            {cheeeeeck && 
                <span style={{marginRight: '8px'}}>Изменено</span>
            }
        </div>
    );
};
export {CheckIcon, ChechOtherUser};
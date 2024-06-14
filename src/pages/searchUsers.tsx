import ErrBlock from 'Components/UI/ErrorBlock/error';
import { IsLoaderUsers } from 'Components/UI/isLoading/isLoading';
import { getDocs, collection, getFirestore, getDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useParams } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ProcessDataStart, ProcessDataFailure } from 'store/processes/process';
import { StartMessages, FinishMessages } from 'store/processes/processedMessages';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { SearchUserState } from 'types/user';
import { ReactComponent as Lupa } from '../svg/search-lupa.svg';
import { ReactComponent as CloseBtn } from '../svg/close.svg';

const UserSearch = () => {
    const { value: searchValue } = useParams();
    const { id } = useAuth();
    const [value, setValue] = useState('');
    const [boolSearchValue, setBoolSearchValue] = useState(false);
    const dispatch = useAppDispatch();
    const db = getFirestore()
    const [startIndex, setStartIndex] = useState(0);
    const [otherUsersData, setOtherUsersData] = useState<SearchUserState[]>([]);
    const [fullUsersData, setFullUsersData] = useState<SearchUserState[]>([]);
    const [ignore, setIgnore] = useState(15);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const itemsPerPage = 15;
    const {loadingMess} = useAppSelector(state => state.processMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (searchValue) {
        setValue(searchValue);
        const FirstSearchUsers = async () => {
          
          dispatch(StartMessages())
          try{
            const querySnapshot = await getDocs(collection(db, "users"));
            if(!querySnapshot.empty){
                const usersSearch: SearchUserState[] = [];
                querySnapshot.forEach((doc) => {
                  const userData = doc.data() as SearchUserState;
                  usersSearch.push(userData);
                })
                const res = usersSearch
                .filter(user => user.fullName && user.fullName.toLowerCase()
                .includes(searchValue.toLowerCase()));
                setFullUsersData(res)
                if(res.length >= itemsPerPage){
                  const newItems = res.slice(startIndex + itemsPerPage);
                  setOtherUsersData(newItems);
                  dispatch(FinishMessages())
                  }else{
                  setOtherUsersData(res);
                  dispatch(FinishMessages())
                }
            }else{
              dispatch(ProcessDataFailure('Что то пошло не так'));
      
            }
            
          }catch(err: any){
            dispatch(ProcessDataFailure(err.code));
            console.error(err.code)
          };
      
        }
        FirstSearchUsers()
      }else{
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    const generateChatID = (id1: string, id2: string) => {
      const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
      const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
      return (`${firstId}${secondId}`);
  };

    useEffect(()=> {
      if(value !== ''){
        setBoolSearchValue(true)
      }else{
        setBoolSearchValue(false)
      };
      
    }, [value]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter" && value) {
        SearchUsers();
      }
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.key === "Enter"){ 
        SearchUsers();
      }
    };

    const SearchUsers = () => {
        setStartIndex(0);
        dispatch(ProcessDataFailure(null));
        dispatch(StartMessages())
        const res = fullUsersData
        .filter(user => user.fullName && user.fullName.toLowerCase()
        .includes(value.toLowerCase()));
        if(res.length !== 0 ){
          if(res.length >= itemsPerPage){
            const newItems = res.slice(startIndex + itemsPerPage);
            setOtherUsersData(newItems);
            dispatch(FinishMessages())
          }else{
            setOtherUsersData(res);
            dispatch(FinishMessages())
          }
        }else{
          dispatch(FinishMessages())
          setOtherUsersData(res);
        }
          dispatch(FinishMessages())
  }

  const nextScroll = () => {
    const newItems = fullUsersData.slice(startIndex + ignore, startIndex + ignore + itemsPerPage);
    setOtherUsersData(prevItems => {
        const filteredNewItems = newItems.filter(newItem => {
          
        return !prevItems.some(prevItem => prevItem.id === newItem.id);
      });
      return [...prevItems, ...filteredNewItems];
    });
        setStartIndex(prevIndex => prevIndex + itemsPerPage);
        setIgnore(0)
        if (startIndex + itemsPerPage >= fullUsersData.length) {
            setHasMore(false);
            console.log(otherUsersData)
          }
  }

  const handleSelect = async (user: SearchUserState) => {
    const combinedId = generateChatID(id.toString(), user.id.toString());
    try{
      const res = await getDoc(doc(db, "chats",combinedId))
      
      if(!res.exists()){
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db,"UserChat", id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: user.id,
            fullName: user.fullName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
          
        });

        await updateDoc(doc(db,"UserChat", user.id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: id,
            fullName: user.fullName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
          
        });
        navigate(`/message/chat/${user.id}`);
      }else{
        navigate(`/message/chat/${user.id}`);
      }
    }catch(err: any){
      dispatch(ProcessDataFailure(err))
      dispatch(setSearchUserData([]))
    }
    dispatch(setSearchUserData([]));

  } 
  const handleClose = () => {
    setValue('');
    dispatch(ProcessDataFailure(null));

    
  }

  return (
    <div 
      style={{
        maxWidth: '80vw',
        position: 'relative',
        left: "50%",
        transform:'translate(-50%)'
      }}
    >
            <div
            style={{
              width: '90%', 
              position: 'relative', 
              left: '50%', 
              transform: 'translate(-50%)',
              margin:'16px 0px 8px 0px'
            }}
          >
      <Lupa className='lupa' onClick={SearchUsers} />
          <input 
            type="text"
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            onKeyUp={handleKeyUp}
            placeholder='Поиск'
            style={{padding: '8px 0px 8px 32px'}}
            className='inputSearch'
            enterKeyHint='search'
            />
                <TransitionGroup>
                  {boolSearchValue &&( 
                      <CSSTransition 
                      timeout={500} 
                      classNames="close" unmountOnExit 
                      in={boolSearchValue}
                      >
                        <CloseBtn 
                          onClick={handleClose}
                          className='closebtn'
                        />
                      </CSSTransition>
                  )}
              </TransitionGroup>
            </div>
          {loadingMess ? (
            <div>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
              <IsLoaderUsers/>
            </div>
          ): (
            otherUsersData.length === 0 
              ? <h3
                  style={{
                    width: '100%',
                    textAlign: 'center'
                  }}
                >Таких пользователей нет</h3>
              :         
              <InfiniteScroll 
                next={nextScroll} 
                hasMore={hasMore} 
                loader={''} 
                dataLength={otherUsersData.length}
                scrollThreshold={0.8}

              >
               
                  {otherUsersData.map((userData, index)=>(
                    <button
                        className="ChatsOtherUser"
                        key={index}
                        onClick={() => handleSelect(userData)}
                    >
                        <img src={userData.photoURL} alt={userData.fullName} />
                        <h3>{userData.fullName}</h3>
                    </button>
                  ))}
                
              </InfiniteScroll>
          )}
          
    </div>
  );
};


export {UserSearch};
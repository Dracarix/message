import ErrBlock from 'Components/UI/ErrorBlock/error';
import { IsLoaderUsers } from 'Components/UI/isLoading/isLoading';
import { getDocs, collection, getFirestore, getDoc, doc, serverTimestamp, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useParams } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ProcessDataStart, ProcessDataSuccess, ProcessDataFailure } from 'store/processes/process';
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
    const {error} = useAppSelector(state => state.process);
    const {loading} = useAppSelector(state => state.processMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (searchValue) {
        setValue(searchValue);
        const FirstSearchUsers = async () => {
          dispatch(StartMessages())
          const q = query(
            collection(db, "users"),
            where("fullName", ">=", searchValue),
            where("fullName", "<=", searchValue + '\uf8ff')
          )
          try{
            
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                dispatch(ProcessDataSuccess())
                const usersData = querySnapshot.docs.map((doc) => {
                  const data = doc.data() as SearchUserState; // Уточняем тип данных
                  return data;
                });
                setFullUsersData(usersData)
                const newItems = usersData.slice(startIndex, startIndex + itemsPerPage);
                setOtherUsersData(newItems);
                dispatch(FinishMessages())
            }else{
              dispatch(ProcessDataFailure('нет таких пользователей'));
            console.log('нет таких пользователей')
      
            }
            
          }catch(err: any){
            dispatch(ProcessDataFailure(err.message));
            console.error(err.message)
          };
      
      }
      FirstSearchUsers()
      }
    }, [searchValue]);

    const generateChatID = (id1: string, id2: string) => {
      const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
      const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
      return (`${firstId}${secondId}`);
  };
    useEffect(()=> {
      if(searchValue !== ''){
        setBoolSearchValue(true)
      }else{
        setBoolSearchValue(false)
      };
      
    }, [searchValue]);
    useEffect(()=> {
      console.log(otherUsersData);
    },[otherUsersData])
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter" && value) {
        SearchUsers();
      }
    };
    
    const SearchUsers = async () => {
      setStartIndex(0);
      dispatch(ProcessDataFailure(null));
      const q = query(
        collection(db, "users"),
        where("fullName", ">=", value),
        where("fullName", "<=", value + '\uf8ff')
      )
      try{
        dispatch(ProcessDataStart());
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            dispatch(StartMessages())
            const usersData = querySnapshot.docs.map((doc) => {
              const data = doc.data() as SearchUserState; // Уточняем тип данных
              return data;
            });
            setFullUsersData(usersData)
            const newItems = usersData.slice(startIndex + itemsPerPage);
            setOtherUsersData(newItems);
            dispatch(FinishMessages())
        }else{
          dispatch(ProcessDataFailure('нет таких пользователей'));
          dispatch(FinishMessages())
        
        setOtherUsersData([]);
        }
        
      }catch(err: any){
        dispatch(ProcessDataFailure(err.message));
        console.error(err.message)
      };
  
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
        navigate(`/chat/${user.id}`);
      }else{
        navigate(`/chat/${user.id}`);
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
        placeholder='Поиск'
        style={{padding: '8px 0px 8px 32px'}}
        className='inputSearch'
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
          {loading ? (
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

          error 
            ? <ErrBlock/>
            : (
          <InfiniteScroll 
                    next={nextScroll} 
                    hasMore={hasMore} 
                    loader={''} 
                    dataLength={otherUsersData.length}
                    scrollableTarget="chatUsersMain"
                    scrollThreshold={0.7}

                    >
                      <div
                      style={{padding: 0}}
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
                      </div>
                    </InfiniteScroll>
            )
          
          )}
          
    </div>
  );
};


export {UserSearch};
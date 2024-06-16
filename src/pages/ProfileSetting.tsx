import { useAuth } from "hooks/use-auth";
import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import '../styles/profile.scss';
import { useMediaQuery } from "react-responsive";
import { ReactComponent as EditPen } from "../svg/edit-pen.svg";
import { ReactComponent as Galka } from "../svg/galochka.svg";
import { getDownloadURL, getMetadata, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAppDispatch } from "hooks/use-redux";
import { ProcessDataFailure } from "store/processes/process";
import CryptoJS from 'crypto-js';
import { getDoc, doc, updateDoc, getFirestore } from "firebase/firestore";
import { ChatObject } from "types/user";
import { getAuth, updateProfile } from "firebase/auth";
import { openComplSetProf } from "store/processes/isModal";

const ProfileSetting = () => {
    const {firstName, lastName, photoURL, id} = useAuth(); 
    const [thisPhotoURL, setThisPhotoURL] = useState('');
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const mediaWidth = useMediaQuery({maxWidth: 800});
    const { thisID } = useParams();
    const [oneName, setOneName] = useState('');
    const [twoName, setTwoName] = useState('');
    const [img, setImg] = useState<File | null>(null);
    const storage = getStorage();
    const dispatch = useAppDispatch();
    const db = getFirestore();
    const userRef = doc(db, 'users', id.toString());  

//Функции для подгрузки или асинхронного обновления чего либо старт!!!!
    
    useEffect(()=>{
        if(thisID){
            if(id.toString() !== thisID){
               navigate('/message/');
            }else{               
                setOneName(firstName);
                setTwoName(lastName)
                setThisPhotoURL(photoURL);
            }
        }else{
            navigate('/message/');
        }
    },[])
    useEffect(()=>{

    })
    const generateChatID = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return (`${firstId}${secondId}`);
    };
    const calculateHash = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray);
        return hash.toString(CryptoJS.enc.Hex);
      };
        const getImageUrlFromStorage = async (hash: string): Promise<string | null> => {
          try {
            const imageRef = ref(storage, hash);
              await getMetadata(imageRef);
              const downloadURL = await getDownloadURL(imageRef);
              return downloadURL;
          } catch (error: any) {
            if (error.code === 'storage/object-not-found') {
              return null;
            }
            console.error('Ошибка при получении URL-адреса изображения:', error);
            return null;
          }
        };
        const userUpdatePhoto = async (newPhotoURL: string) => {
            const docSnap = await getDoc(doc(db, "UserChat", id.toString()));
            const dataThisUser = docSnap.data();
            if(dataThisUser){
              const userObject: ChatObject[] = Object.values(dataThisUser);
              userObject.forEach(async (item)=> {
                if(item.UserInfo.id && item && item.UserInfo){
    
                const idOtherUser = item.UserInfo.id;
                
                  const ChatID = generateChatID(idOtherUser, id.toString());
                const docRef = doc(db, 'UserChat', idOtherUser);
                const querySnapshot = await getDoc(docRef);
                const dataOtherUser = querySnapshot.data();
                if (dataOtherUser) {
                  const otherUserObject: ChatObject[] = Object.values(dataOtherUser);

                  
                  otherUserObject.forEach(async (i)=> {
                        if(
                            i 
                            && i.UserInfo 
                            && i.UserInfo.id 
                            && i.UserInfo.id === id.toString()
                        ){
                          await updateDoc(docRef, { [`${ChatID}.UserInfo.photoURL`]: newPhotoURL });
                          
                        }
                  })  
                }            
              }
              })
              if(user){
                await updateProfile(user, {photoURL: newPhotoURL});
              }
              await updateDoc(userRef, {
                photoURL: newPhotoURL,
              })
            }
          };
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                  setImg(file);
                } else {
                  dispatch(ProcessDataFailure('Изображение должно быть формата jpg, либо png'))
                }
              }
          };
          const editPhoto = async() => {
            if(img){
                const hash = await calculateHash(img);
                const imageUrl = await getImageUrlFromStorage(hash);
                if(imageUrl){
                  setThisPhotoURL(imageUrl);
                  await userUpdatePhoto(imageUrl);
                  
                }else{
                  const storageRef = ref(storage, hash);
                  const uploadTask = uploadBytesResumable(storageRef, img);
                  uploadTask.on(
                      'state_changed',
                      // Обработчик прогресса загрузки, если нужно
                      (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // Обновляем состояние вашего компонента с процентами
                        setUploadProgress(Math.floor(progress));
                      },
                      (error: any) => {
                          if (typeof error === 'string') {
                            dispatch(ProcessDataFailure(error));
                          } else {
                              dispatch(ProcessDataFailure(`'Неожиданный тип ошибки:', ${error}`));
                          }
                      },
                      async () => {
                          const downloadURL = await getDownloadURL(storageRef);
                          setThisPhotoURL(downloadURL);
                          await userUpdatePhoto(downloadURL)
                      }
                  )
                }
            }
        };

          const userUpdateName = async() => {
            const docSnap = await getDoc(doc(db, "UserChat", id.toString()));
            const dataThisUser = docSnap.data();
            const nameFull = oneName + ' ' + twoName;
            if(dataThisUser){
              const userObject: ChatObject[] = Object.values(dataThisUser);
              userObject.forEach(async (item)=> {                
                if(item.UserInfo.id && item && item.UserInfo){
   
                  
                const idOtherUser = item.UserInfo.id;
                
                  const ChatID = generateChatID(idOtherUser, id.toString());
                const docRef = doc(db, 'UserChat', idOtherUser);
                const querySnapshot = await getDoc(docRef);
                const dataOtherUser = querySnapshot.data();
                if (dataOtherUser) {
                  const otherUserObject: ChatObject[] = Object.values(dataOtherUser);
                  otherUserObject.forEach(async (i)=> {
                    if(
                        i 
                        && i.UserInfo 
                        && i.UserInfo.id 
                        && i.UserInfo.id === id.toString()
                    ){
                        if(twoName !== lastName || oneName !== firstName){
                            await updateDoc(docRef, { [`${ChatID}.UserInfo.fullName`]:nameFull });
                        }
                        if(oneName !== firstName){
                            await updateDoc(docRef, { [`${ChatID}.UserInfo.firstName`]:oneName });
                        }
                        if(twoName !== lastName){
                            await updateDoc(docRef, { [`${ChatID}.UserInfo.lastName`]:twoName });
                        }
                            
                      
                    }

                  })
                  
                }            
              }
              })
              if(user){
                await updateProfile(user, {displayName: nameFull});
              }
              await updateDoc(userRef, {
                fullName: nameFull,
                firstName: oneName,
                lastName: twoName,
              })
            }
    
          }
// финиш!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          const handleUpdateProfile = async() => {
            const promises = [];

            if (img) {
                promises.push(editPhoto());
            }
            if (twoName !== lastName || oneName !== firstName) {
                promises.push(userUpdateName());
            }
            try {
              await Promise.all(promises);
              dispatch(openComplSetProf());

            } catch (error) {
                dispatch(ProcessDataFailure('Произошла ошибка, попробуйте позже'));
            }
          }

return (
    <div className="profile__setting__main">
        <div className="profile__avatar">
            {uploadProgress !== null && uploadProgress !== 100
            ?(
                <h3 style={{
                      color:'white'
                    }}
                >
                    {`${uploadProgress}%`}
                </h3>
            ):(<>
                <img 
                    src={img ? URL.createObjectURL(img) : thisPhotoURL} 
                    alt={`Ваша фотография`} 
                    loading="eager"
                    
                    />
                {mediaWidth 
                        ? (
                        <label htmlFor="image">
                        
                            <EditPen  
                                className='editPen__media'
                                width='30px' height='30px'
                                /> 
                        </label>
                        ):(
                            <label 
                                htmlFor="image"
                                className="edit__photo"
                                >
                                <EditPen width='30px' height='30px'/> 
                                Изменить фото
                            </label>
                        )
                }
                    <input
                    type="file"
                    accept="image/*"
                    style={{display:'none'}}
                    id="image"
                    onChange={handleFileChange}
                    alt="Кнопка загрузки изображения"
                    />
                </>
            )   
        }
        </div>
        <div className="main__grid__setting">
            <input 
                type="text" 
                className="input__grid__setting"
                value={oneName} 
                defaultValue={firstName}
                onChange={(e) => setOneName(e.target.value)}
            />
        
            <input  
                type="text"  
                className="input__grid__setting"
                value={twoName}  
                defaultValue={lastName}  
                onChange={(e) => setTwoName(e.target.value)}
            />
        </div>
        <div className="setting__btns">
            <button className="setting__profile__btn"
                style={{color:'red'}}
            >
                Отменить
            </button>
            <button className="setting__profile__btn"
                style={{color:'green'}}       
                onClick={handleUpdateProfile}     
            >
                Сохранить
            </button>
        
        </div>
    </div>
);
};

//https://habr.com/ru/articles/125424/
const SettingCompletedProfile = () => {
    return (
      <div
        style={{
          display:'flex',
          fontSize:'calc(10px + 2vw)',
          alignItems:'center'
        }}
      >
        <Galka 
          width='50px' 
          height='50px'
          style={{marginRight:'8px'}}
        />
        Успешно сохранено!
      </div>
    )
}
export {ProfileSetting, SettingCompletedProfile};
import { Timestamp } from "firebase/firestore";

export interface UserState{
    email: string,
    token:string,
    id:string,
    photoURL: string,
    fullName: string,
    firstName: string,
    lastName: string | null,
    selectedUsers?: { 
      id: string;
      photoURL: string;
      fullName: string;
     }[];
}
export type UserInfoOnly = {
   
  id: string;
  photoURL: string;
  fullName: string;
}

export interface SearchUserState {
  email: string;
  token: string;
  id: number;
  photoURL: string;
  fullName: string;
  firstName: string;
  lastName: string | null;
  [key: string]: string |number| null;
}

export type CallbackType = () => Promise<void>;

export interface ProcessDataState {
    data: any;
    loading: boolean;
    error: Error | null;
  }
  
 export interface ErrorObject {
    errorReducer: any;
    code: string;
    message: string;
  }
  export interface NodeChildren {
    children?: React.ReactNode;
  }
  export interface DefaultChildren {
    children: string,
  }
  export interface ChatObject {
    UserInfo: {
      id: string;
      photoURL: string;
      fullName: string;
    };
    date: Timestamp;
    lastMessage:{
      text: string;
      date:Timestamp;
      from: string;
      messID:string;
      for?: string;
      checked?: boolean;
    } | null,
  }
  export interface ChatObjectItem {
    chat?:ChatObject;
    UserID?: string;
  }
  export type OtherUserInfo = {
    id: string;
    photoURL: string;
    fullName: string;
  } | null;

  export interface MessagesType {
    word:{

      id: string;
      text: string;
      senderId:string;
      date: Timestamp | null;
      img: string | null;
      deleteFor?: string;
      edited:boolean;
      checkedFor?: {
        id:  string
      }[]
    }
  } 

  export interface LinkBtnTypes {
    icon: boolean,

    className?:string,
  }
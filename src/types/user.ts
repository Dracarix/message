import { Timestamp } from "firebase/firestore";

export interface UserState{
    email: string,
    token:string,
    id:number,
    photoURL: string,
    name: string,
}

export interface SearchUserState{
  email: string,
  token:string,
  id:number,
  photoURL: string,
  name: string,
  [key: string]: string | number,
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
    children: React.ReactNode;
  }
  export interface DefaultChildren {
    children: string,
  }
  export interface ChatObject {
    UserInfo: {
      id: string;
      photoURL: string;
      name: string;
    };
    date: Timestamp;

  }
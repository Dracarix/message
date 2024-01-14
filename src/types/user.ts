export interface UserState{
    email: string,
    token:string,
    id:number,
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
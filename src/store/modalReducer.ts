import { PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
    isOpen: boolean;
    component: string | null;
}

export type OpenModalAction = {
    type: 'modal/openModal';
    payload: {
      componentName: string;
      
    };
  };
const initialState = {
    isOpen: false,
    component: null,
  };
  
  const modalReducer = (state: ModalState = initialState, action: PayloadAction<{ componentName: string }>): ModalState => {
    switch (action.type) {
      case 'modal/openModal':
        return {
          ...state,
          isOpen: true,
          component: action.payload.componentName,
        };
      // Другие case
      default:
        return state;
    }
  };
  
  export default modalReducer;
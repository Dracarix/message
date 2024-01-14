import { createAction } from '@reduxjs/toolkit';
import { ReactElement, ReactNode } from 'react';
interface UpdateHtmlContentAction {
    type: string;
    payload: {
      component: JSX.Element;
    };
  }

// export const updateHtmlContentActions = createAction<UpdateHtmlContentAction>('./process/isModalHTML');


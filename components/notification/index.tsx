/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function notification(message: string, ...props: any) {
  return toast(message, props);
}

export function NotificationContainer(...props: any) {
  return (
    <ToastContainer
      {...props}
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      bodyClassName="text-neutral-500 text-sm h-5 tracking-wider my-4"
    />
  );
}

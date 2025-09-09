import React from 'react';

interface AlertProps {
  title: string;
  message: string;
}

const AlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


export const Alert: React.FC<AlertProps> = ({ title, message }) => {
  return (
    <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-4" role="alert">
      <div className="flex">
        <div className="py-1">
            <AlertIcon className="w-6 h-6 text-yellow-400 mr-4"/>
        </div>
        <div>
          <strong className="font-bold">{title}</strong>
          <span className="block sm:inline ml-2">{message}</span>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div className={`mb-4 p-3 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} relative`}>
      {message}
      {onClose && (
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Notification;
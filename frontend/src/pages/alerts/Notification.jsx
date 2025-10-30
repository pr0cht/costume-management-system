import React, { useEffect } from 'react';

function AppNotification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const notificationClass = `notification ${type === 'error' ? 'is-error' : 'is-success'}`;

  return (
    <div className={notificationClass}>
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
}

export default AppNotification;
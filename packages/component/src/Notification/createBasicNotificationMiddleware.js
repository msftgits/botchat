import React from 'react';

import BasicNotification from './BasicNotification';

function createBasicNotificationMiddleware() {
  return () => () => ({ notification: { alt, id, level, message } }) => (
    <BasicNotification alt={alt} level={level} message={message} notificationId={id} />
  );
}

export default createBasicNotificationMiddleware;
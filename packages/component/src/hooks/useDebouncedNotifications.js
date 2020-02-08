import { useRef } from 'react';
import updateIn from 'simple-update-in';

import { map as minOfMap } from '../Utils/minOf';
import filterMap from '../Utils/filterMap';
import useForceRender from './internal/useForceRender';
import useNotifications from './useNotifications';
import useStyleOptions from './useStyleOptions';
import useTimer from './internal/useTimer';

function useDebouncedNotifications() {
  const now = Date.now();

  const [{ toastDebounceTimeout }] = useStyleOptions();
  const [notifications] = useNotifications();
  const debouncedNotificationsRef = useRef({});
  const forceRender = useForceRender();

  // Delete notifications or mark them to be deleted if debouncing.
  for (const id of Object.keys(debouncedNotificationsRef.current).filter(id => !(id in notifications))) {
    debouncedNotificationsRef.current = updateIn(debouncedNotificationsRef.current, [id], debouncedNotification => {
      if (now < debouncedNotification.updateNotBefore) {
        // The update need to be postponed.
        return { ...debouncedNotification, outOfDate: true };
      }

      // Otherwise, return undefined will remove it.
    });
  }

  // For any changes, update notifications or mark them to be updated if debouncing.
  for (const [, { alt, data, id, level, message, timestamp }] of Object.entries(notifications)) {
    debouncedNotificationsRef.current = updateIn(debouncedNotificationsRef.current, [id], debouncedNotification => {
      if (
        debouncedNotification &&
        alt === debouncedNotification.alt &&
        Object.is(data, debouncedNotification.data) &&
        level === debouncedNotification.level &&
        message === debouncedNotification.message &&
        timestamp === debouncedNotification.timestamp
      ) {
        // If nothing changed, return as-is.
        return debouncedNotification;
      }

      if (debouncedNotification && now < debouncedNotification.updateNotBefore) {
        // The update need to be postponed.
        return {
          ...debouncedNotification,
          outOfDate: true
        };
      }

      // Update the notification.
      return {
        ...debouncedNotification,
        alt,
        data,
        id,
        level,
        message,
        outOfDate: false,
        timestamp,
        updateNotBefore: now + toastDebounceTimeout
      };
    });
  }

  const [, { updateNotBefore: earliestUpdateNotBefore }] = minOfMap(
    filterMap(debouncedNotificationsRef.current, ({ outOfDate }) => outOfDate),
    ({ updateNotBefore }) => updateNotBefore
  ) || [undefined, {}];

  useTimer(earliestUpdateNotBefore, forceRender);

  return [debouncedNotificationsRef.current];
}

export default useDebouncedNotifications;

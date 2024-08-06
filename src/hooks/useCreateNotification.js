import { useCallback } from 'react';
import { database } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_NOTIFICATION } from '@env';

const useCreateNotification = () => {
  const createNotification = useCallback(async (user_id, receiver_id, message) => {
    try {
      await database.createDocument(DATABASE_ID, COLLECTION_ID_NOTIFICATION, 'unique()', {
        user_id,
        receiver_id,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, []);

  return createNotification;
};

export default useCreateNotification;

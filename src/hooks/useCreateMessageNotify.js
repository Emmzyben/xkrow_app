import { useCallback } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_NOTIFICATION, COLLECTION_ID_PROFILE } from '@env';

const useCreateMessageNotify = () => {
  const createMessageNotify = useCallback(async (user_id, receiver_id) => {
    try {
      const userProfileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', user_id)]
      );

      if (userProfileQuery.total === 0) {
        throw new Error('user profile not found');
      }

      const userProfileDoc = userProfileQuery.documents[0];
      const userName = `${userProfileDoc.firstName} ${userProfileDoc.lastName}`;

      await database.createDocument(DATABASE_ID, COLLECTION_ID_NOTIFICATION, 'unique()', {
        user_id,
        receiver_id,
        message: `You have a new message from ${userName}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, []);

  return createMessageNotify;
};

export default useCreateMessageNotify;

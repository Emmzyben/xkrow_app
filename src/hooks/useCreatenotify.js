import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_PROFILE } from '@env';
import useCreateNotification from './useCreateNotification';

const useCreateNotify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createNotification = useCreateNotification(); 

  const CreateNotify = async ({ escrowUrl, vendor_id }) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the escrow document
      const escrowQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        [Query.equal('escrow_link', escrowUrl)]
      );

      if (escrowQuery.total === 0) {
        throw new Error('Escrow document not found');
      }

      const escrowDoc = escrowQuery.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        escrowDoc.$id,
        { status: 'awaiting confirmation' }
      );

      const message = `You have a transaction awaiting confirmation from ${vendor_id}`;
      await createNotification('', vendor_id, message);
    } catch (err) {
      console.error('Error changing status:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { CreateNotify, loading, error };
};

export default useCreateNotify;

import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_PROFILE } from '@env';
import useCreateNotification from './useCreateNotification';

const useHandleConfirm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createNotification = useCreateNotification(); // Use the notification hook

  const HandleConfirm = async ({ vendorId, escrowUrl, buyerId }) => {
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

      // Convert amount from string to integer
      const escrowAmount = parseInt(escrowDoc.amount, 10);

      // Validate escrow document attributes
      if (
        escrowDoc.vendor_id !== vendorId ||
        escrowDoc.buyer_id !== buyerId 
      ) {
        throw new Error('Escrow document validation failed');
      }

      // Fetch the buyer's profile document
      const buyerProfileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', buyerId)]
      );

      if (buyerProfileQuery.total === 0) {
        throw new Error('Buyer profile not found');
      }

      const buyerProfileDoc = buyerProfileQuery.documents[0];

      const currentBalance = buyerProfileDoc.balance ? parseInt(buyerProfileDoc.balance, 10) : 0;

      const newBalance = currentBalance + escrowAmount;

      // Update buyer's profile balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        buyerProfileDoc.$id,
        { balance: newBalance }
      );

      // Update escrow document status to 'completed'
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        escrowDoc.$id,
        { status: 'completed' }
      );

      // Fetch the vendor's profile document
      const vendorProfileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', vendorId)]
      );

      if (vendorProfileQuery.total === 0) {
        throw new Error('Vendor profile not found');
      }

      const vendorProfileDoc = vendorProfileQuery.documents[0];
      const vendorName = `${vendorProfileDoc.firstName} ${vendorProfileDoc.lastName}`;

      // Send a notification to the vendor
      const message = `You have received ${escrowAmount} from ${vendorName}`;
      await createNotification(vendorId, buyerId, message);

      setLoading(false);
    } catch (error) {
      console.error('Error releasing payment:', error);
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { HandleConfirm, loading, error };
};

export default useHandleConfirm;

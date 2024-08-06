import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_PROFILE } from '@env';
import useCreateNotification from './useCreateNotification';

const useReleasePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createNotification = useCreateNotification(); // Use the notification hook
  
  const releasePayment = async ({ vendorId, escrowUrl, amount, buyerId }) => {
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
      const inputAmount = parseInt(amount, 10);

      // Validate escrow document attributes
      if (
        escrowDoc.vendor_id !== vendorId ||
        escrowDoc.buyer_id !== buyerId ||
        escrowAmount !== inputAmount
      ) {
        throw new Error('Escrow document validation failed');
      }

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

      // Convert vendor balance from string to integer
      const currentBalance = vendorProfileDoc.balance ? parseInt(vendorProfileDoc.balance, 10) : 0;
      
      // Add the amount to the vendor's balance
      const newBalance = currentBalance + escrowAmount;

      // Update vendor's profile with new balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        vendorProfileDoc.$id,
        { balance: newBalance } 
      );

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
      const buyerName = `${buyerProfileDoc.firstName} ${buyerProfileDoc.lastName}`;
      const message = `You have received ${escrowAmount} from ${buyerName}`;
      
      // Create a notification for the vendor
      await createNotification( buyerId,vendorId, message);

      // Update escrow document status to 'completed'
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        escrowDoc.$id,
        { status: 'completed'}
      );

      setLoading(false);
    } catch (error) {
      console.error('Error releasing payment:', error);
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { releasePayment, loading, error };
};

export default useReleasePayment;

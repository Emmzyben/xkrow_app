import { useState } from 'react';
import { database, Query } from '../backend/appwite'; 
import { useUser } from '../backend/user'; 
import { DATABASE_ID, COLLECTION_ID_PROFILE } from '@env';

const useFundWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser(); 

  const fundWallet = async (amount) => {
    if (!user || !user.id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userProfileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', user.id)]
      );

      if (userProfileQuery.total === 0) {
        throw new Error('User profile not found');
      }

      const userProfileDoc = userProfileQuery.documents[0];

      // Convert balance and amount to integers
      const currentBalance = userProfileDoc.balance ? parseInt(userProfileDoc.balance, 10) : 0;
      const fundingAmount = parseInt(amount, 10);

      // Add the amount to the user's balance
      const newBalance = currentBalance + fundingAmount;

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        userProfileDoc.$id,
        { balance: newBalance} 
      );

    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { fundWallet, loading, error };
};

export default useFundWallet;

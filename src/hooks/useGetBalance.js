import { useState, useEffect } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE, COLLECTION_ID_ESCROW } from '@env';
import { useUser } from '../backend/user';

const useGetBalance = () => {
  const { user } = useUser();
  const [balance, setBalance] = useState(0);
  const [pendingEscrowSum, setPendingEscrowSum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchBalanceAndPendingEscrow();
    }
  }, [user]);

  const fetchBalanceAndPendingEscrow = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user's profile balance
      const profileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', user.id)]
      );

      if (profileQuery.total > 0) {
        const userProfile = profileQuery.documents[0];
        setBalance(userProfile.balance);
      } else {
        throw new Error('Profile not found');
      }

      // Fetch pending escrow amounts for the logged-in user
      const escrowQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        [
          Query.equal('buyer_id', user.id),
          Query.equal('status', 'pending')
        ]
      );

      const pendingAmounts = escrowQuery.documents.map(doc => parseFloat(doc.amount));
      const sumOfPendingEscrow = pendingAmounts.reduce((total, amount) => total + amount, 0);

      setPendingEscrowSum(sumOfPendingEscrow);
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching balance and pending escrow:', error);
      setError(error);
      setLoading(false);
    }
  };

  return { balance, pendingEscrowSum, loading, error, fetchBalanceAndPendingEscrow };
};

export default useGetBalance;

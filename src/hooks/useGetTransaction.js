import { useState, useEffect } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_VENDOR, COLLECTION_ID_CONTRACTOR } from '@env';
import { useUser } from '../backend/user';

const useGetTransaction = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all escrow documents where the user is either the buyer or vendor
      const escrowQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        [
          Query.or([
            Query.equal('buyer_id', user.id),
            Query.equal('vendor_id', user.id)
          ]),
          Query.orderDesc('created_at')
        ]
      );

      const transactions = await Promise.all(
        escrowQuery.documents.map(async (escrowDoc) => {
          const escrowLink = escrowDoc.escrow_link;
          let productName = '';

          if (escrowDoc.seller === 'vendor') {
            const vendorQuery = await database.listDocuments(
              DATABASE_ID,
              COLLECTION_ID_VENDOR,
              [Query.equal('escrow_url', escrowLink)]
            );

            if (vendorQuery.total > 0) {
              productName = vendorQuery.documents[0].product_name;
            }
          } else if (escrowDoc.seller === 'contractor') {
            const contractorQuery = await database.listDocuments(
              DATABASE_ID,
              COLLECTION_ID_CONTRACTOR,
              [Query.equal('escrow_url', escrowLink)]
            );

            if (contractorQuery.total > 0) {
              productName = contractorQuery.documents[0].title;
            }
          }

          return {
            ...escrowDoc,
            productName
          };
        })
      );

      setTransactions(transactions);
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching transactions:', error);
      setError(error);
      setLoading(false);
    }
  };

  return { transactions, loading, error, fetchTransactions };
};

export default useGetTransaction;

import { useState, useCallback } from 'react';
import { Client, Functions, Databases, Query } from 'appwrite';
import { API_URL, API_KEY, FUNCTION_ID, DATABASE_ID, COLLECTION_ID_PROFILE } from '@env';
import { useUser } from '../backend/user'; 

const client = new Client()
  .setEndpoint(API_URL) 
  .setProject(API_KEY); 

const functions = new Functions(client);
const database = new Databases(client);

const useCreateTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { user } = useUser(); 

  const createTransfer = useCallback(async (bankName, accountNumber, accountName, amount) => {
    if (!user || !user.id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

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

      const currentBalance = userProfileDoc.balance ? parseInt(userProfileDoc.balance, 10) : 0;
      const transferAmount = parseInt(amount, 10);

      if (currentBalance < transferAmount) {
        throw new Error('Insufficient balance for the withdrawal.');
      }

      const response = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({
          bankName,
          accountNumber,
          accountName,
          amount
        }),
        false 
      );

      console.log('Raw response:', response);

      let data;
      try {
        data = JSON.parse(response.response || '{}');
      } catch (e) {
        throw new Error('Failed to parse response from the server.');
      }

      if (data.success) {
        setResult(data.data);

        const newBalance = currentBalance - transferAmount;

        await database.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_PROFILE,
          userProfileDoc.$id,
          { balance: newBalance }
        );
      } else {
        setError(data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred during the withdrawal.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { createTransfer, loading, error, result };
};

export default useCreateTransfer;

import { useState, useEffect } from 'react';
import { database } from '../backend/appwite';
import { Query, ID } from 'appwrite';
import { DATABASE_ID, COLLECTION_ID_CONVERSATIONS } from '@env';

const useFetchOrCreateConversation = (userId1, userId2) => {
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_CONVERSATIONS, [
          Query.equal('participants', userId1),
          Query.equal('participants', userId2)
        ]);

        if (result.documents.length > 0) {
          setConversationId(result.documents[0].$id);
        } else {
          const response = await database.createDocument(DATABASE_ID, COLLECTION_ID_CONVERSATIONS, ID.unique(), {
            participants: [userId1, userId2],
            lastMessage: '', // Initialize with an empty string
            createdAt: new Date().toISOString() // Set the current date and time
          });
          setConversationId(response.$id);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId1 && userId2) {
      fetchOrCreateConversation();
    }
  }, [userId1, userId2]);

  return { conversationId, loading, error };
};

export default useFetchOrCreateConversation;

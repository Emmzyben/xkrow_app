import { database,Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PERSONAL_INFO } from '@env';

const useGetPersonalInfo = async (userId) => {
  try {

    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      [
          Query.equal('user_id', userId)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
};

export default useGetPersonalInfo;

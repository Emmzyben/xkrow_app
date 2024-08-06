import { database } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PERSONAL_INFO } from '@env';
import { Query } from '../backend/appwite';

const useGetAllVendor = async (searchTerm = '') => {
  try {
    // Define the query to filter vendors by business name if a searchTerm is provided
    const queries = searchTerm
      ? [Query.search('business_name', searchTerm)]
      : [];

    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      queries
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
};

export default useGetAllVendor;

import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PRODUCTS } from '@env';

const useGetProducts = async (userId) => {
  try {
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PRODUCTS,
      [Query.equal('user_id', userId)]
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export default useGetProducts;

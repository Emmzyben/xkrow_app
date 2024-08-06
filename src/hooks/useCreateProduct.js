import { database, ID } from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_PRODUCTS } from '@env';

const useCreateProduct = async (productData) => {
  const {
    userId,
    itemName,
    price,
    description,
    imageUrl,
  } = productData;

  try {
    await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID_PRODUCTS,
      ID.unique(),
      {
        user_id: userId,
        item_name: itemName,
        price,
        description,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export default useCreateProduct;

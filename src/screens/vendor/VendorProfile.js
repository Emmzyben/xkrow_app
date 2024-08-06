import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faGlobe, faCog, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import useFetchProfileImage from '../../hooks/useFetchProfileImage';
import useGetPersonalInfo from '../../hooks/useGetPersonalInfo'; 
import useGetProducts from '../../hooks/useGetProducts';
import useFetchOrCreateConversation from '../../hooks/useFetchOrCreateConversation';
import { useUser } from '../../backend/user';

const VendorProfile = ({ route, navigation }) => {
  const { userId } = route.params; 
  const { user } = useUser(); 
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    businessName: '',
    businessType: '',
    businessCategory: '',
    businessDescription: '',
    address: '',
  });
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userId) {
        try {
          const imageUrl = await useFetchProfileImage(userId);
          setProfileImage(imageUrl);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };
    fetchProfileImage();
  }, [userId]);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (userId) {
        try {
          const info = await useGetPersonalInfo(userId);
          if (info && info.length > 0) {
            const data = info[0];
            setPersonalInfo({
              businessName: data.business_name,
              businessType: data.business_type,
              businessCategory: data.business_category,
              businessDescription: data.description,
              address: data.address,
            });
          }
        } catch (error) {
          console.error('Error fetching personal info:', error);
        }
      }
    };
    fetchPersonalInfo();
  }, [userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        try {
          const allProducts = await useGetProducts(userId);
          setProducts(allProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setProductsLoading(false);
        }
      }
    };
    fetchProducts();
  }, [userId]);

  const { conversationId, loading: convoLoading, error: convoError } = useFetchOrCreateConversation(user?.id, userId);

  const handleChat = () => {
    if (!convoLoading && conversationId) {
      console.log('Navigating to ChatScreen with conversationId:', conversationId);
      navigation.navigate('ChatScreen', { conversationId });
    } else {
      console.error('Unable to navigate to ChatScreen:', convoError);
    }
  };

  return (
    <View>
      <View style={{ padding: 30, borderBottomWidth: 1, borderBottomColor: 'rgba(102, 112, 133, 1)' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 30, left: 20 }}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 15.3, lineHeight: 18.52, fontWeight: '700', color: '#141414' }}>Vendor Profile</Text>
      </View>

      <View style={styles.profilePicture}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={{ height: '100%' }} />
        ) : (
          <Text>No Profile Image</Text>
        )}
      </View>

      <Text style={styles.businessName}>{personalInfo.businessName || 'Business Name'}</Text>
      <View style={styles.follow}>
        <TouchableOpacity style={styles.followbtn}>
          <Text style={{ textAlign: 'center' }}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followbtn} onPress={handleChat}>
          <Text style={{ textAlign: 'center' }}>Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bio}>
        <View style={styles.trx}>
          <View>
            <Text style={{ fontSize: 12, fontWeight: '600' }}>Business Information</Text>
          </View>
        </View>
        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faGlobe} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={styles.text5}>{personalInfo.businessType || 'Business Type'}</Text>
              <Text style={styles.text7}>{personalInfo.businessCategory || 'Business Category'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faCog} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={styles.text7}>{personalInfo.businessDescription || 'Business Description'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faAddressCard} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={styles.text7}>{personalInfo.address || 'Business Address'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bio}>
        <View style={styles.trx}>
          <View>
            <Text style={{ fontSize: 12, fontWeight: '600' }}>Products</Text>
          </View>
        </View>

        <View style={styles.allProductsContainer}>
          {productsLoading ? (
            <ActivityIndicator size="large" color="#62248F" style={{ marginTop: 20 }} />
          ) : (
            products.map((product) => (
              <TouchableOpacity
                key={product.$id}
                onPress={() => navigation.navigate('ProductDetails', { productData: product })}
                style={{ margin: 5 }}
              >
                <Image
                  source={{ uri: product.image_url }}
                  style={styles.productImageContainer}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default VendorProfile;

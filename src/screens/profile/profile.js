import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faGlobe, faCog, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../backend/user';
import useCreateProfileImage from '../../hooks/useCreateProfileImage';
import useFetchProfileImage from '../../hooks/useFetchProfileImage';
import useGetPersonalInfo from '../../hooks/useGetPersonalInfo';
import useGetProducts from '../../hooks/useGetProducts';
import * as ImagePicker from 'expo-image-picker';
import { storage, ID } from '../../backend/appwite'; 
import { BUCKET_ID, API_URL, PROJECT_ID } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../../styles/style';
import { StyleSheet } from 'react-native';
const Profile = ({ navigation }) => {
  const contextUser = useUser();
  const { logout } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
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

  const fetchProfileImage = async () => {
    if (contextUser?.user?.id) {
      try {
        const imageUrl = await useFetchProfileImage(contextUser.user.id);
        setProfileImage(imageUrl || 'https://example.com/placeholder-image.jpg');
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfileImage('https://example.com/placeholder-image.jpg');
      }
    }
  };

  const fetchPersonalInfo = async () => {
    if (contextUser?.user?.id) {
      try {
        const info = await useGetPersonalInfo(contextUser.user.id);
        if (info?.length > 0) {
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

  const fetchProducts = async () => {
    if (contextUser?.user?.id) {
      try {
        const allProducts = await useGetProducts(contextUser.user.id);
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
      fetchPersonalInfo();
      fetchProducts();
    }, [contextUser.user?.id])
  );

  const sendXmlHttpRequest = (data) => {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 201) resolve(JSON.parse(xhr.response));
        else reject(`Request Failed: ${xhr.status} ${xhr.statusText}`);
      };
      xhr.open("POST", `${API_URL}/storage/buckets/${BUCKET_ID}/files`);
      xhr.withCredentials = true;
      xhr.setRequestHeader("X-Appwrite-Project", PROJECT_ID);
      xhr.setRequestHeader("X-Appwrite-Response-Format", "0.15.0");
      xhr.setRequestHeader("x-sdk-version", "appwrite:web:9.0.1");
      xhr.send(data);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      try {
        await submitImage(result.assets[0].uri);  // Automatically submit the image
      } catch (error) {
        Alert.alert('Submit failed', error.message || 'An error occurred while submitting the image');
      }
    }
  };

  const uploadImage = async () => {
    if (!image) throw new Error("No image selected");

    const filename = image.split("/").pop();
    const match = /\.(\w+)$/.exec(image);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("fileId", ID.unique());
    formData.append("file", {
      uri: image,
      name: filename,
      type,
    });

    try {
      const response = await sendXmlHttpRequest(formData);
      console.log('Image upload response:', response); // Debugging line
      return response.$id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const submitImage = async (imageUri) => {
    try {
      setLoading(true);
      const fileId = await uploadImage(imageUri);
      const fileUrl = `${API_URL}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      
      const result = await useCreateProfileImage(contextUser.user.id, fileUrl);
    
      if (result.success) {
        Alert.alert('Success', 'Profile picture updated successfully');
        // Update the profileImage state to reflect the new profile picture
        setProfileImage(fileUrl);
      } else {
        Alert.alert('Submit failed', result.message);
      }
    } catch (error) {
      Alert.alert('Submit failed', error.message || 'An error occurred while submitting the image');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={localStyles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>Profile</Text>
      </View>
<View style={localStyles.bg}>
  <View style={styles.profilePicture}>
  {profileImage ? (
    <Image source={{ uri: profileImage }} style={localStyles.profileImage} />
  ) : (
    <Text>No Profile Image</Text>
  )}
  <TouchableOpacity 
    onPress={pickImage} 
    style={styles.editIcon}
  >
    <FontAwesomeIcon icon={faPen} size={18} color='#fff'/>
  </TouchableOpacity>
</View>
</View>
      


      <Text style={styles.businessName}>{personalInfo.businessName || 'Business Name'}</Text>
      <View style={styles.follow}>
        <TouchableOpacity style={styles.followbtn}>
          <Text style={localStyles.followButtonText}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followbtn} onPress={() => navigation.navigate('Chatbox')}>
          <Text style={localStyles.followButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bio}>
        <View style={styles.trx}>
          <View>
            <Text style={localStyles.sectionTitle}>Business information</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile2')}>
              <Text style={localStyles.updateLink}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faGlobe} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={localStyles.text5}>{personalInfo.businessType || 'Business Type'}</Text>
              <Text style={localStyles.text7}>{personalInfo.businessCategory || 'Business Category'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faCog} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={localStyles.text7}>{personalInfo.businessDescription || 'Business Description'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.step1}>
          <View style={styles.step1Under}>
            <View>
              <FontAwesomeIcon icon={faAddressCard} size={16} color='rgba(98, 36, 143, 1)' />
            </View>
            <View>
              <Text style={localStyles.text7}>{personalInfo.address || 'Business Address'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bio}>
        <View style={styles.trx}>
          <View>
            <Text style={localStyles.sectionTitle}>Your Products</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile3')}>
              <Text style={localStyles.updateLink}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View><Text>{'\n'}</Text>

        <View style={localStyles.allProductsContainer}>
          {productsLoading ? (
            <ActivityIndicator size="large" color="#62248F" style={localStyles.activityIndicator} />
          ) : (
            products.map((product) => (
              <TouchableOpacity
                key={product.$id}
                onPress={() => navigation.navigate('ProductDetails', { productData: product })}
                style={localStyles.productContainer}
              >
                <Image
                  source={{ uri: product.image_url }}
                  style={localStyles.productImage}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          disabled={loading}
          onPress={async () => {
            setLoading(true); // Set loading to true before starting the logout process
            try {
              await logout(); // Call the logout method
              Alert.alert('Logout Successful', 'You have been logged out.');
              // Optionally, navigate to the login screen after logout
              navigation.navigate('Login'); 
            } catch (error) {
              Alert.alert('Logout Failed', error.message || 'Failed to log out.');
            } finally {
              setLoading(false); 
            }
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log out</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',paddingTop:50
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,zIndex:10000
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  profileImage: {
    height: '100%',borderRadius:100
  },
  followButtonText: {
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  updateLink: {
    color: '#62248F',
    fontSize: 12,
    fontWeight: '600',
  },
  text5: {
    fontSize: 12,
    fontWeight: '600',
  },
  text7: {
    fontSize: 12,
  },
  allProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginTop: 20,
  },
  productContainer: {
    margin: 5,
  },
  productImage: {
    width: 100,
    height: 100,borderRadius:20
  },
  bg:{
    display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#ccc'
  }
});

export default Profile;

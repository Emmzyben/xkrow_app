import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Xkrow from '../../components/xkrow';
import { useUser } from '../../backend/user';
import useCreateVendor from '../../hooks/useCreateVendor';
import { database, Query } from '../../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE, COLLECTION_ID_BVN, COLLECTION_ID_IDENTITY } from '@env';
import useGetProfile from '../../hooks/useGetProfile';
import KYC from '../../components/kyc';
import KYC2 from '../../components/kyc2';
import KYC3 from '../../components/kyc3';
import styles from '../../styles/style';
const Vendor1 = ({ navigation }) => {
  const contextUser = useUser();
  const { createVendor, loading: vendorLoading, error: vendorError } = useCreateVendor();
  const [product_name, setProductName] = useState('');
  const [product_cost, setProductPrice] = useState('');
  const [description, setDescription] = useState('');
  const [escrowLink, setEscrowLink] = useState(null);
  const { profile, loading: profileLoading, error: profileError, fetchProfile } = useGetProfile();
  const [showKYC1, setShowKYC1] = useState(false);
  const [showKYC2, setShowKYC2] = useState(false);
  const [showKYC3, setShowKYC3] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(false);

  const checkCollections = async () => {
    try {
      const userIdQuery = [Query.equal('user_id', contextUser.user.id)];

      const profileResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PROFILE, userIdQuery);
      const bvnResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_BVN, userIdQuery);
      const identityResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_IDENTITY, userIdQuery);

      if (profileResponse.total === 0) {
        setShowKYC1(true);
        setShowKYC2(false);
        setShowKYC3(false);
      } else if (bvnResponse.total === 0 && identityResponse.total === 0) {
        setShowKYC1(false);
        setShowKYC2(true);
        setShowKYC3(false);
      } else if (bvnResponse.total > 0 && identityResponse.total === 0) {
        setShowKYC1(false);
        setShowKYC2(false);
        setShowKYC3(true);
      } else {
        setShowKYC1(false);
        setShowKYC2(false);
        setShowKYC3(false);
      }
    } catch (error) {
      console.error('Error checking collections:', error);
    }
  };

  useEffect(() => {
    if (contextUser.user?.id) {
      fetchProfile();
      setCheckingKYC(true);
      const intervalId = setInterval(() => {
        checkCollections();
      }, 1000); 

      // Clear interval when KYC is completed or user logs out
      return () => {
        clearInterval(intervalId);
        setCheckingKYC(false);
      };
    }
  }, [contextUser.user]);

  const handleNavigation = (route) => {
    setShowKYC1(false);
    setShowKYC2(false);
    setShowKYC3(false);
    navigation.navigate(route);
  };

  const validate = () => {
    if (!product_name) return 'Product name is required';
    if (!product_cost) return 'Product price is required';
    return null;
  };

  const submitVendor = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const vendorData = {
        userId: contextUser.user.id,
        product_name,
        product_cost,
        description,
      };

      const link = await createVendor(vendorData);
      setEscrowLink(link);
    } catch (error) {
      alert(error.message || 'Submit failed');
    }
  };

  const localStyles = StyleSheet.create({
    container: {
      padding: 20,
      borderColor: 'rgba(102, 112, 133, 1)',
      borderWidth: 1,paddingTop:50
    },
    iconLeft: {
      position: 'absolute',
      top: 50,
      zIndex: 1000,left:20
    },
    iconRight: {
      position: 'absolute',
      top: 50,
      zIndex: 1000,
      right: 20,
    },
    titleText: {
      textAlign: 'center',
      fontSize: 15.3,
      lineHeight: 18.52,
      fontWeight: '700',
      color: '#141414',
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    xkrowFee: {
      padding: 20,
    },
  });

  return (
    <View style={{backgroundColor:'#fff',height:'100%'}}>
      <View style={localStyles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.iconLeft}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.titleText}>
          New Xkrow transaction
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={localStyles.iconRight}>
          <FontAwesomeIcon icon={faCommentDots} size={17} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.section}>
        <Text style={styles.text4}>What would you like to sell</Text>
        <Text style={styles.text5}>Name of Products</Text>
        <TextInput 
          style={styles.input} 
          placeholder='Enter name of products' 
          value={product_name}
          onChangeText={setProductName}
        />
        <Text style={styles.text5}>Total cost of Products</Text>
        <TextInput 
          style={styles.input} 
          placeholder='Enter amount' 
          keyboardType='numeric' 
          value={product_cost}
          onChangeText={setProductPrice}
        />
        <Text style={styles.text5}>Descriptions</Text>
        <TextInput 
          style={styles.input} 
          placeholder='Enter description (Optional)' 
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={localStyles.xkrowFee}>
        {/* <Text style={styles.text5}>Xkrow Fee</Text>
        <Text style={styles.text7}>$10.00</Text> */}
      </View>

      {vendorError && <Text style={styles.text7}>{vendorError.message}</Text>}

      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          onPress={submitVendor}
          disabled={vendorLoading}
        >
          {vendorLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Link</Text>
          )}
        </TouchableOpacity>
      </View>

      {showKYC1 && <KYC onVerify={() => handleNavigation('Page1')} />}
      {showKYC2 && <KYC2 onVerify={() => handleNavigation('Page3')} />}
      {showKYC3 && <KYC3 onVerify={() => handleNavigation('Page4')} />}
      {escrowLink && <Xkrow escrowLink={escrowLink} />}
    </View>
  );
};

export default Vendor1;

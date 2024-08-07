import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import useCreateEscrow from '../../hooks/useCreateEscrow';
import Progress from '../../components/progress';
import Success from '../../components/success';
import Failure from '../../components/failure';
import { useUser } from '../../backend/user';

const Buyer3 = ({ navigation, route }) => {
  const { vendorData } = route.params;
  const { createEscrow, loading, error } = useCreateEscrow();
  const contextUser = useUser();
  const [status, setStatus] = useState(null);
  const [escrowFee, setEscrowFee] = useState(0);
  const [userEscrowFee, setUserEscrowFee] = useState(0);

  useEffect(() => {
    const calculateEscrowFee = (amount) => {
      if (amount <= 49999) {
        return 500;
      } else if (amount <= 124999) {
        return 750;
      } else if (amount <= 199999) {
        return 1000;
      } else {
        return amount * 0.0125;
      }
    };

    const fee = calculateEscrowFee(vendorData.product_cost);
    setEscrowFee(fee);
    setUserEscrowFee(fee / 2);
  }, [vendorData.product_cost]);

  const handlePayment = async () => {
    try {
      setStatus('loading');
      await createEscrow({
        amount: vendorData.product_cost,
        vendorId: vendorData.user_id,
        buyerId: contextUser.user.id,
        escrowLink: vendorData.escrow_url,
      });
      setStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setStatus('failure');
    }
  };

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigation.navigate('Details', { vendorData });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, navigation, vendorData]);

  const isVendor = contextUser.user.id === vendorData.user_id;

  return (
    <View>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.arrowButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>New Xkrow transaction</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={localStyles.chatButton}>
          <FontAwesomeIcon icon={faCommentDots} size={17} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.productInfo}>
        <Text style={styles.text4}>Products</Text>
        <Text style={styles.text5}>Name of Product</Text>
        <Text style={styles.text7}>{vendorData.product_name}</Text>
        <Text style={styles.text5}>Price of Product</Text>
        <Text style={styles.text7}>₦{vendorData.product_cost}</Text>
        <Text style={styles.text5}>Product Description</Text>
        <Text style={styles.text7}>{vendorData.description}</Text>
      </View>

      <View style={localStyles.fee}>
        <Text style={styles.text5}>Xkrow Fee</Text>
        <Text style={styles.text7}>₦{userEscrowFee}</Text>
      </View>

      <View style={styles.lastDown1}>
        {!isVendor && (
          <TouchableOpacity style={styles.btn} onPress={handlePayment} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Make Payment</Text>}
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btn3} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel Action</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' && <Progress />}
      {status === 'success' && <Success />}
      {status === 'failure' && <Failure />}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 112, 133, 1)',
    position: 'relative',paddingTop:50
  },
  arrowButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  chatButton: {
    position: 'absolute',
    top: '40%',
    zIndex: 1000,
    right: '5%',
  },
  productInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  fee: {
    padding: 20,
  },
});

export default Buyer3;

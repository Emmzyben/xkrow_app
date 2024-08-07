import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet ,ScrollView} from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useReleasePayment from '../../hooks/useReleasePayment';
import { useUser } from '../../backend/user';
import Progress from '../../components/progress';
import ReleaseSuccess from '../../components/releaseSuccess';
import Failure2 from '../../components/failure2';

const Details = ({ route, navigation }) => {
  const { vendorData } = route.params;
  const { releasePayment, loading, error } = useReleasePayment();
  const contextUser = useUser();
  const [status, setStatus] = useState(null);

  const handleReleasePayment = async () => {
    try {
      setStatus('loading');
      await releasePayment({
        vendorId: vendorData.user_id,
        escrowUrl: vendorData.escrow_url,
        amount: vendorData.product_cost,
        buyerId: contextUser.user.id
      });
      setStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setStatus('failure');
    }
  };

  // Check if the logged-in user is the vendor
  const isVendor = contextUser.user.id === vendorData.user_id;

  return (
    <ScrollView>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.arrowButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>Xkrow Transaction</Text>
      </View>

      <View style={styles.goods}>
        <View style={styles.product}>
          <Text style={styles.white}>{vendorData.product_name}</Text>
        </View>

        <View style={styles.cost1}>
          <View style={styles.cost}>
            <Text style={styles.white2}>Cost</Text>
            <Text style={styles.white2}>₦{vendorData.product_cost}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.text10}>Pending transaction...</Text>
      <Text style={styles.text9}>
        Your money is being held by Xkrow until the transaction is completed
      </Text>

      <View style={styles.lastDown1}>
        {!isVendor && (
          <TouchableOpacity style={styles.btn} onPress={handleReleasePayment} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>I have received my goods</Text>}
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('FundTransactions')}>
          <Text style={styles.buttonText}>Transactions</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' && <Progress />}
      {status === 'success' && <ReleaseSuccess />}
      {status === 'failure' && <Failure2 />}
      {error && <Text>Error: {error.message}</Text>}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    position: 'relative',paddingTop:50
  },
  arrowButton: {
    position: 'absolute',
    top: 50,left:20,
    zIndex: 1000,
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
});

export default Details;

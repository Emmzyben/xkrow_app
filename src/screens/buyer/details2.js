import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet ,ScrollView} from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../backend/user';
import useCreateNotify from '../../hooks/useCreatenotify';
import ReleaseSuccess from '../../components/releaseSuccess';
import Failure2 from '../../components/failure2';

const Details2 = ({ route, navigation }) => {
  const { contractorData, totalAmount } = route.params;
  const contextUser = useUser();
  const { CreateNotify, loading, error } = useCreateNotify();
  const [status, setStatus] = useState(null);

  if (!contractorData) {
    return (
      <View style={localStyles.noDataContainer}>
        <Text style={localStyles.noDataText}>
          No contractor data available.
        </Text>
      </View>
    );
  }

  const handleCreateNotify = async () => {
    try {
      await CreateNotify({
        escrowUrl: contractorData.escrow_link,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <ScrollView>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.arrowButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>
          Xkrow Transaction
        </Text>
      </View>

      <View style={styles.goods}>
        <View style={styles.product}>
          <Text style={styles.white}>{contractorData.title}</Text>
        </View>

        <View style={styles.cost1}>
          <View style={styles.cost}>
            <Text style={styles.white2}>Total Amount</Text>
            <Text style={styles.white2}>₦{totalAmount}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.text10}>Pending transaction...</Text>
      <Text style={styles.text9}>
        Your money is being held by Xkrow until the transaction is completed
      </Text>

      <View style={styles.lastDown1}>
        <TouchableOpacity style={styles.btn} onPress={handleCreateNotify} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>I have finished the work</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn3} onPress={() => navigation.navigate('FundTransactions')}>
          <Text style={styles.buttonText}>Transactions</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      {status === 'success' && <ReleaseSuccess />}
      {status === 'error' && <Failure2 />}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,paddingTop:50
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
  noDataContainer: {
    padding: 30,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
});

export default Details2;

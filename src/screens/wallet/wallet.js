import React, { useEffect } from 'react';
import { View, Text ,TouchableOpacity} from 'react-native';
import styles from '../../styles/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Hero from '../../components/hero';
import Nav from '../../components/nav';
import Transactions from '../../components/transactions';
import { useUser } from '../../backend/user';
import useGetProfile from '../../hooks/useGetProfile'; 

const Wallet = ({ navigation }) => {
  const { user } = useUser();
  const { profile, loading, error, fetchProfile } = useGetProfile();

  useEffect(() => {
    if (user?.id) {
      fetchProfile(); 
    }
  }, [user]);

  return (
    <View style={styles.contain}>
      <View style={styles.top}>
        <View style={styles.top1}>
          <Text style={styles.text2}>
            Welcome {loading ? 'Loading...' : profile ? `${profile.firstName} ${profile.lastName}` : 'User'}
          </Text>
          <Text style={styles.text7}>Here is your wallet details</Text>
        </View> 
        <View >
          
        </View>
      </View>

      <Hero />

      <Transactions />

      <Nav />
    </View>
  );
};

export default Wallet;

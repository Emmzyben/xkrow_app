import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWallet, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import useGetBalance from '../hooks/useGetBalance';

const Hero = () => {
  const navigation = useNavigation();
  const { balance, pendingEscrowSum, error, fetchBalanceAndPendingEscrow } = useGetBalance();
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    fetchBalanceAndPendingEscrow();

    const intervalId = setInterval(() => {
      fetchBalanceAndPendingEscrow();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  return (
    <View>
      <View style={styles.cover}>
        <View style={localStyles.walletContainer}>
          <Text style={styles.text7}>Wallet Balance</Text>
          <View style={localStyles.balanceContainer}>
            <Text style={styles.balance}>
              {showBalance ? (balance ? `₦${balance.toLocaleString()}` : 'Loading...') : '*****'}
            </Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} style={localStyles.iconButton}>
              <FontAwesomeIcon icon={showBalance ? faEyeSlash : faEye} size={17} style={localStyles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fund}>
          <TouchableOpacity onPress={() => navigation.navigate('Fund')} style={styles.fund1}>
            <Text style={localStyles.fundText}>Fund Wallet</Text>
            <FontAwesomeIcon icon={faWallet} size={17} style={styles.text4} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Withdraw')} style={styles.fund1}>
            <Text style={localStyles.fundText}>Withdraw</Text>
            <FontAwesomeIcon icon={faWallet} size={17} style={styles.text4} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cover1}>
        <Text style={localStyles.escrowText}>
          Xkrow Balance: {showBalance ? (pendingEscrowSum !== null ? `₦${pendingEscrowSum.toFixed(2)}` : 'Loading...') : '*****'}
        </Text>
      </View>

  </View>
  );
};

const localStyles = StyleSheet.create({
  walletContainer: {
    padding: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    color: '#fff',
  },
  fundText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: '#34005A',
    marginRight: 10,
  },
  escrowText: {
    color: '#fff',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Hero;

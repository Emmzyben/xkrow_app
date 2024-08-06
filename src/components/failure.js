import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const Failure = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faCircleExclamation} size={25} style={localStyles.icon} />
        <Text style={localStyles.mainText}>We couldn't proceed your payment</Text>
        <Text style={localStyles.subText}>Please, check your wallet balance</Text>
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Fund')}>
            <Text style={localStyles.buttonText}>Fund Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Buyer2')}>
            <Text style={localStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    color: 'rgba(204, 98, 98, 1)',
  },
  mainText: {
    fontSize: 18.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  subText: {
    fontSize: 12.55,
    fontWeight: '600',
    lineHeight: 19.31,
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',color:'#fff'
  },
});

export default Failure;

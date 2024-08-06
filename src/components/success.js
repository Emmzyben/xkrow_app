import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const Success = () => {
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faCircleCheck} size={25} style={localStyles.icon} />
        <Text style={localStyles.title}>Done!</Text>
        <Text style={localStyles.message}>Your wallet has been successfully charged</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    color: 'rgba(63, 188, 143, 1)',
  },
  title: {
    fontSize: 18.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  message: {
    fontSize: 12.55,
    fontWeight: '600',
    lineHeight: 19.31,
    textAlign: 'center',
  },
});

export default Success;

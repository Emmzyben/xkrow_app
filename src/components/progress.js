import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../styles/style';

const Progress = () => {
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="rgba(98, 36, 143, 1)" />
        <Text style={localStyles.title}>Payment in Progress</Text>
        <Text style={localStyles.message}>Please, wait a few moments</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
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

export default Progress;

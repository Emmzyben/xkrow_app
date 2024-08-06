import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faCommentDots, faWallet, faUser } from '@fortawesome/free-solid-svg-icons';

const Nav = () => {
  const navigation = useNavigation();
  return (
    <View style={localStyles.container}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.insideNav}>
          <FontAwesomeIcon icon={faHouse} size={13} style={styles.icon1} />
          <Text style={styles.navs}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={styles.insideNav}>
          <FontAwesomeIcon icon={faCommentDots} size={13} style={styles.icon1} />
          <Text style={styles.navs}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.insideNav}>
          <FontAwesomeIcon icon={faWallet} size={13} style={styles.icon1} />
          <Text style={styles.navs}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.insideNav}>
          <FontAwesomeIcon icon={faUser} size={13} style={styles.icon1} />
          <Text style={styles.navs}>Profile</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,bottom:0,
  },
});

export default Nav;

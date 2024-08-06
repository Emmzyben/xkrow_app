import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';

const Buyer1 = ({ navigation }) => {
  return (
    <View >
      <View style={styles.newcover}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} style={localStyles.arrow} />
        </TouchableOpacity>
      </View>
        
  <View>
      <Text style={localStyles.subtitle}>
          Discover top picks tailored just for you
        </Text>
        <Text style={localStyles.title}>Xkrow Transaction</Text>
  </View>
      
      </View>

      <View style={styles.toper}>
        <Text style={localStyles.description}>
          Kindly choose role you will be performing
        </Text>

        <View style={styles.role}>
          <TouchableOpacity onPress={() => navigation.navigate('Buyer2')} style={styles.roles}>
            <Text style={localStyles.roleText}>Buyer</Text>
            <Image source={require('../../../assets/OBJECTS.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Vendor1')} style={styles.roles}>
            <Text style={localStyles.roleText}>Vendor</Text>
            <Image source={require('../../../assets/OBJECTS3.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Contractor')} style={styles.roles}>
            <Text style={localStyles.roleText}>Contractor</Text>
            <Image source={require('../../../assets/OBJECTS1.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Professionals1')} style={styles.roles}>
            <Text style={localStyles.roleText}>Skilled professionals</Text>
            <Image source={require('../../../assets/OBJECTS2.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={localStyles.footer}>
        <Text style={localStyles.footerText}>
          <FontAwesomeIcon icon={faLock} size={11} /> Secure payment with escrow protection
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  arrow: {
    color: '#FFFFFF',
    margin:10
  },
  subtitle: {
    fontSize: 13.43,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 16.25,
  },
  title: {
    fontSize: 19.18,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 23.21,
  },
  description: {
    color: '#62248F',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  roleText: {
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '500',
    color: '#3A0064',
  },
  footer: {
    padding: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
  },
});

export default Buyer1;

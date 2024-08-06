import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = ({ navigation }) => {
  const route = useRoute();
  const { productData } = route.params;

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      <View style={styles.container}>
        <Image source={{ uri: productData.image_url }} style={styles.image} />
        <Text style={styles.title}>Item name: {productData.item_name}</Text>
        <Text style={styles.price}>Price: ₦{productData.price}</Text>
        <Text style={styles.description}>Description: {productData.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 15,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  container: {
    padding: 20,
    margin: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    fontSize: 15,
    color: 'green',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
  },
});

export default ProductDetails;

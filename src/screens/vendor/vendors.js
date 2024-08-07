import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image ,ScrollView} from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useGetAllVendor from '../../hooks/useGetAllVendor';
import { useUser } from '../../backend/user'; 

const Vendors = ({ navigation }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser(); // Get the user context

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Fetch vendors with the search term
        const vendorData = await useGetAllVendor(searchTerm);

        // Filter out the logged-in user's vendor
        const filteredVendors = vendorData.filter(vendor => vendor.user_id !== user.id);
        setVendors(filteredVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [user.id, searchTerm]); // Dependency on user.id and searchTerm to refetch if user changes or search term changes

  if (loading) {
    return <ActivityIndicator size="large" color="#62248F" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(102, 112, 133, 1)' ,paddingTop:50}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 50, left: 20,zIndex:100000 }}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 15.3, lineHeight: 18.52, fontWeight: '700', color: '#141414' }}>
          Vendors
        </Text>
      </View>

      <View style={styles.Vendors}>
        <Text style={styles.text5}>Find Vendors</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Search' 
          keyboardType='default'
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={styles.float}>
          <TouchableOpacity>
            <Text style={styles.small}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.small}>Most Active</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.small}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.small}>New</Text>
          </TouchableOpacity>
        </View>

        <View>
          {vendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.user_id}
              onPress={() => navigation.navigate('VendorProfile', { userId: vendor.user_id })}
              style={styles.floater}
            >
              <Image style={styles.img1}   source={vendor.image_url ? { uri: vendor.image_url } : require('../../../assets/logo.jpg')}
 />
              <View>
                <Text style={styles.text5}>{vendor.business_name}</Text>
                <Text style={styles.text3}>{vendor.followers_count} followers</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Vendors;

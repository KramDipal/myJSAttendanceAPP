import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
// import { signOutWithMsg } from '../auth/signOut';
// import { FirebaseContextStore } from '../store/firebaseContext';
import { ContextStoreAPI } from '../store/contextAPI';
// import Pattern from '../assets/bg_image.jpg';

const { width: screenWidth } = Dimensions.get('window');

export default function PostComp() {
  const scrollViewRef = useRef(null);
//   const firebaseContextStore = useContext(FirebaseContextStore);
//   const { user } = firebaseContextStore;
  const contextStoreAPI = useContext(ContextStoreAPI);
  const { apiName, location } = contextStoreAPI;
  

  const [images] = useState([
    require('../assets/img1.jpg'),
    require('../assets/img2.jpg'),
    require('../assets/img3.jpg'),
    require('../assets/img4.jpg'),
    require('../assets/road1.png'),
    require('../assets/img2.jpg'),
    require('../assets/img3.jpg'),
    require('../assets/img4.jpg'),
  ]);
  const [city, setCity] = useState('Loading...'); // State to hold city name

  const imageWidth = screenWidth * 0.5; // Each image takes 80% of screen width

  useEffect(() => {
    let currentIndex = 0;
    const totalImages = images.length;

    const scrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalImages; // Loop back to start
      const scrollX = currentIndex * imageWidth;

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        // console.log(`Scrolling to index ${currentIndex}, x: ${scrollX}`); // Debug
      } else {
        console.log('ScrollView ref not available');
      }
    }, 1000); // Scroll every 3 seconds

    return () => {
      console.log('Cleaning up interval');
      clearInterval(scrollInterval);
    };
  }, [images, imageWidth]);

  // Fetch city name when location changes
  useEffect(() => {
    const fetchCity = async () => {
      if (!location?.coords) {
        setCity('N/A');
        return;
      }

      try {
        const { latitude, longitude } = location.coords;
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (geocode.length > 0) {
          setCity(geocode[0].city || geocode[0].subregion || 'Unknown');
        } else {
          setCity('Unknown');
        }
      } catch (error) {
        console.error('Error fetching city:', error);
        setCity('Error');
      }
    };

    fetchCity();
  }, [location]); // Runs whenever location changes


//   const handleSearchLocation = () => {
//     console.log('Searching');
//     contextStoreAPI.getLocation();
//   };

    // Shorten latitude and longitude to 2 decimal places
    const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(2) : 'N/A';
  };

  return (
    <>
      {/* <ImageBackground source={Pattern} resizeMode="cover" style={styles.container}> */}
      <ImageBackground source={require('../assets/CoLogo2.jpg')} resizeMode="cover" style={styles.container}>

        <View style={{ marginTop: 450 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={image} // Use require() directly
                style={[styles.image, { width: imageWidth }]}
              />
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
      <View style={styles.latlong}>
        <Text style={{color:'#ffca2b', fontSize:'20'}}>Latitude: {formatCoordinate(location?.coords.latitude)}°</Text>

        <Text style={{color:'#ffca2b', fontSize:'20'}}>Longitude: {formatCoordinate(location?.coords.longitude)}°</Text>

      </View>
      <Text style={{color:'#ffca2b', fontSize:'20', marginLeft:35}}>City: {city}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  latlong: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    // marginBottom: 5,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  image: {
    height: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  Logo:{
    marginBottom: 10,
    resizeMode: 'contain',
    borderRadius: 10,
  }
});
import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import * as Location from 'expo-location';
import Pattern from '../assets/bg_image.jpg';
import { ContextStoreAPI } from '../store/contextAPI';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

export default function PostComp() {
  const scrollViewRef = useRef(null);
  const { location } = useContext(ContextStoreAPI); // Simplified context usage
  const videoRef = useRef(null);

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
  const [city, setCity] = useState('Loading...');
  const [cityLoading, setCityLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const imageWidth = screenWidth * 0.5;

  useEffect(() => {
    if (!autoScroll) return;
    let index = 0;
    const totalImages = images.length;

    const scrollInterval = setInterval(() => {
      index = (index + 1) % totalImages;
      const scrollX = index * imageWidth;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        setCurrentIndex(index);
      }
    }, 1000);

    return () => clearInterval(scrollInterval);
  }, [autoScroll, images, imageWidth]);

  useEffect(() => {
    const fetchCity = async () => {
      if (!location?.coords) {
        setCity('N/A');
        return;
      }
      setCityLoading(true);
      try {
        const { latitude, longitude } = location.coords;
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        setCity(geocode[0]?.city || geocode[0]?.subregion || 'Unknown');
      } catch (error) {
        console.error('Error fetching city:', error);
        setCity('Error');
      } finally {
        setCityLoading(false);
      }
    };
    fetchCity();
  }, [location]);

  // Handle image press
  const handleImagePress = (index) => {
    // Alert.alert('Image Pressed', `You clicked on image #${index + 1}`);
    setSelectedImage(images[index]);
    setModalVisible(true);
    // You can replace this with any action, e.g., navigation or custom logic
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setModalVisible(false); // Close modal when video finishes
    }
  };
  
  const formatCoordinate = (coord) => (coord ? coord.toFixed(2) : 'N/A');

  return (
    <>
      <ImageBackground source={require('../assets/CoLogo2.jpg')} resizeMode="cover" style={styles.container}>
        <View style={{ marginTop: 420 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >

            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
                activeOpacity={0.8} // Slight fade effect on press
              >
                <Image
                  source={image}
                  style={[styles.image, { width: imageWidth }]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* pause button */}
          {/* <View style={styles.controlContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setAutoScroll(prev => !prev)}
            >
              <Text style={styles.controlText}>{autoScroll ? 'Pause' : 'Resume'}</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentIndex ? '#ffca2b' : '#ccc' },
                ]}
              />
            ))}
          </View>
        </View>

        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>

            {/* {console.log(selectedImage)} */}


            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {selectedImage === 23 
            ?           
                <Video
                ref={videoRef}
                source={require('../assets/ctls.mp4')} // Replace with your MP4 file
                style={styles.video}
                useNativeControls={false}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}            
                />            
            :
            <Image source={selectedImage} style={styles.fullImage} />
          } 
          </View>
        </Modal>

      </ImageBackground>
      <View style={styles.latlong}>
        <Text style={styles.coordText}>Latitude: {formatCoordinate(location?.coords.latitude)}°</Text>
        <Text style={styles.coordText}>Longitude: {formatCoordinate(location?.coords.longitude)}°</Text>
      </View>
      <Text style={styles.cityText}>City: {cityLoading ? 'Loading...' : city}</Text>
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
  },
  scrollContainer: {
    alignItems: 'center',
  },
  image: {
    height: 100,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  controlContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: '#ffca2b',
    padding: 10,
    borderRadius: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  coordText: {
    // color: '#ffca2b',
    color: '#7117b3',
    fontSize: 20,
  },
  cityText: {
    // color: '#ffca2b',
    color:'#7117b3',
    fontSize: 20,
    marginLeft: 35,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 150,
    right: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  fullImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9 * (100 / 100), // Maintain aspect ratio
    borderRadius: 10,
  },
  video: {
    width: screenWidth * 0.8,
    height: 200,
    borderRadius: 10,
  },
});
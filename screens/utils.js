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
  Modal,
  Platform,
  Button
} from 'react-native';
import * as Location from 'expo-location';
import Pattern from '../assets/bg_image.jpg';
import { ContextStoreAPI } from '../store/contextAPI';
import { Video } from 'expo-av';
// import YoutubePlayer from 'react-native-youtube-iframe';

// const { width: screenWidth } = Dimensions.get('window');
// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function PostComp() {
  const scrollViewRef = useRef(null);
  const { location } = useContext(ContextStoreAPI); // Simplified context usage
  const videoRef = useRef(null);
  const [ city, setCity ] = useState('Loading...');
  const [ cityLoading, setCityLoading ] = useState(false);
  const [ autoScroll, setAutoScroll]  = useState(true);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ modalCountVisible, setModalVidCountVisible ] = useState(false);
  const [ selectedImage, setSelectedImage ] = useState(null);
  const [ selectedPayImage, setSelectedImagePay ] = useState(null);
  const [ selectedVideo, setSelectedVideo ] = useState([0]);


  const imageWidth = screenWidth * 0.5;
  const [images] = useState([
    require('../assets/puma.jpg'),
    require('../assets/puma1.jpg'),
    require('../assets/pumaf1.jpg'),
    require('../assets/pumaf2.jpg'),
    require('../assets/pumaBolt.jpg'),
    require('../assets/pumaC.jpg'),
    require('../assets/pumaBall.jpg'),
    require('../assets/pumaFoot.jpg'),
  ]);

  const [imagesPay] = useState([
    require('../assets/pumaBball.jpg'),
    require('../assets/pumaEveryday.jpg'),
    require('../assets/pumaf1logo.jpg'),
    require('../assets/pumaFootBall.png'),
  ]);


  const [videoMap] = useState([    
    require('../assets/pumavid2.mp4'),
    require('../assets/pumavid3.mp4'),
    require('../assets/pumavid4.mp4'),
    require('../assets/pumavid.mp4'),
  ]);

  const [selectionVideoCounts, setSelectionVideoCounts] = useState(
    new Array(videoMap.length).fill(0) // Initialize counts as 0 for each index
  );

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



  //get geolocation
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
    setSelectedImagePay(null);
    setModalVisible(true);
    // You can replace this with any action, e.g., navigation or custom logic
  };


  //select and load video base on index
  const handleImagePressPay = (index) => {
     console.log(`Image ${index} pressed`);
    // Add your navigation or action logic here
        // Alert.alert('Image Pressed', `You clicked on image #${index + 1}`)    
    setSelectedVideo(index);
    handleVideoSelection(index);
    // setSelectedImagePay(imagesPay[index]);
    // setSelectedImage(null); //for the modal display on selected image
    // setModalVisible(true);
  };

  //add to index + 1 if selected
  const handleVideoSelection = (index) => {

    console.log("handleVideoSelection index: " + index)
    // setSelectedVideo(index);
    setSelectionVideoCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      console.log("handleVideoSelection newCounts: " + newCounts)

      newCounts[index] = (newCounts[index] || 0) + 1;

      console.log("handleVideoSelection newCounts2: " + newCounts)
      return newCounts;
    });


  };
  // console.log("handleVideoSelection selectionCounts: " + selectionCounts)
  // const handlePlaybackStatusUpdate = (status) => {
  //   if (status.didJustFinish) {
  //     setModalVisible(false); // Close modal when video finishes
  //   }
  // };
  
  const formatCoordinate = (coord) => (coord ? coord.toFixed(2) : 'N/A');

  // console.log("selectedVideo " + selectedVideo);

  return (
    <>
      <ImageBackground 
        source={require('../assets/fr2.jpg')} 
        resizeMode="repeat"
        style={styles.container}
        >


      {/* <View style={styles.imageContainer}>
        {imagesPay.map((imagesPay, index) => (
              // <TouchableOpacity
              //   key={index}
              //   onPress={() => handleImagePress(index)}
              //   activeOpacity={0.8} // Slight fade effect on press
              // >
                <Image
                  source={imagesPay}
                  style={styles.imagePay}
                />
              // </TouchableOpacity>
            ))}

        </View> */}

      {/*  Display Dashboard Start*/}
      {/* Modal Trigger Button */}
      <Button
        title="Dashboard"
        onPress={() => setModalVidCountVisible(true)}
      />
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCountVisible}
        onRequestClose={() => setModalVidCountVisible(false)}
      >

        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dashboard</Text>
            {selectionVideoCounts.map((count, index) => (
              <Text key={index} style={styles.modalItem}>
                Video {index + 1}: {count} times
              </Text>
            ))}
            <Button
              title="Close"
              onPress={() => setModalVidCountVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* dipslay dashboard end */}

      <View style={styles.imagePayContainer}>
      {imagesPay.map((imagePay, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleImagePressPay(index)}
          activeOpacity={0.8} // Slight fade on press
          style={styles.touchable}
        >
          <Image source={imagePay} style={styles.imagePay} />
        </TouchableOpacity>
      ))}
      </View>

  
      <View style={styles.viewView}>
          <Video
                ref={videoRef}
                source={videoMap[selectedVideo]}
                style={styles.video}
                useNativeControls={true}
                shouldPlay
                isLooping={true}
                resizeMode="contain"                
                // onPlaybatrue}tusUpdate={handlePlaybackStatusUpdate}            
          />  
      </View>

        <View>
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


            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          <Image source={selectedPayImage ? selectedPayImage : selectedImage} style={styles.fullImage} />
          </View>
        </Modal>

      </ImageBackground>
      <View style={styles.latlong}>
        <Text style={styles.coordText}>Latitude: {formatCoordinate(location?.coords.latitude)}°</Text>
        <Text style={styles.coordText}>Longitude: {formatCoordinate(location?.coords.longitude)}°</Text>
        <Text style={styles.coordText}>City: {cityLoading ? 'Loading...' : city}</Text>
      </View>

    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  latlong: {
    // marginTop: 5,s
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // marginBottom:5,
    backgroundColor:'#ff2800'
  },
  scrollContainer: {
    alignItems: 'center',
    // backgroundColor:'#ff2800',
  },
  image: {
    height: 100,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  imagePay: {
    height: 50,
    width: 90,
    borderRadius: 10, // Rounded corners
    marginHorizontal: 8, // Space between images
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Android shadow
    borderWidth: 1, // Subtle border
    borderColor: 'black', // Light border color
    backgroundColor: '#fff', // White background for images
  },
  imagePayContainer: {
    marginTop:5,
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-around', // Evenly space images
    alignItems: 'center', // Vertically center images
    paddingVertical: 5, // Add some vertical padding
    // paddingHorizontal: 5, // Slight horizontal padding
    backgroundColor: 'black', // Light gray background for contrast
    // borderRadius: 5, // Rounded container edges
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
    // color: '#7117b3',
    color: 'white',
    fontSize: 15,
  },
  cityText: {
    // color: '#ffca2b',
    color:'#7117b3',
    fontSize: 15,
    marginLeft: 58,
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
    // width: 400,
    // height: 360,
    // borderRadius: 10,
    width: 400, // Full width minus padding
    height: 320, // 16:9 aspect ratio
    borderRadius: 10,

  },
  viewView:{
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Number, not string
  },
  dashboard: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: screenWidth - 40,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dashboardItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: screenWidth - 60,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});
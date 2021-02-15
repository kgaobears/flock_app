import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
import {useStore} from 'react-redux';
import {
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import HowTo from 'App/HowTo';
import HeaderGradient from 'App/components/HeaderGradient';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Dialog from 'react-native-dialog';
import {firebase, db, au} from 'App/firebase/config';
import io from 'socket.io-client';
import NavBar from 'App/components/common/NavBar';
import {GiftedChat} from 'react-native-gifted-chat';
import AnimatedModal from 'App/components/AnimatedModal';
import Checkout from 'App/components/Checkout';
import {useFocusEffect} from '@react-navigation/native';
// import NumericTextInput from 'App/components'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Countdown from 'App/components/Countdown';



const PriceSlider = ({priceShareInitialPercent, completeFunc=()=>{}, productPrice, remainingPercent, maximums, setOutsideState=()=>{}, confirm=true}) => {
    console.log(priceShareInitialPercent+"%");
    const [initialPercent, setInitialPercent] = useState(priceShareInitialPercent);
    const [pricePercent, setPricePercent] = useState(initialPercent);
    const [changed, setChanged] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const select = useSelector(state=>state.userInfo);
  
    var changeable = false;
    console.log('remaining', remainingPercent);
  
    if (true) {
      // console.log(priceShare, "priceShare");
      console.log(productPrice * pricePercent);
      return <>
      <View style={{flexDirection: 'row', justifyContent: 'center', }}>
        {changed && confirm?<View style={{backgroundColor: constants.DONE, marginRight: 30, justifyContent: 'center', borderRadius: 40, padding: 10}}>
          <TouchableOpacity onPress={()=>{
            setPricePercent(initialPercent);
            setChanged(false);
          }}><Text>Cancel</Text></TouchableOpacity>
        </View>:<View style={{opacity:0,padding: 10, marginRight:30}} ><Text>Cancel</Text></View>}
      <View style={{alignItems: 'center', width: 175}}>
      <Text style={{color:'black'}}>You are paying</Text>
        <Text style={{fontSize: 18, color: 'black'}}>${(parseFloat(productPrice) * pricePercent/100).toFixed(2)} ({pricePercent>remainingPercent?remainingPercent:pricePercent.toFixed(0)}%)</Text>
      </View>
      {changed && confirm?<View style={{backgroundColor: constants.DONE, marginLeft: 30, justifyContent: 'center', borderRadius: 40, padding:10}}>
          <TouchableOpacity onPress={()=>{
            setInitialPercent(pricePercent);
            console.log(select.customerId);
            maximums[au.currentUser.uid] = (pricePercent/100 * productPrice).toFixed(2);
            completeFunc(select.customerId);
            setChanged(false);
            
          }}><Text>Confirm</Text></TouchableOpacity>
        </View>:<View style={{opacity:0,padding: 10, marginLeft:30}} ><Text>Confirm</Text></View>}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 30, height: 30, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>{
            if (pricePercent>4) {
              setPricePercent(pricePercent-4);
              setOutsideState(((pricePercent-4)*productPrice).toFixed(2));
              setChanged(true);
            }
            
          }}>
            <Icon name="minus" color="white" size={27} />
          </TouchableOpacity>
        </View>
  
      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
              
              <View style={{flex: 100-remainingPercent,  height: 15, backgroundColor: constants.GREYORANGE, borderBottomLeftRadius: 40, borderTopLeftRadius: 40}}/>
            <View style={{flex:remainingPercent, marginRight: 0, paddingRight: 0}}>
            <MultiSlider
            values={[pricePercent]}
            // style={{flex: remainingPercent}}
            onValuesChangeStart={()=>{
              changeable = true;
            }}
            onValuesChangeFinish={()=>{
              changable  = false;
            }}
            onValuesChange={(stuff)=>{
              // setPriceShare((parseInt(stuff[0])/100 * productPrice).toFixed(2));
              // if (!changeable) return;
              if (stuff[0] >= 8 && stuff[0] <= 100) {
              setPricePercent(stuff[0]);
              }
              // console.log(stuff);
              setChanged(true);
            }}
    // style={{width: 200, height: 40}}
    // snapped={true}
    markerStyle={{width: 40, height: 40, shadowOpacity:0}}
    selectedStyle={{backgroundColor: constants.BLUERGREY}}
    trackStyle={{height: 15, borderRadius: 20, borderTopLeftRadius: remainingPercent<100?0:20, borderBottomLeftRadius: remainingPercent<100?0:20}}
    // containerStyle={{height: 20}}
    selectedStyle={{backgroundColor:constants.ORANGE}}
    markerContainerStyle={{alignSelf: 'center', marginTop: 7.5}}
    // markerStyle={{marginTop: 15,justifyContent: 'center', alignItems: 'center'}}
    smoothSnapped={true}
    sliderLength={280 * remainingPercent/100}
    step = {4}
    min={0}
    max={remainingPercent+4}
    markerSize={100}
    showSteps={true}
    containerStyle={{width: 30}}
    // markerSize={20}
  
  />
  
  </View>
  <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 30, height: 30, marginLeft: 10, justifyContent: 'center', alignItems: 'center', zIndex: -40}}>
          <TouchableOpacity onPress={()=>{
            if (pricePercent < remainingPercent && pricePercent < 100) {
              setPricePercent(pricePercent+4);
              setOutsideState(((pricePercent+4)*productPrice).toFixed(2))
              setChanged(true);
            }
            
          }}>
            <Icon name="plus" color="white" size={27} />
          </TouchableOpacity>
        </View>
  </View>
  </View>
  
  <View style={{alignItems: 'center',marginTop: -10, paddingTop: 10, justifyContent: 'center'}}>
  <Text style={{color:'black', marginBottom: 10, textAlign: 'center', alignSelf: 'center'}}>Increase to own more and use more.</Text>
  <View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, position: 'absolute', right: 25, borderWidth:1, borderColor: constants.LAVENDER}}>
    <TouchableOpacity style={{height:'100%', width: '100%', justifyContent:'center',alignItems:'center'}} onPress={()=>{
      setInfoModal(true);
    }}>
  <Icon name="info" size={10} color={constants.LAVENDER} />
  </TouchableOpacity>
  </View>
  </View>
      <View style={{flexDirection: 'row'}}>
        
      {/* <Text style={{color:'white', marginBottom: 10}}>Change your payment:</Text> */}
      {/* <ChangePayment data={priceShare} setState={setPriceShare}/> */}
      </View>
      {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Have it now if you  ${(route.params.data.product.price / route.params.data.members.length).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text> */}
      <AnimatedModal colored={true} colors={[constants.PEACH, constants.GREYORANGE]} nested={true} visible={infoModal} close={()=>{setInfoModal(false)}}>
          <HowTo />
      </AnimatedModal>
      </>;
  
    } else {
      return <><Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if you join for ${(route.params.data.product.price / (route.params.data.members.length+1)).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text>
      </>;
    }
  }

  export default PriceSlider;
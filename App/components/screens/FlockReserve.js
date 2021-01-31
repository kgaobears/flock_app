import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {firebase, db, auth} from 'App/firebase/config';
var seedrandom = require('seedrandom');
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import { rentPrice } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';


const FlockReserve = ({navigation, route}) => {
  const percent = '80%';
    
    const [othersMarkedDates, setOthersMarkedDates] = useState({});
    const [myMarkedDates, setMyMarkedDates] = useState({});

      useEffect(()=> {
        console.log(route.params.data.id, "DATA ID");
        db.collection("chatGroups").doc(route.params.data.id)
    .onSnapshot(function(doc) {
        console.log("Current dates: ", doc.data().markedDates);
        const dates = doc.data().markedDates;
        for (var el in dates) {
          if (dates[el].user !== auth.currentUser.uid){
            dates[el] = {...dates[el], color: 'red'}
          } else {
            dates[el] = {...dates[el], color: 'green'}
          }
          
        }
        setOthersMarkedDates(dates);
    });
      },[]);


    const [modalOpen, setModalOpen] = useState(false);
    console.log(route.params);
    const requestTypeIsRent = route.params.data.members.includes({name: auth.currentUser.displayName, uid: auth.currentUser.uid});
    const colors = (requestTypeIsRent)?[constants.PURPLE, constants.RED]:['#ff4d00', constants.PEACH];
    return <SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
      {/* <Text>{requestTypeIsRent?"Borrow":"Flock"}</Text> */}
        {/* <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/> */}
        <Icon name="chevron-left" size={24} color="grey" style={{position: 'absolute', zIndex: 200, top: 50, left: 20}} />
        <View style={{backgroundColor: 'white', borderBottomLeftRadius: 60, borderBottomRightRadius: 60}}>
        <View style={{width: '100%', height: percent, borderBottomRightRadius: 60, borderBottomLeftRadius: 60, overflow: 'hidden'}}>
        <Image blurRadius={50} style = {{position: 'absolute', width: '100%', height: '100%', zIndex: -20}} source = {{uri: route.params.data.product.image}} />
        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        
        </View>
         <View style={{paddingHorizontal: 20, paddingVertical:10, backgroundColor: 'white'}}>
        <Text>{route.params.data.product.title}</Text>
    <Text>${route.params.data.product.price}</Text>
    <Text>${rentPrice(route.params.data.product.price)}</Text>
        </View>
        </View>
        
        <View style={{position: 'absolute', bottom: 30,width: '100%', flexDirection: 'row', marginBottom: 0, justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, alignItems: 'center', }}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
{/* <Image source={constants.PLACEHOLDER_IMAGE } style={{width: 30, aspectRatio:1, marginRight: 10,}}/> */}

<View style={{justifyContent: 'center', alignItems: 'center', marginRight: 10,}}><Image source = {require('App/Assets/Images/heart.png')} style={{width: 35, height: 35,  shadowOpacity: 0.2, shadowOffset: {height:1 , width: 0}}} />
<Text style={{position: 'absolute', top: 10,fontSize: 16}}>34</Text>
</View>

<TouchableOpacity  onPress={()=>{
  navigation.navigate('ShareSocial', {product:route.params.data.product, data:{}, flockId: route.params.data.id})
}}>
<Image 
style={{shadowOpacity: 0.4, shadowOffset:{height:2, width:0},  width: 40, height: 40, aspectRatio:1}}
source={require('App/Assets/Images/Share_Icon_White_Earn.png') } />
</TouchableOpacity>

</View>
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: constants.ORANGE, borderRadius: 40, overflow: 'hidden'}} onPress={()=>{
          setModalOpen(true);
        }}>
          <LinearGradient style={{width: '100%', padding: 15, height: '100%', justifyContent: 'center'}} colors={[constants.ORANGE, constants.YELLOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} >
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 14, fontFamily: constants.FONT}}>Check Availability</Text>
        </LinearGradient>
        </TouchableOpacity>
        </View>
        <AnimatedModal colored={true} colors={colors} visible={modalOpen} close={()=>setModalOpen(false)} content={<ReserveCalendar navigation = {navigation} close={()=>{setModalOpen(false)}} route={route} myMarkedDates={myMarkedDates} setMyMarkedDates={setMyMarkedDates} othersMarkedDates={othersMarkedDates} />} />
        </SafeAreaView>;
}

const ReserveCalendar = ({navigation, route, close, myMarkedDates, othersMarkedDates, setMyMarkedDates}) => {
  const [picked, setPicked] = useState(false);
  const markPeriod = (start, duration=4, options) => {
    const marked = {};
  for (var i = 1; i < duration - 1; i++) {
      marked[moment(start.dateString).add(i, 'days').format('YYYY-MM-DD')] = options;
  }
    marked[start.dateString] = {
      startingDay: true,...options
    };
    console.log(start);
    marked[moment(start.dateString).add(duration-1, 'days').format('YYYY-MM-DD')] = {endingDay: true, ...options};
    setMyMarkedDates(marked);
} 

const requestTypeIsRent = route.params.data.members.includes({name: auth.currentUser.displayName, uid: auth.currentUser.uid});
const numDays = requestTypeIsRent?4:8;

const handleDayPress = (day) => {
  // if (markedDates[day.dateString]) {
  //     markPeriod(4, {});
  //     console.log(markedDates);
  //     return;
  // }
  if (reserved(othersMarkedDates, auth.currentUser.uid, numDays, day.dateString)) {
    return;
  }
  setPicked(true);
  markPeriod(start=day, duration=numDays, options={color: 'rgba(100,255,50,0.5)', user: auth.currentUser.uid});
  console.log(myMarkedDates);
  
}

  return <View style={{paddingBottom: 20, backgroundColor: 'white'}}>
            <Text style={{alignSelf: 'center'}}>You can {requestTypeIsRent?"borrow":"flock"} the item for {numDays} days</Text>
            <Text style={{alignSelf: 'center'}}>Choose a start date 2 days before you intend to use it.</Text>
            <Calendar
            style={{ width: '90%', alignSelf: 'center'}}
      markedDates={{...myMarkedDates, ...othersMarkedDates }}
      markingType={'period'}
      onDayPress={handleDayPress}
    />
    <Button style={{color: picked?'blue':'grey'}} title="rent" onPress={()=>{
      // db.collection("chatGroups").doc(route.params.data.id).update({[`markedDates.${auth.currentUser.uid}`]: markedDates});
      console.log('HELLOOOOOO');
      const dates = Object.keys(myMarkedDates);
      const start = dates[0];
      const end = dates[1];
      // db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
      navigation.navigate('Checkout', {doneFunc: (customerId)=> {
        db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
        const myDates = Object.entries({...othersMarkedDates, ...myMarkedDates});
        let postData = {
          ...route.params.data,
          customerId: customerId,
          chatId: route.params.data.id,
          userId: auth.currentUser.uid,
          dates: myDates[0] + "-" + myDates[myDates.length - 1],
        }
        fetch(constants.CHARGE_FLOCK_COMPLETE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(json));
        console.log('payment done!');
      }, extra: <Text>{start} to {end}</Text>}, );
      close();
    }} />
        {/* <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} /> */}
        </View>
}

const reserved = (markedDates, userId, duration, day) => {
  var truth = false;
  for (var i = 0; i < duration; i++) {
    const value = markedDates[moment(day).add(i, 'days').format('YYYY-MM-DD')];
    if (value === undefined || value === null) { // if unoccupied
      continue;
    }
    if (value.user !== userId) { // if occupied and not occupied by you
      return true;
    }
    if (value.user === userId) { // if occupied previously by you, can't change. if still figuring out, can change.
    // also, might want to have a reschedule or cancel option if click.
      return true;
    }
  }
}

export default FlockReserve;
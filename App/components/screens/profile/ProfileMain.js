import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
//import Input from 'App/components/common/Input';
import {firebase} from 'App/firebase/config';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
//import Base64 from 'base-64';

// global.atob = Base64.encode;

const userInfo = {
  username: 'Qrowsaki',
  bio: 'Hi I like pie. I also like pi. I am a user of flock, a flocker.',
  age: '20',
  gender: 'Male',
};

const Test1 = () => {
  return <Text>Test1</Text>;
};
const Test2 = () => {
  return <Text>Test2</Text>;
};
const ProfilePicture = () => {
  const user = firebase.auth().currentUser;

  const [avatar, setAvatar] = useState({
    //user.photoUrl,
    uri: '',
  });

  //ImagePicker.launchImageLibrary(options, getResponse);
  return (
    <View
      style={{
        backgroundColor: '#ddd',
        //alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
      }}>
      <Image
        style={{width: 120, height: 120, borderRadius: 60}}
        source={avatar}
      />
    </View>
  );
};
const ProfileMain = ({navigation}) => {
  //const user = firebase.auth().currentUser;

  useEffect(() => {}, []);
  const Tab = createMaterialTopTabNavigator();
  return (
    <View style={{flex: 1}}>
      <View style={{position: 'absolute', right: 10, top: 50, zIndex: 400}}>
        <Button
          title="back"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title="changeProfile"
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
        <Button
          title="logout"
          onPress={() => {
            console.log('logout');
          }}
        />
      </View>
      <ImageBackground
        source={require('App/Assets/Images/Orange_Gradient_Small.png')}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
            alignItems: 'flex-start',
            paddingLeft: 40,
          }}>
          <Text
            style={{
              paddingLeft: 25,
              fontSize: 24,
              textAlign: 'center',

              fontFamily: 'Nunito-Light',
              color: 'white',
            }}>
            Profile
          </Text>
          <View style={{flexDirection: 'row'}}>
            <ProfilePicture />
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.username}
                </Text>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.age}
                </Text>
                <Text style={{color: 'white', fontFamily: 'Nunito'}}>
                  {userInfo.gender}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: 'white',
                  fontFamily: 'Nunito',
                }}>
                {userInfo.bio}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{flex: 2}}>
        <Tab.Navigator>
          <Tab.Screen name="Test1" component={Test1} />
          <Tab.Screen name="Test2" component={Test2} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
});

export default ProfileMain;
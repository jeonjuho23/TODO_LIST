import { useState, useEffect} from 'react';
import { View, Text } from 'react-native';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
const Stack = createStackNavigator();

// page, component
import Today from './pages/Today';


export default function App() {

  // 오늘의 날짜 저장
  const getToday = () => {
    const now = new Date();
    let todayYear = now.getFullYear(); // 2023
    let todayMonth = now.getMonth() + 1; // 6
    let todayDate = now.getDate(); // 4

    const today = todayYear * 10000 + todayMonth * 100 + todayDate;
    console.log('today is ' + today); // 20230604
    return today;
  };

  return (
    <View>
      <Today day={getToday()}/>
    </View>
  );
}


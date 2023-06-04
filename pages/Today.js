import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { db } from '../firebaseConfig';

import BouncyCheckbox from 'react-native-bouncy-checkbox';

const Today = (props) => {
  const [addTodo, setAddTodo] = useState(null);
  const [day, setDay] = useState(props.day);
  const [check, setCheck] = useState([]);
  const [uncheck, setUncheck] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const onChangeAddTodo = (event) => {
    setAddTodo(event);
  };
  const onAddTodo = () => {
    console.log(addTodo);
    writeDBofDay();
    setAddTodo(null);
    readDBofDay();
  };

  const checkItemHandler = (value, isChecked) => {
    console.log('checkedList : ',checkedList);
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
      return;
    }
    if (!isChecked && checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value));
      return;
    }
    return;
  };


  const onChangeNextDay = () => {
    setDay(day + 1);
  };
  const onChangeLastDay = () => {
    setDay(day - 1);
  };

  const onCheck = (task, idx) => {
    console.log(task);
    // task 삭제 후 check에 추가
    // uncheck 배열 중 task값 삭제
    let tempUncheck = [...uncheck];
    tempUncheck.splice(idx, 1);
    // check 배열에 task 값 추가
    let tempCheck = [...check, task];
    // db에 업데이트
    writeDBofDay(tempCheck, tempUncheck);
    readDBofDay();
  };
  const onUncheck = (task, idx) => {
    console.log(task);
    // check 배열 중 task값 삭제
    let tempCheck = [...check];
    tempCheck.splice(idx, 1);
    // Uncheck 배열에 task 값 추가
    let tempUncheck = [...uncheck, task];
    // db에 업데이트
    writeDBofDay(tempCheck, tempUncheck);
    readDBofDay();
  };

  useEffect(() => {
    readDBofDay();
  }, [readDBofDay, day]);

  // firestore write  -> 데이터 추가
  const writeDBofDay = async (ch, unch) => {
    if (!ch || !unch) {
      ch = [...check];
      unch = [...uncheck];
    }
    console.log('check: ', ch.toString());
    console.log('uncheck: ', unch.toString());
    try {
      let tempUncheck = [...unch];
      if (addTodo) {
        tempUncheck.push(addTodo);
      }
      console.log(ch);
      console.log(tempUncheck);
      db.collection('todolist').doc(day.toString()).update({
        check: ch,
        uncheck: tempUncheck,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // firestore read  -> day 에 맞는 데이터 읽어오기
  const readDBofDay = useCallback(async () => {
    try {
      const data = db.collection('todolist');
      let tempCheck = [];
      let tempUncheck = [];
      await data.get().then((snap) => {
        snap.forEach((doc) => {
          console.log(doc.toString());
          const ddd = day.toString();
          if (doc.id === ddd) {
            docData = doc.data();
            tempCheck.push(...docData.check);
            tempUncheck.push(...docData.uncheck);
          }
        });
      });
      setCheck(tempCheck);
      setUncheck(tempUncheck);
      setCheckedList(tempCheck);
    } catch (err) {
      console.error(err);
    }
  }, [day]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button style={styles.button} title="<" onPress={onChangeLastDay} />
        <Text style={styles.text}>{day}</Text>
        <Button style={styles.button} title=">" onPress={onChangeNextDay} />
      </View>
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <Text>uncheck</Text>
          {uncheck.map((item, idx) => (
            <BouncyCheckbox
              isChecked={checkedList.includes(item)}
              size={25}
              fillColor="red"
              unfillColor="#FFFFFF"
              text={item}
              iconStyle={{ borderColor: 'red' }}
              textStyle={{ fontFamily: 'JosefinSans-Regular' }}
              onPress={() => {
                onCheck(item, idx);
                checkItemHandler(item, true);
              }}
            />
          ))}
          <Text>check</Text>
          {check.map((item, idx) => (
            <BouncyCheckbox
              isChecked={checkedList.includes(item)}
              size={25}
              fillColor="red"
              unfillColor="#FFFFFF"
              text={item}
              iconStyle={{ borderColor: 'red' }}
              textStyle={{ fontFamily: 'JosefinSans-Regular' }}
              onPress={() => {
                onUncheck(item, idx);
                checkItemHandler(item, false);
              }}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <TextInput
          value={addTodo}
          onChangeText={onChangeAddTodo}
          multiline={true}
          editable={true}
        />
        <Button title="Add" onPress={onAddTodo} />
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');
const headerHeight = height * 0.1;
const contentHeight = height * 0.8;
const footerHeight = height * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: headerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  contentContainer: {
    height: contentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: footerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 24,
  },
  button: {},
});

export default Today;

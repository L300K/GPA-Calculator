import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard
} from 'react-native';
import Modal from "react-native-modal";
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../utils/common';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const CLASS_TABLE = 'classTable';

const Home = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [visibleModalAddClass, setVisibleModalAddClass] = useState(false);
  const [classVal, setClassVal] = useState();
  const [gradeVal, setGradeVal] = useState();
  const [creditVal, setCreditVal] = useState();
  const [data, setData] = useState([]);
  const [gpax, setGpax] = useState(null);
  const [visibleModalGpax, setVisibleModalGpax] = useState(false);

  const getData = async () => {
    const d = await AsyncStorage.getItem(CLASS_TABLE);
    if (d) {
      setData(JSON.parse(d));
    }
  };

  useEffect(async () => {
    await AsyncStorage.removeItem(CLASS_TABLE);
    getData();
  }, []);

  const toggleModalAddClass = () => {
    setVisibleModalAddClass(prev => {
      if (prev) {
        Keyboard.dismiss();
      }
      return !prev;
    });
  };

  const toggleModalGpax = () => {
    setVisibleModalGpax(prev => {
      return !prev;
    });
  };

  const onCreateClass = async () => {
    toggleModalAddClass();
    await pushClassToStack({
      name: classVal,
      grade: gradeVal,
      credit: creditVal
    });
    await getData();
    setClassVal(null);
    setCreditVal(null);
    setGradeVal(null);
  };

  const onCalculate = async () => {
    const result = data.reduce((prev, current) => {
      const nC = Number(current.grade) * Number(current.credit);
      return prev + nC;
    }, 0);
    const allCredit = data.reduce((prev, current) => {
      return prev + Number(current.credit);
    }, 0);
    setGpax((result / allCredit).toFixed(2));
    toggleModalGpax();
  };

  const pushClassToStack = async ({ name, grade, credit }) => {
    const newStack = data;
    newStack.push({ name, grade, credit });
    await AsyncStorage.setItem(CLASS_TABLE, JSON.stringify(newStack));
  };

  const renderItem = ({ index, item }) => {
    return (
      <View style={[styles.headerTable, { paddingBottom: scale(8), paddingTop: index === 0 ? scale(8) : 0 }]}>
        <View
          style={{
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Text>{item.name}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text>{item.grade}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text>{item.credit}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Image
        source={require('./../assets/images/splash_bg.png')}
        style={{
          position: 'absolute',
          width: WIDTH,
          height: HEIGHT
        }}
      />
      <View style={{ flex: 1, paddingTop: headerHeight, paddingBottom: insets.bottom }}>
        <View style={styles.mainCard}>
          <View style={styles.headerTable}>
            <View
              style={{
                flex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>Class</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>Grade</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>Credits</Text>
            </View>
          </View>
          <FlatList
            style={{
              flex: 1
            }}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.name}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleModalAddClass}
            >
              <Text style={{ fontSize: scaleFont(14), fontWeight: '500' }}>เพิ่มวิชา</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              style={styles.buttonCir}
              onPress={onCalculate}
            >
              <Text style={{ fontSize: scaleFont(14), fontWeight: '500', color: 'white' }}>คำนวณเกรด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        isVisible={visibleModalGpax}
        onBackdropPress={toggleModalGpax}
        style={{
          margin: 0,
          alignItems: 'center'
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: scale(15),
            borderRadius: scale(8),
            width: WIDTH - scale(30)
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: scaleFont(20),
                fontWeight: "500"
              }}
            >
              {gpax}
            </Text>
          </View>
          <View
            style={{
              marginTop: scale(15),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              onPress={toggleModalGpax}
              style={styles.buttonCir}
            >
              <Text style={{ fontSize: scaleFont(14), fontWeight: '500', color: 'white' }}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={visibleModalAddClass}
        onBackdropPress={toggleModalAddClass}
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: insets.bottom,
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            paddingHorizontal: scale(15)
          }}
        >
          <View style={{ alignItems: 'flex-end', paddingTop: scale(10) }}>
            <TouchableOpacity
              onPress={toggleModalAddClass}
              style={{
                padding: scale(4)
              }}
            >
              <Image
                source={require('./../assets/images/cross.png')}
                style={{
                  width: scale(16),
                  height: scale(16)
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <CustomTextInput
              value={classVal}
              onChange={({ nativeEvent: { text } }) => setClassVal(text)}
              placeholder='ชื่อวิชา'
              label='ชื่อวิชา'
            />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: scale(10)
            }}
          >
            <View
              style={{ flex: 1, paddingRight: scale(5) }}
            >
              <CustomTextInput
                value={gradeVal}
                onChange={({ nativeEvent: { text } }) => setGradeVal(text)}
                placeholder='เกรด'
                label='เกรด'
                keyboardType={'numeric'}
              />
            </View>
            <View
              style={{ flex: 1, paddingLeft: scale(5) }}
            >
              <CustomTextInput
                value={creditVal}
                onChange={({ nativeEvent: { text } }) => setCreditVal(text)}
                placeholder='หน่วยกิต'
                label='หน่วยกิต'
                keyboardType={'numeric'}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center', paddingTop: scale(10) }}>
            <TouchableOpacity
              onPress={onCreateClass}
              style={styles.buttonCir}
            >
              <Text
                style={{ fontSize: scaleFont(14), fontWeight: '500', color: 'white' }}
              >
                เพิ่มวิชานี้
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const CustomTextInput = ({
  value,
  onChange,
  placeholder,
  label,
  keyboardType
}) => {
  return (
    <>
      <Text
        style={{
          marginBottom: scale(4),
          fontSize: scaleFont(13)
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        clearButtonMode="while-editing"
        keyboardType={keyboardType || "default"}
        style={styles.input}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    marginHorizontal: scale(15),
    paddingHorizontal: scale(15),
    paddingVertical: scale(30),
    borderRadius: scale(30),
    backgroundColor: 'white',
    flex: 1
  },
  headerTable: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerTableText: {
    fontSize: scaleFont(16),
    fontWeight: "500"
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(20)
  },
  button: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: scale(40),
    paddingHorizontal: scale(30),
    paddingVertical: scale(10)
  },
  buttonContainer2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(15)
  },
  buttonCir: {
    borderRadius: scale(22),
    height: scale(44),
    width: '100%',
    backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  input: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: scale(6)
  }
});

export default Home;
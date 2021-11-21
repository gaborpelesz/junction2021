import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, FlatList } from 'react-native'
import { Button, Overlay } from 'react-native-elements';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


export default function BigButton(props) {
    const [sensColor, setValue] = React.useState("#cf5a6b");
    const [sensor, setSensor] = React.useState(props.currentSensor);

    const [visible, setVisible] = React.useState(false);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (props.currentSensor && v === "#cf5a6b" ? "green" : "#cf5a6b"));
    }, 1000);
  }, []);

  React.useEffect(() => {
      setSensor((v) => (props.currentSensor ?  "Sensor " + props.currentSensor : "No sensor"));
  }, []);
        return (
            <View style={styles.container}>
                <View>
                <Button title="Info" type="solid" titleStyle={{fontSize: 16}} buttonStyle={[styles.buttonRect, {backgroundColor: "green"}]} onPress={toggleOverlay}/>
                <Button title="Reset" type="solid" titleStyle={{fontSize: 16}} buttonStyle={styles.buttonRect} onPress={() => {}}/>
                </View>
                <Button title="SAVE" type="solid" titleStyle={{fontSize: 40, fontWeight: "bold"}} buttonStyle={[styles.bigButton, {backgroundColor: sensColor}]} onPress={() => props.onPressButton()}/>
                <View>
                <Button title={sensor} type="solid" titleStyle={{fontSize: 16}} buttonStyle={[styles.buttonRect, {backgroundColor: props.currentSensor ? "green" : "#cf5a6b"}]} onPress={() => {}}/>
                <Button title="Callibrate" type="solid" titleStyle={{fontSize: 16}} buttonStyle={styles.buttonRect} onPress={() => {}}/>
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlayS}>
        <Text style={styles.overlayText}>Hello from Overlay!</Text>
                </Overlay>
                </View>
                
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
      width: width,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      flexWrap: "nowrap"
    },
    bigButton : {
        backgroundColor: "#cf5a6b",
        width: 150,
        height: 150,
        borderRadius: 150
    },
    buttonRect: {
        width: 0.30 * width,
        height: 60,
        backgroundColor: "#cf5a6b",
        borderRadius: 20,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: "space-around",
        flexDirection: 'row',
    },
    buttonRectBig: {
        width: 0.5 * width,
        height: 60,
        backgroundColor: "#cf5a6b",
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: "space-around",
        flexDirection: 'row',
    },
    overlayS: {
        width: 0.8 * width, 
        minHeight: 0.5 * height,
        textAlign: 'center',
    }
  });

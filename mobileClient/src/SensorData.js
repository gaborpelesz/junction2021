import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { Text } from 'react-native-elements';
import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes,
    orientation,
    gravity
  } from "react-native-sensors";
  import io from "socket.io-client";
  import { Button } from 'react-native-elements';

  const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const on = require('./assets/on.png')
    const off = require('./assets/off.png')
export default class SensorData extends Component {

    constructor(props) {
        super(props);
        this.state = {
        accelerometer: {},
        gyroscope: {},
        gravity: {},
        orientation: {}
        };
     }

    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.orientation, 200); // defaults to 100ms
        setUpdateIntervalForType(SensorTypes.accelerometer, 200); 
        setUpdateIntervalForType(SensorTypes.gravity, 200); 

        const subscription = orientation.subscribe((values) => {
            this.setState({orientation: values})
        });

        const subscription1 = accelerometer.subscribe((values) => {
            this.setState({accelerometer: values})
        });

        const subscription2 = gravity.subscribe((values) => {
            this.setState({gravity: values})
        }); 
    }
    // componentWillUnmount() {
    //     subscription.unsubscribe();
    //     subscription1.unsubscribe();
    //     subscription2.unsubscribe();
    // }

    componentDidUpdate() {
        this.sendSensorData()
    }

    sendSensorData() {
        this.props.onSensorUpdate('sensor_data', {
            "pitch": this.state.orientation?.pitch, 
            "yaw": this.state.orientation?.yaw, 
            "roll": this.state.orientation?.roll, 
            "accX": parseFloat((this.state.accelerometer.x - (0.8 * this.state.gravity.x + (1 - 0.8) * this.state.accelerometer.x))), 
            "accY": parseFloat((this.state.accelerometer.y - (0.8 * this.state.gravity.y + (1 - 0.8) * this.state.accelerometer.y))), 
            "accZ": parseFloat((this.state.accelerometer.z - (0.8 * this.state.gravity.z + (1 - 0.8) * this.state.accelerometer.z)))
        });
    }

    

    render() {
      
        const accX = (this.state.accelerometer.x - (0.8 * this.state.gravity.x + (1 - 0.8) * this.state.accelerometer.x)).toFixed(3)
        const accY = (this.state.accelerometer.y - (0.8 * this.state.gravity.y + (1 - 0.8) * this.state.accelerometer.y)).toFixed(3)
        const accZ = (this.state.accelerometer.z - (0.8 * this.state.gravity.z + (1 - 0.8) * this.state.accelerometer.z)).toFixed(3)
        
        const pitch = Object.keys(this.state.orientation).length !== 0 ? (this.state.orientation.pitch).toFixed(3) : 0
        const yaw = Object.keys(this.state.orientation).length !== 0 ? (this.state.orientation.yaw).toFixed(3) : 0
        const roll = Object.keys(this.state.orientation).length !== 0 ? (this.state.orientation.roll).toFixed(3) : 0
        return (
            <View style={styles.container}>
                <ImageBackground source={require('./assets/map.jpg')} resizeMode="cover" style={styles.image}>
                <Text h1 h1Style={{padding: 16, color: "#cf5a6b", backgroundColor: "#ffffffc4", }}>Helvar Mapper</Text>
                {/* <Text h4 style={styles.instHeader}>Orientation  </Text>
                <Text style={styles.instructions}>{pitch} | {yaw} | {roll} </Text>
                <Text style={styles.instructions}>ROLL </Text>
                <Text h4 style={styles.instHeader}>Accelerometer </Text>
                <Text style={styles.instructions}>{accX} | {accY} | {accZ}</Text> */}
                <View style={{flexDirection: "row", justifyContent: "center", flexWrap: 'wrap'}}>
                <Button title="Orientation" type="solid" titleStyle={{fontSize: 16}} buttonStyle={styles.buttonRectBig} onPress={() => {}}/>
                <Button title="Accelerometer" type="solid" titleStyle={{fontSize: 16}} buttonStyle={styles.buttonRectBig} onPress={() => {}}/>
                <Button title={pitch  + " | "  + yaw  + " | "  + roll} type="solid" titleStyle={{fontSize: 14}} buttonStyle={styles.buttonRectBig} onPress={() => {}}/>
                <Button title={accX  + " | "  + accY  + " | "  + accZ} type="solid" titleStyle={{fontSize: 14}} buttonStyle={styles.buttonRectBig} onPress={() => {}}/>
                </View>
                </ImageBackground>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    instructions: {
      color: '#333333',
      marginBottom: 5,
      marginHorizontal: 16
    },
    instHeader: {
      color: '#cf5a6b',
      marginBottom: 5,
      marginHorizontal: 16
    },
    container: {
        height: height,
        width: width,
        flex: 20,
        backgroundColor: '#f8f8f8',
        justifyContent: "space-between"
      },
      image: {
        flex: 1,
      },
    bigButton : {
        backgroundColor: "#cf5a6b",
        width: 150,
        height: 150,
        borderRadius: 150
    },
    buttonRectBig: {
        width: 0.5 * width,
        height: 40,
        backgroundColor: "#cf5a6b",
        alignItems: 'center',
        justifyContent: "space-around",
        flexDirection: 'row',
    },
  });

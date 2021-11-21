import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Button, ImageBackground, Dimensions} from 'react-native';

import SensorData from './src/SensorData';
import io from "socket.io-client";
import BigButton from './src/BigButton';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

 class App extends Component {
   constructor(props) {
     super(props);
     this.child = React.createRef();
     this.state = {sensorId: null, pressed: false};
   }

   buttonPressed() {
      this.setState({pressed: true})
   }

   sensorUpdate(action, data) {
     if (this.state.pressed) {
      console.log({sensor_id: this.state.sensorId, ...data});
      this.socket.emit('pairing_complete', {sensor_id: this.state.sensorId, ...data});
      this.setState({pressed: false})
     } else {
      this.socket.emit(action, data);
     }
             
   }


   componentDidMount() {
    this.socket = io("http://10.100.31.190:5000", {
        query: {
          "client": "mobile"
        }
      });
     this.socket.on("pairing_start", msg => {
        console.log("START");
          console.log(msg);
           this.setState({ sensorId: msg.sensorId });
   });
 }
 
   render() {
     return (
       <View style={styles.container}>
           <SensorData 
           onSensorUpdate={(action, data) => this.sensorUpdate(action, data)}
           />
           <BigButton onPressButton={() => this.buttonPressed()} currentSensor={this.state.sensorId} />
       </View>
     );
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
   },
   image: {
     position: "absolute",
     height: height
   }
 });
 
 export default App;
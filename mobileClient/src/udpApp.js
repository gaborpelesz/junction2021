// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */

//  import React, {Component} from 'react';
//  import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';

 
//  import dgram from 'react-native-udp';
// import SensorData from './src/sensors';
// import io from "socket.io-client";

//  // only works for 8-bit chars
//  function toByteArray(obj) {
//    var uint = new Uint8Array(obj.length);
//    for (var i = 0, l = obj.length; i < l; i++) {
//      uint[i] = obj.charCodeAt(i);
//    }
 
//    return new Uint8Array(uint);
//  }
 
//  class App extends Component {
//    constructor(props) {
//      super(props);
 
//      this.updateChatter = this.updateChatter.bind(this);
//      this.state = {chatter: []};
//    }
 
//    updateChatter(msg) {
//      this.setState({
//        chatter: this.state.chatter.concat([msg]),
//      });
//    }

//    sendData = () => {
//     let self = this;
 
//      let a = dgram.createSocket('udp4');
//      let aPort = 3456
//      a.bind(aPort, function(err) {
//        if (err) throw err;
//       //  self.updateChatter('a bound to ' + JSON.stringify(a.address()));
//      });
 
//      let b = dgram.createSocket('udp4');
//      var bPort = 5556
//      b.bind(bPort, function(err) {
//        if (err) throw err;
//       //  self.updateChatter('b bound to ' + JSON.stringify(b.address()));
//      });

//      var msg = toByteArray('HelloMes');
//        a.send(msg, 0, msg.length, 5555, '10.100.31.190', function(err) {
//          if (err) throw err;
//          self.updateChatter('a sent data');
//        });


//        b.on('message', function(data, rinfo) {
//         var str = String.fromCharCode.apply(null, new Uint8Array(data));
//         self.updateChatter('b received ' + str + ' ' + JSON.stringify(rinfo));
//       });
//    }
 
//    componentDidMount() {
//     this.socket = io("http://10.100.31.190:5000", {
//         query: {
//           "client": "mobile"
//         }
//       });
//      this.socket.on("pairing_start", msg => {
//          console.log(msg);
//            this.setState({ sensorId: msg.sensorId
//       });
//    });
//  }
 
//    render() {
//      return (
//        <View style={styles.container}>
//          <ScrollView>
//            {this.state.chatter.map((msg, index) => {
//              return (
//                <Text key={index} style={styles.welcome}>
//                  {msg}
//                </Text>
//              );
//            })}
//            <Button title="Press" onPress={() => this.sendData()} />
//            <SensorData socket={this.socket}/>
//          </ScrollView>
//        </View>
//      );
//    }
//  }
 
//  const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//      justifyContent: 'center',
//      alignItems: 'center',
//      backgroundColor: '#F5FCFF',
//    },
//    welcome: {
//      fontSize: 20,
//      textAlign: 'center',
//      margin: 10,
//    },
//    instructions: {
//      textAlign: 'center',
//      color: '#333333',
//      marginBottom: 5,
//    },
//  });
 
//  export default App;
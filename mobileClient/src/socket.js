import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import io from "socket.io-client";

export default class Socket extends Component {
    constructor(props) {
        super(props);
        this.state = {
           chatMessage: "",
           chatMessages: []
        };
     }

    //  componentDidMount() {
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

    //  submitChatMessage() {
    //     this.socket.emit('pairing_complete', {sensor: 15});
    //     this.setState({sensor: 15});
    //   }

    render() {
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text style={{borderWidth: 2, top: 500}}>{chatMessage.title}</Text>
    ));

    return (
      <View style={styles.container}>
        {chatMessages}
        <TextInput
          style={{height: 40, borderWidth: 2, top: -40}}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({chatMessage});
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
    marginTop: 50,
      height: 200,
      width: 400,
      flex: 1,
      backgroundColor: 'gray',
    },
  });

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "aalto open";
const char* password = "";

//Your Domain name with URL path or IP address with path
String serverName = "http://10.100.31.190:5000/sensor_trigger";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;

// Set webserver port to 80
WiFiServer server(80);

String header;

// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0; 
// Define timeout time in milliseconds (example: 2000ms = 2s)
const long timeoutTime = 2000;


#define LEDPIN 26
#define TRIGPIN 27

// Function headers
void sendMacAddress(void);
void blinkingSensor(void);


// Blinking without delay variables
int ledState = LOW;
unsigned long previousMillis = 0;
const long interval = 1000;

// Motion Sensor setup
uint8_t pirState = LOW;
int value = 0;
int motion_i = 0;
int blinkSensor = 0;

void setup() {
  // LED and sensor pin setup
  pinMode(LEDPIN, OUTPUT);
  pinMode(TRIGPIN, INPUT);

  Serial.begin(9600);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  server.begin();

  delay(5000);
 
}

void loop() {

  // Listen for incomming calls
  WiFiClient client = server.available();

  if (client) {                             // If a new client connects,
    currentTime = millis();
    previousTime = currentTime;
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected() && currentTime - previousTime <= timeoutTime) {  // loop while the client's connected
      currentTime = millis();
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // turns on and off the blinking
            if (header.indexOf("GET /blinkSensor/on") >= 0) {
              Serial.println("LED on");
              //Serial.println(header);
              blinkSensor = 1;
            } else if (header.indexOf("GET /blinkSensor/off") >= 0) {
              Serial.println("LED off");
              //Serial.println(header.indexOf("GET /blinkSensor/off"));
              //Serial.println(header);
              blinkSensor = 0;
            }
            
            
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }

  // Pooling the sensor
  value = digitalRead(TRIGPIN);  // read input value
    if (value == HIGH) {            // check if the input is HIGH
      if (pirState == LOW) {
        motion_i += 1;
        // we have just turned on
        Serial.print("Motion ");
        Serial.print(motion_i);
        Serial.println(" Detected");
        // We only want to print on the output change, not state
        pirState = HIGH;

        // Send post request
        sendMacAddress();
      }
    } else {
      if (pirState == HIGH){
        // we have just turned of
        Serial.println("Motion ended!");
        // We only want to print on the output change, not state
        pirState = LOW;
      }
    }

  // Turn on or off the LED
  if(pirState == HIGH && blinkSensor == 0){
    digitalWrite(LEDPIN, HIGH);
  }
  else {
    digitalWrite(LEDPIN, LOW);
  }

  
  blinkingSensor();

  

}


void sendMacAddress(void){
  //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);
      
      // If you need an HTTP request with a content type: application/json, use the following:
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST({"{\"device_id\":\"7C:9E:BD:06:69:0C\"}"});

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}


void blinkingSensor(){

  if (blinkSensor == 1){
    digitalWrite(LEDPIN, HIGH);
    delay(500);
    digitalWrite(LEDPIN, LOW);
    delay(500);
    
    }
  else if (blinkSensor == 0){
    digitalWrite(LEDPIN, LOW);
    }

}
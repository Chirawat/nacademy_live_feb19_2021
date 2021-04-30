var lblStatus = document.getElementById("lblStatus");
var led = document.getElementById("led");

// Set timer = 5 sec.
function ticker(){
    console.log("timeout!");
    lblStatus.innerText = "Disconnedted!";
    lblStatus.classList.remove('bg-success');
    lblStatus.classList.add('bg-danger');
}
var timer = setInterval(ticker, 5000);

function btnOnClicked(){
    console.log("ON");
    client.publish('nacademy/led', 'ON', { qos: 0, retain: false })
}

function btnOffClicked(){
    console.log("OFF");
    client.publish('nacademy/led', 'OFF', { qos: 0, retain: false })
}
///////////////////////////////////////////

// MQTT Connect
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const host = 'ws://broker.emqx.io:8083/mqtt'
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
    },
}

console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
    console.log('Connection error: ', err)
    client.end()
})

client.on('reconnect', () => {
    console.log('Reconnecting...')
})

client.on('connect', () => {
    console.log('Client connected:' + clientId)
    
    // Subscribe
    client.subscribe('nacademy/led', { qos: 0 })
    client.subscribe('nacademy/status', { qos: 0 })
})

// Received
client.on('message', (topic, message, packet) => {
    console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)  
    if(topic == "nacademy/status")
    {
        // Clear timer 
        clearInterval(timer);
        timer = setInterval(ticker, 5000);


        lblStatus.innerText = "online";
        lblStatus.classList.remove('bg-danger');
        lblStatus.classList.add('bg-success');

        var message_t = message.toString();
        var ledStatus = message_t.substring(message_t.indexOf("led") + 4);
        if(ledStatus == "False"){
            led.innerText="OFF";
            led.classList.remove('bg-primary');
            led.classList.add('bg-secondary');
        }
        else{
            led.innerText = "ON";
            led.classList.remove('bg-secondary');
            led.classList.add('bg-primary');
        }
        
    }
})
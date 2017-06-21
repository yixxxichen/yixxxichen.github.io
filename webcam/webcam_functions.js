// Variables
var ws = undefined; // websocket instance
var logs = [];
var logsLimit = 4;
var camera_button= document.getElementById('mybutton');
// Initialize the WebSocket
function initWebSocket() {
    var ipName = "10.106.2.188";
    if (ws) {
        ws.close(); // close the websocket if open.
        ws = undefined;
    }
    ws = new WebSocket('ws://' + ipName + '/stream');

    ws.onopen = function () { // when handshake is complete:
        log('WebSocket open to ZentriOS device ' + ipName);
        //*** Change the text of the button to read "Stop Webcam" ***//
            camera_button.value = "Stop Webcam";

         //*** Change the title attribute of the button to display "Click to stop webcam" ***//
         
            camera_button.title="Click to Stop Webcam";
        
         //*** Enable the button" ***//
          camera_button.disabled=false;
    };

    ws.onclose = function () { // when socket is closed:
        log('WebSocket connection to ' + ipName + ' has been closed!');
         //*** Change the text of the button to read "Start Webcam" ***//
         
        
            camera_button.value="Start Webcam";
        
        
        //*** Change the title attribute of the button to display "Click to start webcam" ***//
       
            camera_button.title="Click to Start Webcam";
       
        //*** Enable the button" ***//
          camera_button.disabled= false;
        
    };

    ws.onmessage = function (event) { // when client receives a WebSocket message:
        //*** Display a new timestamp ***//
        var t =document.getElementById('timeStamp');
        t.value = GetTimeFormatted();


        //*** Set the source of the image to the image on the WiFi chip ***//
        var img= document.getElementById('picture');
        img.src=   './img.jpg';
    };
	
	ws.onerror = function () { // when an error occurs
		ws.close();
		log('Websocket error');
        //*** Change the text of the button to read "Start Webcam" ***//
		camera_button.value= "Start Webcam";


        //*** Change the title attribute of the button to display "Click to start webcam" ***//
		camera_button.tile="Click to Start Webcam";
        //*** Enable the button" ***//
		camera_button.disabled= false;
	}
}

// Set up event listeners
//*** When the button is clicked, disable it, and depending on whether a Websocket is open or not, either run "initWebSocket()" or "ws.close()" ***//
function eventlistener(){
    
    camera_button.disabled = true;
    if(camera_button.value=="Start Webcam"){
      initWebSocket();
    }
    else{
        ws.close();
    }

}


// Other functions
function log(txt) {
    logs.push({
        'content': txt,
        'type': 'log'
    });
    showLog(logs, 'log', logsLimit);
}

function showLog(logArray, logId, logLimit) {
    var logContent = '';
    var logLength = logArray.length;
    var iStart = logLength - logLimit - 1;
    if (iStart < 0) {
        iStart = 0;
    }
    for (var index = iStart; index < logLength; ++index) {
        logItem = logArray[index];
        logContent += '<span class="' + logItem.type + '">' + logItem.content + '</span><br/>\n'
    }
    document.getElementById(logId).innerHTML = logContent;
}




// Define initialization function
function init() {
    initWebSocket();
}

// Open Websocket as soon as page loads
window.addEventListener("load", init, false);


/*Function: get time stamp*/
function GetTimeFormatted() {
       var now = new Date();
       return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
                     + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                     .getSeconds()) : (now.getSeconds())));
}


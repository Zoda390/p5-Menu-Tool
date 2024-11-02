var express = require('express');
var fs = require('fs');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("The server is running on port: "+3000);

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log(socket.id + " joined");

    socket.on('getFile', (data)=>{
        console.log("got file data");
        fs.writeFile('public/assets/uiImg'+data.id+'.png', data.src, 'base64', (err)=>{
            if (err) throw err;
            console.log('sent file reply');
            socket.emit("fileReply", {id: data.id});
        });
    });
}
//import { Server as SocketServer } from "socket.io";
'use strict'
const SocketServer = require('socket.io');
const Sockets = require('./sockets');
const express = require('express');
const config = require('./config');
const http = require('http');

const app = config(express());
const server = http.createServer(app);

const io = new SocketServer.Server(server);

// Conectar a la base de datos de MongoDB
require('./database');

// Init server
server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})

Sockets(io);
# Network specification for Potato Jam
* Using P2P connections with [peerjs](https://peerjs.com/)
* A peer creates a server and clients connect to it (one to many)
# Overview
* Server = peer that started the room and can accept multiple clients
* Client = peer that connects to server

* Server opens connection for clients to connect
* A client connects:
    * Server checks the client's connection and sends CONNECTION_ACCEPTED if the connection was acccepted
    * Server broadcasts NEW_CONNECTION to all clients to signal that a new client joined the room
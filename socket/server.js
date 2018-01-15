var ws = require("nodejs-websocket")
var PORT = 3000;

var clientCount = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    clientCount++
    conn.nickName = 'user' + clientCount
    var mes = {}
    mes.type = 'enter'
    mes.data = conn.nickName + 'comes in'
    broadcast(JSON.stringify(mes))
    broadcast(conn.nickName + 'come in!')
    conn.on("text", function (str) {
        console.log("Received " + str)
        var mes = {}
        mes.type = 'message'
        mes.data = conn.nickName + ' says: ' + str
        broadcast(JSON.stringify(mes))
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        var mes = {}
        mes.type = 'leave'
        mes.data = conn.nickName + 'left'
        broadcast(JSON.stringify(mes))
    })
    conn.on("error", function (err) {
        console.log("handler error")
        console.log(err)
    })
}).listen(PORT)

console.log("websocket server listening " + PORT)

function broadcast(str) {
    server.connections.forEach(function (connection) {
        connection.sendText(str);
    })
}
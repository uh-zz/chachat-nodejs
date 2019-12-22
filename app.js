const port = 8080;

var fs = require('fs');
var path = require('path');
var mime = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript"
};


var server = require('http').createServer(function(req, res) {
 
    if (req.url == '/') {
        filepath = '/index.html'
    } else {
        filepath = req.url
    }
    var fullpath = __dirname + filepath;

    res.writeHead(200, {"Content-type":mime[path.extname(fullpath)] || "text/plain"});
    
    fs.readFile(fullpath, function(err, data) {
        if (err) {
            console.log("file read error");
        } else {
            res.end(data, "utf-8");
        }
    });

}).listen(port);

var io = require('socket.io').listen(server);

// websocket
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
});

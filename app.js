const port = 8080;

var fs = require('fs');
var path = require('path');
var mime = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript"
};

var message = require('./js/message');

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
            console.log("file read error", err);
        } else {
            res.end(data, "utf-8");
        }
    });

}).listen(port);

// ユーザ管理
var userMap = {};

// websocket
var io = require('socket.io').listen(server);
io.on('connection', function(socket){
    
    // チャット開始（チャットユーザ登録）
    socket.on('connected', function(name) {
        
        userMap[socket.id] = name;
        
        // グループチャットで必要になりそう
        var wallMsg = name + " joined";

        socket.broadcast.emit('publish_wallMsg', wallMsg);
    });

    // ふきだしメッセージ送信
    socket.on('publish_message', function(json) {

        // ふきだし枠をjsonに追加
        json.frame = message.speechBubble.bubble_frame;        

        io.emit('publish_message', json);
    });
});

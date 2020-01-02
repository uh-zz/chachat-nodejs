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

});

server.listen(port, function() {
    console.log('Node.js server running...');
});

// ユーザ管理
var userMap = {};

// websocket
var io = require('socket.io').listen(server, function(){
    console.log('[Websocket] server: ' + server + ' Socket.io running...');
});
io.on('connection', function(socket){
    
    // チャット開始（チャットユーザ登録）
    socket.on('connected', function(name) {
        
        userMap[socket.id] = name;
        
        // グループチャットで必要になりそう
        var wallMsg = name + " joined";

        socket.broadcast.emit('publish_wallMsg', wallMsg);
    });

    // ユーザ入力の開始
    var nowTyping = 0;
    socket.on('start_typing', function(user){
        if (nowTyping <= 0){
            socket.broadcast.emit('start_typing', userMap[socket.id]);
        }

        nowTyping++;
        setTimeout(() => {
            nowTyping--;
            if(nowTyping <= 0) {
               socket.broadcast.emit('end_typing');
            }
        }, 3000);
    });

    // ユーザ入力の終了
    socket.on('end_typing', function(){
        nowTyping = 0;
        socket.broadcast.emit('end_typing');
    });

    // ふきだしメッセージ送信
    socket.on('publish_message', function(json) {

        // ふきだし枠をjsonに追加
        json.frame = message.speechBubble.bubble_frame;        

        io.emit('publish_message', json);
    });

    //　既読チェック
    socket.on('check_read', function() {
        io.emit('check_read', userMap[socket.id]);
    });
});

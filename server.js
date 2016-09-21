var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connectedCount = 0;

var words = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var getRandomWord = function() {
    return words[Math.floor(Math.random() * words.length)];
};

var word = null;
var drawer = null;



io.on('connection', function(socket) {

    if (!drawer) {
        drawer = socket
        word = getRandomWord()
        socket.emit('drawer', word)
    }
    socket.on('connect', function() {
        console.log('A user has connected');

    });

    socket.on('drawing', function(drawing) {
        socket.broadcast.emit('drawing', drawing);
    })

    socket.on('guess', function(guess) {
        if (guess.toLowerCase() === word.toLowerCase()) {
            io.emit('winner', word)
    
        }
        else {
        io.emit('guess', guess)
        }
    })
    socket.on('disconnect', function() {
        if (drawer.id === socket.id) {
            if (io.sockets.clients().length) {
                drawer = io.sockets.clients()[0]
                word = getRandomWord()
                drawer.emit('drawer', word)

            }
            else {
                drawer = null;
            }
          
        }
        console.log('A user has disconnected');
    });

});

io.on('disconnect', function(socket) {

});

server.listen(process.env.PORT || 8080);
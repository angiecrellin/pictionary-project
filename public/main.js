/* global $ */

$(document).ready(function() {
    var socket = io();
    var drawing = null;
    

    

    // first person to connect is drawer, everyone else connected is a guesser
    var drawer = false;
    socket.on('drawer', function(word){
        $('#randomWord').text(word)
        console.log('drawer')
      drawer = true  
    })


    var pictionary = function() {
        var canvas, context;

        var draw = function(position) {
            context.beginPath();
            context.arc(position.x, position.y,
                6, 0, 2 * Math.PI);
            context.fill();
        };

        canvas = $('canvas');
        context = canvas[0].getContext('2d');
        canvas[0].width = canvas[0].offsetWidth;
        canvas[0].height = canvas[0].offsetHeight;
        canvas.on('mousedown', function() {
            drawing = true;
        });
        canvas.on('mouseup', function() {
            drawing = false;
        });
        canvas.on('mousemove', function(event) {
            if (drawing === true && drawer === true) {
                var offset = canvas.offset();
                var position = {
                    x: event.pageX - offset.left,
                    y: event.pageY - offset.top
                };
                socket.emit('drawing', position);
                draw(position);
            }




        });
        socket.on('drawing', function(position) {
            draw(position);
        });

        var guessBox;


        socket.on('guess', function(guess) {
            console.log(guess);
            addGuessToList(guess);
        });
        
        socket.on('winner', function(word){
            winnerNotification(word);
        })
        
    function winnerNotification(word){
        $('#winnerNotification').text('We have a winner.  The word was: ' + word)
    }

        var onKeyDown = function(event) {
            if (event.keyCode != 13) {
                return;
            }





            console.log(guessBox.val());
            
            socket.emit('guess', guessBox.val())
            guessBox.val('');

        };
        

        function addGuessToList(guess) {
            
            $('#guesses').append('<li>' + guess + '</li>')

        }

        guessBox = $('#guess input');
        guessBox.on('keydown', onKeyDown);

    };
    pictionary();
});

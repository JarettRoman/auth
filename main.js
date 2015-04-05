var socket = io();
    //var userEmail = user.local.email;
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
  });
    socket.on('chat message', function(msg){
      if(msg.length > 0){
        $('#messages').append($('<li>').text(msg));
      };
    });


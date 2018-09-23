var connectionnumber;
var friends = [];

var appUrl = window.location.protocol+'//'+window.location.hostname+':'+window.location.port;
var socketUrl = window.location.protocol+'//'+window.location.hostname+':3001';

var socket = io.connect(socketUrl);


/*
socket.on('youare', function (data) {
  connectionnumber = data.id;
  document.getElementById('iam').innerHTML = 'This connection '+connectionnumber;
});


socket.on('tell me your id', function (data) {
  socket.emit('i am', { id: connectionnumber });
});


socket.on('play audio', function (data) {
  if (data.id != connectionnumber) {return;}
  var ct = data["content-type"];
  if (ct.startsWith('audio')) {
    document.getElementById('iam').innerHTML = 'PLAY AUDIO!!! '+data.source;
    var ap = document.getElementById('audioplayer');
    ap.setAttribute("src",data.source);
    ap.play();
  } else {
    document.getElementById('iam').innerHTML = 'PLAY VIDEO!!! '+data.source;
    var ap = document.getElementById('videoplayer');
    ap.setAttribute("src",data.source);
    ap.play();
  }
});



socket.on('hello from', function (data) {
        //if (friends.indexOf(data.from)==-1) { friends.push(data.from); }
        AddFriend(data.from);
        var txt = "";
        for (i in friends) {
                txt = txt + '<input type="radio" name="target" value="'+friends[i]+'"> Player#'+friends[i] ;
        }
        document.getElementById('formTarget').innerHTML = txt;
});

function AddFriend(id) {
        if (friends.indexOf(id)==-1) { friends.push(id); }
}



function WhoIsThere() {
    friends = [connectionnumber];
    socket.emit('whos there', { id: connectionnumber });
}

function PlayAudio(source, target) {
        //var target = document.getElementById('target').value;
        var t = document.querySelector('input[name="target"]:checked').value;
        socket.emit('request play audio', { id: t,
                    source: appUrl+'/media?source='+encodeURIComponent(source)});
}

*/


const socket = io('/')
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;
let myVideoStream;
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // answer the call of the peer
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })


    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    })

    // // For the chat funcitionality
    // let text = $('input');
    // $('html').keydown((e) => {
    //     if (e.which === 13 && text.val().length !== 0) {
    //         // console.log('text', text.val())
    //         socket.emit('message', text.val());
    //         text.val('')
    //     }
    // })

    // // Get the message back from the server
    // socket.on('createMessage', message => {
    //     // console.log('message from the server', message);
    //     $('.messges').append(`<li class = 'message'><b>User:</b><br/>${message}</li>`);
    // })
})


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}


peer.on('open', id => {
    // console.log('id', id);
    socket.emit('join-room', ROOM_ID, id);
})



// socket.emit('join-room', ROOM_ID);
console.log('ROOM_ID', ROOM_ID);

// socket.on('user-connected', (userId)=>{
//     connectToNewUser(userId, stream);
// })

/**
 * Send the new user our video stream
 */
const connectToNewUser = (userId, stream) => {
    //  console.log('new user', userId);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}


// For the chat funcitionality
let text = $('input');
$('html').keydown((e) => {
    if (e.which === 13 && text.val().length !== 0) {
        // console.log('text', text.val())
        socket.emit('message', text.val());
        text.val('')
    }
})

// Get the message back from the server
socket.on('createMessage', message => {
    // console.log('message from the server', message);
    $('ul').append(`<li class = 'message'><b>User:</b><br/>${message}</li>`);
    scorllToBottom();
})

// handle scrolling
const scorllToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop('scrollHeight'));
}

// Mute unmute video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    // console.log(myVideoStream, enabled);
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton()
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setUnmuteButton = () => {
    const html = `
    <i class = 'unmute fas fa-microphone-slash'></i>
    <span>Unmute</span>
    `;
    document.querySelector('.main__mute__button').innerHTML = html;

}

const setMuteButton = () => {
    const html = `
    <i class = 'fas fa-microphone'></i>
    <span>Mute</span>
    `;
    document.querySelector('.main__mute__button').innerHTML = html;

}



// stop video functionality

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
  }
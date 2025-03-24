import config from './utils/config.js';
import { generateUUID } from './utils/generateUUID.js';
import { getRandomInt } from './utils/getRandomInt.js';

document.addEventListener('DOMContentLoaded', function () {
    const createButton = document.querySelector('.create-box button');
    const findButton = document.querySelector('.find-box button');
    const inputCode = document.querySelector('.input-code-enter')

    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
    }

    // CREATE THE ROOM
    createButton.addEventListener(('click'), () => {
        createRoom();
    });

    // FIND AND JOIN THE ROOM
    findButton.addEventListener('click', () => {
        let code = inputCode.value.trim();
        findRoom(code);
    });
});

function createRoom() {
    let name = getRandomInt(1000);
    const roomData = {
        roomName: '@' + String(name)
    }

    fetch(`${config.apiUrl}/api/rooms/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.roomName && data.code) {
                window.location.href = `chat.html?code=${data.code}&expiresAt=${data.expiresAt}`;
            } else {
                alert('Error creating room');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create room.');
        });
}

function findRoom(code) {
    fetch(`${config.apiUrl}/api/rooms/${code}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.code && data.expiresAt) {
                window.location.href = `chat.html?code=${data.code}&expiresAt=${data.expiresAt}`;
            } else {
                alert(`${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to find room.');
        });
}
import config from './utils/config.js';
import { startTimer } from './utils/startTimer.js';
import { scrollToBottom } from './utils/scrollToBottom.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('code');
    const expiresAt = urlParams.get('expiresAt');
    const deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
        alert('No device id found!');
        window.location.href = 'index.html';
        return;
    }

    if (!roomCode) {
        alert('No room code found!');
        window.location.href = 'index.html';
        return;
    }

    if (!expiresAt) {
        alert('No expiration time found!');
        window.location.href = 'index.html';
        return;
    }

    const sendBtn = document.querySelector('.btn-send-message');
    const backBtn = document.querySelector('.btn-back');
    const messageInput = document.querySelector('.footer-chat input');
    const messagesContainer = document.querySelector('.messages');
    const timer = document.querySelector('.timer');

    // Check massageInput value for changing sendBtn color
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            sendBtn.style.color = '#fff'; 
        } else {
            sendBtn.style.color = '#888'; 
        }
    });
    
    // Load messages in the start
    renderMessages(roomCode, deviceId);

    // Timer for expires date
    startTimer(expiresAt, timer);

    // Send message by btn
    sendBtn.addEventListener('click', () => sendMessage(roomCode, messageInput, messagesContainer, deviceId));

    // Send message by enter key
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Back btn
    backBtn.addEventListener('click', () => {
        if (roomCode && deviceId) {
            leaveRoom(roomCode, deviceId);
        } else {
            window.location.href = 'index.html';
        }
    });

    // Automatic updates
    setInterval(() => renderMessages(roomCode, deviceId), 2000);
});

function sendMessage(code, messageInput, messagesContainer, deviceId) {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    const newMessage = document.createElement('div');
    newMessage.classList.add('message', 'sent');
    newMessage.innerHTML = `<p class="text">${messageText}</p>`;
    messagesContainer.appendChild(newMessage);

    setTimeout(() => {
        scrollToBottom(messagesContainer);
    }, 100);

    fetch(`${config.apiUrl}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roomCode: code,
            sender: deviceId,
            text: messageText
        })
    })
    .then(response => response.json())
    .then(() => {
        messageInput.value = '';
        setTimeout(() => renderMessages(code, deviceId), 500);
    })
    .catch(error => console.error('Error sending message:', error));
}

function renderMessages(code, deviceId) {
    fetch(`${config.apiUrl}/api/messages/${code}`)
        .then(response => response.json())
        .then(data => {
            const messagesContainer = document.querySelector('.messages');
            if (!messagesContainer) return;

            messagesContainer.innerHTML = ''; 

            data.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');

                if (msg.sender === deviceId) {
                    messageDiv.classList.add('sent');
                } else {
                    messageDiv.classList.add('received');
                }

                messageDiv.innerHTML = `<p class="text">${msg.text}</p>`;
                messagesContainer.appendChild(messageDiv);
            });

            setTimeout(() => {
                const isScrolledToBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop === messagesContainer.clientHeight;
                if (isScrolledToBottom) {
                    scrollToBottom(messagesContainer); 
                }
            }, 100);
        })
        .catch(error => console.error('Error loading messages:', error));
}

function leaveRoom(roomCode, deviceId) {
    fetch(`${config.apiUrl}/api/rooms/${roomCode}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
    })
        .then(response => response.json())
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error when leaving the room:', error);
            window.location.href = 'index.html'; 
        });
}
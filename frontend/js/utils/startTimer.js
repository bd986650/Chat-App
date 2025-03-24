export function startTimer(expiresAt, timerElement) {
    function updateTimer() {
        const now = new Date();
        const expireTime = new Date(expiresAt);
        const diff = expireTime - now;

        if (diff <= 0) {
            timerElement.textContent = '00:00';
            alert('Room expired!');
            window.location.href = 'index.html';
            return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateTimer(); 
    setInterval(updateTimer, 1000); 
}
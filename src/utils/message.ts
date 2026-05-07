type MessageType = 'success' | 'error' | 'info' | 'loading' | 'warning';

interface MessageOptions {
  content: string;
  key?: string;
  duration?: number;
}

const messages = new Map<string, HTMLElement>();
let container: HTMLElement | null = null;

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div');
    container.className = 'message-container';
    document.body.appendChild(container);
  }
  return container;
}

function createIcon(type: MessageType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    case 'loading':
      return '⟳';
    default:
      return '';
  }
}

function showMessage(type: MessageType, options: string | MessageOptions) {
  const config = typeof options === 'string' ? { content: options } : options;
  const { content, key = 'default', duration = 3000 } = config;

  // Remove existing message with same key
  if (messages.has(key)) {
    const existing = messages.get(key);
    existing?.remove();
    messages.delete(key);
  }

  const messageContainer = getContainer();
  const messageEl = document.createElement('div');
  messageEl.className = `message-item message-${type}`;
  messageEl.setAttribute('data-key', key);

  const icon = document.createElement('span');
  icon.className = 'message-icon';
  icon.textContent = createIcon(type);

  const text = document.createElement('span');
  text.className = 'message-text';
  text.textContent = content;

  messageEl.appendChild(icon);
  messageEl.appendChild(text);

  messageContainer.appendChild(messageEl);
  messages.set(key, messageEl);

  // Trigger animation
  setTimeout(() => {
    messageEl.classList.add('message-show');
  }, 10);

  if (duration > 0) {
    setTimeout(() => {
      messageEl.classList.remove('message-show');
      setTimeout(() => {
        messageEl.remove();
        messages.delete(key);
      }, 300);
    }, duration);
  }
}

// Inject styles
function injectStyles() {
  if (document.getElementById('message-styles')) return;

  const style = document.createElement('style');
  style.id = 'message-styles';
  style.textContent = `
    .message-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      pointer-events: none;
    }

    .message-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      margin-bottom: 8px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    }

    .message-item.message-show {
      opacity: 1;
      transform: translateY(0);
    }

    .message-icon {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }

    .message-text {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }

    .message-success .message-icon {
      color: #52c41a;
    }

    .message-error .message-icon {
      color: #ff4d4f;
    }

    .message-warning .message-icon {
      color: #faad14;
    }

    .message-info .message-icon {
      color: #1677ff;
    }

    .message-loading .message-icon {
      color: #1677ff;
      animation: message-loading-spin 1s linear infinite;
    }

    @keyframes message-loading-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

// Inject styles on module load
injectStyles();

export const message = {
  success: (options: string | MessageOptions) => showMessage('success', options),
  error: (options: string | MessageOptions) => showMessage('error', options),
  info: (options: string | MessageOptions) => showMessage('info', options),
  warning: (options: string | MessageOptions) => showMessage('warning', options),
  loading: (options: string | MessageOptions) => showMessage('loading', options),
  destroy: (key: string = 'default') => {
    const messageEl = messages.get(key);
    if (messageEl) {
      messageEl.classList.remove('message-show');
      setTimeout(() => {
        messageEl.remove();
        messages.delete(key);
      }, 300);
    }
  },
};

(function() {
  'use strict';

  // Get bot ID and base URL from script tag
  function getBotIdAndBaseUrlFromScript() {
    const scripts = document.querySelectorAll('script[src*="chatbot-widget.js"]');
    for (const script of scripts) {
      const src = script.getAttribute('src');
      if (src && src.includes('chatbot-widget.js')) {
        const url = new URL(src);
        const botId = url.searchParams.get('bot-id');
        const baseUrl = url.origin; // Extract the base URL (e.g., https://multi-tenancy-bots.vercel.app)
        return { botId, baseUrl };
      }
    }
    return { botId: null, baseUrl: null };
  }

  // Configuration
  const CONFIG = {
    iframeUrl: null, // Will be set dynamically based on script src
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    width: '400px',
    height: '600px',
    zIndex: 999999,
    theme: 'light', // light, dark
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    botId: null
  };

  // Widget state
  let isOpen = false;
  let isMinimized = false;
  let iframe = null;
  let toggleButton = null;
  let widgetContainer = null;
  let isInitialized = false;

  // Create and inject CSS
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-widget-container {
        position: fixed;
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: transparent;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .chatbot-widget-container.bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      .chatbot-widget-container.bottom-left {
        bottom: 20px;
        left: 20px;
      }
      
      .chatbot-widget-container.top-right {
        top: 20px;
        right: 20px;
      }
      
      .chatbot-widget-container.top-left {
        top: 20px;
        left: 20px;
      }
      
      .chatbot-toggle-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${CONFIG.primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
      
      .chatbot-toggle-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }
      
      .chatbot-iframe {
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        background: white;
        margin-bottom: 20px;
        transition: all 0.3s ease;
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .chatbot-iframe.minimized {
        transform: scale(0.8);
        opacity: 0;
        pointer-events: none;
      }
      
      .chatbot-iframe.hidden {
        display: none;
      }
      
      .chatbot-close-button {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ef4444;
        border: none;
        cursor: pointer;
        color: white;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .chatbot-close-button:hover {
        background: #dc2626;
      }
      
      @media (max-width: 768px) {
        .chatbot-widget-container {
          bottom: 0 !important;
          right: 0 !important;
          left: 0 !important;
          top: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
        }
        
        .chatbot-iframe {
          width: 100% !important;
          height: 100% !important;
          margin-bottom: 0 !important;
          border-radius: 0 !important;
        }
        
        .chatbot-toggle-button {
          bottom: 20px !important;
          right: 20px !important;
          position: fixed !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create toggle button
  function createToggleButton() {
    toggleButton = document.createElement('button');
    toggleButton.className = 'chatbot-toggle-button';
    toggleButton.innerHTML = '💬';
    toggleButton.title = 'Chat with us';
    toggleButton.addEventListener('click', toggleChat);
    return toggleButton;
  }

  // Create iframe
  function createIframe() {
    iframe = document.createElement('iframe');
    
    // Build iframe URL with bot ID if available
    let iframeUrl = CONFIG.iframeUrl;
    if (CONFIG.botId) {
      iframeUrl += `?bot-id=${CONFIG.botId}`;
    }
    
    console.log('Chatbot Widget: Creating iframe with URL:', iframeUrl);
    
    iframe.src = iframeUrl;
    iframe.className = 'chatbot-iframe';
    iframe.style.width = CONFIG.width;
    iframe.style.height = CONFIG.height;
    iframe.style.display = 'none';
    
    // Listen for messages from iframe
    window.addEventListener('message', handleIframeMessage);
    
    // Listen for iframe load event to send ready message
    iframe.onload = function() {
      // Send ready message to parent window
      window.parent.postMessage({ type: 'CHATBOT_READY' }, '*');
    };
    
    return iframe;
  }

  // Handle messages from iframe
  function handleIframeMessage(event) {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'CHATBOT_READY') {
      console.log('Chatbot iframe is ready');
    } else if (event.data.type === 'CHATBOT_MESSAGE_SENT') {
      // Handle message sent event if needed
      console.log('Message sent:', event.data.message);
    } else if (event.data.type === 'CHATBOT_ERROR') {
      console.error('Chatbot error:', event.data.error);
      // Handle bot configuration errors
      if (event.data.error.includes('Bot not found') || event.data.error.includes('not configured')) {
        console.error('Bot configuration error. Please check the bot ID.');
      }
    }
  }

  // Toggle chat visibility
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open chat
  function openChat() {
    if (!isInitialized || !iframe) {
      console.error('Chatbot Widget: Widget not fully initialized yet');
      return;
    }
    
    isOpen = true;
    isMinimized = false;
    
    iframe.style.display = 'block';
    iframe.classList.remove('minimized', 'hidden');
    
    // Update toggle button
    if (toggleButton) {
      toggleButton.innerHTML = '−';
      toggleButton.title = 'Minimize chat';
    }
    
    // Send message to iframe
    try {
      iframe.contentWindow.postMessage({ type: 'CHATBOT_OPEN' }, CONFIG.iframeUrl);
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  }

  // Close chat
  function closeChat() {
    if (!isInitialized || !iframe) {
      console.error('Chatbot Widget: Widget not fully initialized yet');
      return;
    }
    
    isOpen = false;
    isMinimized = false;
    
    iframe.style.display = 'none';
    iframe.classList.add('hidden');
    
    // Update toggle button
    if (toggleButton) {
      toggleButton.innerHTML = '💬';
      toggleButton.title = 'Chat with us';
    }
    
    // Send message to iframe
    try {
      iframe.contentWindow.postMessage({ type: 'CHATBOT_CLOSE' }, CONFIG.iframeUrl);
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  }

  // Minimize chat
  function minimizeChat() {
    if (!isInitialized || !iframe) {
      console.error('Chatbot Widget: Widget not fully initialized yet');
      return;
    }
    
    isMinimized = true;
    iframe.classList.add('minimized');
    
    // Update toggle button
    if (toggleButton) {
      toggleButton.innerHTML = '💬';
      toggleButton.title = 'Open chat';
    }
    
    // Send message to iframe
    try {
      iframe.contentWindow.postMessage({ type: 'CHATBOT_MINIMIZE' }, CONFIG.iframeUrl);
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  }

  // Initialize widget
  function init() {
    // Get bot ID and base URL from script tag if not provided in config
    if (!CONFIG.botId || !CONFIG.iframeUrl) {
      const { botId, baseUrl } = getBotIdAndBaseUrlFromScript();
      if (!CONFIG.botId) CONFIG.botId = botId;
      if (!CONFIG.iframeUrl) CONFIG.iframeUrl = baseUrl + '/embed';
    }
    
    // Validate bot ID
    if (!CONFIG.botId) {
      console.error('Chatbot Widget: Bot ID not specified. Please provide a bot-id parameter in the script URL.');
      return;
    }
    
    // Validate iframe URL
    if (!CONFIG.iframeUrl) {
      console.error('Chatbot Widget: Could not determine iframe URL. Please check the script src.');
      return;
    }
    
    // Create container
    widgetContainer = document.createElement('div');
    widgetContainer.className = `chatbot-widget-container ${CONFIG.position}`;
    
    // Create elements
    const iframeElement = createIframe();
    const toggleButtonElement = createToggleButton();
    
    // Add elements to container
    widgetContainer.appendChild(iframeElement);
    widgetContainer.appendChild(toggleButtonElement);
    
    // Add to page
    document.body.appendChild(widgetContainer);
    
    // Mark as initialized
    isInitialized = true;
  }

  // Public API
  window.ChatbotWidget = {
    // Initialize the widget
    init: function(config = {}) {
      Object.assign(CONFIG, config);
      
      // Get bot ID and base URL from script tag if not provided
      if (!CONFIG.botId || !CONFIG.iframeUrl) {
        const { botId, baseUrl } = getBotIdAndBaseUrlFromScript();
        if (!CONFIG.botId) CONFIG.botId = botId;
        if (!CONFIG.iframeUrl) CONFIG.iframeUrl = baseUrl + '/embed';
      }
      
      // Debug logging
      console.log('Chatbot Widget: Initializing with config:', {
        botId: CONFIG.botId,
        iframeUrl: CONFIG.iframeUrl,
        position: CONFIG.position
      });
      
      injectStyles();
      init();
    },
    
    // Check if widget is ready
    isReady: function() {
      return isInitialized && iframe !== null;
    },
    
    // Open the chat
    open: function() {
      if (isOpen) return;
      openChat();
    },
    
    // Close the chat
    close: function() {
      if (!isOpen) return;
      closeChat();
    },
    
    // Minimize the chat
    minimize: function() {
      if (!isOpen || isMinimized) return;
      minimizeChat();
    },
    
    // Send a message programmatically
    sendMessage: function(message) {
      if (!isInitialized || !isOpen || !iframe) {
        console.error('Chatbot Widget: Cannot send message - widget not ready, iframe not ready, or chat not open');
        return;
      }
      
      try {
        iframe.contentWindow.postMessage({ 
          type: 'CHATBOT_SEND_MESSAGE', 
          message: message 
        }, CONFIG.iframeUrl);
      } catch (error) {
        console.error('Error sending message to iframe:', error);
      }
    },
    
    // Update configuration
    updateConfig: function(newConfig) {
      Object.assign(CONFIG, newConfig);
      // Re-apply styles if needed
      if (document.querySelector('.chatbot-widget-container')) {
        const existingStyle = document.querySelector('style[data-chatbot]');
        if (existingStyle) {
          existingStyle.remove();
        }
        injectStyles();
      }
    },
    
    // Destroy the widget
    destroy: function() {
      if (widgetContainer && widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleChat);
      }
      window.removeEventListener('message', handleIframeMessage);
      
      iframe = null;
      toggleButton = null;
      widgetContainer = null;
      isOpen = false;
      isMinimized = false;
      
      console.log('Chatbot widget destroyed');
    }
  };

  // Auto-initialize if script is loaded with data-auto-init attribute
  if (document.currentScript && document.currentScript.hasAttribute('data-auto-init')) {
    window.addEventListener('DOMContentLoaded', function() {
      window.ChatbotWidget.init();
    });
  }
})();

declare global {
  interface Window {
    ChatbotWidget: {
      init: (config?: ChatbotWidgetConfig) => void;
      isReady: () => boolean;
      open: () => void;
      close: () => void;
      minimize: () => void;
      sendMessage: (message: string) => void;
      updateConfig: (config: Partial<ChatbotWidgetConfig>) => void;
      destroy: () => void;
    };
  }
}

interface ChatbotWidgetConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  width?: string;
  height?: string;
  zIndex?: number;
  primaryColor?: string;
  secondaryColor?: string;
  botId?: string;
}

export {};

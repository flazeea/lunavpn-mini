
interface TelegramWebApp {
    initData: string;
    initDataUnsafe: any;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: any;
    MainButton: any;
    HapticFeedback: any;
    onEvent(eventType: string, eventHandler: Function): void;
    offEvent(eventType: string, eventHandler: Function): void;
    sendData(data: any): void;
    ready(): void;
    expand(): void;
    close(): void;
}

interface Window {
    Telegram?: {
        WebApp: TelegramWebApp;
    }
}

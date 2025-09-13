declare module "react-native-websocket" {
  export default class WebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    constructor(url: string, protocols?: string | string[]);
    send(data: string | ArrayBuffer): void;
    close(code?: number, reason?: string): void;
    onopen: () => void;
    onmessage: (event: { data: string }) => void;
    onerror: (event: { message: string }) => void;
    onclose: (event: { code: number; reason: string }) => void;
    readyState: number;
  }
}

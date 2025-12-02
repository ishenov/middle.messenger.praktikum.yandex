export default class WSService {
  private socket: WebSocket;
  private pingInterval: number | undefined;
  private onMessage: (data: unknown) => void;

  constructor(url: string, onMessage: (data: unknown) => void) {
    this.socket = new WebSocket(url);
    this.onMessage = onMessage;

    this.socket.addEventListener('open', () => {
      console.log('Соединение установлено');
      this.setupPing();
      this.getOldMessages("0")
    });

    this.socket.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      this.clearPing();
    });

    this.socket.addEventListener('message', event => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          return;
        }
        this.onMessage(data);
      } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
      }
    });

    this.socket.addEventListener('error', event => {
      console.log('Ошибка', event);
    });
  }

  private setupPing() {
    this.pingInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 10000);
  }

  private clearPing() {
    if (this.pingInterval) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }

  public getOldMessages(offset: string) {
    this.send({ type: 'get old', content: offset });
  }

  public send(data: unknown) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  public close() {
    this.clearPing();
    this.socket.close();
  }
}

export default class WSService {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      console.log('Соединение установлено');
    });

    this.socket.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    this.socket.addEventListener('message', event => {
      console.log('Получены данные', event.data);
    });

    this.socket.addEventListener('error', event => {
      console.log('Ошибка', event);
    });
  }

  send(data: any) {
    this.socket.send(JSON.stringify(data));
  }
}

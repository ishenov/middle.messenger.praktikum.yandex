import HTTPTransport from '../services/HTTPTransport';
import { DeleteChat } from './type';

const chatAPI = new HTTPTransport('/chats');

export default class ChatAPI {
  deleteChat(chatId: number) {
    return chatAPI.delete<DeleteChat>('', { chatId });
  }
}

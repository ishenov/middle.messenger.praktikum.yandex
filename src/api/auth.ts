import HTTPTransport, {HTTPTransportResponse} from '../services/HTTPTransport';
import {
  APIError, CreateUser, LoginRequestData, SignUpResponse, UserDTO,
} from './type';

const authUrl = new HTTPTransport('/auth');

export default class AuthApi {
  async create(data: CreateUser): Promise<HTTPTransportResponse<SignUpResponse>> {
    return authUrl.post('/signup', { data });
  }

  async login(data: LoginRequestData): Promise<HTTPTransportResponse<void | APIError>> {
    return authUrl.post('/signin', { data });
  }

  async me(): Promise<HTTPTransportResponse<UserDTO | APIError>> {
    return authUrl.get('/user');
  }

  async logout(): Promise<HTTPTransportResponse<void | APIError>> {
    return authUrl.post('/logout');
  }
}

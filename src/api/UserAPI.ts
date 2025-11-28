import HTTPTransport from '../services/HTTPTransport';
import { ProfileData } from '../pages/ProfilePage';

const userAPI = new HTTPTransport('/user');

export default class UserAPI {
  saveProfile(data: ProfileData) {
    return userAPI.put<ProfileData>('/profile', data);
  }

  changeAvatar(data: FormData) {
    return userAPI.put<ProfileData>('/profile/avatar', data);
  }

  changePassword(data: { oldPassword: string; newPassword: string; }) {
    return userAPI.put('/password', data);
  }
}

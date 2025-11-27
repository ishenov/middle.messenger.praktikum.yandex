export type APIError = {
  reason: string;
};

export type SignUpResponse = {
  id: number
};

export type UserDTO = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type DeleteChat = {
  userId: number;
  result: {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
  }
};

export type CreateUser = Omit<UserDTO, 'avatar' | 'display_name' | 'id'> & {
  password: string
};

export type LoginRequestData = {
  login: string,
  password: string
};

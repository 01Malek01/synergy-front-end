// axiosError.ts
export interface AxiosErrorResponse {
  message: string;
}

export interface AxiosError {
  response?: {
    data: AxiosErrorResponse;
    status: number;
    statusText: string;
  };
  request?: unknown;
  message?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    _id: string;
  };
  createdAt: string;
  likes: string[];
  postId?: string;
  isShared?: boolean;
  sharedFrom?: {
    name: string;
    _id: string;
  };
}

export type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthLoading: boolean;
};

export type User = {
  name: string;
  email?: string;
  isAuthenticated?: boolean;
  _id?: string;
  bio?: string;
  profilePic?: string;
  following?: string[];
  followers?: string[];
  createdAt?: string;
};

export type Comment = {
  id: string;
  author: string;
  content: string;
  publishDate?: string;
  createdAt?: string;
};
export type PostComment = {
  author: string;
  content: string;
  createdAt: string;
  _id: string;
  post: string;
  authorName: string;
};

export interface PostContextValue {
  posts: Post[];
  isLoading: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
  user?: string;
  type: string;
}

export type AuthUser = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  _id: string;
  bio: string;
  profilePic: string;
  following: string[];
  followers: string[];
  createdAt: string;
};

export interface Message {
  content: string;
  sender: string;
  receiver: string;
  readBy: string[];
  _id: string;
  conversationId: string;
  createdAt: string;
}

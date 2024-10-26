export interface Post {
  id: string;
  title: string;
  image: string;
  images?: string[];
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  location?: string;
  topics?: string[];
}

export interface Topic {
  id: string;
  name: string;
  count: number;
}
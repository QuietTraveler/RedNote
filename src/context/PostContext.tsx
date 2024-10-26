import React, { createContext, useContext, useState, useCallback } from 'react';
import { Post } from '../types';
import { posts as initialPosts } from '../data';

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  return (
    <PostContext.Provider value={{ posts, addPost, selectedPost, setSelectedPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}
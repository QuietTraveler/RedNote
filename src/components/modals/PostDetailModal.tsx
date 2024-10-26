import React from 'react';
import { X, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Post as PostType } from '../../types';

interface PostDetailModalProps {
  post: PostType;
  isOpen: boolean;
  onClose: () => void;
}

export function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="aspect-square">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{post.author.name}</h3>
                  <p className="text-sm text-gray-500">原创作者</p>
                </div>
              </div>

              <h2 className="text-xl font-medium mb-4">{post.title}</h2>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1">
                    <Heart className="w-6 h-6" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button>
                    <Bookmark className="w-6 h-6" />
                  </button>
                  <button>
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
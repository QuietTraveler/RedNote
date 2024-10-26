import React, { useState, useRef } from 'react';
import { X, Image, MapPin, Hash, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePost } from '../../context/PostContext';

export function CreatePostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [location, setLocation] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPost } = usePost();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setSelectedImages(prev => [...prev, ...images]);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleAddTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic]);
      setNewTopic('');
      setShowTopicInput(false);
    }
  };

  const handlePublish = () => {
    if (content && selectedImages.length > 0) {
      const newPost = {
        id: Date.now().toString(),
        title: content,
        image: selectedImages[0],
        images: selectedImages,
        author: {
          name: '我',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
        },
        likes: 0,
        comments: 0,
        location,
        topics
      };
      addPost(newPost);
      onClose();
      // Reset form
      setContent('');
      setSelectedImages([]);
      setLocation('');
      setTopics([]);
      setCurrentImageIndex(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
          <h2 className="font-medium">发布笔记</h2>
          <button 
            className={`px-4 py-1.5 rounded-full ${
              content && selectedImages.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!content || selectedImages.length === 0}
            onClick={handlePublish}
          >
            发布
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <textarea
              placeholder="分享你的精彩生活..."
              className="w-full h-32 resize-none outline-none text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {selectedImages.length > 0 ? (
              <div className="relative mt-4">
                <div className="relative w-full aspect-square">
                  <img 
                    src={selectedImages[currentImageIndex]} 
                    alt="Selected" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => handleRemoveImage(currentImageIndex)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {selectedImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white disabled:opacity-50"
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => Math.min(selectedImages.length - 1, prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white disabled:opacity-50"
                        disabled={currentImageIndex === selectedImages.length - 1}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                        {selectedImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedImages.map((image, index) => (
                    <button
                      key={index}
                      className={`relative w-20 h-20 flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-red-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                  {selectedImages.length < 9 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-red-500 transition-colors"
                    >
                      <Plus className="w-6 h-6 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-red-500 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">添加图片</span>
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="添加位置"
                  className="flex-1 outline-none min-w-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Hash className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {topics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-sm">
                    #{topic}
                  </span>
                ))}
                {showTopicInput ? (
                  <div className="flex items-center space-x-2 min-w-0">
                    <input
                      type="text"
                      placeholder="添加话题"
                      className="outline-none text-sm min-w-0"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                    />
                    <button 
                      onClick={handleAddTopic}
                      className="text-sm text-red-500 whitespace-nowrap"
                    >
                      添加
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowTopicInput(true)}
                    className="text-sm text-gray-500"
                  >
                    添加话题
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
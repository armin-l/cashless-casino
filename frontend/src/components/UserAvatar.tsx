'use client';

import React from 'react';

/**
 * UserAvatar — avatar placeholder with gold dot border for current user's row.
 * 
 * Shows a circular avatar (initials or icon) that can be highlighted with
 * a gold border to indicate the logged-in user in leaderboards and feeds.
 */

type Props = {
  username: string;
  isCurrentUser?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export default function UserAvatar({ username, isCurrentUser = false, size = 'md' }: Props) {
  const initials = username.slice(0, 2).toUpperCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center font-bold bg-gradient-to-br from-gray-800 to-gray-900 ${sizeClasses[size]} ${isCurrentUser ? 'ring-2 ring-yellow-500' : ''}`}
    >
      {initials}
      
      {/* Gold dot indicator for current user */}
      {isCurrentUser && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-950" />
      )}
    </div>
  );
}

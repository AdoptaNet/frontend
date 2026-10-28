'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  sizeClassName?: string;
  textClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export function UserAvatar({
  src,
  name,
  className = '',
  sizeClassName = 'w-10 h-10',
  textClassName = 'text-xs font-bold text-verde-700',
  fallbackIcon,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const displayName = (name || '').trim();
  const initials = displayName
    ? displayName
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '';

  const fallback = initials || (displayName.length >= 2 ? displayName.slice(0, 2).toUpperCase() : 'AN');

  if (src && !hasError) {
    return (
      <div
        className={`${sizeClassName} rounded-full overflow-hidden border border-line bg-verde-50 shrink-0 ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={displayName || 'Avatar de usuario'}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} rounded-full bg-verde-100 border border-line flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {fallbackIcon || (
        fallback ? (
          <span className={textClassName}>{fallback}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-verde-700" />
        )
      )}
    </div>
  );
}

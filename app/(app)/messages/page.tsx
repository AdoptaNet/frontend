import React, { Suspense } from 'react';
import { MessagesPage } from '@/modules/messages/components/MessagesPage';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Mensajes — AdoptaNet',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        </div>
      }
    >
      <MessagesPage />
    </Suspense>
  );
}

'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    liff: any;
  }
}

export interface LiffContext {
  userId: string;
  displayName: string;
  pictureUrl: string;
  isLinked: boolean;
}

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || '1668676101-JZwvBDDL';

export function useLiff() {
  const [liffContext, setLiffContext] = useState<LiffContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (typeof window !== 'undefined' && window.liff) {
          const liff = window.liff;
          
          if (!liff.isLoggedIn()) {
            liff.login();
            return;
          }

          await liff.init({ liffId: LIFF_ID });

          if (liff.isInClient()) {
            const profile = await liff.getProfile();
            setLiffContext({
              userId: profile.userId,
              displayName: profile.displayName || 'Unknown',
              pictureUrl: profile.pictureUrl || '',
              isLinked: true,
            });
          } else {
            // ใช้ query param ที่ส่งมาจาก webhook
            const params = new URLSearchParams(window.location.search);
            const lineId = params.get('lineId');
            if (lineId) {
              setLiffContext({
                userId: lineId,
                displayName: 'LINE User',
                pictureUrl: '',
                isLinked: false,
              });
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize LIFF');
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  return { liffContext, isLoading, error };
}

export function closeLiff() {
  if (typeof window !== 'undefined' && window.liff) {
    window.liff.closeWindow();
  }
}

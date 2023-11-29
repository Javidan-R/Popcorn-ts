// useKey.tsx
import { useEffect } from 'react';
export function useKey(key: string | number, action: () => void): void {
  useEffect(() => {
    function callback(e: KeyboardEvent): void {
      if (e.code.toLowerCase() === String(key).toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', callback);

    return (): void => {
      document.removeEventListener('keydown', callback);
    };
  }, [action, key]);
}

import {useState, useEffect} from 'react';

type ScriptLoadState = 'done' | 'loading' | 'error';

/**
 * Hook to async load a script tag.
 * @param src url to the script
 * @returns ScriptLoadState = 'done' | 'loading' | 'error'
 */
export function useLoadScript(src: string): ScriptLoadState {
  const [state, setState] = useState<ScriptLoadState>('loading');

  useEffect(() => {
    async function doLoadScript() {
      setState('loading');
      try {
        // Create a script tag, wait for onload
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            resolve();
          };
          script.onerror = () => {
            reject();
          };
          document.head.appendChild(script);
        });
        setState('done');
      } catch (e) {
        setState('error');
      }
    };

    doLoadScript();
  }, [src]);

  return state;
}

import { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: number, initialDelay = false) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current!();
        }
        if (delay !== null) {
            // If initial delay is false, invoke immediately the first time
            if (!initialDelay) tick();

            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, initialDelay]);
}
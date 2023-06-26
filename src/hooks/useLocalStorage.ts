import { d } from '@wagmi/cli/dist/config-c09a23a5';
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const readValue = () => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = (value: T) => {

        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    useEffect(() => {
        const onChange = (e: StorageEvent) => {
            if (e.storageArea === window.localStorage && e.key === key) {
                setStoredValue(readValue());
            }
        };

        window.addEventListener('storage', onChange);
        return () => window.removeEventListener('storage', onChange);
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;

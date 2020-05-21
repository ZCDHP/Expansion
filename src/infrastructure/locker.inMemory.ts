const Wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export const Locker = () => {
    const set = new Set<string | number>();

    return (key: string | number) => async <T>(asyncFunc: () => Promise<T>) => {
        while (true) {
            if (!set.has(key))
                break;
            await Wait(10);
        }

        set.add(key);

        try {
            return await asyncFunc();
        }
        finally {
            set.delete(key);
        }
    }
}

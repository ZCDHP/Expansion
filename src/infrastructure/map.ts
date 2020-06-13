export type Map<Key extends (number | string), Value> = {
    [key in Key]: Value;
}

export namespace Map {
    export const Empty: <Key extends (number | string), Value>() => Map<Key, Value> = <Key extends (number | string), Value>() => ({} as Map<Key, Value>);

    export const Set: <Key extends (number | string), Value>(key: Key, value: Value) => (map: Map<Key, Value>) => Map<Key, Value> = (key, value) => map => ({
        ...map,
        [key]: value,
    });

    export const Map: <Key extends (number | string), Value>(map: Map<Key, Value>) => <ValueOut>(f: (v: Value) => ValueOut) => Map<Key, ValueOut> =
        <Key extends (number | string), Value>(map: Map<Key, Value>) => <ValueOut>(f: (v: Value) => ValueOut) =>
            Object.keys(map).reduce<Map<Key, ValueOut>>((result, key) => Set(key as any as Key, f(map[key as any as Key]))(result), Empty());

    export const Remove: <Key extends (number | string) > (key: Key) => <Value>(map: Map<Key, Value>) => Map<Key, Value> = key => map => {
        const newMap = { ...map };
        delete newMap[key];
        return newMap;
    };

    export const Iterate: <Key extends (number | string), Value>(map: Map<Key, Value>) => <T>(f: (key: Key, value: Value) => T) => T[] =
        <Key extends (number | string), Value>(map: Map<Key, Value>) => <T>(f: (key: Key, value: Value) => T) =>
            Object.keys(map).map<T>(key => f(key as any as Key, map[key as any as Key]));
}

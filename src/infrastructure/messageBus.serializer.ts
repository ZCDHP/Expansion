import { Id } from "./utils";


export type Serializer<T> = {
    serialize: (v: T) => string,
    deserialize: (s: string) => T
};

export const String: Serializer<string> = {
    serialize: Id,
    deserialize: Id,
}

export const Number: Serializer<number> = {
    serialize: n => n.toString(),
    deserialize: parseInt,
};

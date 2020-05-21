export const __ = Symbol("Default");

export type Case<Tag extends string, Data> = {
    type: Tag,
    data: Data,
};

export const Case = <Tag extends string>(type: Tag) => <Data>() => (data: Data) => ({ type, data } as Case<Tag, Data>);

// Tag1 | Tag2 | ...
// export type Tag<Value extends Case<string, any>> = Value["type"];

// /*
// {
//     Tag1: Case1,
//     Tag2: Case2,
//     ...
// }
// */
// type CaseMap<U extends Case<string, any>> = {
//     [K in Tag<U>]: U extends { type: K } ? U : never
// }

// type FullPattern<U extends Case<string, any>, T> = {
//     [K in Tag<U>]: (value: CaseMap<U>[K]) => T
// }

// type PartialPattern<U extends Case<string, any>, T> =
//     Partial<FullPattern<U, T>> & { [__]: (value: U) => T }

// export const Match: <U extends Case<string, any>, T>(pattern: FullPattern<U, T>) => (value: U) => T = pattern => value =>
//     (pattern as any)[value.type](value)

// export const PartialMatch: <U extends Case<string, any>, T>(pattern: PartialPattern<U, T>) => (value: U) => T = pattern => value =>
//     (pattern as any)[value.type] ?
//         (pattern as any)[value.type](value) :
//         (pattern as any)[__](value);

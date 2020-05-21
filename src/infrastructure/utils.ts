export const Id = <T>(i: T) => i;
export type Id<T> = (i: T) => T;

export const Const = <T>(i: T) => () => i;
export const Void = () => { };


export type Constructor<T> = {
    [key: string]: (v: any) => T
};

export const ConstructorMap: <OriginOut, Constr extends Constructor<OriginOut>, Out>(obj: Constr, mapping: (x: OriginOut) => Out) => {
    [Key in keyof typeof obj]: (v: Parameters<typeof obj[Key]>[0]) => Out
} =
    <OriginOut, Constr extends Constructor<OriginOut>, Out>(obj: Constr, mapping: (x: OriginOut) => Out) =>
        Object.keys(obj)
            .reduce((resultObj, key) => ({
                ...resultObj,
                [key]: ((x: any) => mapping(obj[key](x)))
            }), {}) as any;


export const Never: (_: never) => never = a => a; 

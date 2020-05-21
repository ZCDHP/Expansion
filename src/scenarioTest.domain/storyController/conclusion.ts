export type Conclusion =
    | Pass
    | Fail
export type Pass = { passed: true }
export const Pass = () => ({ passed: true }) as Pass;

export type Fail = { passed: false, reason: any };
export const Fail = (reason: any) => ({ passed: false, reason });

import { Epic } from "./epic";

import { Spec as Connect } from "./commands.ts/connect";
import { Spec as Disconnect } from "./commands.ts/disconnect";

export const Spec = Epic("GConnection")([
    Connect,
    Disconnect,
]);


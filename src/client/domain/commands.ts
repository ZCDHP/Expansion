import * as Domain from "./domain";
import * as ConnectionDomain from "./connection";
import * as LoginDomain from "./login";
import * as MatchFindingDomain from "./matchFinding";

export const Login: () => Domain.Command = () => Domain.Command.Connection(ConnectionDomain.Command.LoginCommand(LoginDomain.Command.Login()));
export const FindMatch: () => Domain.Command = () => Domain.Command.Connection(ConnectionDomain.Command.LoginCommand(LoginDomain.Command.MatchFindingCommand(MatchFindingDomain.Command.Queue())));

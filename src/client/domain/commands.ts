import { Never } from "../../infrastructure/utils";

import * as Domain from "./domain";
import * as ConnectionDomain from "./connection";
import * as LoginDomain from "./login";
import * as MatchFindingDomain from "./matchFinding";

import * as Server from '../../contracts/serverMessage';

const ConnectionCommand: (cmd: ConnectionDomain.Command) => Domain.Command = cmd => Domain.Command.Connection(cmd);
const LoginCommand: (cmd: LoginDomain.Command) => Domain.Command = cmd => ConnectionCommand(ConnectionDomain.Command.LoginCommand(cmd));
const MatchFindCommand: (cmd: MatchFindingDomain.Command) => Domain.Command = cmd => LoginCommand(LoginDomain.Command.MatchFindingCommand(cmd));

export const Login: () => Domain.Command = () => LoginCommand(LoginDomain.Command.Login());
export const FindMatch: () => Domain.Command = () => MatchFindCommand(MatchFindingDomain.Command.Queue());


export const Deserialize: (msg: Server.Message) => Domain.Command = message => {
    switch (message.type) {
        case Server.Message.Tags.Connection: return ConnectionCommand(Deserialization.ConnectionMessage(message.data));
        case Server.Message.Tags.Login: return LoginCommand(Deserialization.LoginMessage(message.data));
        case Server.Message.Tags.MatchFinding: return MatchFindCommand(Deserialization.MatchFindingMessage(message.data));
        default: Never(message);
    }
}

namespace Deserialization {
    export const ConnectionMessage: (msg: Server.ConnectionMessage) => ConnectionDomain.Command = message => {
        switch (message.type) {
            case Server.ConnectionMessage.Tags.Reject: return ConnectionDomain.Command.Rejected(message.data);
            default: Never(message.type);
        }
    }

    export const LoginMessage: (msg: Server.LoginMessage) => LoginDomain.Command = message => {
        switch (message.type) {
            case Server.LoginMessage.Tags.Approve: return LoginDomain.Command.LoginApproved(message.data);
            default: Never(message.type);
        }
    }

    export const MatchFindingMessage: (msg: Server.MatchFindingMessage) => MatchFindingDomain.Command = message => {
        switch (message.type) {
            case Server.MatchFindingMessage.Tags.Queued: return MatchFindingDomain.Command.Queued(message.data);
            case Server.MatchFindingMessage.Tags.MatchFound: return MatchFindingDomain.Command.MatchFound(message.data);
            default: Never(message);
        }
    }
}

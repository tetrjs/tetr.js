import * as Payloads from "../interfaces/Payloads";

export default interface Social {
  message(recipient: string, msg: string): void;
  invite(recipient: string): void;
  presence(presence: Payloads.Presence): void;
}

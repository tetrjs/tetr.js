import User from "../user/User";
import { APIResponse } from "../util/types";

export default class ClientUser {
  constructor({ user: me }: APIResponse, user: User) {
    if (me.role !== "bot")
      throw new Error(
        `Client "${me.username}" is not a bot account. Contact osk (https://osk.sh/) to apply for a bot account.`
      );

    this.user = user;
    this.email = me.email;
    this.privacy = {
      showWon: me.privacy_showwon,
      showPlayed: me.privacy_showplayed,
      showGameTime: me.privacy_showgametime,
      showCountry: me.privacy_showcountry,
      privateMode: me.privacy_privatemode,
      status: {
        shallow: me.privacy_status_shallow,
        deep: me.privacy_status_deep,
        exact: me.privacy_status_exact,
      },
      dm: me.privacy_dm,
      invite: me.privacy_invite,
    };
    this.thanked = me.thanked;
    this.banList = me.banlist;
    this.warnings = me.warnings;
    this.bannedStatus = me.bannedstatus;
    this.supporterExpires = me.supporter_expires;
    this.totalSupported = me.total_supported;
    this.zen = me.zen;
    this.totp = {
      enabled: me.totp.enabled,
      codesRemaining: me.totp.codes_remaining,
    };
  }

  public user: User;
  public email: string;
  public privacy: {
    showWon: boolean;
    showPlayed: boolean;
    showGameTime: boolean;
    showCountry: boolean;
    privateMode: "private" | "public";
    status: {
      shallow: "nobody" | "friends" | "everyone";
      deep: "nobody" | "friends" | "everyone";
      exact: "nobody" | "friends" | "everyone";
    };
    dm: "nobody" | "friends" | "everyone";
    invite: "nobody" | "friends" | "everyone";
  };
  thanked: boolean;
  banList: unknown[];
  warnings: unknown[];
  bannedStatus: string;
  supporterExpires: number;
  totalSupported: number;
  zen: { map: string; level: number; progress: number; score: number };
  totp: { enabled: boolean; codesRemaining: number };
}

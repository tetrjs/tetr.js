import Client from "./client/Client";
import ClientUser from "./client/ClientUser";
import Room from "./room/Room";
import User from "./user/User";
import UserManager from "./user/UserManager";
import { TetraChannel } from "./channel/Channel";
export * as ChannelTypes from "./channel/ChannelTypes";

export { Client, ClientUser, Room, User, UserManager, TetraChannel };

export interface Relationship {
  /** The id of the relationship. */
  _id: string;

  /** The user in the relationship. */
  user: User;

  /** The amount of unread messages. */
  unread: number;
  /** The type of relationship. */
  type: string;
  /** The last updated date. */
  updated: Date;

  /** The presence of the user. `undefined` if not online. */
  presence?: Presence & {
    invitable: boolean;
  };
}

export interface DirectMessage {
  /** Contents of the message. */
  content: string;
  /** Contents of the message after being passed through TETR.IO's profanity filter. */
  content_safe: string;

  /** Whether this is a system message. */
  system: boolean;

  /** The ISO 8601-formatted timestamp of the message. */
  ts: string;

  /** The id of the message. */
  id: string;

  /**
   * The author of the message.
   */
  author?: User;
}

export interface CacheData {
  cache: {
    status: string;
    cached_at: number;
    cached_until: number;
  };
  data: any;
}

export interface Handling {
  arr: number;
  das: number;
  sdf: number;
  safelock: boolean;
  cancel: boolean;
  dcd: number;
}

export interface Context {
  user: User;
  handling: Handling;
  opts: { fulloffset: number; fullinterval: number };
}

export type Presence = {
  status: "online" | "away" | "busy" | "offline";
  detail: Detail;
};

export type Detail =
  | ""
  | "menus"
  | "40l"
  | "blitz"
  | "zen"
  | "custom"
  | "lobby_end:X-QP"
  | "lobby_spec:X_QP"
  | "lobby_ig:X-QP"
  | "lobby:X-QP"
  | "lobby_end:X-PRIV"
  | "lobby_spec:X_PRIV"
  | "lobby_ig:X-PRIV"
  | "lobby:X-PRIV"
  | `lobby_end:${string}`
  | `lobby_spec:${string}`
  | `lobby_ig:${string}`
  | `lobby:${string}`
  | "tl_mm"
  | "tl"
  | "tl_end"
  | "tl_mm_complete";

export type Role = "anon" | "user" | "bot" | "mod" | "admin";

export interface Worker {
  name: string;
  flag: string;
}

export interface Config {
  meta?: {
    name?: string;
    userlimit?: string;
    allowAnonymous?: boolean;
    bgm?: BGM;
    match?: { ft?: number; wb?: number };
  };
  options?: {
    stock?: number;
    bagtype?: Bag;
    spinbonuses?: Spins;
    allow180?: boolean;
    kickset?: Kickset;
    allow_harddrop?: boolean;
    display_next?: boolean;
    display_hold?: boolean;
    nextcount?: number;
    display_shadow?: boolean;
    are?: number;
    lineclear_are?: number;
    room_handling?: boolean;
    room_handling_arr?: number;
    room_handling_das?: number;
    room_handling_sdf?: number;
    g?: number;
    gincrease?: number;
    gmargin?: number;
    garbagemultiplier?: number;
    garbagemargin?: number;
    garbageincrease?: number;
    locktime?: number;
    garbagespeed?: number;
    garbagecap?: number;
    garbagecapincrease?: number;
    garbagecapmax?: number;
    manual_allowed?: boolean;
    b2bchaining?: boolean;
    clutch?: boolean;
  };
}

export type BGM =
  | "RANDOM"
  | "RANDOMcalm"
  | "RANDOMbattle"
  | "kutchu-toshi"
  | "shikiichi-made-mousujoshi"
  | "touhoudaiensei"
  | "asayake-no-taiyou"
  | "in-sorrow-and-pains"
  | "honemi-ni-shimiiru-karasukaze"
  | "inorimichite"
  | "kaze-no-sanpomichi"
  | "muscat-to-shiroi-osara"
  | "natsuzora-to-syukudai"
  | "success-story"
  | "kaiser-hige-na-neko"
  | "akindo"
  | "philosophy"
  | "yoru-no-niji"
  | "shiroi-hyoutan"
  | "smoke"
  | "aijin-sanka"
  | "akai-tsuchi-wo-funde"
  | "burari-tokyo"
  | "back-water"
  | "burning-heart"
  | "hayate-no-sei"
  | "ice-eyes"
  | "ima-koso"
  | "prism"
  | "risky-area"
  | "fuyu-no-jinkoueisei"
  | "hatsuyuki"
  | "kansen-gairo"
  | "chiheisen-wo-koete"
  | "moyase-toushi-yobisamase-tamashii"
  | "naraku-heno-abyssmaze"
  | "samurai-sword"
  | "super-machine-soul"
  | "uchuu-5239"
  | "ultra-super-heros"
  | "21seiki-no-hitobito"
  | "haru-wo-machinagara"
  | "go-go-go-summer"
  | "sasurai-no-hitoritabi"
  | "wakana"
  | "zange-no-ma"
  | "subarashii-nichijou"
  | "asphalt"
  | "madobe-no-hidamari"
  | "minamoto"
  | "sora-no-sakura"
  | "suiu"
  | "freshherb-wreath-wo-genkan-ni";

export type Bag = "7-bag" | "14-bag" | "classic" | "pairs" | "total mayhem";

export type Spins = "T-spins" | "all" | "stupid" | "none";

export type Kickset = "SRS+" | "SRS" | "SRS-X" | "TETRA-X" | "NRS" | "ARS" | "ASC" | "none";

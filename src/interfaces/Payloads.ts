/*
MIT License
Copyright (c) 2021 Jakob de Guzman
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export interface Authorize {
  id: number;
  command: "authorize";
  data: {
    token: string;
    handling: {
      arr: string;
      das: string;
      sdf: string;
      safelock: boolean;
    };
    signature: {
      mode?: "production";
      version?: string;
      countdown?: false;
      commit: { id: string; time?: number };
      serverCycle?: string;
      build?: { id?: string; time?: number };
    };
    i?: string;
  };
}

export interface Chat {
  id: number;
  command: "chat";
  data: string;
}

export const Die = {
  command: "die",
};

export interface Hello {
  command: "hello";
  packets: Buffer[]; // tbd
}

export interface JoinRoom {
  id: number;
  command: "joinroom";
  data: string;
}

export interface LeaveRoom {
  id: number;
  command: "leaveroom";
  data: boolean;
}

export interface New {
  command: "new";
}

// Deprecated
export interface Ping {
  command: "ping";
}

export interface Resume {
  command: "resume";
  socketid: string;
  resumeid: string;
}

export interface SocialDM {
  command: "social.dm";
  data: { recipient: string; msg: string };
}

export interface SocialInvite {
  command: "social.invite";
  data: string;
}

export interface SocialNotificationsACK {
  command: "social.notifications.ack";
  data?: string;
}

export interface SocialPresence {
  command: "social.presence";
  data: Presence;
}

export interface Presence {
  status: "online" | "away" | "busy" | "offline";
  detail:
    | ""
    | "menus"
    | "40l"
    | "blitz"
    | "zen"
    | "custom"
    | "lobby_end:X-QP"
    | "lobby_spec:X-QP"
    | "lobby_ig:X-QP"
    | "lobby:X-QP"
    | "lobby_end:X-PRIV"
    | "lobby_spec:X-PRIV"
    | "lobby_ig:X-PRIV"
    | "lobby:X-PRIV"
    | "tl_mn"
    | "tl"
    | "tl_end"
    | "tl_mn_complete"
    | string;
  user?: string;
  invitable?: boolean;
}

export interface SocialRelationshipsACK {
  command: "social.relationships.ack";
  data: string;
}

export interface SwitchBracket {
  id: number;
  command: "switchbracket";
  data: "player" | "spectator";
}

export interface SwitchBracketHost {
  id: number;
  command: "switchbrackethost";
  data: { uid: string; bracket: "player" | "spectator" };
}

export interface UpdateConfig {
  id: number;
  command: "updateconfig";
  data: { index: string; value: any }[];
}

export interface Payload {
  type: number;
  id?: number;
  lengths?: number;
  data: any;
}

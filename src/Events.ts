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

import { User } from ".";
import { Handling } from "./index";

export interface EventMessage {
  content: string;
  user: User;
  systemMessage: boolean;
}

export interface EventDM {
  content: string;
  user?: User;
  system: boolean;
  timestamp: string;
}

export interface EventInvite {
  room: string;
  author: User;
}

export interface RoomEndPlayer {
  user: User;
  wins: number;
  inputs: number;
  piecesPlaced: number;
}

export interface EventReadyMulti {
  options: any;
  contexts: {
    listenID: string;
    user: { _id: string; username: string };
    handling: Handling;
    opts: { fulloffset: number; fullinterval: number };
    alive: boolean;
  }[];
  first: boolean;
  gameID: string;
  started: boolean;
}

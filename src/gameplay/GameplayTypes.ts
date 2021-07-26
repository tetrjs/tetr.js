export type Key = "hardDrop" | "softDrop" | "moveLeft" | "moveRight" | "rotateCW" | "rotateCCW";

export interface KeyEvent {
  frame: number;
  type: "keydown" | "keyup";
  data: {
    key: Key;
    subframe: number;
  };
}

export interface BaseReplay {
  listenID: string;
  provisioned: number;
}

// Input

export interface InGameEvent {
  frame: number;
  type: "ige";
  data: {
    id: number;
    frame: number;
    type: "ige";
    data: {
      type: "attack";
      lines: number;
      column: number;
      sender: string;
      sent_frame: number;
    };
  };
}

export interface RecieveReplay extends BaseReplay {
  frames: (KeyEvent | InGameEvent)[];
}

// Output

export interface StartEvent {
  frame: number;
  type: "start";
  data: Record<string, never>;
}

export interface Targets {
  frame: number;
  type: "targets";
  data: {
    id: "diyusi";
    frame: number;
    type: "targets";
    data: string[];
  };
}

export interface SendReplay extends BaseReplay {
  frames: (KeyEvent | StartEvent | Targets | InGameEvent)[];
}

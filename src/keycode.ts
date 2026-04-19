/**
 * 键盘按键枚举（使用 KeyboardEvent.key）
 * @deprecated keyCode 已废弃，改用 key 属性
 */
export const MoveKey = {
  W: 'w',
  S: 's',
  A: 'a',
  D: 'd',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
} as const;

export const FuncKey = {
  Q: 'q',
  E: 'e',
  F: 'f',
  Delete: 'Delete',
  Backspace: 'Backspace',
} as const;

/** @deprecated 使用 MoveKey 替代 */
export const MoveKeyCode = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
};

/** @deprecated 使用 FuncKey 替代 */
export const FuncKeyCode = {
  Q: 81,
  E: 69,
  F: 70,
  DELETE: 8,
};

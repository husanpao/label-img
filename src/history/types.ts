import { Shape } from '../Shape';

/**
 * 命令接口 - 命令模式基础
 */
export interface ICommand {
  name: string;
  execute(): void;
  undo(): void;
  redo(): void;
}

/**
 * 历史记录管理器接口
 */
export interface IHistoryManager {
  execute(command: ICommand): void;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
  getHistory(): ICommand[];
}

/**
 * 历史状态快照
 */
export interface IHistoryState {
  shapes: Shape[];
  timestamp: number;
}

import { ICommand, IHistoryManager } from './types';

/**
 * 历史记录管理器
 * 使用命令模式实现撤销/重做功能
 */
export class HistoryManager implements IHistoryManager {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  /**
   * 执行命令并记录到历史
   */
  execute(command: ICommand): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // 新命令执行后清空重做栈

    // 限制历史记录大小
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
  }

  /**
   * 撤销上一步操作
   * @returns 是否成功撤销
   */
  undo(): boolean {
    const command = this.undoStack.pop();
    if (!command) return false;

    command.undo();
    this.redoStack.push(command);
    return true;
  }

  /**
   * 重做上一步撤销的操作
   * @returns 是否成功重做
   */
  redo(): boolean {
    const command = this.redoStack.pop();
    if (!command) return false;

    command.redo();
    this.undoStack.push(command);
    return true;
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * 获取历史记录
   */
  getHistory(): ICommand[] {
    return [...this.undoStack];
  }
}

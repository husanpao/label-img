import { Shape } from '../../Shape';
import { ICommand } from '../types';

/**
 * 删除图形命令
 */
export class RemoveShapeCommand implements ICommand {
  name = 'RemoveShape';
  private removedIndex: number = -1;

  constructor(
    private shapeList: Shape[],
    private shape: Shape,
    private onExecute?: () => void,
    private onUndo?: () => void
  ) {}

  execute(): void {
    this.removedIndex = this.shapeList.indexOf(this.shape);
    if (this.removedIndex > -1) {
      this.shapeList.splice(this.removedIndex, 1);
    }
    this.onExecute?.();
  }

  undo(): void {
    if (this.removedIndex > -1) {
      this.shapeList.splice(this.removedIndex, 0, this.shape);
    }
    this.onUndo?.();
  }

  redo(): void {
    this.execute();
  }
}

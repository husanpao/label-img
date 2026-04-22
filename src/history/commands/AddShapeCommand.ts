import { Shape } from '../../Shape';
import { ICommand } from '../types';

/**
 * 添加图形命令
 */
export class AddShapeCommand implements ICommand {
  name = 'AddShape';

  constructor(
    private shapeList: Shape[],
    private shape: Shape,
    private onExecute?: () => void,
    private onUndo?: () => void
  ) {}

  execute(): void {
    this.shapeList.push(this.shape);
    this.onExecute?.();
  }

  undo(): void {
    const index = this.shapeList.indexOf(this.shape);
    if (index > -1) {
      this.shapeList.splice(index, 1);
    }
    this.onUndo?.();
  }

  redo(): void {
    this.execute();
  }
}

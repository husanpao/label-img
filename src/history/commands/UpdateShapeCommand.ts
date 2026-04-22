import { Shape } from '../../Shape';
import { Points } from '../../structure';
import { ICommand } from '../types';

/**
 * 更新图形命令
 */
export class UpdateShapeCommand implements ICommand {
  name = 'UpdateShape';
  private oldPositions: Points = [];

  constructor(
    private shape: Shape,
    private newPositions: Points,
    private onExecute?: () => void,
    private onUndo?: () => void
  ) {}

  execute(): void {
    this.oldPositions = [...this.shape.getPositions()];
    this.shape.updatePositions([...this.newPositions]);
    this.onExecute?.();
  }

  undo(): void {
    this.shape.updatePositions([...this.oldPositions]);
    this.onUndo?.();
  }

  redo(): void {
    this.shape.updatePositions([...this.newPositions]);
    this.onExecute?.();
  }
}

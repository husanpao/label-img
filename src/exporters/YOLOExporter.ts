import { Shape } from '../Shape';
import { Points } from '../structure';
import { IExporter, IImageInfo } from './types';

/**
 * YOLO 格式导出器
 * 每行: <class_id> <x_center> <y_center> <width> <height>
 * 坐标归一化到 0-1
 */
export class YOLOExporter implements IExporter {
  name = 'YOLO Exporter';
  format = 'yolo';
  extension = '.txt';

  export(shapes: Shape[], imageInfo: IImageInfo): string {
    const lines: string[] = [];

    shapes.forEach(shape => {
      if (!shape.visible || shape.status === 'disabled') return;

      const positions = shape.getPositions();
      if (positions.length === 0) return;

      // 获取类别 ID（从 registerID 解析，如果没有则默认为 0）
      const classId = this.parseClassId(shape.registerID);

      // 计算 bbox
      const bbox = this.calculateBBox(positions);
      const { xCenter, yCenter, width, height } = this.normalizeBBox(
        bbox,
        imageInfo.width,
        imageInfo.height
      );

      // YOLO 格式: class_id x_center y_center width height
      lines.push(
        `${classId} ${xCenter.toFixed(6)} ${yCenter.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
      );
    });

    return lines.join('\n');
  }

  private parseClassId(registerId: string): number {
    // 尝试从 registerId 解析数字，例如 "person_0" -> 0
    const match = registerId.match(/_(\d+)$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    // 默认返回 0
    return 0;
  }

  private calculateBBox(positions: Points): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    positions.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    return { minX, minY, maxX, maxY };
  }

  private normalizeBBox(
    bbox: { minX: number; minY: number; maxX: number; maxY: number },
    imgWidth: number,
    imgHeight: number
  ): { xCenter: number; yCenter: number; width: number; height: number } {
    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;
    const xCenter = bbox.minX + width / 2;
    const yCenter = bbox.minY + height / 2;

    return {
      xCenter: xCenter / imgWidth,
      yCenter: yCenter / imgHeight,
      width: width / imgWidth,
      height: height / imgHeight,
    };
  }
}

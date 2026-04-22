import { Shape } from '../Shape';
import { Points } from '../structure';
import { IExporter, IImageInfo, IAnnotation } from './types';

/**
 * COCO 格式导出器
 * 标准实例分割/目标检测格式
 */
export class COCOExporter implements IExporter {
  name = 'COCO Exporter';
  format = 'coco';
  extension = '.json';

  export(shapes: Shape[], imageInfo: IImageInfo): string {
    const annotations: IAnnotation[] = [];

    shapes.forEach((shape, idx) => {
      if (!shape.visible || shape.status === 'disabled') return;

      const positions = shape.getPositions();
      if (positions.length === 0) return;

      const bbox = this.calculateBBox(positions);
      const annotation: IAnnotation = {
        id: idx + 1,
        classId: this.parseClassId(shape.registerID),
        className: shape.registerID,
        type: shape.type === 'Rect' ? 'rect' : 'polygon',
        bbox: [bbox.minX, bbox.minY, bbox.maxX - bbox.minX, bbox.maxY - bbox.minY],
        points: positions.map(([x, y]) => [x, y] as number[]),
        area: this.calculateArea(positions),
        attributes: shape.data ? Object.fromEntries(Object.entries(shape.data)) : undefined,
      };

      annotations.push(annotation);
    });

    const cocoDataset = {
      version: '1.0',
      image: {
        width: imageInfo.width,
        height: imageInfo.height,
        url: imageInfo.url || '',
        filename: imageInfo.filename || '',
      },
      annotations,
    };

    return JSON.stringify(cocoDataset, null, 2);
  }

  private parseClassId(registerId: string): number {
    const match = registerId.match(/_(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
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

  private calculateArea(positions: Points): number {
    // Shoelace formula for polygon area
    const n = positions.length;
    if (n < 3) return 0;

    let area = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += positions[i][0] * positions[j][1];
      area -= positions[j][0] * positions[i][1];
    }

    return Math.abs(area / 2);
  }
}

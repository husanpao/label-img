import { Shape } from '../Shape';

export interface IImageInfo {
  width: number;
  height: number;
  url?: string;
  filename?: string;
}

export interface IAnnotationData {
  version: string;
  image: IImageInfo;
  annotations: IAnnotation[];
}

export interface IAnnotation {
  id: string | number;
  classId: number;
  className: string;
  type: 'rect' | 'polygon';
  bbox?: [number, number, number, number]; // [x, y, width, height]
  points: number[][]; // [[x1, y1], [x2, y2], ...]
  area?: number;
  attributes?: Record<string, unknown>;
}

export interface IExporter {
  name: string;
  format: string;
  extension: string;
  export(shapes: Shape[], imageInfo: IImageInfo): string;
}

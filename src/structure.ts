/** 通用映射类型 */
export type Map<T> = Record<string, T>;

/** 坐标点 [x, y] */
export type Point = readonly [number, number];

/** 坐标点数组 */
export type Points = Point[];

/** 颜色类型 */
export type TColor = CSSStyleDeclaration['color'];

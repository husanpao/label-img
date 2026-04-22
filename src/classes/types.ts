/**
 * 类别配置
 */
export interface IClassConfig {
  id: number;
  name: string;
  color: string;
  shortcut?: string; // 快捷键，如 '1', '2', 'a' 等
  description?: string;
}

/**
 * 类别管理器接口
 */
export interface IClassManager {
  getClasses(): IClassConfig[];
  getClassById(id: number): IClassConfig | undefined;
  getClassByName(name: string): IClassConfig | undefined;
  addClass(config: Omit<IClassConfig, 'id'>): IClassConfig;
  removeClass(id: number): boolean;
  updateClass(id: number, config: Partial<Omit<IClassConfig, 'id'>>): boolean;
  setClasses(classes: IClassConfig[]): void;
  getNextClassId(): number;
}

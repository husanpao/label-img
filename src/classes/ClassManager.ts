import { IClassConfig, IClassManager } from './types';

/**
 * 类别管理器
 * 管理标注类别的配置（ID、名称、颜色、快捷键）
 */
export class ClassManager implements IClassManager {
  private classes: Map<number, IClassConfig> = new Map();
  private nextId: number = 0;

  constructor(classes?: IClassConfig[]) {
    if (classes && classes.length > 0) {
      classes.forEach(cls => {
        this.classes.set(cls.id, cls);
        this.nextId = Math.max(this.nextId, cls.id + 1);
      });
    }
  }

  /**
   * 获取所有类别
   */
  getClasses(): IClassConfig[] {
    return Array.from(this.classes.values());
  }

  /**
   * 根据 ID 获取类别
   */
  getClassById(id: number): IClassConfig | undefined {
    return this.classes.get(id);
  }

  /**
   * 根据名称获取类别
   */
  getClassByName(name: string): IClassConfig | undefined {
    return Array.from(this.classes.values()).find(cls => cls.name === name);
  }

  /**
   * 添加类别
   */
  addClass(config: Omit<IClassConfig, 'id'>): IClassConfig {
    const id = this.nextId++;
    const newClass: IClassConfig = { ...config, id };
    this.classes.set(id, newClass);
    return newClass;
  }

  /**
   * 删除类别
   */
  removeClass(id: number): boolean {
    return this.classes.delete(id);
  }

  /**
   * 更新类别
   */
  updateClass(id: number, config: Partial<Omit<IClassConfig, 'id'>>): boolean {
    const cls = this.classes.get(id);
    if (!cls) return false;

    const updated = { ...cls, ...config };
    this.classes.set(id, updated);
    return true;
  }

  /**
   * 设置所有类别（会清空现有类别）
   */
  setClasses(classes: IClassConfig[]): void {
    this.classes.clear();
    this.nextId = 0;
    classes.forEach(cls => {
      this.classes.set(cls.id, cls);
      this.nextId = Math.max(this.nextId, cls.id + 1);
    });
  }

  /**
   * 获取下一个可用的类别 ID
   */
  getNextClassId(): number {
    return this.nextId;
  }

  /**
   * 根据快捷键获取类别
   */
  getClassByShortcut(shortcut: string): IClassConfig | undefined {
    return Array.from(this.classes.values()).find(cls => cls.shortcut === shortcut);
  }

  /**
   * 导出为数组
   */
  toJSON(): IClassConfig[] {
    return this.getClasses();
  }

  /**
   * 从数组导入
   */
  fromJSON(classes: IClassConfig[]): void {
    this.setClasses(classes);
  }
}

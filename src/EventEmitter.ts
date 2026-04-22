import { Shape } from './Shape';

type ShapeEvent = (shape: Shape) => void; // 特定 shape 事件

/** 事件回调函数类型 */
export type EventCallback = (data: unknown) => void;

// 内置事件
interface EmitEventMap {
  select: ShapeEvent; // shape 被选中
  create: ShapeEvent; // shape 创建
  delete: ShapeEvent; // shape 删除
  update: EventCallback; // 更新
  labelType: EventCallback; // 标注类型修改
  init: EventCallback; // 初始化
  imageReady: EventCallback; // 图片加载成功
  undo: EventCallback; // 撤销
  redo: EventCallback; // 重做

  shapeRegister: EventCallback; // 图形注册

  beforeRender: EventCallback; // 渲染之前
  afterRender: EventCallback; // 渲染之后

  beforeClear: EventCallback; // 画布清除之前
  afterClear: EventCallback; // 画布清除之后

  beforeRenderBackground: EventCallback; // 渲染背景之前
  afterRenderBackground: EventCallback; // 渲染背景之后

  beforeRenderImage: EventCallback; // 渲染图片之前
  afterRenderImage: EventCallback; // 渲染图片之后

  beforeRenderShape: EventCallback; // 渲染图形之前
  afterRenderShape: EventCallback; // 渲染图形之后

  beforeRenderDrawing: EventCallback; // 渲染当前绘图之前
  afterRenderDrawing: EventCallback; // 渲染当前绘图之后
}
type EmitEventKey = keyof EmitEventMap;

type IMethodTypes = 'on' | 'once';
type IEvent<K extends keyof EmitEventMap> = {
  type: IMethodTypes;
  fn: EmitEventMap[K];
};
type IEventMap = {
  [K in keyof EmitEventMap]: IEvent<K>[];
};
/**
 * 事件监听器
 */
export class EventEmitter {
  private getEvents: (type: EmitEventKey) => IEvent<EmitEventKey>[];
  private createEvent: (type: EmitEventKey, event: IEvent<EmitEventKey>) => void;
  constructor() {
    const eventMap = {} as IEventMap;
    this.getEvents = type => {
      return eventMap[type] || [];
    };
    this.createEvent = (type, event) => {
      if (!eventMap[type]) {
        eventMap[type] = [];
      }
      (eventMap[type] as IEvent<EmitEventKey>[]).push(event);
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(type: EmitEventKey, data?: any) {
    const fns = this.getEvents(type);
    if (!fns.length) return;
    fns.forEach(({ fn, type: t }, idx) => {
      fn(data);
      if (t === 'once') {
        fns.splice(idx, 1);
      }
    });
  }
  on<K extends keyof EmitEventMap>(type: K, cb: EmitEventMap[K]) {
    this.createEvent(type, {
      fn: cb,
      type: 'on',
    });
    return () => {
      const events = this.getEvents(type);
      const idx = events.findIndex(({ fn }) => fn === cb);
      if (idx > -1) {
        events.splice(idx, 1);
      }
    };
  }
  once<K extends keyof EmitEventMap>(type: K, cb: EmitEventMap[K]) {
    this.createEvent(type, {
      fn: cb,
      type: 'once',
    });
    return () => {
      const events = this.getEvents(type);
      const idx = events.findIndex(({ fn }) => fn === cb);
      if (idx > -1) {
        events.splice(idx, 1);
      }
    };
  }

  /**
   * 移除所有指定类型的监听器
   * @param type 事件类型
   */
  offAll<K extends keyof EmitEventMap>(type: K): void {
    const events = this.getEvents(type);
    events.length = 0;
  }

  /**
   * 获取指定事件的监听器数量
   * @param type 事件类型
   * @returns 监听器数量
   */
  listenerCount<K extends keyof EmitEventMap>(type: K): number {
    return this.getEvents(type).length;
  }

  /**
   * 检查是否有指定事件的监听器
   * @param type 事件类型
   * @returns 是否有监听器
   */
  hasListeners<K extends keyof EmitEventMap>(type: K): boolean {
    return this.listenerCount(type) > 0;
  }
}

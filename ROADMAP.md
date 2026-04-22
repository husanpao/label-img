# LabelImg - 通用图片标注组件

## 项目定位

**框架无关、可扩展、标准化的图片标注引擎**

- 纯 TypeScript 实现，零框架依赖
- 插件化架构，支持自定义功能扩展
- 标准化数据格式，无缝对接主流 AI 框架
- 可作为底层引擎集成到任意前端框架

---

## 一、核心架构设计

### 1. 分层架构

```
┌─────────────────────────────────────────┐
│           Adapter Layer                 │  ← 框架适配层 (React/Vue/Angular)
│    (label-img-react / label-img-vue)    │
├─────────────────────────────────────────┤
│           Core Engine                   │  ← 核心引擎 (本仓库)
│  (Event System + Render Engine + IO)    │
├─────────────────────────────────────────┤
│           Plugin System                 │  ← 插件系统
│  (Shapes + Exporters + AI Assist)       │
├─────────────────────────────────────────┤
│           Extension API                 │  ← 扩展接口
│  (Custom Shape + Custom Exporter)       │
└─────────────────────────────────────────┘
```

### 2. 核心原则

| 原则     | 说明                                 |
| -------- | ------------------------------------ |
| 框架无关 | 不依赖 React/Vue/Angular，纯 TS 实现 |
| 可扩展   | 插件化架构，支持自定义图形、导出器   |
| 可配置   | 通过配置对象定义行为，而非继承       |
| 标准化   | 支持业界标准格式 (COCO/YOLO/VOC)     |
| 类型安全 | 完整的 TypeScript 类型定义           |

---

## 二、核心功能模块

### 1. 图形系统 (Shape System)

| 功能               | 优先级 | 状态 | 说明             |
| ------------------ | ------ | ---- | ---------------- |
| 矩形 (Rect)        | P0     | ✅   | 目标检测基础     |
| 多边形 (Polygon)   | P0     | ✅   | 实例分割         |
| 圆形 (Circle)      | P1     | ⬜   | 特殊检测场景     |
| 椭圆 (Ellipse)     | P2     | ⬜   | 旋转目标检测     |
| 线条 (Line)        | P2     | ⬜   | 车道线/骨架      |
| 关键点 (Keypoint)  | P1     | ⬜   | 姿态估计         |
| **自定义图形扩展** | P1     | ⬜   | 插件化注册新图形 |

### 2. 类别系统 (Label System)

| 功能                     | 优先级 | 状态 | 说明               |
| ------------------------ | ------ | ---- | ------------------ |
| 类别定义 (ID/Name/Color) | P0     | ⬜   | 标准化类别配置     |
| 层级类别                 | P1     | ⬜   | COCO supercategory |
| 类别属性                 | P2     | ⬜   | occluded/truncated |
| 类别验证                 | P1     | ⬜   | 重复/空值检查      |
| **动态类别加载**         | P1     | ⬜   | 从配置文件加载     |

### 3. 数据 IO 系统 (Import/Export)

| 格式                 | 优先级 | 状态 | 说明                   |
| -------------------- | ------ | ---- | ---------------------- |
| **YOLO** (txt)       | P0     | ⬜   | 目标检测主流           |
| **COCO** (json)      | P0     | ⬜   | 实例分割标准           |
| **Pascal VOC** (xml) | P1     | ⬜   | 经典检测格式           |
| **LabelMe** (json)   | P2     | ⬜   | 分割标注               |
| **自定义格式**       | P1     | ⬜   | 通过 Exporter 插件扩展 |
| 格式互转             | P2     | ⬜   | YOLO ↔ COCO ↔ VOC      |

### 4. 状态管理 (State Management)

| 功能                 | 优先级 | 状态 | 说明           |
| -------------------- | ------ | ---- | -------------- |
| 图形状态 (CRUD)      | P0     | ✅   | 增删改查       |
| 历史记录 (Undo/Redo) | P0     | ⬜   | 命令模式实现   |
| 状态序列化           | P0     | ⬜   | JSON 导入/导出 |
| 状态验证             | P1     | ⬜   | 数据完整性检查 |
| **状态订阅**         | P1     | ⬜   | 监听变化事件   |

---

## 三、插件系统 (Plugin System)

### 1. 图形插件 (Shape Plugin)

```typescript
interface IShapePlugin {
  name: string;
  type: string;
  // 渲染方法
  render(ctx: CanvasRenderingContext2D, shape: Shape): void;
  // 碰撞检测
  hitTest(point: Point, shape: Shape): boolean;
  // 序列化/反序列化
  serialize(shape: Shape): unknown;
  deserialize(data: unknown): Shape;
}

// 注册自定义图形
labelImg.useShapePlugin(MyCustomShapePlugin);
```

### 2. 导出器插件 (Exporter Plugin)

```typescript
interface IExporterPlugin {
  name: string;
  format: string;
  extension: string;
  // 导出方法
  export(shapes: Shape[], imageInfo: ImageInfo): string | Blob;
  // 导入方法 (可选)
  import?(data: string): Shape[];
}

// 注册自定义导出器
labelImg.useExporterPlugin(MyExporterPlugin);
```

### 3. AI 辅助插件 (AI Assist Plugin)

```typescript
interface IAIAssistPlugin {
  name: string;
  // 预标注
  preAnnotate(image: ImageSource): Promise<Shape[]>;
  // 自动分割
  autoSegment?(point: Point, image: ImageSource): Promise<Points>;
}
```

---

## 四、配置系统 (Configuration)

### 1. 初始化配置

```typescript
interface ILabelImgConfig {
  // 画布配置
  canvas: {
    width: number;
    height: number;
    bgColor: string;
  };

  // 交互配置
  interaction: {
    zoomEnabled: boolean;
    panEnabled: boolean;
    minZoom: number;
    maxZoom: number;
    showGrid: boolean;
    gridSize: number;
  };

  // 标注配置
  annotation: {
    showLabel: boolean;
    labelFontSize: number;
    showConfidence: boolean;
    defaultShapeStyle: IShapeStyle;
  };

  // 快捷键配置
  shortcuts: Record<string, string>;

  // 插件配置
  plugins: IPlugin[];
}
```

### 2. 类别配置

```typescript
interface ILabelClassConfig {
  id: number;
  name: string;
  color: string;
  supercategory?: string;
  attributes?: IAttributeConfig[];
}

// 从配置文件加载
labelImg.loadClasses('/path/to/classes.json');
```

---

## 五、API 设计

### 1. 核心 API

```typescript
class LabelImg {
  // 生命周期
  constructor(container: HTMLElement, config?: ILabelImgConfig);
  destroy(): void;

  // 图片操作
  loadImage(source: string | File): Promise<void>;
  clearImage(): void;

  // 标注操作
  startAnnotate(type: string, classId: number): void;
  stopAnnotate(): void;

  // 图形操作
  addShape(shape: Shape): void;
  removeShape(id: string): void;
  updateShape(id: string, updates: Partial<Shape>): void;
  getShape(id: string): Shape | null;
  getAllShapes(): Shape[];

  // 选择操作
  selectShape(id: string): void;
  deselectShape(): void;
  getSelectedShape(): Shape | null;

  // 历史操作
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  // 导入导出
  export(format: string): string | Blob;
  import(data: string, format: string): void;

  // 序列化
  serialize(): string;
  deserialize(data: string): void;

  // 事件订阅
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;

  // 插件
  use(plugin: IPlugin): void;
}
```

### 2. 事件系统

```typescript
type LabelImgEvents = {
  // 图片事件
  'image:load': { image: HTMLImageElement };
  'image:clear': void;

  // 标注事件
  'annotation:start': { type: string; classId: number };
  'annotation:complete': { shape: Shape };
  'annotation:cancel': void;

  // 图形事件
  'shape:create': { shape: Shape };
  'shape:delete': { shape: Shape };
  'shape:update': { shape: Shape; changes: unknown };
  'shape:select': { shape: Shape };
  'shape:deselect': void;

  // 历史事件
  'history:undo': { state: IState };
  'history:redo': { state: IState };

  // 渲染事件
  'render:before': void;
  'render:after': void;
};
```

---

## 六、框架适配层

### 1. React Adapter

```typescript
// label-img-react
import { LabelImg } from 'label-img';
import { useLabelImg } from 'label-img-react';

function App() {
  const { containerRef, labelImg } = useLabelImg({
    config: { ... },
    onShapeCreate: (shape) => console.log(shape),
  });

  return <div ref={containerRef} />;
}
```

### 2. Vue Adapter

```typescript
// label-img-vue
import { useLabelImg } from 'label-img-vue';

export default {
  setup() {
    const { containerRef, labelImg } = useLabelImg({
      config: { ... },
    });

    return { containerRef };
  }
};
```

---

## 七、开发计划

### Phase 1: 核心引擎 (P0)

- [ ] 重构为插件化架构
- [ ] 实现命令模式 (Undo/Redo)
- [ ] 完善类型定义
- [ ] 标准化事件系统

### Phase 2: 数据 IO (P0)

- [ ] YOLO 格式导出器
- [ ] COCO 格式导出器
- [ ] 状态序列化/反序列化
- [ ] 类别配置系统

### Phase 3: 扩展功能 (P1)

- [ ] 圆形/关键点图形
- [ ] AI 辅助插件接口
- [ ] 自定义图形插件示例
- [ ] 自定义导出器示例

### Phase 4: 生态建设 (P2)

- [ ] React Adapter
- [ ] Vue Adapter
- [ ] 文档站点
- [ ] 在线示例

---

## 八、目录结构

```
label-img/
├── packages/
│   ├── core/              # 核心引擎
│   ├── react/             # React Adapter
│   ├── vue/               # Vue Adapter
│   └── plugins/           # 官方插件
│       ├── exporter-yolo/
│       ├── exporter-coco/
│       └── shape-circle/
├── examples/              # 示例项目
│   ├── react-basic/
│   ├── vue-basic/
│   └── vanilla-js/
├── docs/                  # 文档
└── tests/                 # 测试
```

---

## 优先级说明

- **P0 (Critical)**: 核心功能，必须实现
- **P1 (High)**: 重要功能，建议尽快实现
- **P2 (Medium)**: 增强功能，有时间再实现

## 状态说明

- ✅ 已完成
- 🔄 进行中
- ⬜ 未开始

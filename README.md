# 图片标注工具

image annotation tool with javascript

> 本工具专注图形标注，不局限某种方式与格式，只输出关键点位信息，不与业务逻辑耦合，并提供方法自定义展示方式与实体属性填写的实现（持续开发当中，文档更新可能滞后，请使用固定版本）

### 示例

[demo for react](https://hold-baby.github.io/label-img/)

### 安装

```
npm install label-img
```

or

```html
<script src="./labelImg.js"></script>
```

### 使用

```javascript
/**
 * 生成实例
 * @element   挂载节点
 * @options   配置 非必填
 */
const labeler = new LabelImg(element, {
  width: 800,
  height: 600,
  bgColor: `#000`, // 背景色
  imagePlacement: 'default', // default | center
});
// 注册图形
labeler.register('polygon', {
  type: 'Polygon',
  tag: '多边形',
});
// 加载图片
labeler.load(url);
// 选择标注多边形
labeler.label('polygon');
```

### 图形

```js
const { Shape } from "label-img"
// or
const Shape = LabelImg.Shape

// IShapeOptions
const shapeOptions = {
  id, // 图形唯一 id 可自动生成
  type, // 图形类型 必填 Polygon | Rect
  name, // 图形名称
  positions, // 坐标集合 ex: [[0, 0], [100, 100]]
  data, // 自定义数据 可用于存储实体属性等内容
  tag, // 展示在图形上的说明标签
  showTag, // 是否展示标签
  closed, // 是否闭合
  visible, // 是否可见
  active, // 是否被选中
  disabled, // 是否禁用
  /**
   * { normal, active, disabled }
   * {
   *  normal: {
   *    dotColor: "red", // 坐标点颜色
   *    dotRadius: 3, // 坐标点大小
   *    lineColor: "#c30", // 连线颜色
   *    lineWidth: 2, // 连线宽度
   *    fillColor: "pink", // 填充色
   *  }
   * }
   */
  style, // 图形样式
}
const shape = new Shape(shapeOptions)
// or
/**
 * @id      图形注册 ID
 * @options 配置  Partial<Omit<IShapeOptions, "type">>
 */
const shape = LabelImg.createShape(id, options)
// 添加到画布中
labeler.addShape(shape)
```

### 注册图形

```js
/**
 * @id        图形 ID   Polygon: 多边形，Rect: 矩形
 * @options   图形配置  Omit<IShapeCfg, "registerID">
 */
labeler.register(id, options);
```

### 加载图片

```js
/**
 * @param   url || file
 * return   Promise
 */
labeler.load(param);
```

### labeler API

所有 `set*` 方法均支持链式调用，返回 `this`。

```js
// 图形注册与标注
isRegister(id)                    // 判断是否注册
label(id, continuity)             // 选择标注类型
labelOff()                        // 取消当前标注
getLabels()                       // 获取已注册的图形列表

// 图形操作
addShape(shape, index)            // 添加图形（支持链式调用）
addShapes(shapes)                 // 批量添加图形（支持链式调用）
remove(shape | id)                // 删除图形（支持链式调用）
removeShapes(shapes | ids)        // 批量删除图形（支持链式调用）
setActive(shape)                  // 选中某一图形（支持链式调用）
orderShape(shape | id, flag)      // 调整图形层级（支持链式调用）

// 批量查询与更新
getShapeList()                    // 获取图形列表
getShapeByName(name)              // 按名称筛选图形
filterShapes(predicate)           // 自定义条件筛选图形
updateShapes(predicate, updates)  // 按条件批量更新图形样式/属性（支持链式调用）

// 带撤销支持的图形操作
addShapeWithHistory(shape)        // 添加图形（支持撤销）
removeWithHistory(shape | id)     // 删除图形（支持撤销）
executeCommand(command)           // 执行自定义命令

// 撤销 / 重做
undo()                            // 撤销上一步操作，返回是否成功
redo()                            // 重做上一步撤销，返回是否成功
canUndo()                         // 是否可以撤销
canRedo()                         // 是否可以重做
clearHistory()                    // 清空历史记录（支持链式调用）

// 显示控制
setGuideLine(status?: boolean)    // 是否启用参照线（支持链式调用）
setTagShow(status?: boolean)      // 是否启用标签（支持链式调用）
isTagShow()                       // 获取是否启用标签
setContinuity(status: boolean)    // 设置是否连续标注（支持链式调用）

// 数据导出
toDataURL()                       // 导出标注图片的 base64 格式
export(format)                    // 导出标注数据，format: 'yolo' | 'coco' | 'json'
exportWith(exporter)              // 使用自定义导出器导出
getAnnotationData()               // 获取标准化标注数据对象

// 类别管理
setClasses(classes)               // 设置类别列表（支持链式调用）
getClasses()                      // 获取所有类别
add Class(config)                 // 添加单个类别，返回新类别对象
removeClass(id)                   // 删除类别
updateClass(id, config)           // 更新类别属性
getClassById(id)                  // 根据 ID 获取类别
getClassByName(name)              // 根据名称获取类别
getShapesByClass(classId)         // 获取指定类别的所有图形

// 事件系统
onEvent(type, callback)           // 监听事件，返回取消监听函数
onceEvent(type, callback)         // 一次性监听，返回取消监听函数
offAllEvents(type)                // 移除指定类型的所有监听器（支持链式调用）
listenerCount(type)               // 获取指定事件的监听器数量
hasListeners(type)                // 检查是否有指定事件的监听器

// 渲染
render()                          // 渲染画面
forceRender()                     // 强制渲染
resize()                          // 重置图片大小与坐标
```

### 数据导出

支持 YOLO、COCO、JSON 三种标注格式：

```js
// YOLO 格式（.txt）
// 每行: <class_id> <x_center> <y_center> <width> <height>，坐标归一化到 0-1
const yoloData = labeler.export('yolo');

// COCO 格式（.json）
const cocoData = labeler.export('coco');

// 内部 JSON 格式（含完整图形信息）
const jsonData = labeler.export('json');

// 获取标准化数据对象（不序列化）
const data = labeler.getAnnotationData();

// 自定义导出器
class MyExporter {
  name = 'Custom';
  format = 'custom';
  extension = '.txt';
  export(shapes, imageInfo) {
    return shapes.map(s => s.registerID).join('\n');
  }
}
labeler.exportWith(new MyExporter());
```

### 撤销 / 重做

```js
// 使用带历史记录的方法操作图形
labeler.addShapeWithHistory(shape); // 添加（可撤销）
labeler.removeWithHistory(shape); // 删除（可撤销）

// 撤销 / 重做
labeler.undo();
labeler.redo();

// 自定义命令
import { ICommand } from 'label-img';
class MyCommand {
  name = 'MyCommand';
  execute() {
    /* 执行 */
  }
  undo() {
    /* 撤销 */
  }
  redo() {
    /* 重做 */
  }
}
labeler.executeCommand(new MyCommand());
```

### 类别管理

```js
// 设置类别列表
labeler.setClasses([
  { id: 0, name: 'person', color: '#FF0000', shortcut: '1' },
  { id: 1, name: 'car', color: '#00FF00', shortcut: '2' },
]);

// 动态添加
const newClass = labeler.addClass({ name: 'dog', color: '#0000FF' });

// 更新
labeler.updateClass(0, { color: '#FF6600' });

// 查询
labeler.getClassById(0);
labeler.getClassByName('person');

// 按类别筛选图形
const persons = labeler.getShapesByClass(0);
```

### 批量操作

```js
// 批量添加
labeler.addShapes([shape1, shape2, shape3]);

// 批量删除
labeler.removeShapes([shape1, shape2]);

// 条件筛选
const hidden = labeler.filterShapes(s => s.isHidden());

// 批量更新（按条件修改样式或属性）
labeler.updateShapes(shape => shape.registerID === 'person', {
  style: { normal: { lineColor: 'blue' }, active: {}, disabled: {} },
});

// 链式调用示例
labeler.addShape(shape).setActive(shape).setTagShow(true).setGuideLine(true);
```

### 事件

```js
// 监听事件，返回取消监听函数
const off = labeler.onEvent('create', shape => {
  console.log('新建图形:', shape);
});
off(); // 取消监听

// 一次性监听
labeler.onceEvent('imageReady', () => {
  console.log('图片加载完成');
});

// 内置事件类型
// select      —— 图形被选中
// create      —— 图形创建
// delete      —— 图形删除
// update      —— 状态更新
// undo        —— 撤销
// redo        —— 重做
// imageReady  —— 图片加载完成
// labelType   —— 标注类型切换
// init        —— 初始化完成
```

### Shape API

```js
getPositions()            // 获取坐标点集合
updatePositions(positions) // 更新坐标信息
setActive(status)         // 设置选中
isActive()                // 是否被选中
close()                   // 图形闭合
isClose()                 // 是否闭合
disabled()                // 禁用
normal()                  // 恢复正常
isDisabled()              // 是否禁用
hidden()                  // 隐藏
isHidden()                // 是否隐藏
show()                    // 显示
isShowTag()               // 是否展示标签
tagShow(status?: boolean) // 控制标签展示
setTag(val)               // 标签内容
```

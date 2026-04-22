import { useState } from 'react';
import {
  Button,
  Tag,
  Switch,
  Modal,
  Image,
  Row,
  Col,
  Divider,
  Tabs,
  Space,
  message,
  Select,
} from 'antd';
import SourceModal from './source-modal';

import { useLabelImg } from './label-img-provider';
import { dataURIToBlob } from '../src/utils';
import { useStore } from './store-provider';
import { Shape } from '../src/Shape';
import EntityModal from './entity-modal';
import './control.less';

const { TabPane } = Tabs;

const ShapeItem = ({ shape, render }: { shape: Shape; render: () => void }) => {
  const { registerID, id, type } = shape;
  const [lb] = useLabelImg();

  const isHidden = shape.isHidden();
  const isDisabled = shape.isDisabled();

  return (
    <div className="shape-item">
      <div>{`${registerID}-${id}`}</div>
      <div className="shape-ctrl">
        <Button
          size="small"
          onClick={() => {
            if (isHidden) {
              shape.show();
            } else {
              shape.hidden();
            }
            render();
          }}
        >
          {isHidden ? '显示' : '隐藏'}
        </Button>
        <Button
          size="small"
          onClick={() => {
            if (isDisabled) {
              shape.normal();
            } else {
              shape.disabled();
            }
            render();
          }}
        >
          {isDisabled ? '正常' : '禁用'}
        </Button>
        <Button
          size="small"
          danger
          onClick={() => {
            lb?.remove(shape);
            render();
          }}
        >
          删除
        </Button>
        <Button
          size="small"
          onClick={() => {
            shape.tagShow();
            render();
          }}
        >
          标签
        </Button>
      </div>
      <div>
        <Tag color="blue">{type}</Tag>
      </div>
    </div>
  );
};

const Control = () => {
  const [lb] = useLabelImg();
  const [{ list, labelTypes }, setStore] = useStore();
  const [continuity, setContinuity] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [base64, setBase64] = useState('');
  const [exportFormat, setExportFormat] = useState<'yolo' | 'coco' | 'json'>('yolo');
  const [classes, setClasses] = useState<
    { id: number; name: string; color: string; shortcut?: string }[]
  >([]);

  const render = () => {
    const list = lb?.getShapeList();
    if (!list) return;
    setStore({
      list,
    });
    lb?.render();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cb = (v: any) => {
    if (!lb) return;
    const { id, ...options } = v;
    lb.register(id, options);
    const labelTypes = lb.getLabels();
    setStore({
      labelTypes,
    });
    setIsCreate(false);
  };

  return (
    <div className="control">
      <Divider></Divider>
      <Row justify="space-between" align="middle">
        <Col span={8}>
          <Button
            onClick={() => {
              setIsCreate(true);
            }}
          >
            新建实体类型
          </Button>
        </Col>
        <EntityModal
          visible={isCreate}
          onCancel={() => {
            setIsCreate(false);
          }}
          cb={cb}
        />
      </Row>
      <Divider orientation="left">实体类型列表</Divider>
      <Row justify="start">
        {labelTypes.map(({ key, name }) => {
          return (
            <Col
              key={key}
              style={{
                marginRight: 8,
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  lb?.label(key);
                }}
              >
                {name}
              </Button>
            </Col>
          );
        })}
      </Row>
      <Divider orientation="left">类别管理（新功能）</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              // 设置标准类别配置
              const newClasses = [
                { id: 0, name: 'person', color: '#FF0000', shortcut: '1' },
                { id: 1, name: 'car', color: '#00FF00', shortcut: '2' },
                { id: 2, name: 'dog', color: '#0000FF', shortcut: '3' },
              ];
              lb?.setClasses(newClasses);
              setClasses(newClasses);
              message.success('类别配置已设置');
            }}
          >
            设置示例类别
          </Button>
          <Button
            size="small"
            onClick={() => {
              const cls = lb?.getClasses();
              console.log('当前类别:', cls);
              message.info(`共有 ${cls?.length || 0} 个类别，请查看控制台`);
            }}
          >
            查看类别
          </Button>
          <Button
            size="small"
            onClick={() => {
              const newClass = lb?.addClass({
                name: `class_${Date.now()}`,
                color: '#FF00FF',
                shortcut: String(classes.length + 1),
              });
              if (newClass) {
                setClasses([...classes, newClass]);
                message.success(`添加类别: ${newClass.name}`);
              }
            }}
          >
            添加类别
          </Button>
        </Space>
        <div>
          {classes.map(cls => (
            <Tag key={cls.id} color={cls.color}>
              {cls.name} (快捷键: {cls.shortcut})
            </Tag>
          ))}
        </div>
      </Space>
      <Divider orientation="left">批量操作（新功能）</Divider>
      <Space>
        <Button
          size="small"
          onClick={() => {
            const shapes = lb?.getShapeList();
            if (shapes && shapes.length > 0) {
              const allRed = shapes[0].style?.normal?.lineColor === '#FF0000';
              lb?.updateShapes(() => true, {
                style: {
                  normal: { lineColor: allRed ? '#00FF00' : '#FF0000' },
                  disabled: {},
                  active: {},
                },
              });
              message.success('批量更新样式完成');
              render();
            }
          }}
        >
          批量更新样式
        </Button>
        <Button
          size="small"
          danger
          onClick={() => {
            const shapes = lb?.filterShapes(s => s.isHidden());
            if (shapes && shapes.length > 0) {
              lb?.removeShapes(shapes);
              message.success(`批量删除 ${shapes.length} 个隐藏图形`);
              render();
            } else {
              message.info('没有隐藏的图形可删除');
            }
          }}
        >
          批量删除隐藏图形
        </Button>
      </Space>
      <Divider orientation="left">控制</Divider>
      <div className="continuity">
        <Switch
          onChange={continuity => {
            setContinuity(continuity);
            lb?.setContinuity(continuity);
          }}
        />
        {continuity ? '连续标注' : '单次标注'}
      </div>
      <Row justify="start" align="middle">
        <Button
          size="small"
          onClick={() => {
            lb?.setTagShow(!lb.isTagShow());
          }}
        >
          显示/隐藏标签
        </Button>
        <Button
          size="small"
          onClick={() => {
            lb?.getShapeList().forEach(shape => {
              if (shape.isHidden()) {
                shape.show();
              } else {
                shape.hidden();
              }
            });
            lb?.render();
          }}
        >
          显示/隐藏图形
        </Button>
        <Button
          size="small"
          onClick={() => {
            lb?.resize();
          }}
        >
          重置大小
        </Button>
        <Button
          size="small"
          onClick={() => {
            lb?.setGuideLine();
          }}
        >
          辅助线
        </Button>
        <Button
          size="small"
          onClick={() => {
            const result = lb?.undo();
            if (result) {
              message.success('撤销成功');
              render();
            } else {
              message.info('没有可撤销的操作');
            }
          }}
          disabled={!lb?.canUndo()}
        >
          撤销
        </Button>
        <Button
          size="small"
          onClick={() => {
            const result = lb?.redo();
            if (result) {
              message.success('重做成功');
              render();
            } else {
              message.info('没有可重做的操作');
            }
          }}
          disabled={!lb?.canRedo()}
        >
          重做
        </Button>
        <Button
          size="small"
          onClick={() => {
            const list = lb?.getShapeList().map(({ id, tagContent, positions }) => {
              return {
                id,
                tag: tagContent,
                positions,
              };
            });
            console.log(list);
            alert(JSON.stringify(list));
          }}
        >
          获取数据
        </Button>
        <Button
          size="small"
          onClick={() => {
            try {
              const data = lb?.export(exportFormat);
              console.log(`${exportFormat.toUpperCase()} 格式导出:`, data);
              message.success(`${exportFormat.toUpperCase()} 格式导出成功，请查看控制台`);
            } catch (e) {
              message.error('导出失败: ' + (e as Error).message);
            }
          }}
        >
          导出标注
        </Button>
        <Select
          size="small"
          value={exportFormat}
          onChange={setExportFormat}
          style={{ width: 100 }}
          options={[
            { label: 'YOLO', value: 'yolo' },
            { label: 'COCO', value: 'coco' },
            { label: 'JSON', value: 'json' },
          ]}
        />
        <Button
          size="small"
          onClick={() => {
            const base64 = lb?.toDataURL();
            if (!base64) return;
            setBase64(base64);
          }}
        >
          导出图片
        </Button>
        <Modal
          visible={!!base64}
          onCancel={() => {
            setBase64('');
          }}
          cancelText="关闭"
          onOk={() => {
            const blob = dataURIToBlob(base64);
            const a = document.createElement('a');
            a.download = 'labelImage.jpg';
            a.href = URL.createObjectURL(blob);
            a.click();
          }}
          okText="下载"
        >
          <Image src={base64} preview={false} />
        </Modal>
      </Row>
      <Divider orientation="left">实体列表</Divider>
      <Tabs type="card">
        <TabPane tab="全部" key="all">
          <div className="shape-list">
            {list.map(shape => {
              return <ShapeItem shape={shape} render={render} key={shape.id} />;
            })}
          </div>
        </TabPane>
        {labelTypes.map(({ key, name }) => {
          return (
            <TabPane tab={name} key={key}>
              <div className="shape-list">
                {list
                  .filter(({ registerID }) => registerID === key)
                  .map(shape => {
                    return <ShapeItem shape={shape} render={render} key={shape.id} />;
                  })}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
      <SourceModal />
    </div>
  );
};

export default Control;

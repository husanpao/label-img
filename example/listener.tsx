import { useEffect } from 'react';
import { useLabelImg } from './label-img-provider';
import { useStore } from './store-provider';

const Listener = () => {
  const [lb] = useLabelImg();
  const [, setStore] = useStore();

  useEffect(() => {
    if (!lb) return;
    lb.emitter.on('create', () => {
      const list = lb.getShapeList();
      setStore({
        list,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb]);

  return null;
};

export default Listener;

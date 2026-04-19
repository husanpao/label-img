import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Shape } from '../src/Shape';

interface IStore {
  list: Shape[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelTypes: any[];
}

const initStore: IStore = {
  list: [],
  labelTypes: [],
};

const StoreCtx = createContext<[IStore, (store: Partial<IStore>) => void]>([initStore, () => {}]);

export const useStore = () => useContext(StoreCtx);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store, setStore] = useState(initStore);

  const update = (newStore: Partial<IStore>) => {
    setStore(data => Object.assign({}, data, newStore));
  };

  return <StoreCtx.Provider value={[store, update]}>{children}</StoreCtx.Provider>;
};

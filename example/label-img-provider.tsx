import { createContext, useContext, useState, type ReactNode } from 'react';
import type LabelImg from '../src/main';

const LabelImgCtx = createContext<[LabelImg | null, (lb: LabelImg) => void]>([null, () => {}]);

export const useLabelImg = () => useContext(LabelImgCtx);

interface LabelImgProviderProps {
  children: ReactNode;
}

export const LabelImgProvider = ({ children }: LabelImgProviderProps) => {
  const [lb, setLb] = useState<LabelImg | null>(null);

  return <LabelImgCtx.Provider value={[lb, setLb]}>{children}</LabelImgCtx.Provider>;
};

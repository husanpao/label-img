import { createRoot } from 'react-dom/client';
import { LabelImgProvider } from './label-img-provider';
import Control from './control';
import { StoreProvider } from './store-provider';
import Listener from './listener';
import { CreateInstance } from './instance';
import { Row } from 'antd';
import './app.less';

const Main = () => {
  return (
    <StoreProvider>
      <LabelImgProvider>
        <div className="pw">
          <Row justify="center">
            <CreateInstance />
            <Control />
            <Listener />
          </Row>
        </div>
      </LabelImgProvider>
    </StoreProvider>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Main />);
}

import React from 'react';

import 'src/styles/global.scss';
import { configure } from 'mobx';

configure({ enforceActions: 'always' });


// @ts-ignore
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

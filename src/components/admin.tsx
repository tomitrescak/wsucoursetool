import Head from 'next/head';

import { withApollo } from 'config/apollo';
import { Root } from './admin/index';

function Editor() {
  return (
    <div>
      <Head>
        <title>BICT Configurator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Root readonly={false} />
    </div>
  );
}

function Viewer() {
  return (
    <div>
      <Head>
        <title>BICT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Root readonly={true} />
    </div>
  );
}

export const Admin = withApollo({ ssr: true })(Editor);
export const View = withApollo({ ssr: false })(Viewer);

// export const Admin = Editor;
// export const View = Viewer;

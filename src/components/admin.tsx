import Head from 'next/head';

import { AdminContainer } from 'components/container';
import { withApollo } from 'config/apollo';

function Editor() {
  return (
    <div>
      <Head>
        <title>BICT Configurator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminContainer readonly={false} />
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

      <AdminContainer readonly={true} />
    </div>
  );
}

export const Admin = withApollo({ ssr: true })(Editor);
export const View = withApollo({ ssr: false })(Viewer);

// export const Admin = Editor;
// export const View = Viewer;

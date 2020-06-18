import Head from 'next/head';

import { withApollo } from 'config/apollo';
import { AdminContainer } from 'components/container';

function Editor() {
  return (
    <div>
      <Head>
        <title>BICT Configurator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminContainer />
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
export const View = withApollo({ ssr: true })(Viewer);

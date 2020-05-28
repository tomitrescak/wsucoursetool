import Head from "next/head";

import { withApollo } from "config/apollo";
import { AdminContainer } from "components/container";

function Home() {
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

export const Admin = withApollo({ ssr: true })(Home);

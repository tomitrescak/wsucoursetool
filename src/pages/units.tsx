import { withApollo } from 'config/apollo';

import Head from 'next/head';
import { UnitContainer } from 'components/unit_graph_container';

function Viewer() {
  return (
    <div>
      <Head>
        <title>BICT &gt; Unit Explorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UnitContainer />
    </div>
  );
}

export default withApollo({ ssr: false })(Viewer);

import Head from 'next/head';
import { UnitContainer } from 'components/units/unit_graph_container';
import { withApollo } from 'config/apollo';

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

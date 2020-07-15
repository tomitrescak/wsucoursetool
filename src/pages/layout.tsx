import { withApollo } from 'config/apollo';
import React from 'react';

import Head from 'next/head';
import { UnitContainer } from 'components/unit_graph_container';
import { Pane, Button, IconButton } from 'evergreen-ui';

function Lay() {
  const result = [];
  for (let i = 0; i < 100; i++) {
    result.push(<div key={i}>{i}: Line</div>);
  }
  return result;
}

const VerticalPane = ({ title, children }) => {
  const [collapsed, collapse] = React.useState(false);

  return (
    <Pane
      height="100%"
      overflow={collapsed ? 'hidden' : 'auto'}
      width={collapsed ? '34px' : undefined}
      borderRight={collapsed ? 'dashed 1px #dedede' : undefined}
      marginRight={4}
    >
      {collapsed ? (
        <Button
          iconAfter="double-chevron-down"
          transform="rotate(-90deg)"
          transformOrigin="bottom right"
          onClick={() => collapse(false)}
          marginTop={-30}
          float="right"
        >
          {title}
        </Button>
      ) : (
        <IconButton
          icon={'double-chevron-left'}
          float="right"
          marginTop={4}
          marginRight={4}
          onClick={() => collapse(true)}
          iconSize={12}
          height={20}
        />
      )}

      {!collapsed && <Pane clear="right">{children}</Pane>}
    </Pane>
  );
};

function Viewer() {
  return (
    <Pane
      position="absolute"
      top="40px"
      bottom="0px"
      left="0px"
      right="0px"
      overflow="hidden"
      display="flex"
    >
      <Head>
        <title>BICT &gt; Unit Explorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VerticalPane title={'Hello'}>
        <Lay />
      </VerticalPane>
      <VerticalPane title={'World'}>
        <Lay />
      </VerticalPane>
      <VerticalPane title={'Yaz'}>
        <Lay />
      </VerticalPane>
    </Pane>
  );
}

export default Viewer;

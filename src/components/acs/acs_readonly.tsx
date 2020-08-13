import React from 'react';

import marked from 'marked';
import { AcsKnowledge } from 'components/types';
import { Pane, Text, Heading } from 'evergreen-ui';

type Props = {
  acs: AcsKnowledge;
};

export const AcsReadonly = ({ acs }: Props) => {
  return (
    <div style={{ overflow: 'auto' }}>
      <Pane padding={8} marginBottom={16}>
        <Heading size={500} marginBottom={16}>
          {acs.name}
        </Heading>
        <Text>{acs.description}</Text>

        {acs.items.map(it => (
          <Pane key={it.id}>
            <Heading size={400}>{it.name}</Heading>
            <Text dangerouslySetInnerHTML={{ __html: marked(it.description) }} />
          </Pane>
        ))}
      </Pane>
    </div>
  );
};

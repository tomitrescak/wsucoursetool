import React from 'react';
import { Pane, Heading, Icon } from 'evergreen-ui';

type Props = {
  title: string;
  id: string;
  children?: React.ReactChild | React.ReactChild[];
  titleControls?: React.ReactChild;
};

export const Expander = ({ title, children, id, titleControls }: Props) => {
  const isServer = typeof localStorage == 'undefined';

  const [expanded, setExpanded] = React.useState(isServer || localStorage.getItem(id) === 'true');

  return (
    <Pane marginTop={16} elevation={2} padding={16} borderRadius={8}>
      <Heading
        size={500}
        marginBottom={0}
        borderBottom={expanded ? 'dashed 1px #dedede' : ''}
        display="flex"
        alignItems="center"
      >
        <Icon
          size={16}
          marginRight={8}
          icon={expanded ? 'chevron-down' : 'chevron-right'}
          cursor="pointer"
          onClick={() => {
            setExpanded(!expanded);
            localStorage.setItem(id, expanded ? 'false' : 'true');
          }}
        />
        {title}
        {titleControls}
      </Heading>

      {expanded && children}
    </Pane>
  );
};
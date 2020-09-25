import React from 'react';
import { Pane, Heading, Icon } from 'evergreen-ui';

type Props = {
  title: string;
  id: string;
  children?: React.ReactChild | React.ReactChild[];
  titleControls?: React.ReactChild;
  image?: string;
};

export const Expander = ({ title, children, id, titleControls, image }: Props) => {
  const isServer = typeof localStorage == 'undefined';

  const [expanded, setExpanded] = React.useState(isServer || localStorage.getItem(id) === 'true');

  return (
    <Pane marginTop={16} elevation={1} padding={16} borderRadius={8} background="tint1">
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
        {image && <img src={image} alt={title} />}
        {title}
        {titleControls}
      </Heading>

      {expanded && children}
    </Pane>
  );
};

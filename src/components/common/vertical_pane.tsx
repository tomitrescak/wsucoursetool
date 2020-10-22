import React from 'react';
import { Pane, Button, IconButton } from 'evergreen-ui';

type Props = {
  title?: string;
  shrink?: boolean;
  children: any;
};

function isExpanded(name: string) {
  return typeof localStorage == 'undefined'
    ? false
    : localStorage.getItem('VerticalPane:' + name) === 'true';
}

export const VerticalPane = ({ title, children, shrink }: Props) => {
  const [collapsed, collapse] = React.useState(isExpanded(title));

  function renderButton() {
    return collapsed ? (
      <Button
        iconAfter="double-chevron-down"
        transform="rotate(-90deg)"
        transformOrigin="bottom right"
        onClick={() => {
          collapse(false);
          localStorage.setItem('VerticalPane:' + title, 'false');
        }}
        marginTop={-30}
        whiteSpace="nowrap"
        position="absolute"
        right={2}
      >
        {title}
      </Button>
    ) : (
      <IconButton
        icon={'double-chevron-left'}
        marginTop={4}
        marginRight={4}
        onClick={() => {
          localStorage.setItem('VerticalPane:' + title, 'true');
          collapse(true);
        }}
        iconSize={12}
        height={20}
        position="absolute"
        right={0}
      />
    );
  }

  return (
    <Pane
      className="scroll1"
      height="100%"
      overflow={collapsed ? 'hidden' : 'auto'}
      width={collapsed ? '34px' : undefined}
      borderRight={collapsed ? 'solid 1px #dedede' : undefined}
      marginRight={4}
      minWidth={34}
      position="relative"
      padding={8}
      paddingTop={2}
      flexShrink={shrink ? undefined : 0}
      flex={shrink ? 1 : undefined}
    >
      {title && renderButton()}
      {!collapsed && <Pane>{children}</Pane>}
    </Pane>
  );
};

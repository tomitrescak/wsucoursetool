import React from 'react';
import { SidebarTab, SidebarTabProps, Text, Pane } from 'evergreen-ui';
import styled from '@emotion/styled';

// export const SideTab: React.FC<SidebarTab & { onClick: any }> = ({ onClick, ...rest }) => (
//   <SidebarTab onSelect={onClick} {...rest} />
// );

export const SideTab = SidebarTab;

export const Tabs = styled.div`
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

type TextFieldProps = {
  label: string;
  value?: string;
  html?: string;
};

export const TextField: React.FC<TextFieldProps> = ({ label, value, html }) => (
  <Pane marginBottom={4}>
    <Text is="label" fontWeight={500} htmlFor={label}>
      {label}
    </Text>
    {html ? (
      <Text id={label} dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <Text id={label}>{value}</Text>
    )}
  </Pane>
);

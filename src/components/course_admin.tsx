import React from 'react';
import { Pane, Tablist, SidebarTab, Paragraph, Menu, Text, toaster } from 'evergreen-ui';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { CourseConfig } from './types';
import { UnitsEditor } from './unit';
import { url } from 'lib/helpers';
import { useMutation } from '@apollo/react-hooks';
import { SAVE } from 'lib/data';

const BreadCrumbs = styled(Text)`
  background: white;
  border: solid 1px #dedede;
  opacity: 0.9;
  border-radius: 6px;
  display: flex;
  text-align: center;
  width: 100%;
  padding: 2px 8px;
  margin: 8px;
`;

const tabs = ['Units', 'Topics', 'Blocks', 'Specialisations'];

const CourseAdminComponent: React.FC<{ data: CourseConfig }> = ({ data }) => {
  const router = useRouter();
  const { category = url(tabs[0]) } = router.query;
  const selectedIndex = tabs.findIndex(t => url(t) === category);

  const state = React.useMemo(
    () =>
      observable({
        courseConfig: data
      }),
    []
  );

  const [addTodo] = useMutation(SAVE, {
    onError() {
      toaster.notify('Save Error');
    },
    onCompleted() {
      toaster.notify('Saved');
    }
  });

  function save() {
    addTodo({
      variables: {
        courses: JSON.stringify(toJS(state.courseConfig), null, 2)
      }
    });
  }

  if (selectedIndex === -1) {
    return <Pane padding={16}>404: ¯\_(ツ)_/¯ Do not modify the url!</Pane>;
  }

  return (
    <>
      <Pane
        position="fixed"
        display="flex"
        height={40}
        width="100%"
        background="blueTint"
        top={0}
        left={0}
      >
        <Menu.Item icon="floppy-disk" width={40} onClick={save} />
        <BreadCrumbs>{tabs[selectedIndex]} &gt;</BreadCrumbs>
      </Pane>
      <Pane display="flex" paddingTop={48} paddingLeft={8} paddingRight={8}>
        <Tablist marginBottom={16} flexBasis={140} marginRight={8}>
          {tabs.map((tab, index) => (
            <Link key={tab} href="/editor/[category]" as={`/editor/${url(tab)}`}>
              <SidebarTab
                key={tab}
                id={tab}
                onSelect={() => {}}
                isSelected={index === selectedIndex}
                aria-controls={`panel-${tab}`}
              >
                {tab}
              </SidebarTab>
            </Link>
          ))}
        </Tablist>

        {selectedIndex == 0 && <UnitsEditor state={state} />}
      </Pane>
    </>
  );
};

export const CourseAdmin = observer(CourseAdminComponent);

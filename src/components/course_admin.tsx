import React from 'react';
import { Pane, Tablist, SidebarTab, Menu, Text, toaster } from 'evergreen-ui';
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
import { AcsEditor } from './acs_knowledge_areas';
import { JobsEditor } from './jobs';

import 'mobx-react-lite/batchingForReactDom';
import { SfiaEditor } from './sfia_skills';
import { TopicEditor } from './topics';
import { AllBlocksEditor } from './blocks_editor';
import { SpecialisationEditor } from './specialisations';
import { Graph } from './block_graph';

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

const Admin = styled.div`
  a {
    text-decoration: none;
  }
`;

const tabs = [
  'Units',
  'Topics',
  'Blocks',
  'Specialisations',
  'Jobs',
  'ACS Skills',
  'SFIA Skills',
  'Graph'
];

const CourseAdminComponent: React.FC<{ data: CourseConfig; readonly: boolean }> = ({
  data,
  readonly
}) => {
  const router = useRouter();
  const { category = url(tabs[0]) } = router.query;
  const selectedIndex = tabs.findIndex(t => url(t) === category);

  const [addTodo] = useMutation(SAVE, {
    onError() {
      toaster.notify('Save Error');
    },
    onCompleted() {
      toaster.notify('Saved');
    }
  });

  function save() {
    return addTodo({
      variables: {
        courses: JSON.stringify(toJS(state.courseConfig), null, 2)
      }
    });
  }

  const state = React.useMemo(
    () =>
      observable({
        courseConfig: data,
        save
      }),
    []
  );

  if (selectedIndex === -1) {
    return <Pane padding={16}>404: ¯\_(ツ)_/¯ Do not modify the url!</Pane>;
  }

  const selectedTab = tabs[selectedIndex];
  const view = readonly ? 'view' : 'editor';

  return (
    <Admin>
      <Pane
        position="fixed"
        display="flex"
        height={40}
        width="100%"
        background="blueTint"
        top={0}
        left={0}
      >
        <Menu.Item icon="floppy-disk" width={40} onSelect={save} />
        <BreadCrumbs>{tabs[selectedIndex]} &gt;</BreadCrumbs>
      </Pane>
      <Pane display="flex" paddingTop={48} paddingLeft={8} paddingRight={8}>
        <Tablist marginBottom={16} flexBasis={140} marginRight={8}>
          {tabs.map((tab, index) => (
            <Link key={tab} href={`/${view}/[category]`} as={`/${view}/${url(tab)}`}>
              <a>
                <SidebarTab
                  key={tab}
                  id={tab}
                  isSelected={index === selectedIndex}
                  aria-controls={`panel-${tab}`}
                >
                  {tab}
                </SidebarTab>
              </a>
            </Link>
          ))}
        </Tablist>

        {selectedTab == 'Units' && <UnitsEditor state={state} readonly={readonly} />}
        {selectedTab == 'Jobs' && <JobsEditor state={state} readonly={readonly} />}
        {selectedTab == 'Blocks' && <AllBlocksEditor state={state} readonly={readonly} />}
        {selectedTab == 'Topics' && <TopicEditor state={state} readonly={readonly} />}
        {selectedTab == 'ACS Skills' && <AcsEditor state={state} readonly={readonly} />}
        {selectedTab == 'SFIA Skills' && <SfiaEditor state={state} readonly={readonly} />}
        {selectedTab == 'Specialisations' && (
          <SpecialisationEditor state={state} readonly={readonly} />
        )}
        {selectedTab == 'Graph' && <Graph state={state} />}
      </Pane>
    </Admin>
  );
};

export const CourseAdmin = observer(CourseAdminComponent);

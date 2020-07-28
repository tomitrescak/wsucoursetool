import React from 'react';
import { Pane, Tablist, SidebarTab, Menu, Text, toaster } from 'evergreen-ui';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Link from 'next/link';

import 'mobx-react-lite/batchingForReactDom';

import { url } from 'lib/helpers';

import { TopicEditor } from 'components/topics/topics';
import { AllBlocksEditor } from 'components/blocks/blocks_editor';
import { Graph } from 'components/blocks/block_graph';
import { AcsEditor } from 'components/acs/acs_knowledge_areas';
import { JobsEditor } from 'components/jobs/jobs';
import { SfiaEditor } from 'components/sfia/sfia_skills';
import { SpecialisationEditor } from 'components/specialisations/specialisations';
import { CoursesEditor } from 'components/courses/courses';
import { VerticalPane } from 'components/common/vertical_pane';
import { UnitsEditor } from 'components/units/unit_list';

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
  'Courses',
  'Topics',
  // 'Blocks',
  'Specialisations',
  'Jobs',
  'ACS Skills',
  'SFIA Skills',
  'Graph'
];

let to: any;

const CourseAdminComponent: React.FC<{ readonly: boolean }> = ({ readonly }) => {
  const router = useRouter();
  const { category = url(tabs[0]) } = router.query;
  const selectedIndex = tabs.findIndex(t => url(t) === category);

  // const [addTodo] = useMutation(SAVE, {
  //   onError() {
  //     toaster.notify('Save Error');
  //   },
  //   onCompleted() {
  //     toaster.notify('Saved');
  //   }
  // });

  // function save() {
  //   // return addTodo({
  //   //   variables: {
  //   //     courses: JSON.stringify(toJS(state.courseConfig), null, 2)
  //   //   }
  //   // });
  //   return fetch('http://localhost:3000/api/save', {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json'
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: JSON.stringify(toJS(state.courseConfig), null, 2)
  //   })
  //     .then(function (response) {
  //       toaster.notify('Saved');
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       toaster.notify('Save Error: ' + error);
  //     });
  // }

  // function delaySave() {
  //   if (to) {
  //     clearTimeout(to);
  //   }
  //   to = setTimeout(() => {
  //     save();
  //   }, 2000);
  // }

  const state = React.useMemo(() => {
    // const { course, undoManager } = createConfig(data);

    return {
      // courseConfig: course,
      // undoManager,
      // save,
      // delaySave
    } as any;
  }, []);

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
        zIndex={10}
        maxHeight="40px"
      >
        <Menu.Item
          icon="floppy-disk"
          width={40}
          maxWidth="40px"
          onSelect={() => state.save && state.save()}
        />
        <Menu.Item
          icon="undo"
          width={40}
          onSelect={() =>
            state.undoManager && state.undoManager.canUndo && state.undoManager.undo()
          }
        />
        <Menu.Item
          icon="redo"
          width={40}
          onSelect={() =>
            state.undoManager && state.undoManager.canRedo && state.undoManager.redo()
          }
        />
        <BreadCrumbs>{tabs[selectedIndex]} &gt;</BreadCrumbs>
      </Pane>
      <Pane
        position="absolute"
        top="40px"
        bottom="0px"
        left="0px"
        right="0px"
        overflow="hidden"
        display="flex"
        padding={8}
      >
        <VerticalPane title="Main Menu">
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
        </VerticalPane>

        {selectedTab == 'Units' && <UnitsEditor state={state} readonly={readonly} />}
        {selectedTab == 'Courses' && <CoursesEditor state={state} readonly={readonly} />}
        {selectedTab == 'Jobs' && <JobsEditor state={state} readonly={readonly} />}
        {/* {selectedTab == 'Blocks' && <AllBlocksEditor state={state} readonly={readonly} />} */}
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

export const Root = observer(CourseAdminComponent);

import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { useDbQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { Pane, Text, Heading } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { Unit, Topic } from 'components/types';
import styled from '@emotion/styled';

const Block = styled.div`
  margin: 4px;
  background: #dedede;
  border-radius: 4px;
  padding: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Container: React.FC<Props> = ({ state, readonly }) => {
  const localState = useLocalStore(() => ({
    isShown: false,
    selection: [],
    course: '',
    major: '',
    filterName: '',
    filterCode: '',
    level: 'ug',
    selectedTopics: []
  }));
  const form = buildForm(localState, ['filterCode', 'filterName']);

  const { loading, error, data, refetch } = useDbQuery();
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  let selectedCourse = localState.course
    ? data.courses.find(c => c.id === localState.course)
    : null;

  let selectedMajor = localState.major
    ? selectedCourse.majors.find(m => m.id === localState.major)
    : null;

  let db: Unit[] = data.db;

  const filteredUnits = db
    .filter(u => u.group)
    .slice()
    .filter(f => {
      let isOk = true;
      if (selectedCourse) {
        isOk =
          selectedCourse.core.findIndex(c => c.id === f.id) >= 0 ||
          (selectedMajor && selectedMajor.units.findIndex(u => u.id === f.id) >= 0);
      }
      if (localState.filterName) {
        isOk =
          isOk &&
          localState.filterName
            .toLowerCase()
            .split(' ')
            .every(d => f.name.toLowerCase().indexOf(d) >= 0);
      }
      if (localState.filterCode) {
        isOk = isOk && f.id.indexOf(localState.filterCode) >= 0;
      }
      isOk =
        isOk &&
        (localState.level === 'both'
          ? true
          : localState.level === 'ug'
          ? f.level < 7
          : f.level > 6);

      isOk =
        isOk &&
        (localState.selectedTopics.length === 0
          ? true
          : localState.selectedTopics.some(t => f.topics.some(p => p === t)));
      return isOk;
    });

  const topics: Topic[] = filteredUnits.reduce((prev, unit) => {
    for (let topicId of unit.topics || []) {
      let topic = data.topics.find(t => t.id === topicId);
      if (prev.indexOf(topic) === -1) {
        prev.push(topic);
      }
    }
    return prev;
  }, []);

  // grop by group
  const groups: Array<{ key: string; values: Unit[] }> = filteredUnits.reduce((prev, unit) => {
    if (unit.group) {
      let group = prev.find(p => p.key === unit.group);
      if (group == null) {
        group = { key: unit.group, values: [] };
        prev.push(group);
      }
      group.values.push(unit);
    }
    return prev;
  }, []);

  // const selectedItem: Entity = selectedId ? data.jobs.find(b => b.id === selectedId) : null;
  // const form = buildForm(localState, ['name']);
  // const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" width="100%" flex="1" position="relative">
      <Text
        is="div"
        size={300}
        fontWeight="bold"
        background="pink"
        flex={1}
        marginRight={8}
        marginLeft={120}
        padding={4}
      >
        Unknown
      </Text>
      {topics.map((g, i) => (
        <Text
          is="div"
          size={300}
          key={g.id}
          background="#f2f2f9"
          flex={1}
          marginRight={8}
          fontWeight="bold"
          padding={4}
          marginLeft={i == 1000 ? 120 : 0}
        >
          {g.name}
        </Text>
      ))}

      <Pane position="absolute" top={30} right={0} left={0}>
        {groups.map(u => (
          <Text is="div" size={300} background="yellow" flex={1} marginRight={8} display="flex">
            <Pane flex="0 0 120px">{u.key}</Pane>
            <Pane flex="1" marginRight={4}>
              {u.values.map(unit => (
                <Pane flex={1} background="white" marginBottom={4}>
                  <Heading id="div" size={300} margin={4}>
                    {unit.name}
                  </Heading>
                  <Pane display="flex">
                    {/* Unknwon */}
                    <Pane flex={1} marginRight={8}>
                      <Block>
                        {unit.blocks.filter(b => b.topics == null || b.topics.length === 0).length}{' '}
                        block(s)
                      </Block>
                    </Pane>
                    {topics.map((t, i) => (
                      <Pane flex={1} marginRight={i === topics.length - 1 ? 0 : 8}>
                        {unit.blocks
                          .filter(b => b.topics != null && b.topics.some(id => id === t.id))
                          .map(tp => (
                            <Block key={tp.id}>{tp.name}</Block>
                          ))}
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              ))}
            </Pane>
          </Text>
        ))}

        {/* <Pane background="yellow" flex={1} marginRight={8} display="flex">
          <Pane flex="0 0 120px">Pyhton</Pane>
          <Pane flex={1} background="blue" marginRight={8}>
            Some
          </Pane>
          <Pane flex={1} background="blue" marginRight={8}>
            Some
          </Pane>
          <Pane flex={1} background="blue">
            Some
          </Pane>
        </Pane>
        <Pane background="yellow" flex={1} marginRight={8}>
          Fundamentals
        </Pane>
        <Pane background="yellow" flex={1} marginRight={8}>
          Fundamentals
        </Pane> */}
      </Pane>
    </Pane>
  );
};

export const Analysis = observer(Container);

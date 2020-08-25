import React from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react';
import { useDbQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { Pane, Text, Heading, TextInput, Select, SelectMenu, Button, Icon } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { Unit, Topic } from 'components/types';
import styled from '@emotion/styled';
import { observable } from 'mobx';

const Block = styled.div<{ level: string }>`
  margin: 4px;
  background: ${props => {
    switch (props.level) {
      case 'Fundamentals':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'lightred';
      case 'Applied':
        return 'lightblue';
      default:
        return '#d0d0df';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'Fundamentals':
        return 'white';
      case 'Intermediate':
        return 'black';
      case 'Advanced':
        return 'white';
      case 'Applied':
        return 'white';
      default:
        return '#black';
    }
  }};
  border-radius: 4px;
  padding: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnitPanel = styled.div`
  flex: 1;
  background: white;
  margin-top: 4px;
  margin-bottom: 4px;
  border: solid 1px #dedede;
  border-radius: 4px;
`;

const GroupPanel = styled(Text)`
  flex: 1;
  background: yellow;
  margin-top: 4px;
  margin-bottom: 4px;
  border: solid 1px #dedede;
  border-radius: 4px;

  margin-right: 8px;
  display: flex;
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

  let observableTopics = data.topics.map(t => observable(t));

  const topics: Array<Topic & { count: string[] }> = filteredUnits.reduce((prev, unit) => {
    for (let topicId of unit.topics || []) {
      let topic = observableTopics.find(t => t.id === topicId);
      topic.count = [];
      if (prev.indexOf(topic) === -1) {
        prev.push(topic);
      }
    }
    return prev;
  }, []);

  // grop by group
  const groups: Array<{ key: string; values: Unit[] }> = filteredUnits.reduce((prev, unit) => {
    if (unit.group) {
      for (let groupName of (unit.group || '').split(',')) {
        let name = groupName.trim();
        let group = prev.find(p => p.key === name);
        if (group == null) {
          group = { key: name, values: [] };
          prev.push(group);
        }
        group.values.push(unit);
      }
    }
    return prev;
  }, []);

  // const selectedItem: Entity = selectedId ? data.jobs.find(b => b.id === selectedId) : null;
  // const form = buildForm(localState, ['name']);
  // const view = readonly ? 'view' : 'editor';

  return (
    <Pane flex="1">
      <Pane display="flex" marginBottom={8} maxWidth={1000}>
        <TextInput
          flex={3}
          placeholder="Name ..."
          value={localState.filterName}
          onChange={form.filterName}
          marginRight={8}
          width="100%"
        />
        <TextInput
          flex={1}
          placeholder="Code ..."
          value={localState.filterCode}
          onChange={form.filterCode}
          width="100%"
        />
        <Select
          value={localState.level || 'ug'}
          onChange={e => (localState.level = e.currentTarget.value)}
          marginRight={8}
        >
          <option value="ug">Undergraduate</option>
          <option value="pg">Postgraduate</option>
          <option value="both">Both</option>
        </Select>
        <Select
          value={localState.course}
          onChange={e => (localState.course = e.currentTarget.value)}
          marginRight={8}
        >
          <option value="">Select Course ...</option>
          {data.courses.map((c, i) => (
            <option value={c.id} key={i}>
              {c.name}
            </option>
          ))}
        </Select>

        {selectedCourse && (
          <Select
            value={localState.major}
            onChange={e => (localState.major = e.currentTarget.value)}
          >
            <option value="">Select Major ...</option>
            {selectedCourse.majors.map((c, i) => (
              <option value={c.id} key={i}>
                {c.name}
              </option>
            ))}
          </Select>
        )}

        <SelectMenu
          isMultiSelect
          title="Select topics"
          options={data.topics.map(t => ({ label: t.name, value: t.id }))}
          selected={localState.selectedTopics}
          onSelect={item => {
            localState.selectedTopics.push(item.value);
          }}
          onDeselect={item => {
            localState.selectedTopics.splice(localState.selectedTopics.indexOf(item.value), 1);
          }}
        >
          <Button maxWidth={300} marginRight={8}>
            {localState.selectedTopics.length > 3
              ? `${localState.selectedTopics.length} selected`
              : localState.selectedTopics.length > 0
              ? localState.selectedTopics
                  .map(t => data.topics.find(p => p.id === t).name)
                  .join(', ')
              : 'Select topics...'}
            <Icon size={12} icon="caret-down" marginLeft={4} />
          </Button>
        </SelectMenu>
      </Pane>
      <Pane display="flex" flex="1">
        <Text
          is="div"
          size={300}
          fontWeight="bold"
          background="pink"
          flex="0 0 150px"
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
            flex="0 0 150px"
            marginRight={8}
            fontWeight="bold"
            padding={4}
            marginLeft={i == 1000 ? 120 : 0}
          >
            {g.name} <Observer>{() => <span>({g.count.length})</span>}</Observer>
          </Text>
        ))}
      </Pane>

      <Pane>
        {groups.map(u => (
          <GroupPanel is="div" size={300}>
            <Pane flex="0 0 120px" padding={16}>
              <Heading size={400}>{u.key}</Heading>
            </Pane>
            <Pane flex="1" marginRight={4}>
              {u.values.map(unit => {
                const unknownBlocks = unit.blocks.filter(
                  b => b.topics == null || b.topics.length === 0
                ).length;
                return (
                  <UnitPanel>
                    <Heading id="div" size={300} margin={4}>
                      {unit.name}
                    </Heading>
                    <Pane display="flex">
                      {/* Unknwon */}
                      <Pane flex="0 0 150px" marginRight={8}>
                        {unknownBlocks > 0 && (
                          <Block level="Unknown">{unknownBlocks} block(s)</Block>
                        )}
                      </Pane>
                      {topics.map((t, i) => (
                        <Pane
                          flex="0 0 150px"
                          overflow="hidden"
                          marginRight={i === topics.length - 1 ? 0 : 8}
                        >
                          {unit.blocks
                            .filter(b => b.topics != null && b.topics.some(id => id === t.id))
                            .map(tp => {
                              const blockId = unit.id + '-' + tp.id;
                              if (t.count.indexOf(blockId) === -1) {
                                t.count.push(blockId);
                              }
                              return (
                                <Block level={tp.level} key={tp.id} title={tp.name}>
                                  {tp.name}
                                </Block>
                              );
                            })}
                        </Pane>
                      ))}
                    </Pane>
                  </UnitPanel>
                );
              })}
            </Pane>
          </GroupPanel>
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

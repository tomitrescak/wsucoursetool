import React from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react';
import { useDbQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import {
  Pane,
  Text,
  Heading,
  TextInput,
  Select,
  SelectMenu,
  Button,
  Icon,
  Checkbox
} from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { Unit, Topic, Block } from 'components/types';
import styled from '@emotion/styled';
import { observable } from 'mobx';

const BlockView = styled.div<{ level: string }>`
  margin: 4px;
  font-size: 11px;
  background: ${props => {
    switch (props.level) {
      case 'Flagged':
        return 'purple';
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
      case 'Flagged':
        return 'white';
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

type Collections = {
  topics: Topic[];
};

const groupByStrategies: {
  [index: string]: {
    groups(unit: Unit, collections: Collections): string[];
    inGroup(block: Block, group: string, collections: Collections): boolean;
  };
} = {
  keyword: {
    groups(unit) {
      return unit.blocks.reduce((groups, block) => {
        groups.push(...(block.keywords || ['Unknown']));
        return groups;
      }, []);
    },
    inGroup(block, group, collections) {
      return block.keywords.some(keyword => keyword === group);
    }
  },
  topic: {
    groups(unit, collections) {
      return unit.blocks.reduce((groups, block) => {
        if (block.topics && block.topics.length) {
          groups.push(...block.topics.map(t => collections.topics.find(p => p.id === t).name));
        } else {
          groups.push('Unknown');
        }

        return groups;
      }, []);
    },
    inGroup(block, group, collections) {
      let tp = collections.topics.find(t => t.name === group);
      return block.topics.some(t => t === tp.id);
    }
  },
  flag: {
    groups(unit, collections) {
      return unit.blocks.reduce((groups, block) => {
        groups.push(
          block.flagged
            ? 'Flagged'
            : unit.outdated
            ? 'Outdated'
            : unit.obsolete
            ? 'Obsolete'
            : unit.dynamic
            ? 'Dynamic'
            : unit.proposed
            ? 'Proposed'
            : 'Unflagged'
        );
        return groups;
      }, []);
    },
    inGroup(block, group, collections) {
      return true;
    }
  },
  unit: {
    groups(unit) {
      return [unit.name];
    },
    inGroup() {
      return true;
    }
  },
  unitCoordinator: {
    groups(unit) {
      return [unit.coordinator];
    },
    inGroup() {
      return true;
    }
  },
  unitLevel: {
    groups(unit) {
      return [unit.level.toString()];
    },
    inGroup() {
      return true;
    }
  },
  blockLevel: {
    groups(unit, collections) {
      return unit.blocks.reduce((groups, block) => {
        groups.push(block.level || 'Unknown');
        return groups;
      }, []);
    },
    inGroup(block, group, collections) {
      return block.level === group || (group === 'Unknown' && block.level == null);
    }
  }
};

const Container = () => {
  const localState = useLocalStore(() => ({
    isShown: false,
    selection: [],
    course: '',
    major: '',
    filterName: '',
    filterCode: '',
    level: 'ug',
    keywordOnly: true,
    selectedTopics: [],
    groupBy: 'keyword'
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
    .slice()
    .filter(u => u.processed == true)
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
    for (let block of unit.blocks) {
      for (let topicId of block.topics || []) {
        let topic = observableTopics.find(t => t.id === topicId);
        (topic as any).count = [];
        if (prev.indexOf(topic) === -1) {
          prev.push(topic);
        }
      }
    }
    return prev;
  }, []);

  // grop by group
  const strategy = groupByStrategies[localState.groupBy];
  const collections = {
    topics
  };
  const groups: Array<{ key: string; values: Unit[] }> = filteredUnits
    .reduce(
      (prev, unit) => {
        let groupNames = strategy.groups(unit, collections);
        for (let groupName of groupNames) {
          let name = (groupName || 'Unknown').trim();
          let group = prev.find(p => p.key === name);
          if (group == null) {
            group = { key: name, values: [] };
            prev.push(group);
          }
          if (group.values.every(g => g.id !== unit.id)) {
            group.values.push(unit);
          }
        }

        return prev;
      },
      [{ key: 'Unknown', values: [] }]
    )
    .sort((a, b) => (a.key || '').localeCompare(b.key));

  // const selectedItem: Entity = selectedId ? data.jobs.find(b => b.id === selectedId) : null;
  // const form = buildForm(localState, ['name']);
  // const view = readonly ? 'view' : 'editor';

  return (
    <Pane>
      <Pane position="fixed" top={45} display="flex" width="100%" maxWidth={1000}>
        <Select
          value={localState.groupBy}
          onChange={e => (localState.groupBy = e.currentTarget.value)}
          marginRight={8}
        >
          <option value={'keyword'}>By Keyword</option>
          <option value={'topic'}>By Topic</option>
          <option value={'unit'}>By Unit</option>
          <option value={'unitCoordinator'}>By Unit Coordinator</option>
          <option value={'unitLevel'}>By Unit Level</option>
          <option value={'blockLevel'}>By Block Level</option>
          <option value={'flag'}>By Flag</option>
        </Select>
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
          marginRight={8}
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
            marginRight={8}
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
      <Pane overflow="auto" position="fixed" top={80} left={0} bottom={0} right={0}>
        <Pane display="flex" flex="1" position="relative" marginLeft={4}>
          <Pane width={120} minWidth={120}>
            <Checkbox
              label="Group"
              checked={localState.keywordOnly}
              onChange={e => (localState.keywordOnly = e.currentTarget.checked)}
            />
          </Pane>
          <Text
            is="div"
            size={300}
            fontWeight="bold"
            background="pink"
            flex="0 0 150px"
            marginRight={8}
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

        <Pane position="absolute" top={40} left={0} bottom={0} overflow="auto">
          {groups
            .filter(g => g.values.length > 0)
            .map(u => (
              <Pane
                key={u.key}
                background="yellow"
                display="flex"
                marginBottom={4}
                borderRadius={6}
                marginLeft={4}
              >
                <Pane width={120} padding={16} minWidth={120}>
                  <Heading size={400}>{u.key}</Heading>
                </Pane>
                <Pane>
                  {u.values.map(unit => {
                    const unknownBlocks = unit.blocks.filter(
                      b => b.topics == null || b.topics.length === 0
                    ).length;
                    return (
                      <Pane
                        key={unit.id}
                        background="white"
                        marginTop={2}
                        marginBottom={4}
                        borderRadius={6}
                        marginRight={2}
                      >
                        <Pane>
                          <Heading id="div" size={300} margin={4}>
                            {unit.name}
                          </Heading>
                        </Pane>
                        <Pane display="flex">
                          <Pane width={150} marginRight={8}>
                            {unknownBlocks > 0 && (
                              <BlockView level="Unknown">{unknownBlocks} block(s)</BlockView>
                            )}
                          </Pane>
                          {topics.map((t, i) => (
                            <Pane width={150} marginRight={8}>
                              {unit.blocks
                                .filter(
                                  b =>
                                    b.topics != null &&
                                    b.topics.some(id => id === t.id) &&
                                    (!localState.keywordOnly ||
                                      strategy.inGroup(b, u.key, collections))
                                )
                                .map(tp => {
                                  const blockId = unit.id + '-' + tp.id;
                                  if (t.count.indexOf(blockId) === -1) {
                                    t.count.push(blockId);
                                  }
                                  return (
                                    <BlockView
                                      level={tp.flagged ? 'Flagged' : tp.level}
                                      key={tp.id}
                                      title={tp.name}
                                    >
                                      {tp.name}
                                    </BlockView>
                                  );
                                })}
                            </Pane>
                          ))}
                        </Pane>
                      </Pane>
                    );
                  })}
                </Pane>
              </Pane>
            ))}
          {/* {groups.map(u => (
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
            ))} */}
        </Pane>
      </Pane>
    </Pane>
  );
};

export const Analysis = observer(Container);

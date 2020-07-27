import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  Pane,
  Heading,
  Button,
  Select,
  Combobox,
  ListItem,
  UnorderedList,
  IconButton,
  Text,
  Checkbox,
  Badge,
  Icon,
  Popover,
  Position,
  Menu
} from 'evergreen-ui';

import { bloom } from './bloom';
import { State, Prerequisite, Unit, AcsKnowledge, Activity, Topic } from './types';
import { useAcsQuery, useBlocksQuery, useTopicsQuery, BlockList } from 'config/graphql';
import { ProgressView } from './progress_view';

export type Props = {
  state: State;
  owner: { prerequisites?: Prerequisite[] };
  unit: Unit;
  activities?: Activity[];
};

export type LineProps = {
  prerequisite: Prerequisite;
  acsSkills: AcsKnowledge[];
  blocks: BlockList[];
  owner: { prerequisites?: Prerequisite[] };
  activities: Activity[];
  topics: Topic[];
  i: number;
};

const PrerequisiteLine = ({
  prerequisite,
  acsSkills,
  activities,
  blocks,
  topics,
  owner,
  i
}: LineProps) => (
  <ListItem display="flex">
    {prerequisite.type === 'skill' && (
      <Text flex="1">
        <Badge color="orange">Skill</Badge> {acsSkills.find(s => s.id === prerequisite.id)?.name} -{' '}
        {prerequisite.value} [{bloom[prerequisite.value - 1].title}]{' '}
      </Text>
    )}
    {prerequisite.type === 'block' && (
      <Text flex="1">
        <Badge color="blue">Block</Badge>{' '}
        {prerequisite.activityId != null && (
          <>
            {' '}
            <Badge color="green">A</Badge>{' '}
            {activities.find(a => a.id === prerequisite.activityId)?.name}
            &nbsp;&gt;&nbsp;
          </>
        )}
        {blocks.find(s => s.id === prerequisite.id && prerequisite.unitId === s.unitId)?.name}
      </Text>
    )}
    {prerequisite.type === 'topic' && (
      <Text flex="1">
        <Badge color="purple">Topic</Badge> {topics.find(s => s.id === prerequisite.id)?.name}
      </Text>
    )}

    <Badge marginRight={16} marginLeft={8} color={prerequisite.recommended ? 'green' : 'red'}>
      {prerequisite.recommended ? 'Recommended' : 'Required'}
    </Badge>

    <IconButton
      marginTop={-4}
      flex="0 0 40px"
      icon="trash"
      intent="danger"
      appearance="primary"
      marginRight={16}
      onClick={() => {
        owner.prerequisites.splice(i, 1);
      }}
    />
  </ListItem>
);

export type AddPrerequisiteProps = {
  unit: Unit;
  acsSkills: AcsKnowledge[];
  owner: { prerequisites?: Prerequisite[] };
  activities: Activity[];
  blocks: BlockList[];
  topics: Topic[];
};

const AddPrerequisite = observer(
  ({ unit, acsSkills, owner, activities, blocks, topics }: AddPrerequisiteProps) => {
    const localState = useLocalStore(() => ({
      type: '',
      topicId: '',
      block: null as BlockList,
      acsSkillId: '',
      activityId: null,
      rating: -1,
      blockTopicId: '',
      recommended: false
    }));

    return (
      <Pane display="flex" alignItems="center">
        <Select
          marginRight={8}
          flex="0 0 80px"
          value={localState.type || ''}
          onChange={e => (localState.type = e.currentTarget.value)}
        >
          <option value="">None</option>
          <option value="block">Block</option>
          <option value="topic">Topic</option>
          <option value="skill">Skill</option>
          <option value="or">Or</option>
        </Select>

        {/* PREREQUSTIE TYPE = BLOCK */}

        {localState.type === 'block' && (
          <Pane display="flex" alignItems="center" flex="1" marginRight={8}>
            <Pane flex="1">
              <Combobox
                flex="1"
                width="100%"
                id="block"
                items={blocks}
                itemToString={item => (item ? item.name : '')}
                onChange={selected => (localState.block = selected)}
              />
            </Pane>

            {localState.type === 'block' && activities != null && (
              <Pane marginLeft={8} flex="1">
                <Combobox
                  flex="1"
                  width="100%"
                  id="activities"
                  items={activities}
                  itemToString={item => (item ? item.name : '')}
                  onChange={selected => (localState.activityId = selected.id)}
                />
              </Pane>
            )}
          </Pane>
        )}

        {/* PREREQUSTIE TYPE = TOPIC */}

        {localState.type === 'topic' && (
          <Pane display="flex" alignItems="center" flex="1" marginRight={8}>
            <Combobox
              flex="1"
              width="100%"
              id="topic"
              items={topics}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localState.topicId = selected.id)}
            />
          </Pane>
        )}

        {/* PREREQUSTIE TYPE = SKILL */}

        {localState.type === 'skill' && (
          <Pane display="flex" alignItems="center" flex="1">
            <Combobox
              flex="1"
              width="100%"
              id="mapping"
              items={acsSkills}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localState.acsSkillId = selected.id)}
            />
            <Select
              marginLeft={8}
              marginRight={8}
              flex="0 0 140px"
              value={localState.rating ? localState.rating.toString() : ''}
              onChange={e => (localState.rating = parseInt(e.currentTarget.value))}
            >
              <option value="">None</option>
              <option value="1">1 - Knowledge</option>
              <option value="2">2 - Comprehension</option>
              <option value="3">3 - Application</option>
              <option value="4">4 - Analysis</option>
              <option value="5">5 - Synthesis</option>
              <option value="6">6 - Evaluation</option>
            </Select>
          </Pane>
        )}

        <Checkbox
          margin={0}
          checked={localState.recommended}
          onChange={e => (localState.recommended = e.currentTarget.checked)}
        />
        <Text display="block" marginLeft={8} marginRight={8}>
          Rec.
        </Text>

        {localState.type && (
          <Button
            iconBefore="plus"
            appearance="primary"
            onClick={() => {
              if (!owner.prerequisites) {
                owner.prerequisites = [];
              }
              if (localState.type === 'skill') {
                owner.prerequisites.push({
                  id: localState.acsSkillId,
                  type: 'skill',
                  value: localState.rating,
                  recommended: localState.recommended
                });
              } else if (localState.type === 'block') {
                owner.prerequisites.push({
                  id: localState.block.id,
                  unitId: localState.block.unitId,
                  type: 'block',
                  recommended: localState.recommended,
                  activityId: localState.activityId
                });
              } else if (localState.type === 'topic') {
                owner.prerequisites.push({
                  id: localState.topicId,
                  type: 'topic',
                  recommended: localState.recommended
                });
              } else if (localState.type === 'or') {
                owner.prerequisites.push({
                  type: 'or',
                  prerequisites: []
                });
              }
            }}
          >
            Add
          </Button>
        )}
      </Pane>
    );
  }
);

type OrEditorProps = {
  owner: { prerequisites: Prerequisite[] };
  prerequisite: Prerequisite;
  acsSkills: AcsKnowledge[];
  unit: Unit;
  activities?: Activity[];
  blocks: BlockList[];
  topics: Topic[];
};

const OrEditor = observer(
  ({ owner, prerequisite, acsSkills, unit, activities, blocks, topics }: OrEditorProps) => (
    <Pane display="flex" marginBottom={8}>
      <IconButton
        icon="trash"
        appearance="primary"
        intent="danger"
        marginRight={4}
        onClick={() => {
          owner.prerequisites.splice(owner.prerequisites.indexOf(prerequisite), 1);
        }}
      />
      <IconButton
        icon="plus"
        onClick={() =>
          prerequisite.prerequisites.push({
            prerequisites: [],
            type: 'container'
          })
        }
      />
      <Pane flex="1" marginLeft={8}>
        {prerequisite.prerequisites.map((p, i) => (
          <Pane key={i}>
            <Prerequisites
              owner={p}
              acsSkills={acsSkills}
              unit={unit}
              activities={activities}
              blocks={blocks}
              topics={topics}
            />

            {i < prerequisite.prerequisites.length - 1 && (
              <h2
                style={{
                  width: '100%',
                  textAlign: 'center',
                  borderBottom: '1px solid #000',
                  lineHeight: '0.1em',
                  margin: '10px 0 20px',
                  fontSize: '12px'
                }}
              >
                <div
                  style={{
                    background: '#f5f6f7',
                    padding: '4 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginBottom: '-10px'
                  }}
                >
                  OR
                  <IconButton
                    marginLeft={4}
                    iconSize={10}
                    marginRight={0}
                    width="20px"
                    height="20px"
                    icon="trash"
                    appearance="primary"
                    intent="danger"
                    onClick={() => {
                      prerequisite.prerequisites.splice(i, 1);
                    }}
                  />
                </div>
              </h2>
            )}
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
);

const Prerequisites = observer(({ owner, acsSkills, unit, activities, blocks, topics }) => {
  return (
    <Pane>
      <UnorderedList icon="tick" iconColor="success" alignItems="center" margin={0} marginLeft={0}>
        {(owner.prerequisites || []).map((o, i) => {
          if (o.type === 'or') {
            return (
              <OrEditor
                owner={owner}
                prerequisite={o}
                acsSkills={acsSkills}
                blocks={blocks}
                topics={topics}
                unit={unit}
              />
            );
          }
          return (
            <PrerequisiteLine
              activities={activities}
              prerequisite={o}
              acsSkills={acsSkills}
              owner={owner}
              blocks={blocks}
              topics={topics}
              i={i}
            />
          );
        })}
      </UnorderedList>
      <AddPrerequisite
        activities={activities}
        acsSkills={acsSkills}
        owner={owner}
        unit={unit}
        blocks={blocks}
        topics={topics}
      />
    </Pane>
  );
});

export const PrerequisiteEditor: React.FC<Props> = observer(({ owner, unit, activities }) => {
  const [expanded, setExpanded] = React.useState((owner.prerequisites || []).length > 0);

  const { loading: aLoading, error: aError, data: aData } = useAcsQuery();
  const { loading: tLoading, error: tError, data: tData } = useTopicsQuery();
  const { loading: bLoading, error: bError, data: bData } = useBlocksQuery();

  if (aLoading || aError || bLoading || bError || tLoading || tError) {
    return (
      <ProgressView loading={aLoading || bLoading || tLoading} error={aError || bError || tError} />
    );
  }

  const topics = tData.topics;
  const blocks = React.useMemo(() => {
    const unitBlocks = unit.blocks.map(b => ({ id: b.id, unitId: unit.id, name: b.name }));
    // const otherBlocks = unit
    //   ? state.courseConfig.blocks.filter(b => unit.blocks.every(id => id !== b.id))
    //   : state.courseConfig.blocks;
    return unitBlocks.concat(bData.blocks);
  }, []);

  const acsSkills = React.useMemo(() => {
    return aData.acs
      .map(m => m.items)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [aData]);

  return (
    <Pane flex={1}>
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
          onClick={() => setExpanded(!expanded)}
        />
        Prerequisites and Recommendations
        <Pane flex="1" display="flex" justifyItems="flex-end">
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                <Menu.Group title="Import">
                  <Menu.Item
                    onSelect={() => {
                      owner.prerequisites.push(
                        ...unit.blocks.map(
                          b =>
                            ({
                              id: b.id,
                              unitId: unit.id,
                              type: 'block',
                              recommended: true
                            } as Prerequisite)
                        )
                      );
                    }}
                  >
                    All Blocks
                  </Menu.Item>
                  {/* <Menu.Item
                      onSelect={() => {
                        owner.prerequisites.push(
                          ...unit.blocks
                            .filter(b =>
                              state.courseConfig.blocks
                                .find(t => t.id === b)
                                .activities.some(a => a.type === 'assignment')
                            )
                            .map(
                              b =>
                                ({
                                  id: b,
                                  type: 'block',
                                  recommended: true
                                } as Prerequisite)
                            )
                        );
                      }}
                    >
                      Practicals
                    </Menu.Item>
                    <Menu.Item
                      onSelect={() => {
                        owner.prerequisites.push(
                          ...unit.blocks
                            .filter(b =>
                              state.courseConfig.blocks
                                .find(t => t.id === b)
                                .activities.some(a => a.type === 'exam')
                            )
                            .map(
                              b =>
                                ({
                                  id: b,
                                  type: 'block',
                                  recommended: true
                                } as Prerequisite)
                            )
                        );
                      }}
                    >
                      Exams
                    </Menu.Item> */}
                </Menu.Group>
              </Menu>
            }
          >
            <IconButton icon="chevron-down" marginLeft={16} appearance="minimal" />
          </Popover>
        </Pane>
      </Heading>

      {expanded && (
        <Pane marginTop={8}>
          <Prerequisites
            activities={activities}
            acsSkills={acsSkills}
            owner={owner}
            unit={unit}
            blocks={blocks}
            topics={topics}
          />{' '}
        </Pane>
      )}
    </Pane>
  );
});

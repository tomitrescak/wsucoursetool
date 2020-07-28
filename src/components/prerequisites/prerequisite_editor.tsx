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

import { bloom } from '../acs/bloom';
import { State, Prerequisite, Unit, AcsKnowledge, Activity, Topic, Block } from '../types';
import { usePrerequisitesQuery, BlockList, useUnitsQuery, useUnitBaseQuery } from 'config/graphql';
import { ProgressView } from '../common/progress_view';
import { PrerequisiteModel } from 'components/classes';

type PrerequisiteOwner = {
  prerequisites?: ReadonlyArray<Prerequisite>;
  addPrerequisite(p: Prerequisite);
  addPrerequisites(ps: Prerequisite[]);
  removePrerequisite(ix: number);
};

export type Props = {
  state: State;
  owner: PrerequisiteOwner;
  unit: Unit;
  activities?: Activity[];
};

export type LineProps = {
  prerequisite: Prerequisite;
  acsSkills: AcsKnowledge[];
  blocks: BlockList[];
  owner: PrerequisiteOwner;
  activities: Activity[];
  topics: Topic[];
  i: number;
  unit: Unit;
};

const BlockPrerequisiteLine = ({
  prerequisite,
  unit,
  activities
}: {
  prerequisite: Prerequisite;
  unit: Unit;
  activities: Activity[];
}) => {
  const { loading, error, data } = useUnitBaseQuery({
    variables: {
      id: prerequisite.unitId || '-1'
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  if (data.unitBase == null) {
    const fallbackBlock = unit?.blocks.find(b => b.id === prerequisite.id);
    const fallbackActivity = fallbackBlock?.activities.find(a => a.id === prerequisite.activityId)
      ?.name;

    return (
      <Text>
        Err: {fallbackBlock?.name} [{prerequisite.id}] {fallbackActivity}[{prerequisite.activityId}]
      </Text>
    );
  }
  const block = data.unitBase.blocks.find(s => s.id === prerequisite.id);
  return (
    <Text flex="1">
      {prerequisite.activityId != null && prerequisite.activityId != '' && (
        <>
          <Badge color="green">A</Badge>{' '}
          {activities.find(a => a.id === prerequisite.activityId)?.name}
          &nbsp;<b>&#x27a4;</b>&nbsp;
        </>
      )}
      <Badge color="blue">Block</Badge> {data.unitBase.name} &nbsp;&#x27a4;&nbsp;
      {block.name}
    </Text>
  );
};

const PrerequisiteLine = ({
  prerequisite,
  acsSkills,
  activities,
  blocks,
  topics,
  owner,
  i,
  unit
}: LineProps) => (
  <ListItem display="flex">
    {prerequisite.type === 'skill' && (
      <Text flex="1">
        <Badge color="orange">Skill</Badge> {acsSkills.find(s => s.id === prerequisite.id)?.name} -{' '}
        {prerequisite.value} [{bloom[prerequisite.value - 1].title}]{' '}
      </Text>
    )}
    {prerequisite.type === 'block' && (
      <BlockPrerequisiteLine activities={activities} prerequisite={prerequisite} unit={unit} />
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
        owner.removePrerequisite(i);
      }}
    />
  </ListItem>
);

export type AddPrerequisiteProps = {
  unit: Unit;
  acsSkills: AcsKnowledge[];
  owner: {
    prerequisites?: PrerequisiteModel[];
    addPrerequisite(p: Prerequisite);
    removePrerequise(ix: number);
  };
  activities: Activity[];
  topics: Topic[];
};

const AddPrerequisite = observer(
  ({ unit, acsSkills, owner, topics, activities }: AddPrerequisiteProps) => {
    const localState = useLocalStore(() => ({
      type: '',
      topicId: '',
      block: null as Block,
      acsSkillId: '',
      activityId: null,
      rating: -1,
      blockTopicId: '',
      recommended: false,
      selectedUnitId: unit ? unit.id : '-1'
    }));

    const { loading, error, data } = useUnitsQuery();
    const { loading: unitLoading, data: unitData } = useUnitBaseQuery({
      variables: {
        id: localState.selectedUnitId
      }
    });
    if (loading || unitLoading || error) {
      return <ProgressView loading={loading || unitLoading} error={error} />;
    }

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
                selectedItem={data.units.find(u => u.id === localState.selectedUnitId)}
                items={data.units}
                itemToString={item => (item ? item.name : '')}
                onChange={selected => (localState.selectedUnitId = selected.id)}
              />
            </Pane>

            <Pane flex="1" marginLeft={8}>
              <Combobox
                flex="1"
                width="100%"
                id="block"
                items={unitData.unitBase.blocks}
                itemToString={item => (item ? item.name : '')}
                onChange={selected => (localState.block = selected)}
              />
            </Pane>

            {localState.type === 'block' && activities && (
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
                owner.addPrerequisite({
                  id: localState.acsSkillId,
                  type: 'skill',
                  value: localState.rating,
                  recommended: localState.recommended
                });
              } else if (localState.type === 'block') {
                owner.addPrerequisite({
                  id: localState.block.id,
                  unitId: localState.selectedUnitId,
                  type: 'block',
                  recommended: localState.recommended,
                  activityId: localState.activityId
                });
              } else if (localState.type === 'topic') {
                owner.addPrerequisite({
                  id: localState.topicId,
                  type: 'topic',
                  recommended: localState.recommended
                });
              } else if (localState.type === 'or') {
                owner.addPrerequisite({
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
  owner: PrerequisiteOwner;
  prerequisite: PrerequisiteModel;
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
          owner.removePrerequisite(owner.prerequisites.indexOf(prerequisite));
        }}
      />
      <IconButton
        icon="plus"
        onClick={() =>
          prerequisite.addPrerequisite({
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
                      prerequisite.removePrerequisite(i);
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
                key={i}
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
              key={i}
              activities={activities}
              prerequisite={o}
              acsSkills={acsSkills}
              owner={owner}
              blocks={blocks}
              topics={topics}
              i={i}
              unit={unit}
            />
          );
        })}
      </UnorderedList>
      <AddPrerequisite
        activities={activities}
        acsSkills={acsSkills}
        owner={owner}
        unit={unit}
        topics={topics}
      />
    </Pane>
  );
});

export const PrerequisiteEditor: React.FC<Props> = observer(({ owner, unit, activities }) => {
  const [expanded, setExpanded] = React.useState((owner.prerequisites || []).length > 0);

  const { loading, error, data } = usePrerequisitesQuery();

  const blocks = React.useMemo(() => {
    if (loading) {
      return [];
    }
    return unit ? unit.blocks.map(b => ({ id: b.id, unitId: unit.id, name: b.name })) : [];
    // const otherBlocks = unit
    //   ? state.courseConfig.blocks.filter(b => unit.blocks.every(id => id !== b.id))
    //   : state.courseConfig.blocks;
  }, [loading]);

  const acsSkills = React.useMemo(() => {
    if (loading) {
      return [];
    }
    return data.acs
      .map(m => m.items)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [loading]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const topics = data.topics;

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
                      owner.addPrerequisites(
                        unit.blocks.map(
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

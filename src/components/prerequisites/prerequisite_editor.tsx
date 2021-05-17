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

import { State, Prerequisite, Unit, Activity, Topic, Block, SfiaSkill } from '../types';
import { usePrerequisitesQuery, BlockList, useUnitsQuery, useUnitBaseQuery } from 'config/graphql';
import { ProgressView } from '../common/progress_view';
import { PrerequisiteModel, UnitModel } from 'components/classes';

export type PrerequisiteOwner = {
  requisites?: ReadonlyArray<Prerequisite>;
  addRequisite(key: string, p: Prerequisite);
  // addRequisites(ps: Prerequisite[]);
  // removeRequisiteByIndex(ix: number);
  removeRequisite(key: string, p: Prerequisite);
};

export type Props = {
  state: State;
  owner: PrerequisiteOwner;
  unit: UnitModel;
  readonly: boolean;
  id: string;
};

export type LineProps = {
  prerequisite: Prerequisite;
  sfiaSkills: SfiaSkill[];
  blocks: BlockList[];
  owner: PrerequisiteOwner;
  topics: Topic[];
  i: number;
  field: string;
  unit: Unit;
  readonly: boolean;
};

const BlockPrerequisiteLine = ({
  prerequisite,
  unit
}: {
  prerequisite: Prerequisite;
  unit: Unit;
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
    const fallbackBlock = (unit?.blocks || []).find(b => b.id === prerequisite.id);
    const fallbackActivity = fallbackBlock?.activities.find(a => a.id === prerequisite.activityId)
      ?.name;

    return (
      <Text>
        Err: {fallbackBlock?.name} [{prerequisite.id}] {fallbackActivity}[{prerequisite.activityId}]
      </Text>
    );
  }
  const block = (data.unitBase.blocks || []).find(s => s.id === prerequisite.id);
  return (
    <Text flex="1">
      <Badge color="blue">Block</Badge> {data.unitBase.name} &nbsp;&#x27a4;&nbsp;
      {block?.name || 'NOT FOUND'}
    </Text>
  );
};

const UnitPrerequisiteLine = ({
  prerequisite,
  unit
}: {
  prerequisite: Prerequisite;
  unit: Unit;
}) => {
  const { loading, error, data } = useUnitBaseQuery({
    variables: {
      id: prerequisite.id || '-1'
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  if (data.unitBase == null) {
    return <Text>Error: Unit with id "{prerequisite.id}" not found</Text>;
  }
  return (
    <Text flex="1">
      <Badge color="teal">Unit</Badge> {data.unitBase.name}
    </Text>
  );
};

const PrerequisiteLine = ({
  prerequisite,
  sfiaSkills,
  blocks,
  field,
  topics,
  owner,
  i,
  unit,
  readonly
}: LineProps) => (
  <ListItem display="flex">
    {prerequisite.type === 'sfia' && (
      <Text flex="1">
        <Badge color="orange">SFIA</Badge> {sfiaSkills.find(s => s.id === prerequisite.id)?.name} -{' '}
        {prerequisite.value}
      </Text>
    )}
    {prerequisite.type === 'block' && (
      <BlockPrerequisiteLine prerequisite={prerequisite} unit={unit} />
    )}
    {prerequisite.type === 'unit' && (
      <UnitPrerequisiteLine prerequisite={prerequisite} unit={unit} />
    )}
    {prerequisite.type === 'topic' && (
      <Text flex="1">
        <Badge color="purple">Topic</Badge> {topics.find(s => s.id === prerequisite.id)?.name}
      </Text>
    )}

    {prerequisite.recommended === true ||
      (prerequisite.recommended === false && (
        <Badge marginRight={16} marginLeft={8} color={prerequisite.recommended ? 'green' : 'red'}>
          {prerequisite.recommended ? 'Recommended' : 'Required'}
        </Badge>
      ))}

    {!readonly && (
      <IconButton
        marginTop={-4}
        flex="0 0 40px"
        icon="trash"
        intent="danger"
        appearance="primary"
        marginRight={16}
        onClick={() => {
          owner.removeRequisite(field, prerequisite);
        }}
      />
    )}
  </ListItem>
);

export type AddPrerequisiteProps = {
  unit: Unit;
  sfiaSkills: SfiaSkill[];
  owner: PrerequisiteOwner;
  topics: Topic[];
  field: string;
};

const AddPrerequisiteInner = ({ unit, sfiaSkills, owner, topics, field }: AddPrerequisiteProps) => {
  const localState = useLocalStore(() => ({
    type: '',
    topicId: '',
    block: null as Block,
    sfiaSkillId: '',
    activityId: null,
    rating: -1,
    blockTopicId: '',
    recommended: field === 'prerequisites' ? false : undefined,
    selectedUnitId: unit ? unit?.id : '-1'
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
        <option value="unit">Unit</option>
        <option value="topic">Topic</option>
        <option value="skill">Skill</option>
        <option value="or">Or</option>
      </Select>

      {/* PREREQUSTIE TYPE = BLOCK */}

      {(localState.type === 'block' || localState.type === 'unit') && (
        <Pane display="flex" alignItems="center" flex="1" marginRight={8}>
          <Pane flex="1">
            <Combobox
              flex="1"
              width="100%"
              id="block"
              selectedItem={data.units.find(u => u?.id === localState.selectedUnitId)}
              items={data.units}
              itemToString={item => item?.name || ''}
              onChange={selected => (localState.selectedUnitId = selected?.id)}
            />
          </Pane>

          {localState.type === 'block' && (
            <Pane flex="1" marginLeft={8}>
              <Combobox
                flex="1"
                width="100%"
                id="block"
                items={unitData.unitBase.blocks}
                itemToString={item => item?.name || ''}
                onChange={selected => (localState.block = selected)}
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
            items={sfiaSkills}
            itemToString={item => (item ? item.name : '')}
            onChange={selected => (localState.sfiaSkillId = selected.id)}
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

      {field === 'prerequisites' && (
        <>
          <Checkbox
            margin={0}
            checked={localState.recommended}
            onChange={e => (localState.recommended = e.currentTarget.checked)}
          />
          <Text display="block" marginLeft={8} marginRight={8}>
            Rec.
          </Text>
        </>
      )}
      {localState.type && (
        <Button
          iconBefore="plus"
          appearance="primary"
          onClick={() => {
            if (!owner.requisites) {
              owner.requisites = [];
            }
            if (localState.type === 'skill') {
              owner.addRequisite(field, {
                id: localState.sfiaSkillId,
                type: 'sfia',
                value: localState.rating,
                recommended: localState.recommended
              });
            } else if (localState.type === 'block') {
              owner.addRequisite(field, {
                id: localState.block.id,
                unitId: localState.selectedUnitId,
                type: 'block',
                recommended: localState.recommended,
                activityId: localState.activityId
              });
            } else if (localState.type === 'unit') {
              owner.addRequisite(field, {
                id: localState.selectedUnitId,
                type: 'unit',
                recommended: localState.recommended
              });
            } else if (localState.type === 'topic') {
              owner.addRequisite(field, {
                id: localState.topicId,
                type: 'topic',
                recommended: localState.recommended
              });
            } else if (localState.type === 'or') {
              owner.addRequisite(field, {
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
};

const AddPrerequisite = observer(AddPrerequisiteInner);

type OrEditorProps = {
  owner: PrerequisiteOwner;
  prerequisite: PrerequisiteModel;
  sfiaSkills: SfiaSkill[];
  unit: Unit;
  blocks: BlockList[];
  topics: Topic[];
  readonly: boolean;
  field: string;
};

const OrEditorInner = ({
  owner,
  prerequisite,
  sfiaSkills,
  unit,
  blocks,
  topics,
  readonly,
  field
}: OrEditorProps) => (
  <Pane display="flex" marginBottom={8}>
    <IconButton
      icon="trash"
      appearance="primary"
      intent="danger"
      marginRight={4}
      onClick={() => {
        owner.removeRequisite(field, prerequisite);
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
            title={null}
            owner={p}
            field={field}
            sfiaSkills={sfiaSkills}
            unit={unit}
            blocks={blocks}
            topics={topics}
            readonly={readonly}
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
);

const OrEditor = observer(OrEditorInner);

const PrerequisitesInner = ({
  owner,
  sfiaSkills,
  unit,
  blocks,
  topics,
  readonly,
  field,
  title
}) => {
  if (readonly && (owner[field] == null || owner[field].length == 0)) {
    return null;
  }
  return (
    <Pane>
      {title && (
        <Heading marginTop={8} marginBottom={8}>
          {title} ({owner[field].length})
        </Heading>
      )}
      <UnorderedList icon="tick" iconColor="success" alignItems="center" margin={0} marginLeft={0}>
        {(owner[field] || []).map((o, i) => {
          if (o.type === 'or') {
            return (
              <OrEditor
                key={i}
                owner={owner}
                prerequisite={o}
                sfiaSkills={sfiaSkills}
                blocks={blocks}
                topics={topics}
                unit={unit}
                field={field}
                readonly={readonly}
              />
            );
          }
          return (
            <PrerequisiteLine
              key={i}
              field={field}
              prerequisite={o}
              sfiaSkills={sfiaSkills}
              owner={owner}
              blocks={blocks}
              topics={topics}
              i={i}
              unit={unit}
              readonly={readonly}
            />
          );
        })}
      </UnorderedList>
      {!readonly && (
        <AddPrerequisite
          sfiaSkills={sfiaSkills}
          owner={owner}
          unit={unit}
          topics={topics}
          field={field}
        />
      )}
    </Pane>
  );
};

const Prerequisites = observer(PrerequisitesInner);

const PrerequisiteEditorInner: React.FC<Props> = ({ owner, unit, readonly, id }) => {
  const [expanded, setExpanded] = React.useState(localStorage.getItem(id) === 'true');

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

  const sfiaSkills = React.useMemo(() => {
    if (loading) {
      return [];
    }
    return [...data.sfia].sort((a, b) => a.name.localeCompare(b.name));
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
          onClick={() => {
            const exp = !expanded;
            setExpanded(exp);
            localStorage.setItem(id, exp.toString());
          }}
        />
        {/* Prerequisites and Recommendations */}
        Relations
      </Heading>

      {expanded && (
        <Pane marginTop={8}>
          <Prerequisites
            sfiaSkills={sfiaSkills}
            owner={owner}
            unit={unit}
            field="prerequisites"
            title="Prerequisites"
            blocks={blocks}
            topics={topics}
            readonly={readonly}
          />

          <Prerequisites
            sfiaSkills={sfiaSkills}
            owner={owner}
            unit={unit}
            field="corequisites"
            title="Corerequisites"
            blocks={blocks}
            topics={topics}
            readonly={readonly}
          />

          <Prerequisites
            sfiaSkills={sfiaSkills}
            owner={owner}
            unit={unit}
            field="equivalent"
            title="Equivalent"
            blocks={blocks}
            topics={topics}
            readonly={readonly}
          />

          <Prerequisites
            sfiaSkills={sfiaSkills}
            owner={owner}
            unit={unit}
            field="incompatible"
            title="Incompatible"
            blocks={blocks}
            topics={topics}
            readonly={readonly}
          />
        </Pane>
      )}
    </Pane>
  );
};

export const PrerequisiteEditor = observer(PrerequisiteEditorInner);

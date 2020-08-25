import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Alert,
  Heading,
  Button,
  IconButton,
  Badge,
  Icon,
  Select,
  TextInput,
  Text,
  SelectField,
  Checkbox
} from 'evergreen-ui';
import Router from 'next/router';
import { State, Block, BlockType as ActivityType, Activity, Unit, AcsKnowledge } from '../types';
import { buildForm, findMaxId, findNumericMaxId } from 'lib/helpers';
import Link from 'next/link';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from '../common/tab';
import { OutcomeEditor } from '../outcomes/outcome_editor';
import { PrerequisiteEditor } from '../prerequisites/prerequisite_editor';
import { TopicBlockEditor } from '../completion_criteria/completion_criteria_editor';
import { TextEditor } from '../common/text_editor';
import { KeywordEditor, TopicEditor } from 'components/common/tag_editors';
import { action, toJS } from 'mobx';
import { Dnd, DragContainer } from 'components/common/dnd';
import { BlockModel, UnitModel, ActivityModel } from 'components/classes';
import units from 'pages/units';

function blockCredits(block: Block) {
  if (block.completionCriteria && block.completionCriteria.credit) {
    return block.completionCriteria.credit;
  }
}

const Handler = ({ dnd }) => (
  <Pane width={10} height={20} marginRight="2" pointer="drag" color="#999" {...dnd.handlerProps}>
    <Icon icon="drag-handle-vertical" size={14} />
  </Pane>
);

const ActivityDetail: React.FC<{
  unit: UnitModel;
  activity: ActivityModel;
  block: BlockModel;
  state: State;
  dnd: Dnd;
  readonly: boolean;
}> = observer(({ block, activity, dnd, unit, readonly }) => {
  const form = React.useMemo(
    () => buildForm(activity, ['name', 'type', 'description', 'lengthHours']),
    [activity]
  );
  const activityModifier = React.useMemo(
    () => ({
      splice(position: number, count: number, element?: ActivityModel): void {
        block.spliceActivity(position, count, element);
      },
      findIndex(condition: (c: Activity) => boolean): number {
        return block.activities.findIndex(condition);
      }
    }),
    [block]
  );

  return (
    <div
      {...dnd.props(activity, activityModifier, true)}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}
    >
      <div style={{ flex: '0 0 10px', marginRight: '8px' }}>
        <Handler dnd={dnd} />
      </div>

      <Badge
        marginRight={8}
        color={
          activity.type === 'knowledge'
            ? 'green'
            : activity.type === 'exam'
            ? 'red'
            : activity.type === 'practical'
            ? 'blue'
            : activity.type === 'assignment'
            ? 'yellow'
            : 'teal'
        }
        title={
          activity.type === 'knowledge'
            ? 'Lecture'
            : activity.type === 'exam'
            ? 'Exam or Assessment'
            : activity.type === 'practical'
            ? 'Practical'
            : activity.type === 'assignment'
            ? 'Assignment or Project'
            : 'WIL'
        }
      >
        {activity.type === 'knowledge'
          ? 'K'
          : activity.type === 'exam'
          ? 'E'
          : activity.type === 'practical'
          ? 'P'
          : activity.type === 'assignment'
          ? 'A'
          : 'W'}
      </Badge>

      {readonly ? (
        <Text is="div" flex={1} size={400}>
          {activity.name}
        </Text>
      ) : (
        <TextInput
          flex="1"
          placeholder="Activity Name"
          value={activity.name}
          onChange={form.name}
          width="100%"
          marginRight={4}
        />
      )}

      {/* <td>
          <TextInput
            placeholder="Activity Description Name"
            value={activity.description}
            onChange={form.description}
            width="100%"
          />
        </td> */}

      {!readonly && (
        <>
          <Select
            flex="0 0 100px"
            value={activity.type}
            id="type"
            placeholder="Activity Type"
            onChange={form.type}
            marginRight={4}
          >
            <option value="">Please Select ...</option>
            <option value="knowledge">Knowledge</option>
            <option value="practical">Practical</option>
            <option value="assignment">Assignment (Project)</option>
            <option value="exam">Exam / Quiz</option>
            <option value="wif">WIL</option>
          </Select>
          <TextInput
            flex="0 0 50px"
            placeholder="Hours"
            width={40}
            marginRight={4}
            value={activity.lengthHours}
            onChange={form.lengthHours}
          />

          <IconButton
            icon="eject"
            iconSize={12}
            width={24}
            marginRight={4}
            intent="warning"
            appearance="primary"
            onClick={() => {
              const clone = activity.toJS();
              unit.addBlock({
                id: findMaxId(unit.blocks),
                name: activity.name,
                outcome: '',
                outcomes: [],
                description: '',
                activities: [clone],
                completionCriteria: {},
                keywords: [],
                prerequisites: [],
                topics: []
              });
              block.spliceActivity(block.activities.indexOf(activity), 1);
            }}
          />

          <IconButton
            icon="trash"
            iconSize={12}
            width={24}
            intent="danger"
            appearance="primary"
            onClick={() => block.spliceActivity(block.activities.indexOf(activity), 1)}
          />
        </>
      )}
    </div>
  );
});

const BlockDetails: React.FC<{
  block: BlockModel;
  state: State;
  unit: UnitModel;
  keywords: string[];
  acs: AcsKnowledge[];
  readonly: boolean;
}> = observer(({ block, state, unit, keywords, acs, readonly }) => {
  const form = React.useMemo(() => buildForm(block, ['name', 'description', 'outcome']), [block]);
  const dnd = React.useMemo(() => new Dnd({ splitColor: 'transparent', id: 'activity' }), []);

  const [expanded, setExpanded] = React.useState(
    block.completionCriteria != null && Object.keys(block.completionCriteria).length > 0
  );
  const view = readonly ? 'view' : 'editor';

  function addBlock(name = '<New Block>') {
    const newBlock: Block = {
      id: findMaxId(unit.blocks),
      name,
      prerequisites: [
        {
          id: block.id,
          type: 'block',
          recommended: true
        }
      ],
      completionCriteria: {},
      description: '',
      keywords: [],
      outcome: '',
      outcomes: [],
      topics: [],
      // credits: 0,
      activities: []
    };
    if (unit) {
      unit.addBlock(newBlock);
    }

    // TODO: sync route
    Router.push(
      `/${view}/[category]/[item]`,
      unit
        ? `/${view}/units/unit-${unit.id}--new-block-${newBlock.id}`
        : `/${view}/blocks/new-block-${newBlock.id}`
      // { shallow: true }
    );
  }

  function addActivity(type: ActivityType, name = '<New Activity>') {
    const newActivity: Activity = {
      id: findMaxId(block.activities),
      name,
      description: '',
      type,
      lengthHours: 2
    };
    block.addActivity(newActivity);
    state.delaySave();
  }

  return (
    <div style={{ flex: 1 }} key={block.id}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Pane display="flex" alignItems="center" marginBottom={8}>
          <Heading size={500} flex="1">
            <Icon marginRight={8} icon="build" size={14} />
            {block.name}
          </Heading>
          {unit && !readonly && (
            <>
              <IconButton
                icon="arrow-up"
                iconSize={12}
                marginRight={2}
                width={20}
                onClick={() => {
                  const index = unit.blocks.findIndex(b => b.id === block.id);
                  if (index >= 1) {
                    unit.removeBlock(index);
                    unit.insertBlock(block, index - 1);
                  }
                }}
              />
              <IconButton
                icon="arrow-down"
                iconSize={12}
                marginRight={2}
                width={20}
                onClick={() => {
                  const index = unit.blocks.findIndex(b => b.id === block.id);
                  if (index < block.activities.length - 1) {
                    unit.removeBlock(index);
                    unit.insertBlock(block, index + 1);
                  }
                }}
              />
            </>
          )}

          {!readonly && (
            <Button
              appearance="primary"
              intent="success"
              marginRight={8}
              iconBefore="plus"
              onClick={() => {
                addBlock();
              }}
            >
              Block
            </Button>
          )}
        </Pane>

        {/* BASIC INFO */}

        {!readonly && (
          <TextInputField
            flex="1"
            label="Name"
            placeholder="Block Name"
            value={block.name}
            onChange={form.name}
            marginBottom={8}
          />
        )}

        {/* ACTIVITIES */}

        <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
          <Pane
            display="flex"
            alignItems="center"
            marginBottom={16}
            paddingBottom={4}
            borderBottom="dashed 1px #dedede"
          >
            <Heading size={500} flex="1">
              Activities
            </Heading>
            {!readonly && (
              <>
                <Button
                  appearance="primary"
                  intent="success"
                  marginRight={8}
                  iconBefore="plus"
                  onClick={() => {
                    addActivity('knowledge', 'Lecture');
                  }}
                >
                  Lecture
                </Button>
                <Button
                  appearance="primary"
                  intent="none"
                  iconBefore="plus"
                  marginRight={8}
                  onClick={() => {
                    addActivity('practical', 'Practical'); // - ' + block.name);
                  }}
                >
                  Practical
                </Button>
                <Button
                  appearance="primary"
                  intent="warning"
                  iconBefore="plus"
                  marginRight={8}
                  onClick={() => {
                    addActivity('assignment', 'Portfolio'); // - ' + block.name);
                  }}
                >
                  Assig.
                </Button>
                <Button
                  appearance="primary"
                  intent="danger"
                  iconBefore="plus"
                  onClick={() => {
                    addActivity('exam', 'Exam');
                  }}
                >
                  Exam
                </Button>
              </>
            )}
          </Pane>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ flex: '0 0 50px' }} />
            <div style={{ flex: 1 }}>
              <Heading size={400}>Name</Heading>
            </div>
            {/* <th style={{ width: '100%' }}>
                    <Heading size={400}>Description</Heading>
                  </th> */}
            {!readonly && (
              <>
                <div style={{ flex: ' 0 0 100px' }}>
                  <Heading size={400}>Type</Heading>
                </div>
                <div style={{ flex: '0 0 78px' }}>
                  <Heading size={400}>Hrs.</Heading>
                </div>
              </>
            )}
          </div>

          <DragContainer>
            {block.activities.map(a => (
              <ActivityDetail
                unit={unit}
                block={block}
                activity={a}
                state={state}
                key={a.id}
                dnd={dnd}
                readonly={readonly}
              />
            ))}
          </DragContainer>
        </Pane>

        {/* PREREQUSTIES */}
        <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
          <PrerequisiteEditor
            state={state}
            owner={block}
            unit={unit}
            activities={block.activities}
            readonly={readonly}
          />
        </Pane>

        {/* COMPLETION CRITERIA */}

        <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
          <Heading
            size={500}
            marginBottom={expanded ? 8 : 0}
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
            Completion Criteria
          </Heading>

          {expanded && (
            <TopicBlockEditor
              block={block.completionCriteria}
              items={block.activities}
              readonly={readonly}
            />
          )}
        </Pane>

        {/* OUTCOMES */}

        <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
          <OutcomeEditor state={state} owner={block} acss={acs} readonly={readonly} />
          {/* <TextEditor owner={block} field="outcome" label="Outcome Description" /> */}
        </Pane>

        {/* DETAILS */}
        <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
          <Heading size={500} marginBottom={16} borderBottom="dashed 1px #dedede">
            Details
          </Heading>

          <TextEditor owner={block} field="outcome" label="Description" readonly={readonly} />

          <Pane display="flex">
            {/* TOPICS */}
            <TopicEditor owner={block} readonly={readonly} />
            {/* KEYWORDS */}
            <KeywordEditor owner={block} keywords={keywords} readonly={readonly} />
          </Pane>

          <Pane display="flex">
            {/* GROUP */}
            <TextInputField
              label="Group"
              id="group"
              value={block.group}
              disabled={readonly}
              onChange={form.group}
              marginRight={8}
            />
            {/* LEVEL */}
            <SelectField
              label="Level"
              id="level"
              onChange={e => (block.level = e.value)}
              marginRight={8}
            >
              <option value="">Please Select ...</option>
              <option value="Fundamentals">Fundamentals</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Applied">Applied</option>
            </SelectField>
            <Checkbox
              margin={0}
              marginTop={30}
              label="Flagged"
              onChange={e => (block.flagged = e.currentTarget.checked)}
              checked={block.flagged}
              disabled={readonly}
            />
          </Pane>
        </Pane>

        <Button
          appearance="primary"
          intent="danger"
          onClick={() => {
            unit.removeBlock(unit.blocks.indexOf(block));
          }}
          iconBefore="trash"
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

type Props = {
  acs: AcsKnowledge[];
  state: State;
  blocks: BlockModel[];
  readonlyBlocks: Block[];
  unit: UnitModel;
  selectedBlockId: string;
  url: (block: Block) => string;
  title?: string;
  readonly: boolean;
  keywords: string[];
};

function createRanges(arr: number[]) {
  let start = null;
  let end = null; // track start and end
  end = start = arr[0];
  let result: string[] = [];
  for (let i = 1; i < arr.length; i++) {
    // as long as entries are consecutive, move end forward
    if (arr[i] == arr[i - 1] + 1) {
      end = arr[i];
    } else {
      // when no longer consecutive, add group to result
      // depending on whether start=end (single item) or not
      if (start == end) result.push(start);
      else result.push(start + '-' + end);

      start = end = arr[i];
    }
  }

  // handle the final group
  if (start == end) result.push(start);
  else result.push(start + '-' + end);

  return result;
}

function requisiteRanges(blocks: Block[], block: Block, recommended: boolean) {
  const prerequisites = (block.prerequisites || [])
    .filter(p => p.type === 'block' && p.recommended === recommended)
    .sort((a, b) =>
      blocks.findIndex(s => s.id === a.id) < blocks.findIndex(s => s.id === b.id) ? -1 : 1
    );

  const indices = prerequisites.map(b => blocks.findIndex(s => s.id === b.id) + 1);
  if (indices.length > 0) {
    return createRanges(indices);
  }
  return [];
}

function blockColor(block: Block) {
  if (!block.activities || block.activities.length === 0) {
    return undefined;
  }
  if (block.activities.some(a => a.type === 'exam')) {
    return 'red';
  }
  if (block.activities.some(a => a.type === 'assignment')) {
    return 'yellow';
  }
  return undefined;
}

const BlocksEditorView: React.FC<Props> = ({
  selectedBlockId,
  url,
  state,
  unit,
  title,
  keywords,
  acs,
  readonly,
  readonlyBlocks
}) => {
  const selectedBlock = selectedBlockId ? unit.blocks.find(b => b.id === selectedBlockId) : null;
  const dnd = React.useMemo(() => new Dnd({ splitColor: 'transparent', id: 'blocks' }), []);
  const view = readonly ? 'view' : 'editor';

  const mergeWithNext = direction =>
    action(() => {
      if (!selectedBlockId) {
        return;
      }
      const blockIndex = unit.blocks.findIndex(b => b.id === selectedBlockId);
      const nextBlock = unit.blocks[blockIndex + direction];

      if (!nextBlock) {
        return;
      }
      const currentBlock = unit.blocks[blockIndex];

      let maxId = findNumericMaxId(currentBlock.activities);

      // reasign ids
      let activities = nextBlock.activities.map(a => ({
        ...a.toJS(),
        id: (maxId++).toString()
      }));

      if (unit.completionCriteria && unit.completionCriteria.criteria) {
        let cc = unit.completionCriteria.criteria.find(c => c.id === nextBlock.id);
        if (cc) {
          // fill in the current block
          currentBlock.completionCriteria.type = 'allOf';

          if (currentBlock.completionCriteria.criteria == null) {
            currentBlock.completionCriteria.criteria = [];
          }
          currentBlock.completionCriteria.addCompletionCriteria({
            ...cc,
            id: activities[0]?.id as any
          });

          // remove from original
          unit.completionCriteria.criteria.splice(unit.completionCriteria.criteria.indexOf(cc), 1);
        }
      }

      // assign new id

      currentBlock.addActivities(activities);
      unit.removeBlock(blockIndex + direction);
    });

  const blockModifier = React.useMemo(
    () => ({
      splice(position: number, count: number, element?: BlockModel): void {
        unit.spliceBlock(position, count, element);
      },
      findIndex(condition: (id: Block) => boolean): number {
        return unit.blocks.findIndex(condition);
      }
    }),
    [unit]
  );

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={300} width={200} marginRight={8}>
        <Pane display="flex">
          {title && (
            <Heading size={500} marginBottom={16} flex="1">
              {title}
            </Heading>
          )}
          {!readonly && (
            <>
              <IconButton
                icon="symbol-triangle-up"
                title="Merge with previous block"
                onClick={mergeWithNext(-1)}
              />
              <IconButton
                icon="symbol-triangle-down"
                title="Merge with next block"
                onClick={mergeWithNext(1)}
              />
            </>
          )}
        </Pane>
        <Tabs>
          <DragContainer>
            {unit.blocks.map((block, index) => (
              <Pane
                display="flex"
                alignItems="center"
                key={block.id}
                {...dnd.props(block, blockModifier, true)}
              >
                {!readonly && <Handler dnd={dnd} />}
                <Pane flex="1" width="130px" marginRight={8}>
                  <Link key={block.id} href={`/${view}/[category]/[item]`} as={url(block)}>
                    <a>
                      <SideTab
                        key={block.id}
                        id={block.id}
                        isSelected={selectedBlock && block.id === selectedBlock.id}
                        aria-controls={`panel-${block.name}`}
                        display="flex"
                        alignItems="center"
                      >
                        <Badge color={blockColor(block)} marginRight={8}>
                          {index + 1}
                        </Badge>

                        {block.name}
                      </SideTab>
                    </a>
                  </Link>
                </Pane>
                <Pane>
                  {blockCredits(block) && (
                    <Badge
                      color={block.activities.some(a => a.type === 'exam') ? 'red' : 'orange'}
                      marginLeft={-4}
                      marginRight={8}
                    >
                      {blockCredits(block)}¢
                    </Badge>
                  )}
                  {requisiteRanges(unit.blocks, block, false).map(r => (
                    <Badge key={r} color={'red'}>
                      {r}
                    </Badge>
                  ))}
                  {requisiteRanges(unit.blocks, block, true).map(r => (
                    <Badge key={r} color={'green'}>
                      {r}
                    </Badge>
                  ))}
                </Pane>
              </Pane>
            ))}
          </DragContainer>
          {readonlyBlocks && (
            <>
              <Heading size={400}>Imported Blocks</Heading>
              {readonlyBlocks.map((b, i) => {
                return (
                  <Link
                    key={b.id}
                    href={`/${view}/[category]/[item]`}
                    as={`/${view}/units/imported-${b.unitId}--${b.name}-${b.id}`}
                  >
                    <a>
                      <SideTab
                        id={b.id}
                        aria-controls={`panel-${b.name}`}
                        display="flex"
                        alignItems="center"
                      >
                        <Badge color="orange" marginRight={8}>
                          {i + 1}
                        </Badge>

                        {b.name}
                      </SideTab>
                    </a>
                  </Link>
                );
              })}
            </>
          )}
        </Tabs>
        {!readonly && (
          <Pane marginTop={16}>
            <AddBlockModal state={state} unit={unit} />
          </Pane>
        )}
      </Tablist>
      {unit.blocks.length === 0 && <Alert flex={1}>There are no units defined</Alert>}
      {selectedBlock && (
        <BlockDetails
          keywords={keywords}
          block={selectedBlock}
          unit={unit}
          state={state}
          acs={acs}
          readonly={readonly}
        />
      )}
    </Pane>
  );
};

export const BlocksEditor = observer(BlocksEditorView);

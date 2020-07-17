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
  Checkbox
} from 'evergreen-ui';
import Router from 'next/router';
import {
  State,
  Block,
  BlockType as ActivityType,
  Activity,
  Unit,
  CompletionCriteria
} from './types';
import { buildForm, findMaxId, findNumericMaxId } from 'lib/helpers';
import Link from 'next/link';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from './tab';
import { OutcomeEditor } from './outcome_editor';
import { PrerequisiteEditor } from './prerequisite_editor';
import { TopicBlockEditor } from './topic_block_editor';
import { TextEditor } from './text_editor';
import { KeywordEditor, TopicEditor } from './tag_editors';
import { action } from 'mobx';

function blockCredits(block: Block) {
  if (block.completionCriteria && block.completionCriteria.credit) {
    return block.completionCriteria.credit;
  }
}

const ActivityDetail: React.FC<{ activity: Activity; block: Block; state: State }> = observer(
  ({ block, activity }) => {
    const form = React.useMemo(
      () => buildForm(activity, ['name', 'type', 'description', 'lengthHours']),
      [activity]
    );

    return (
      <tr>
        <td>
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
        </td>
        <td>
          <TextInput
            placeholder="Activity Name"
            value={activity.name}
            onChange={form.name}
            width="100%"
          />
        </td>
        {/* <td>
          <TextInput
            placeholder="Activity Description Name"
            value={activity.description}
            onChange={form.description}
            width="100%"
          />
        </td> */}
        <td>
          <Select value={activity.type} id="type" placeholder="Activity Type" onChange={form.type}>
            <option value="">Please Select ...</option>
            <option value="knowledge">Knowledge</option>
            <option value="practical">Practical</option>
            <option value="assignment">Assignment (Project)</option>
            <option value="exam">Exam / Quiz</option>
            <option value="wif">WIL</option>
          </Select>
        </td>
        <td>
          <TextInput
            placeholder="Hours"
            width={40}
            value={activity.lengthHours}
            onChange={form.lengthHours}
          />
        </td>
        <td style={{ display: 'flex' }}>
          <IconButton
            icon="arrow-up"
            iconSize={12}
            marginRight={2}
            width={20}
            onClick={() => {
              const index = block.activities.indexOf(activity);
              if (index >= 1) {
                block.activities.splice(index, 1);
                block.activities.splice(index - 1, 0, activity);
              }
            }}
          />
          <IconButton
            icon="arrow-down"
            iconSize={12}
            marginRight={2}
            width={20}
            onClick={() => {
              const index = block.activities.indexOf(activity);
              if (index < block.activities.length - 1) {
                block.activities.splice(index, 1);
                block.activities.splice(index + 1, 0, activity);
              }
            }}
          />
          <IconButton
            icon="trash"
            iconSize={12}
            width={24}
            intent="danger"
            appearance="primary"
            onClick={() => block.activities.splice(block.activities.indexOf(activity), 1)}
          />
        </td>
      </tr>
    );
  }
);

const BlockDetails: React.FC<{ block: Block; state: State; unit: Unit }> = observer(
  ({ block, state, unit }) => {
    const form = React.useMemo(() => buildForm(block, ['name', 'description', 'outcome']), [block]);
    const [expanded, setExpanded] = React.useState(
      block.completionCriteria != null && Object.keys(block.completionCriteria).length > 0
    );

    // merge all keywords from blocks and topics
    let keywords = React.useMemo(() => {
      let keywords = state.courseConfig.blocks.flatMap(b => b.keywords);
      keywords = keywords.filter((item, index) => keywords.indexOf(item) === index).sort();
      return keywords;
    }, []);

    // back
    if (block.completionCriteria == null) {
      block.completionCriteria = {};
    }

    function addBlock(name = '<New Block>') {
      const newBlock: Block = {
        id: findMaxId(state.courseConfig.blocks),
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
        unit.blocks.push(newBlock.id);
      }
      state.courseConfig.blocks.push(newBlock);

      state.save().then(() => {
        Router.push(
          '/editor/[category]/[item]',
          unit
            ? `/editor/units/unit-${unit.id}--new-block-${newBlock.id}`
            : `/editor/blocks/new-block-${newBlock.id}`
          // { shallow: true }
        );
      });
    }

    function addActivity(type: ActivityType, name = '<New Activity>') {
      const newActivity: Activity = {
        id: findMaxId(state.courseConfig.blocks),
        name,
        description: '',
        type,
        lengthHours: 2
      };
      block.activities.push(newActivity);
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
            {unit && (
              <>
                <IconButton
                  icon="arrow-up"
                  iconSize={12}
                  marginRight={2}
                  width={20}
                  onClick={() => {
                    const index = unit.blocks.findIndex(id => id === block.id);
                    if (index >= 1) {
                      unit.blocks.splice(index, 1);
                      unit.blocks.splice(index - 1, 0, block.id);
                    }
                  }}
                />
                <IconButton
                  icon="arrow-down"
                  iconSize={12}
                  marginRight={2}
                  width={20}
                  onClick={() => {
                    const index = unit.blocks.findIndex(id => id === block.id);
                    if (index < block.activities.length - 1) {
                      unit.blocks.splice(index, 1);
                      unit.blocks.splice(index + 1, 0, block.id);
                    }
                  }}
                />
              </>
            )}

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
          </Pane>

          {/* BASIC INFO */}

          <TextInputField
            flex="1"
            label="Name"
            placeholder="Block Name"
            value={block.name}
            onChange={form.name}
            marginBottom={8}
          />

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
            </Pane>

            <table>
              <thead>
                <tr>
                  <th></th>
                  <th style={{ width: '100%' }}>
                    <Heading size={400}>Name</Heading>
                  </th>
                  {/* <th style={{ width: '100%' }}>
                    <Heading size={400}>Description</Heading>
                  </th> */}
                  <th style={{ minWidth: '105px' }}>
                    <Heading size={400}>Type</Heading>
                  </th>
                  <th>
                    <Heading size={400}>Hrs.</Heading>
                  </th>
                  <th style={{ width: '70px' }}></th>
                </tr>
              </thead>
              <tbody>
                {block.activities.map(a => (
                  <ActivityDetail block={block} activity={a} state={state} key={a.id} />
                ))}
              </tbody>
            </table>
          </Pane>

          {/* PREREQUSTIES */}
          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <PrerequisiteEditor
              state={state}
              owner={block}
              unit={unit}
              activities={block.activities}
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
                state={state}
                block={block.completionCriteria}
                items={block.activities}
              />
            )}
          </Pane>

          {/* OUTCOMES */}

          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <OutcomeEditor state={state} owner={block} />
            {/* <TextEditor owner={block} field="outcome" label="Outcome Description" /> */}
          </Pane>

          {/* DESCRIPITION */}
          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <Heading size={500} marginBottom={16} borderBottom="dashed 1px #dedede">
              Details
            </Heading>

            <TextEditor owner={block} field="outcome" label="Description" />

            <Pane display="flex">
              {/* TOPICS */}
              <TopicEditor owner={block} state={state} />
              {/* KEYWORDS */}
              <KeywordEditor owner={block} keywords={keywords} />
            </Pane>
          </Pane>

          <Button
            appearance="primary"
            intent="danger"
            onClick={() => {
              if (confirm('Are you really sure?')) {
                state.courseConfig.blocks.splice(state.courseConfig.blocks.indexOf(block), 1);
                state.courseConfig.units.forEach(u => {
                  let index = u.blocks.findIndex(id => id === block.id);
                  if (index >= 0) {
                    u.blocks.splice(index, 1);
                  }
                });
              }
            }}
            iconBefore="trash"
          >
            Delete
          </Button>
        </Pane>
      </div>
    );
  }
);

type Props = {
  state: State;
  blocks: Block[];
  unit: Unit;
  selectedBlockId: string;
  url: (block: Block) => string;
  title?: string;
  readonly: boolean;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

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
  blocks,
  selectedBlockId,
  url,
  state,
  unit,
  title
}) => {
  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null;

  const mergeWithNext = direction =>
    action(() => {
      if (!selectedBlockId) {
        return;
      }
      const blockIndex = blocks.findIndex(b => b.id === selectedBlockId);
      const nextBlock = blocks[blockIndex + direction];

      if (!nextBlock) {
        return;
      }
      const currentBlock = blocks[blockIndex];

      // reasign ids
      let activities = nextBlock.activities.map(a => ({
        ...a,
        id: findNumericMaxId(currentBlock.activities)
      }));

      if (unit.completionCriteria && unit.completionCriteria.criteria) {
        let cc = unit.completionCriteria.criteria.find(c => c.id === nextBlock.id);
        if (cc) {
          // fill in the current block
          if (currentBlock.completionCriteria == null) {
            currentBlock.completionCriteria = {
              type: 'allOf'
            };
          } else {
            currentBlock.completionCriteria.type = 'allOf';
          }
          if (currentBlock.completionCriteria.criteria == null) {
            currentBlock.completionCriteria.criteria = [];
          }
          currentBlock.completionCriteria.criteria.push({
            ...cc,
            id: activities[0]?.id as any
          });

          // remove from original
          unit.completionCriteria.criteria.splice(unit.completionCriteria.criteria.indexOf(cc), 1);
        }
      }

      // assign new id

      currentBlock.activities.push(...activities);
      blocks.splice(blockIndex + direction, 1);

      unit.blocks.splice(unit.blocks.indexOf(nextBlock.id), 1);
    });

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={300} width={200} marginRight={8}>
        <Pane display="flex">
          {title && (
            <Heading size={500} marginBottom={16} flex="1">
              {title}
            </Heading>
          )}
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
        </Pane>
        <Tabs>
          {blocks.map((block, index) => (
            <Pane display="flex" key={block.id}>
              <Pane flex="1" width="130px" marginRight={8}>
                <Link key={block.id} href="/editor/[category]/[item]" as={url(block)}>
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
                {requisiteRanges(blocks, block, false).map(r => (
                  <Badge key={r} color={'red'}>
                    {r}
                  </Badge>
                ))}
                {requisiteRanges(blocks, block, true).map(r => (
                  <Badge key={r} color={'green'}>
                    {r}
                  </Badge>
                ))}
              </Pane>
            </Pane>
          ))}
        </Tabs>
        <Pane marginTop={16}>
          <AddBlockModal state={state} unit={unit} />
        </Pane>
      </Tablist>
      {state.courseConfig.units.length === 0 && <Alert flex={1}>There are no units defined</Alert>}
      {selectedBlock && <BlockDetails block={selectedBlock} unit={unit} state={state} />}
    </Pane>
  );
};

export const BlocksEditor = observer(BlocksEditorView);

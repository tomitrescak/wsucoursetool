import React from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Alert,
  Heading,
  Button,
  SelectField,
  Combobox,
  IconButton,
  Text,
  TextareaField,
  Autocomplete,
  TagInput,
  Badge,
  Textarea,
  Icon,
  Select,
  TextInput
} from 'evergreen-ui';
import Router from 'next/router';
import { State, Block, Topic, BlockType as ActivityType, Activity, Unit } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';
import marked from 'marked';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from './tab';
import { OutcomeEditor } from './outcome_editor';
import { PrerequisiteEditor } from './prerequisite_editor';
import { TopicBlockEditor } from './topic_block_editor';
import { TextEditor } from './text_editor';

function blockCredits(block: Block) {
  if (block.completionCriteria && block.completionCriteria.credit) {
    return block.completionCriteria.credit;
  }
}

type TagProps = {
  block: Block;
  keywords: string[];
  state: State;
};

const KeywordEditor = observer(({ block, keywords }: TagProps) => {
  return (
    <Pane flex={1}>
      <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
        Keywords
      </Text>
      <Autocomplete
        title="Keywords"
        onChange={undefined}
        onSelect={e => {
          if (block.keywords == null) {
            block.keywords = [];
          }
          block.keywords.push(e);
        }}
        items={keywords}
      >
        {props => {
          const { getInputProps, getRef, inputValue } = props;
          const { value, onChange, ...rest } = getInputProps();
          return (
            <Observer>
              {() => (
                <TagInput
                  id="keywords"
                  inputProps={{ placeholder: 'Add keywords...' }}
                  values={block.keywords}
                  width="100%"
                  onChange={values => {
                    block.keywords = values;
                  }}
                  onRemove={(_value, index) => {
                    block.keywords = block.keywords.filter((b, i) => i !== index);
                  }}
                  onInputChange={onChange}
                  innerRef={getRef}
                  marginBottom={16}
                  {...rest}
                />
              )}
            </Observer>
          );
        }}
      </Autocomplete>
    </Pane>
  );
});

const TopicEditor = observer(({ block, state }: TagProps) => {
  const topics = (block.topics || [])
    .map(id => state.courseConfig.topics.find(t => t.id === id))
    .map(t => t.name);

  return (
    <Pane flex={1} marginRight={8}>
      <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
        Topics
      </Text>
      <Autocomplete
        title="Topics"
        onChange={undefined}
        onSelect={e => {
          if (block.topics == null) {
            block.topics = [];
          }
          const tid = state.courseConfig.topics.find(t => t.name === e).id;
          block.topics.push(tid);
        }}
        items={state.courseConfig.topics.map(t => t.name)}
      >
        {props => {
          const { getInputProps, getRef, inputValue } = props;
          const { value, onChange, ...rest } = getInputProps();
          return (
            <Observer>
              {() => (
                <TagInput
                  id="keywords"
                  inputProps={{ placeholder: 'Add topics...' }}
                  values={topics}
                  width="100%"
                  // onChange={values => {
                  //   block.keywords = values;
                  // }}
                  onRemove={(_value, index) => {
                    block.topics = block.topics.filter((_, i) => i !== index);
                  }}
                  onInputChange={onChange}
                  innerRef={getRef}
                  marginBottom={16}
                  {...rest}
                />
              )}
            </Observer>
          );
        }}
      </Autocomplete>
    </Pane>
  );
});

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
            placeholder="Unit Name"
            value={activity.name}
            onChange={form.name}
            width="100%"
          />
        </td>
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

    // merge all keywords from blocks and topics
    let keywords = React.useMemo(() => {
      let keywords = state.courseConfig.blocks
        .flatMap(b => b.keywords)
        .concat(state.courseConfig.topics.flatMap(b => b.keywords));
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
        credits: 0,
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
      state.save();
    }

    return (
      <div style={{ flex: 1 }} key={block.id}>
        <Pane background="tint3" borderRadius={6} marginLeft={24}>
          <Pane display="flex" alignItems="center" marginBottom={8}>
            <Heading size={500} flex="1">
              <Icon marginRight={8} icon="build" size={14} />
              {block.name}
            </Heading>
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

          <Pane display="flex">
            {/* TOPICS */}
            <TopicEditor block={block} keywords={keywords} state={state} />
            {/* KEYWORDS */}
            <KeywordEditor block={block} keywords={keywords} state={state} />
          </Pane>

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
                  addActivity('knowledge');
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
                  addActivity('practical', 'Practical - ' + block.name);
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
                  addActivity('assignment', 'Portfolio - ' + block.name);
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
            <PrerequisiteEditor state={state} owner={block} />
          </Pane>

          {/* COMPLETION CRITERIA */}

          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <Heading size={500} marginBottom={16} borderBottom="dashed 1px #dedede">
              Completion Criteria
            </Heading>

            <TopicBlockEditor
              state={state}
              unitId={unit ? unit.id : undefined}
              block={block.completionCriteria}
            />
          </Pane>

          {/* OUTCOMES */}

          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <OutcomeEditor state={state} owner={block} />
            <TextEditor owner={block} field="outcome" label="Outcome Description" />
          </Pane>

          {/* DESCRIPITION */}
          <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16}>
            <Heading size={500} marginBottom={16} borderBottom="dashed 1px #dedede">
              Details
            </Heading>

            <TextEditor owner={block} field="description" label="Description" />
          </Pane>
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

const BlocksEditorView: React.FC<Props> = ({
  blocks,
  selectedBlockId,
  url,
  state,
  unit,
  title
}) => {
  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null;

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={400} width={200} marginRight={8}>
        {title && (
          <Heading size={500} marginBottom={16}>
            {title}
          </Heading>
        )}
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
                    >
                      {blockCredits(block) && (
                        <Badge color="red" marginLeft={-4} marginRight={8}>
                          {blockCredits(block)}
                        </Badge>
                      )}
                      &nbsp;{index + 1}&nbsp;-&nbsp;
                      {block.name}
                    </SideTab>
                  </a>
                </Link>
              </Pane>
              <Pane>
                {(block.prerequisites || [])
                  .filter(p => p.type === 'block')
                  .map((p, i) => (
                    <Badge key={p.id + i} color={p.recommended ? 'green' : 'red'}>
                      {blocks.findIndex(s => s.id === p.id) + 1}
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

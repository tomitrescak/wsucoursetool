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
  Textarea
} from 'evergreen-ui';
import Router from 'next/router';
import { State, Block, Topic, BlockType } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';
import marked from 'marked';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from './tab';
import { OutcomeEditor } from './outcome_editor';
import { PrerequisiteEditor } from './prerequisite_editor';
import { TopicBlockEditor } from './topic_block_editor';

function blockCredits(block: Block) {
  if (block.completionCriteria && block.completionCriteria.credit) {
    return block.completionCriteria.credit;
  }
}

const order = ['wil', 'exam', 'assignment', 'practical', 'knowledge'];

const BlockDetails: React.FC<{ block: Block; state: State }> = observer(({ block, state }) => {
  const form = React.useMemo(
    () => buildForm(block, ['name', 'type', 'description', 'outcome', 'lengthHours']),
    [block]
  );
  const topics = state.courseConfig.topics.filter(t => (t.blocks || []).some(b => b === block.id));
  const localState = useLocalStore(() => ({
    isDescriptionPreview: false,
    isOutcomePreview: false
  }));
  const [selectedTopic, setTopic] = React.useState<Topic>(null);

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

  function addBlock(type: BlockType, name = '<New Block>') {
    const newBlock: Block = {
      id: findMaxId(state.courseConfig.blocks),
      name,
      mappedUnitId: block.mappedUnitId,
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
      lengthHours: 2,
      type: type
    };
    state.courseConfig.blocks.push(newBlock);

    state.save().then(() => {
      Router.push(
        block.mappedUnitId
          ? `/editor/units/unit-${block.mappedUnitId}--new-block-${newBlock.id}`
          : `/editor/blocks/new-block-${newBlock.id}`
      );
    });
  }

  return (
    <div style={{ flex: 1 }} key={block.id}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Pane display="flex" alignItems="center">
          <Heading size={500} marginBottom={16} flex="1">
            {block.name}
          </Heading>
          <Button
            appearance="primary"
            intent="success"
            marginRight={8}
            onClick={() => {
              addBlock('knowledge');
            }}
          >
            + Lecture
          </Button>
          <Button
            appearance="primary"
            intent="none"
            marginRight={8}
            onClick={() => {
              addBlock('practical', 'Practical - ' + block.name);
            }}
          >
            + Practical
          </Button>
          <Button
            appearance="primary"
            intent="warning"
            marginRight={8}
            onClick={() => {
              addBlock('assignment', 'Portfolio - ' + block.name);
            }}
          >
            + Assig.
          </Button>
          <Button
            appearance="primary"
            intent="danger"
            onClick={() => {
              addBlock('exam', 'Exam');
            }}
          >
            + Exam
          </Button>
        </Pane>
        <Pane display="flex">
          <TextInputField
            flex="1"
            label="Name"
            placeholder="Unit Name"
            value={block.name}
            onChange={form.name}
            marginBottom={8}
          />
          <TextInputField
            flex="0 0 80px"
            label="Length (hrs)"
            placeholder="Hours"
            value={block.lengthHours}
            onChange={form.lengthHours}
            marginBottom={8}
            marginLeft={8}
          />
        </Pane>
        <SelectField
          value={block.type}
          label="Type"
          id="type"
          placeholder="Block Type"
          onChange={form.type}
          marginBottom={8}
        >
          <option value="">Please Select ...</option>
          <option value="knowledge">Knowledge</option>
          <option value="practical">Practical</option>
          <option value="assignment">Assignment (Project)</option>
          <option value="exam">Exam / Quiz</option>
          <option value="wif">WIL</option>
        </SelectField>

        {/* PREREQUSTIES */}
        <PrerequisiteEditor state={state} owner={block} />

        {/* OUTCOMES */}
        {block.type !== 'knowledge' && block.type !== 'practical' && (
          <Pane marginTop={16}>
            <OutcomeEditor state={state} owner={block} />

            {/* COMPLETION CRITERIA */}

            <Heading size={400} marginTop={16} marginBottom={16}>
              Completion Criteria
            </Heading>
            <TopicBlockEditor
              state={state}
              unitId={block.mappedUnitId}
              block={block.completionCriteria}
            />

            {/* OUTCOME DESCRIPTION */}
            <Text
              is="label"
              htmlFor="outcome"
              fontWeight={500}
              marginBottom={8}
              marginTop={16}
              display="block"
            >
              Outcome Description{' '}
              <Badge
                cursor="pointer"
                onClick={() => (localState.isOutcomePreview = !localState.isOutcomePreview)}
              >
                {localState.isOutcomePreview ? 'Editor' : 'Preview'}
              </Badge>
            </Text>
            {localState.isOutcomePreview ? (
              <Text dangerouslySetInnerHTML={{ __html: marked(block.outcome) }} />
            ) : (
              <Textarea id="outcome" value={block.outcome} onChange={form.outcome} />
            )}
          </Pane>
        )}

        {/* DESCRIPITION */}

        <Text
          is="label"
          htmlFor="description"
          fontWeight={500}
          marginTop={16}
          marginBottom={8}
          display="block"
        >
          Description{' '}
          <Badge
            cursor="pointer"
            onClick={() => (localState.isDescriptionPreview = !localState.isDescriptionPreview)}
          >
            {localState.isDescriptionPreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isDescriptionPreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(block.description) }} />
        ) : (
          <Textarea id="description" value={block.description} onChange={form.description} />
        )}

        {/* KEYWORDS */}

        <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
          Keywords
        </Text>
        <Autocomplete
          title="Fruits"
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

        {/* TOPICS */}

        <Text is="label" htmlFor="topic" fontWeight={500} marginBottom={8} display="block">
          Belongs to Topic
        </Text>

        {topics.map((t, i) => (
          <Pane key={t.id} display="flex" alignItems="center" marginBottom={8}>
            <IconButton
              flex="0 0 40px"
              icon="trash"
              intent="danger"
              appearance="primary"
              marginRight={8}
              onClick={() => {
                t.blocks.splice(
                  t.blocks.findIndex(b => b === block.id),
                  1
                );
              }}
            />{' '}
            <Text>{t.name}</Text>
          </Pane>
        ))}

        <Pane display="flex" marginBottom={16}>
          <Combobox
            flex="1"
            width="100%"
            id="topic"
            items={state.courseConfig.topics}
            itemToString={item => (item ? item.name : '')}
            onChange={selected => setTopic(selected)}
          />
          <Button
            marginLeft={8}
            iconBefore="plus"
            appearance="primary"
            onClick={() => {
              if (!selectedTopic.blocks) {
                selectedTopic.blocks = [];
              }
              selectedTopic.blocks.push(block.id);
            }}
          >
            Add
          </Button>
        </Pane>

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              state.courseConfig.blocks.splice(
                state.courseConfig.blocks.findIndex(p => p === block),
                1
              );
            }
          }}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  blocks: Block[];
  unitId: string;
  unitName: string;
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
  unitId,
  unitName,
  title
}) => {
  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null;

  const sorted: Block[] = [];
  const original = [
    ...blocks.sort((a, b) => {
      const o1 = order.indexOf(a.type);
      const o2 = order.indexOf(b.type);
      return o1 < o2 ? -1 : 1;
    })
  ];
  let i = 0;
  while (sorted.length !== blocks.length) {
    for (let i = original.length - 1; i >= 0; i--) {
      const block = original[i];
      if (
        block.prerequisites == null ||
        block.prerequisites.length === 0 ||
        block.prerequisites.every(b => original.every(o => o.id !== b.id))
      ) {
        sorted.push(block);
        original.splice(i, 1);
      }
    }
    if (i++ > 1000) {
      throw new Error('Infinite!');
    }
  }

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={400} width={200} marginRight={8}>
        {title && (
          <Heading size={500} marginBottom={16}>
            {title}
          </Heading>
        )}
        <Tabs>
          {sorted.map((block, index) => (
            <Pane display="flex">
              <Pane flex="1" width="130px" marginRight={8}>
                <Link key={block.id} href="/editor/[category]/[item]" as={url(block)}>
                  <a>
                    <SideTab
                      key={block.id}
                      id={block.id}
                      isSelected={selectedBlock && block.id === selectedBlock.id}
                      aria-controls={`panel-${block.name}`}
                    >
                      <Badge
                        marginRight={8}
                        marginLeft={
                          block.prerequisites &&
                          block.prerequisites.length > 0 &&
                          block.type !== 'knowledge'
                            ? 8
                            : 0
                        }
                        color={
                          block.type === 'knowledge'
                            ? 'green'
                            : block.type === 'exam'
                            ? 'red'
                            : block.type === 'practical'
                            ? 'blue'
                            : block.type === 'assignment'
                            ? 'yellow'
                            : 'teal'
                        }
                      >
                        {block.type === 'knowledge'
                          ? 'K'
                          : block.type === 'exam'
                          ? 'E'
                          : block.type === 'practical'
                          ? 'P'
                          : block.type === 'assignment'
                          ? 'A'
                          : 'W'}
                      </Badge>
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
                {block.prerequisites
                  .filter(p => p.type === 'block')
                  .map((p, i) => (
                    <Badge key={p.id + i} color={p.recommended ? 'green' : 'red'}>
                      {sorted.findIndex(s => s.id === p.id) + 1}
                    </Badge>
                  ))}
              </Pane>
            </Pane>
          ))}
        </Tabs>
        <Pane marginTop={16}>
          <AddBlockModal state={state} unitId={unitId} unitName={unitName} />
        </Pane>
      </Tablist>
      {state.courseConfig.units.length === 0 && <Alert flex={1}>There are no units defined</Alert>}
      {selectedBlock && <BlockDetails block={selectedBlock} state={state} />}
    </Pane>
  );
};

export const BlocksEditor = observer(BlocksEditorView);

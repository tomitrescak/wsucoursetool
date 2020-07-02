import React from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Heading,
  Button,
  Textarea,
  Badge,
  IconButton,
  Text,
  Autocomplete,
  TagInput
} from 'evergreen-ui';
import { State, Topic } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { PrerequisiteEditor } from './prerequisite_editor';
import { OutcomeEditor } from './outcome_editor';
import { TopicBlockEditor } from './topic_block_editor';

type KeywordProps = {
  item: Topic;
  keywords: string;
};
const KeywordEditor = ({ item, keywords }: KeywordProps) => {
  return (
    <Pane>
      {/* KEYWORDS */}

      <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
        Keywords
      </Text>
      <Autocomplete
        title="Fruits"
        onChange={undefined}
        onSelect={e => {
          if (item.keywords == null) {
            item.keywords = [];
          }
          item.keywords.push(e);
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
                  values={item.keywords}
                  width="100%"
                  onChange={values => {
                    item.keywords = values;
                  }}
                  onRemove={(_value, index) => {
                    item.keywords = item.keywords.filter((b, i) => i !== index);
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
};

const Details: React.FC<{ item: Topic; state: State }> = observer(({ item, state }) => {
  const localState = useLocalStore(() => ({
    isPreview: false,
    isOutcomePreview: false,
    acsId: '',
    rating: 0,
    bloom: -1
  }));
  const form = React.useMemo(() => buildForm(item, ['name', 'description', 'outcome']), [item]);
  let keywords = React.useMemo(() => {
    let keywords = state.courseConfig.blocks
      .flatMap(b => b.keywords)
      .concat(state.courseConfig.topics.flatMap(b => b.keywords));
    keywords = keywords.filter((item, index) => keywords.indexOf(item) === index).sort();
    return keywords;
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextInputField
          label="Name"
          placeholder="Name"
          value={item.name}
          onChange={form.name}
          marginBottom={8}
        />
        <Text is="label" htmlFor="description" fontWeight={500} marginBottom={8} display="block">
          Description{' '}
          <Badge cursor="pointer" onClick={() => (localState.isPreview = !localState.isPreview)}>
            {localState.isPreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isPreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(item.description) }} />
        ) : (
          <Textarea value={item.description} onChange={form.description} />
        )}

        {/* Outcome */}
        <Text is="label" htmlFor="outcome" fontWeight={500} marginBottom={8} display="block">
          Outcome Description{' '}
          <Badge
            cursor="pointer"
            onClick={() => (localState.isOutcomePreview = !localState.isOutcomePreview)}
          >
            {localState.isOutcomePreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isOutcomePreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(item.outcome) }} />
        ) : (
          <Textarea id="outcome" value={item.outcome} onChange={form.outcome} />
        )}

        {/* BLOCKS */}

        <Pane background="tint2" marginTop={16} padding={16} borderRadius={6}>
          <Heading htmlFor="topic" fontWeight={500} marginBottom={8} display="block">
            Blocks
          </Heading>

          {item.blocks.map((b, i) => (
            <Pane display="flex" alignItems="center">
              <IconButton
                flex="0 0 40px"
                icon="trash"
                intent="danger"
                appearance="primary"
                marginRight={16}
                onClick={() => {
                  item.blocks.splice(i, 1);
                }}
              />
              <Link
                key={b}
                href={`/editor/[category]/[item]`}
                as={`/editor/blocks/${url(
                  state.courseConfig.blocks.find(l => l.id === b).name
                )}-${b}`}
              >
                <a>
                  <Text>{state.courseConfig.blocks.find(l => l.id === b).name}</Text>
                </a>
              </Link>
            </Pane>
          ))}
        </Pane>

        <Pane display="flex" background="tint2" marginTop={16} padding={16} borderRadius={6}>
          {/* PREREQUSTIES */}
          <PrerequisiteEditor state={state} owner={item} />

          {/* OUTCOMES */}
          <OutcomeEditor state={state} owner={item} />
        </Pane>

        {/* COMPLETION CRITERIA */}

        <Pane background="tint2" marginTop={16} padding={16} borderRadius={6}>
          <Heading htmlFor="topic" fontWeight={500} marginBottom={8} display="block">
            Completion Criteria
          </Heading>

          <TopicBlockEditor state={state} block={item.completion} />
        </Pane>

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              state.courseConfig.topics.splice(
                state.courseConfig.topics.findIndex(p => p === item),
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

const DetailsReadonly: React.FC<{ item: Topic }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextField label="Description" html={marked(item.description)} />
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  readonly: boolean;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId ? state.courseConfig.topics.find(b => b.id === selectedId) : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {state.courseConfig.topics.map(topic => (
            <Link
              key={topic.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/topics/${url(topic.name)}-${topic.id}`}
            >
              <a>
                <SideTab
                  key={topic.id}
                  id={topic.id}
                  isSelected={selectedItem && topic.id === selectedItem.id}
                  aria-controls={`panel-${topic.name}`}
                >
                  {topic.name}
                </SideTab>
              </a>
            </Link>
          ))}
        </Tabs>
        {!readonly && (
          <Pane marginTop={16} display="flex" alignItems="center">
            <TextInputField
              flex={1}
              label="Name"
              value={localState.name}
              placeholder="Please specify name ..."
              onChange={form.name}
              marginRight={4}
            />
            <IconButton
              appearance="primary"
              intent="success"
              icon="plus"
              onClick={() => {
                state.courseConfig.topics.push({
                  id: findMaxId(state.courseConfig.topics),
                  name: localState.name,
                  description: '',
                  prerequisites: [],
                  outcomes: [],
                  blocks: [],
                  completion: {},
                  keywords: [],
                  outcome: ''
                });
              }}
            />
          </Pane>
        )}
      </Tablist>

      {selectedItem &&
        (readonly ? (
          <DetailsReadonly item={selectedItem} />
        ) : (
          <Details item={selectedItem} state={state} />
        ))}
    </Pane>
  );
};

export const TopicEditor = observer(EditorView);

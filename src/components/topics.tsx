import React from 'react';
import { observer, useLocalStore, Observer } from 'mobx-react';
import { TextInputField, Pane, Tablist, Heading, Button, IconButton } from 'evergreen-ui';
import { State, Topic } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { TextEditor } from './text_editor';
import { VerticalPane } from './vertical_pane';

type KeywordProps = {
  item: Topic;
  keywords: string;
};

const Details: React.FC<{ item: Topic; state: State }> = observer(({ item, state }) => {
  const form = React.useMemo(() => buildForm(item, ['name', 'description']), [item]);

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

        <TextEditor owner={item} field="description" label="Description" />

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
    <>
      <VerticalPane title="Topic List">
        <Tablist flexBasis={200} width={200} marginRight={8}>
          <Tabs>
            {state.courseConfig.topics
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(topic => (
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
                    description: ''
                  });
                }}
              />
            </Pane>
          )}
        </Tablist>
      </VerticalPane>

      <VerticalPane title="Topic" shrink={true}>
        {selectedItem &&
          (readonly ? (
            <DetailsReadonly item={selectedItem} />
          ) : (
            <Details item={selectedItem} state={state} />
          ))}
      </VerticalPane>
    </>
  );
};

export const TopicEditor = observer(EditorView);

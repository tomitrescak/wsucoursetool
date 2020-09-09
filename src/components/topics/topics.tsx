import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Heading,
  Button,
  IconButton,
  toaster,
  Badge,
  Text
} from 'evergreen-ui';
import { State, Topic, Entity } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from 'components/common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { TextEditor } from 'components/common/text_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { model, Model, prop, modelAction, undoMiddleware } from 'mobx-keystone';
import { TopicModel } from 'components/classes';
import { useSaveConfigMutation, useTopicsDetailsQuery, TopicDetails } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

@model('Editor/Topics')
class TopicEditorModel extends Model({
  items: prop<TopicModel[]>()
}) {
  @modelAction
  add(pre: Entity) {
    this.items.push(new TopicModel(pre));
  }

  @modelAction
  remove(ix: number) {
    this.items.splice(ix, 1);
  }
}

type KeywordProps = {
  item: Topic;
  keywords: string;
};

const Details: React.FC<{ item: Topic; owner: TopicEditorModel }> = observer(({ item, owner }) => {
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

        <TextEditor owner={item} field="description" label="Description" readonly={false} />

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              owner.remove(owner.items.findIndex(p => p === item));
            }
          }}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

const DetailsReadonly: React.FC<{ item: TopicDetails }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextField
          label="Description"
          html={marked(item.description || 'This topic has no description')}
        />

        <Pane marginTop={16}>
          <Heading size={400}>Blocks</Heading>
          {item.blocks.length === 0 && <Text>This topic is not covered in any block</Text>}

          <ul>
            {item.blocks.map(b => (
              <li key={b.unitId + '_' + b.blockId}>
                <Link
                  href={`/view/[category]/[item]`}
                  as={`/view/units/${url(b.unitName)}-${b.unitId}`}
                >
                  <a>
                    <Text>{b.unitName}</Text>
                  </a>
                </Link>
                {' > '}
                <Link
                  href={`/view/[category]/[item]`}
                  as={`/view/units/${url(b.unitName)}-${b.unitId}--${url(b.blockName)}-${
                    b.blockId
                  }`}
                >
                  <a>
                    <Text>{b.blockName}</Text>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </Pane>
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

  const localState = useLocalStore(() => ({
    name: ''
  }));

  const { loading, error, data, refetch } = useTopicsDetailsQuery();
  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError() {
      toaster.danger('Error ;(');
    }
  });

  const model = React.useMemo(() => {
    if (data) {
      let model = new TopicEditorModel({
        items: data.topicsDetails.map(t => new TopicModel(t))
      });
      state.undoManager = undoMiddleware(model);
      state.save = () => {
        const body = model.items.map(i => i.toJS());
        save({
          variables: {
            body,
            part: 'topics'
          }
        });
      };
      return model;
    }
    return null;
  }, [data]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem = selectedId ? model.items.find(b => b.id === selectedId) : null;

  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <>
      <VerticalPane title="Topic List">
        <Tablist flexBasis={200} width={200} marginRight={8}>
          <Tabs>
            {model.items
              .slice()
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
                      {topic.name} <Badge marginLeft={8}>{topic.blocks.length}</Badge>
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
                  model.add({
                    id: findMaxId(model.items),
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
            <Details item={selectedItem} owner={model} />
          ))}
      </VerticalPane>
    </>
  );
};

export const TopicEditor = observer(EditorView);

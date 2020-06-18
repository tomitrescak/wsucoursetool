import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Alert,
  Heading,
  Button,
  Textarea,
  Badge,
  IconButton,
  Text
} from 'evergreen-ui';
import { State, Specialisation } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { PrerequisiteEditor } from './prerequisite_editor';

const Details: React.FC<{ item: Specialisation; state: State }> = observer(({ item, state }) => {
  const localState = useLocalStore(() => ({ isPreview: false, acsId: '', rating: 0, bloom: -1 }));
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

        <Pane display="flex" background="tint2" marginTop={16} padding={16} borderRadius={6}>
          {/* PREREQUSTIES */}
          <PrerequisiteEditor state={state} owner={item} />
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

const DetailsReadonly: React.FC<{ item: Specialisation }> = observer(({ item }) => {
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
  const selectedItem = selectedId
    ? state.courseConfig.specialisations.find(b => b.id === selectedId)
    : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {state.courseConfig.specialisations.map(specialisation => (
            <Link
              key={specialisation.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/specialisations/${url(specialisation.name)}-${specialisation.id}`}
            >
              <a>
                <SideTab
                  key={specialisation.id}
                  id={specialisation.id}
                  isSelected={selectedItem && specialisation.id === selectedItem.id}
                  aria-controls={`panel-${specialisation.name}`}
                >
                  {specialisation.name}
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
                state.courseConfig.specialisations.push({
                  id: findMaxId(state.courseConfig.acsKnowledge),
                  name: localState.name,
                  description: '',
                  prerequisites: []
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

export const SpecialisationEditor = observer(EditorView);

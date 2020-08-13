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
  Text,
  toaster
} from 'evergreen-ui';
import { State, Specialisation, Entity } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from '../common/tab';
import marked from 'marked';
import Router, { useRouter } from 'next/router';
import { PrerequisiteEditor } from '../prerequisites/prerequisite_editor';
import {
  useCreateSpecialisationMutation,
  useSpecialisationsQuery,
  useSpecialisationQuery,
  useDeleteSpecialisationMutation,
  useSaveConfigMutation
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { createSpecialisation } from 'components/classes';
import { undoMiddleware } from 'mobx-keystone';
import { TextEditor } from 'components/common/text_editor';

const Details: React.FC<{
  item: Entity;
  state: State;
  refetch: Function;
}> = observer(({ item, state, refetch }) => {
  const { loading, error, data } = useSpecialisationQuery({
    variables: {
      id: item.id
    }
  });
  const [deleteSpecialisation] = useDeleteSpecialisationMutation({
    onCompleted() {
      toaster.notify('Specialisation deleted. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });
  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const specialisation = React.useMemo(() => {
    if (data) {
      const specialisation = createSpecialisation(data.specialisation);
      state.undoManager = undoMiddleware(specialisation);
      state.save = () =>
        save({
          variables: {
            body: specialisation.toJS(),
            part: 'specialisation',
            id: item.id
          }
        }).then(() => refetch());
      return specialisation;
    }
    return null;
  }, [data]);

  const form = React.useMemo(() => buildForm(specialisation, ['name', 'description']), [item]);
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextInputField
          label="Name"
          placeholder="Name"
          value={specialisation.name}
          onChange={form.name}
          marginBottom={8}
        />

        <TextEditor
          field="description"
          label="Description"
          owner={specialisation}
          readonly={false}
        />

        <Pane display="flex" background="tint2" marginTop={16} padding={16} borderRadius={6}>
          {/* PREREQUSTIES */}
          <PrerequisiteEditor state={state} owner={specialisation} unit={null} readonly={false} />
        </Pane>

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure? This action cannot be undone!')) {
              deleteSpecialisation({
                variables: {
                  id: item.id
                }
              }).then(() => {
                refetch();
                Router.push('/editor/[category]', `/editor/specialisations`);
              });
            }
          }}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

const DetailsReadonly: React.FC<{ item: Entity }> = observer(({ item }) => {
  const { loading, error, data } = useSpecialisationQuery({
    variables: {
      id: item.id
    }
  });
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }
  const specialisation: Specialisation = data.specialisation;

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {specialisation.name}
        </Heading>

        <TextField label="Description" html={marked(specialisation.description)} />
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

  const [createSpecialisation] = useCreateSpecialisationMutation({
    onCompleted() {
      toaster.notify('Specialisation created. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const localState = useLocalStore(() => ({
    name: ''
  }));

  const { loading, error, data, refetch } = useSpecialisationsQuery();
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem = selectedId ? data.specialisations.find(b => b.id === selectedId) : null;
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {data.specialisations.map(specialisation => (
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
                createSpecialisation({
                  variables: {
                    id: findMaxId(data.specialisations),
                    name: localState.name
                  }
                }).then(() => {
                  refetch();
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
          <Details item={selectedItem} state={state} refetch={refetch} />
        ))}
    </Pane>
  );
};

export const SpecialisationEditor = observer(EditorView);

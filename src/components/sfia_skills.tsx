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
  Combobox
} from 'evergreen-ui';
import { State, Job, SfiaSkill } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';

const Details: React.FC<{ item: SfiaSkill; state: State }> = observer(({ item, state }) => {
  const localState = useLocalStore(() => ({ isPreview: false }));
  const form = React.useMemo(() => buildForm(item, ['name', 'description']), [item]);
  const items = state.courseConfig.acsKnowledge.map(m => m.items).flat();
  const selected = item.acsSkillId ? items.find(i => i.id === item.acsSkillId) : null;
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextInputField
          label="Name"
          id="skillName"
          placeholder="Name"
          value={item.name}
          onChange={form.name}
          marginBottom={8}
        />

        <Text fontWeight={500} htmlFor="mapping" marginBottom={4} display="block">
          ACS Mapping
        </Text>

        <Combobox
          id="mapping"
          initialSelectedItem={{ label: '' }}
          items={items}
          itemToString={item => (item ? item.name : '')}
          selectedItem={selected}
          onChange={selected => (item.acsSkillId = selected.id)}
        />

        {/* <Text is="label" htmlFor="description" fontWeight={500} marginBottom={8} display="block">
          Description{' '}
          <Badge cursor="pointer" onClick={() => (localState.isPreview = !localState.isPreview)}>
            {localState.isPreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isPreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(item.description) }} />
        ) : (
          <Textarea value={item.description} onChange={form.description} />
        )} */}

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              state.courseConfig.sfiaSkills.splice(
                state.courseConfig.sfiaSkills.findIndex(p => p === item),
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

const DetailsReadonly: React.FC<{ item: SfiaSkill }> = observer(({ item }) => {
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

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId
    ? state.courseConfig.sfiaSkills.find(b => b.id === selectedId)
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
          {state.courseConfig.sfiaSkills
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(block => (
              <Link
                key={block.id}
                href={`/${view}/[category]/[item]`}
                as={`/${view}/sfia-skills/${url(block.name)}-${block.id}`}
              >
                <a>
                  <SideTab
                    key={block.id}
                    id={block.id}
                    isSelected={selectedItem && block.id === selectedItem.id}
                    aria-controls={`panel-${block.name}`}
                  >
                    {!block.acsSkillId && <Badge>No Mapping</Badge>}
                    {block.name}
                  </SideTab>
                </a>
              </Link>
            ))}
        </Tabs>
        {!readonly && (
          <Pane marginTop={16} display="flex" alignItems="center">
            <TextInputField
              flex={1}
              id="newSkillName"
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
                state.courseConfig.sfiaSkills.push({
                  id: findMaxId(state.courseConfig.sfiaSkills),
                  name: localState.name,
                  description: '',
                  acsSkillId: ''
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

export const SfiaEditor = observer(EditorView);

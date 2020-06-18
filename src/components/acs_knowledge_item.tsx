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
import { State, Block, AcsKnowledge, Entity } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';

const Details: React.FC<{ item: Entity; state: State }> = observer(({ item, state }) => {
  const localState = useLocalStore(() => ({ isPreview: false }));
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
        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              state.courseConfig.acsKnowledge.splice(
                state.courseConfig.acsKnowledge.findIndex(p => p === item),
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

const DetailsReadonly: React.FC<{ item: Entity }> = observer(({ item }) => {
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
  acs: AcsKnowledge;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

const AcsKnowledgeItemView: React.FC<Props> = ({ state, acs, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit && mainSplit.length > 1 ? mainSplit[1].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId ? acs.items.find(b => b.id === selectedId) : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {acs.items.map(item => (
            <Link
              key={item.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/acs-skills/${url(acs.name)}-${acs.id}--${url(item.name)}-${item.id}`}
            >
              <a>
                <SideTab
                  key={item.id}
                  id={item.id}
                  isSelected={selectedItem && item.id === selectedItem.id}
                  aria-controls={`panel-${item.name}`}
                >
                  {item.name}
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
                acs.items.push({
                  id: findMaxId(acs.items),
                  name: localState.name,
                  description: ''
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

export const AcsKnowledgeItem = observer(AcsKnowledgeItemView);

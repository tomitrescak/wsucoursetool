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
  Icon
} from 'evergreen-ui';
import { State, Block, AcsKnowledge } from './types';
import { buildForm, findMaxId, url, viewType } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { AcsKnowledgeItem } from './acs_knowledge_item';

// const Details: React.FC<{ item: AcsKnowledge; state: State }> = observer(({ item, state }) => {
//   const localState = useLocalStore(() => ({ isPreview: false }));
//   const form = React.useMemo(() => buildForm(item, ['name', 'description']), [item]);

//   return (
//     <div style={{ flex: 1 }}>
//       <Pane background="tint3" borderRadius={6} marginLeft={24}>
//         <Heading size={500} marginBottom={16}>
//           {item.name}
//         </Heading>

//         <TextInputField
//           label="Name"
//           placeholder="Name"
//           value={item.name}
//           onChange={form.name}
//           marginBottom={8}
//         />

//         <Button
//           intent="danger"
//           iconBefore="trash"
//           appearance="primary"
//           marginTop={8}
//           onClick={() => {
//             if (confirm('Are You Sure?')) {
//               state.courseConfig.acsKnowledge.splice(
//                 state.courseConfig.acsKnowledge.findIndex(p => p === item),
//                 1
//               );
//             }
//           }}
//         >
//           Delete
//         </Button>
//       </Pane>
//     </div>
//   );
// });

const DetailsReadonly: React.FC<{ item: AcsKnowledge }> = observer(({ item }) => {
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

const AcsEditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId
    ? state.courseConfig.acsKnowledge.find(b => b.id === selectedId)
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
          {state.courseConfig.acsKnowledge.map(block => (
            <Link
              key={block.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/acs-skills/${url(block.name)}-${block.id}`}
            >
              <a>
                <SideTab
                  key={block.id}
                  id={block.id}
                  isSelected={selectedItem && block.id === selectedItem.id}
                  aria-controls={`panel-${block.name}`}
                >
                  {block.name}
                </SideTab>
              </a>
            </Link>
          ))}
          <a href="https://www.acs.org.au/msa/acs-core-body-of-knowledge-for-ict-professionals-cbok.html">
            <SideTab borderTop="1px dotted #dedede">
              <Pane display="flex" alignItems="center">
                <Icon icon="link" marginRight={4} />
                ACS Core Body of Knowledge
              </Pane>
            </SideTab>
          </a>
        </Tabs>
        {!readonly && (
          <Pane marginTop={16} display="flex" alignItems="center">
            <TextInputField
              flex={1}
              label="Block Name"
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
                state.courseConfig.acsKnowledge.push({
                  id: findMaxId(state.courseConfig.acsKnowledge),
                  name: localState.name,
                  description: '',
                  items: []
                });
              }}
            />
          </Pane>
        )}
      </Tablist>

      {selectedItem && <AcsKnowledgeItem acs={selectedItem} readonly={readonly} state={state} />}
      {/* {selectedItem &&
        (readonly ? (
          <DetailsReadonly item={selectedItem} />
        ) : (
          <Details item={selectedItem} state={state} />
        ))} */}
    </Pane>
  );
};

export const AcsEditor = observer(AcsEditorView);

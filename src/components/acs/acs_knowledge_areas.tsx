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
  Icon,
  toaster
} from 'evergreen-ui';
import { State, Block, AcsKnowledge } from '../types';
import { buildForm, findMaxId, url, viewType } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from '../common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { AcsKnowledgeItem } from './acs_knowledge_item';
import { useAcsQuery, useSaveConfigMutation } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { model, Model, prop, modelAction, undoMiddleware, getSnapshot } from 'mobx-keystone';
import { AcsSkillModel, createAcs, createAcss } from 'components/classes';
import { AcsReadonly } from './acs_readonly';

type Props = {
  state: State;
  readonly: boolean;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

@model('Editor/Acs')
class AcsEditorModel extends Model({
  items: prop<AcsSkillModel[]>()
}) {
  @modelAction
  add(pre: AcsKnowledge) {
    this.items.push(createAcs(pre));
  }

  @modelAction
  remove(ix: number) {
    this.items.splice(ix, 1);
  }
}

const AcsEditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const localState = useLocalStore(() => ({
    name: ''
  }));

  const { loading, error, data, refetch } = useAcsQuery();
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
      let model = new AcsEditorModel({
        items: createAcss(data.acs)
      });
      state.undoManager = undoMiddleware(model);
      state.save = () => {
        const body = model.items.map(i => i.toJS());
        save({
          variables: {
            body,
            part: 'acs'
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

  const acs = model.items;

  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId ? acs.find(b => b.id === selectedId) : null;

  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {acs.map(block => (
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
                <Icon size={14} icon="link" marginRight={4} />
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
                model.add({
                  id: findMaxId(acs),
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
    </Pane>
  );
};

export const AcsEditor = observer(AcsEditorView);

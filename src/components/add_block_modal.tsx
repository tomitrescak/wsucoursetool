import React from 'react';
import { Dialog, Pane, TextInputField, Button, SelectField } from 'evergreen-ui';
import { useLocalStore, observer } from 'mobx-react';
import { State, Block } from './types';
import { findMaxId, buildForm, url } from 'lib/helpers';
import Router from 'next/router';

type Props = {
  unitId: string;
  unitName: string;
  state: State;
};

export const AddBlockModalView: React.FC<Props> = ({ unitId, unitName, state }) => {
  const localState = useLocalStore(() => ({
    isShown: false,
    name: '',
    type: 'knowledge' as any
  }));
  const form = buildForm(localState, ['name', 'type']);
  return (
    <>
      <Dialog
        isShown={localState.isShown}
        title="Dialog title"
        onCloseComplete={() => (localState.isShown = false)}
        shouldCloseOnEscapePress={true}
        shouldCloseOnOverlayClick={false}
        onConfirm={close => {
          const newBlock: Block = {
            id: findMaxId(state.courseConfig.blocks),
            name: localState.name,
            mappedUnitId: unitId,
            prerequisites: [],
            completionCriteria: {},
            description: '',
            keywords: [],
            outcome: '',
            outcomes: [],
            type: localState.type
          };
          state.courseConfig.blocks.push(newBlock);

          state.save().then(() => {
            Router.push(
              unitId
                ? `/editor/units/${url(unitName)}-${unitId}--${url(localState.name)}-${newBlock.id}`
                : `/editor/blocks/${url(localState.name)}-${newBlock.id}`
            );
          });

          close();
        }}
        confirmLabel="Add Block"
      >
        <Pane display="flex" alignItems="flex-baseline">
          <TextInputField
            flex={2}
            label="Block Name"
            placeholder="Please specify name ..."
            onChange={form.name}
            marginRight={4}
          />
        </Pane>
        <SelectField
          flex={1}
          value={localState.type}
          label="Type"
          id="type"
          placeholder="Block Type"
          onChange={form.type}
          marginBottom={8}
        >
          <option value="">Please Select ...</option>
          <option value="knowledge">Knowledge</option>
          <option value="assignment">Assignment (Project)</option>
          <option value="exam">Exam / Quiz</option>
          <option value="wif">WIL</option>
        </SelectField>
      </Dialog>

      <Button appearance="primary" iconBefore="plus" onClick={() => (localState.isShown = true)}>
        Add Block
      </Button>
    </>
  );
};

export const AddBlockModal = observer(AddBlockModalView);

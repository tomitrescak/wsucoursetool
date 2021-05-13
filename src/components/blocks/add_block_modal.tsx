import React from 'react';
import { Dialog, Pane, TextInputField, Button, SelectField } from 'evergreen-ui';
import { useLocalStore, observer } from 'mobx-react';
import { State, Block } from '../types';
import { findMaxId, buildForm, url } from 'lib/helpers';
import Router from 'next/router';
import { UnitModel, createBlock } from 'components/classes';

type Props = {
  unit: UnitModel;
  state: State;
};

export const AddBlockModalView: React.FC<Props> = ({ unit, state }) => {
  const localState = useLocalStore(() => ({
    isShown: false,
    name: ''
  }));
  const form = buildForm(localState, ['name']);
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
            id: findMaxId(unit.blocks),
            blockId: Date.now().toString(),
            name: localState.name,
            prerequisites: [],
            completionCriteria: {},
            description: '',
            keywords: [],
            outcome: '',
            outcomes: [],
            activities: [],
            topics: [],
            level: '',
            offline: false,
            length: 0,
            credits: 0,
            sfiaSkills: []
          };
          unit.addBlock(newBlock);

          state.save();

          Router.push(
            '/editor/[category]/[item]',
            unit
              ? `/editor/units/${url(unit.name)}-${unit.id}--${url(localState.name)}-${newBlock.id}`
              : `/editor/blocks/${url(localState.name)}-${newBlock.id}`
          );

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
      </Dialog>

      <Button appearance="primary" iconBefore="plus" onClick={() => (localState.isShown = true)}>
        Add Block
      </Button>
    </>
  );
};

export const AddBlockModal = observer(AddBlockModalView);

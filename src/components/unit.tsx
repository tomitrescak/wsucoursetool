import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  SidebarTab,
  Alert,
  IconButton,
  Heading,
  Dialog,
  Button,
  toaster
} from 'evergreen-ui';
import { Unit, State } from './types';
import { url, findMaxId } from 'lib/helpers';
import Link from 'next/link';

import Router from 'next/router';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import { SAVE } from 'lib/data';
import { toJS } from 'mobx';

type Mapped<T> = {
  [P in keyof T]: any;
};
function buildForm<T>(obj: T, keys: Array<keyof T>): Mapped<T> {
  const result = {};
  for (let key of keys) {
    result[key as any] = (e: React.ChangeEvent<HTMLInputElement>) =>
      (obj[key as any] = e.currentTarget.value);
  }
  return result as any;
}

const UnitDetails: React.FC<{ unit: Unit; state: State }> = ({ unit, state }) => {
  const form = React.useMemo(() => buildForm(unit, ['name', 'id']), [unit]);

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint2" padding={16} borderRadius={6}>
        <Heading size={500} marginBottom={16}>
          Unit: {unit.name}
        </Heading>
        <TextInputField
          label="Code"
          value={unit.id}
          onChange={form.id}
          disabled={true}
          marginBottom={8}
        />
        <TextInputField
          label="Name"
          placeholder="Unit Name"
          value={unit.name}
          onChange={form.name}
          marginBottom={8}
        />
      </Pane>
      <Button
        intent="danger"
        iconBefore="trash"
        appearance="primary"
        marginTop={8}
        onClick={() => {
          if (confirm('Are You Sure?')) {
            state.courseConfig.units.splice(
              state.courseConfig.units.findIndex(p => p === unit),
              1
            );
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
};

const UnitsEditorView: React.FC<{ state: State }> = ({ state }) => {
  const localState = useLocalStore(() => ({
    newUnitName: '',
    newUnitId: '',
    isShown: false
  }));
  const form = buildForm(localState, ['newUnitName', 'newUnitId']);

  const router = useRouter();
  const { item } = router.query;
  let unitId = '';
  let unit: Unit | undefined;

  if (item) {
    const split = (item as string).split('-');
    unitId = split[split.length - 1];

    unit = state.courseConfig.units.find(u => u.id === unitId);
  }

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={240} marginRight={8}>
        {state.courseConfig.units.map((unit, index) => (
          <Link
            key={unit.id}
            href="/editor/[category]/[item]"
            as={`/editor/units/${url(unit.name)}-${unit.id}`}
          >
            <SidebarTab
              key={unit.id}
              id={unit.id}
              isSelected={unit.id === unitId}
              onSelect={() => {}}
              aria-controls={`panel-${unit.name}`}
            >
              {unit.name}
            </SidebarTab>
          </Link>
        ))}

        <Dialog
          isShown={localState.isShown}
          title="Dialog title"
          onCloseComplete={() => (localState.isShown = false)}
          onConfirm={close => {
            if (state.courseConfig.units.some(u => u.id === localState.newUnitId)) {
              alert('Unit Already exists');
              return false;
            }
            state.courseConfig.units.push({
              id: localState.newUnitId,
              name: localState.newUnitName,
              mappedTopic: ''
            });

            close();
          }}
          confirmLabel="Add Unit"
        >
          <Pane display="flex" alignItems="flex-baseline">
            <TextInputField
              label="Unit Code"
              placeholder="Unit Id"
              onChange={form.newUnitId}
              marginRight={4}
            />
            <TextInputField
              label="Unit Name"
              placeholder="Unit Name"
              onChange={form.newUnitName}
              marginRight={4}
              flex={1}
            />
          </Pane>
        </Dialog>

        <Pane
          display="flex"
          alignItems="center"
          marginTop={16}
          paddingTop={8}
          borderTop="dotted 1px #dedede"
        >
          <Button
            appearance="primary"
            iconBefore="plus"
            onClick={() => (localState.isShown = true)}
          >
            Add Unit
          </Button>
        </Pane>
      </Tablist>
      {state.courseConfig.units.length === 0 && <Alert flex={1}>There are no units defined</Alert>}
      {unit && <UnitDetails unit={unit} state={state} />}
    </Pane>
  );
};

export const UnitsEditor = observer(UnitsEditorView);

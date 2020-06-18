import React from 'react';
import marked from 'marked';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  SidebarTab,
  Alert,
  Heading,
  Dialog,
  Button,
  SelectField,
  Combobox,
  Text,
  TabNavigation,
  Tab,
  Badge,
  Textarea
} from 'evergreen-ui';
import { Unit, State } from './types';
import { url, buildForm } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { BlocksEditor } from './block_editor';
import { TopicBlockEditor } from './topic_block_editor';
import { OutcomeEditor } from './outcome_editor';

const UnitDetails: React.FC<{ unit: Unit; state: State; readonly: boolean }> = observer(
  ({ unit, state, readonly }) => {
    const form = React.useMemo(() => buildForm(unit, ['name', 'id', 'delivery', 'outcome']), [
      unit
    ]);
    const blocks = state.courseConfig.blocks.filter(b => b.mappedUnitId == unit.id);

    let selectedBlockId: string | undefined;
    const router = useRouter();
    const item = router.query.item as string;

    if (item) {
      const mainSplit = item.split('--');

      // find block
      const blockSplit = mainSplit.length > 1 ? mainSplit[1].split('-') : null;
      selectedBlockId = blockSplit != null ? blockSplit[blockSplit.length - 1] : null;
    }
    const localState = useLocalStore(() => ({
      tab: selectedBlockId ? 'Blocks' : 'Description',
      isOutcomePreview: false
    }));

    if (unit.completionCriteria == null) {
      unit.completionCriteria = {};
    }

    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint2" padding={16} borderRadius={6}>
          <Pane marginBottom={16} display="flex" alignItems="center">
            <Heading size={500} marginRight={16}>
              {unit.name}
            </Heading>
            <TabNavigation>
              {['Description', 'Blocks'].map((tab, index) => (
                <Tab
                  onSelect={() => {
                    localState.tab = tab;
                  }}
                  key={tab}
                  is="a"
                  href="#"
                  id={tab}
                  isSelected={tab === localState.tab}
                >
                  {tab}
                </Tab>
              ))}
            </TabNavigation>
          </Pane>
          {localState.tab === 'Description' && (
            <Pane>
              <TextInputField
                label="Code"
                value={unit.id}
                id="unitCode"
                onChange={form.id}
                disabled={true}
                marginBottom={8}
              />
              <TextInputField
                label="Name"
                id="unitName"
                placeholder="Unit Name"
                value={unit.name}
                onChange={form.name}
                marginBottom={8}
              />

              <Text is="label" htmlFor="topic" fontWeight={500} marginBottom={8} display="block">
                Mapped Topic
              </Text>
              <Combobox
                flex="1"
                width="100%"
                id="topic"
                items={state.courseConfig.topics}
                itemToString={item => (item ? item.name : '')}
                selectedItem={
                  unit.mappedTopic && state.courseConfig.topics.find(t => t.id === unit.mappedTopic)
                }
                onChange={selected => (unit.mappedTopic = selected.id)}
                marginBottom={8}
              />

              <SelectField
                value={unit.delivery}
                label="Delivery"
                id="unitDelivery"
                placeholder="Delivery"
                onChange={form.delivery}
              >
                <option value="1">1 semester</option>
                <option value="2">2 semesters</option>
                <option value="3">3 semesters</option>
              </SelectField>

              {/* COMPLETION CRITERIA */}

              <Heading size={400} marginTop={16} marginBottom={16}>
                Completion Criteria
              </Heading>
              <TopicBlockEditor state={state} block={unit.completionCriteria} unitId={unit.id} />

              {/* OUTCOME DESCRIPTION */}
              <Text
                is="label"
                htmlFor="outcome"
                fontWeight={500}
                marginBottom={8}
                marginTop={16}
                display="block"
              >
                Outcome Description{' '}
                <Badge
                  cursor="pointer"
                  onClick={() => (localState.isOutcomePreview = !localState.isOutcomePreview)}
                >
                  {localState.isOutcomePreview ? 'Editor' : 'Preview'}
                </Badge>
              </Text>
              {localState.isOutcomePreview ? (
                <Text dangerouslySetInnerHTML={{ __html: marked(unit.outcome) }} />
              ) : (
                <Textarea id="outcome" value={unit.outcome} onChange={form.outcome} />
              )}

              {/* OUTCOMES */}
              <Pane marginTop={16}>
                <OutcomeEditor state={state} owner={unit} />
              </Pane>
            </Pane>
          )}
          {localState.tab === 'Blocks' && (
            <BlocksEditor
              readonly={readonly}
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              state={state}
              unitId={unit.id}
              unitName={unit.name}
              title="Blocks"
              url={block =>
                `/editor/units/${url(unit.name)}-${unit.id}--${url(block.name)}-${block.id}`
              }
            />
          )}
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
  }
);

const UnitsEditorView: React.FC<{ state: State; readonly: boolean }> = ({ state, readonly }) => {
  const localState = useLocalStore(() => ({
    newUnitName: '',
    newUnitId: '',
    isShown: false
  }));
  const form = buildForm(localState, ['newUnitName', 'newUnitId']);

  const router = useRouter();
  const item = router.query.item as string;
  let unitId = '';
  let unit: Unit | undefined;

  if (item) {
    const mainSplit = item.split('--');

    // find unit
    const split = mainSplit[0].split('-');
    unitId = split[split.length - 1];
    unit = state.courseConfig.units.find(u => u.id === unitId);
  }

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={240} marginRight={8}>
        {state.courseConfig.units
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((unit, index) => (
            <Link
              key={unit.id}
              href="/editor/[category]/[item]"
              as={`/editor/units/${url(unit.name)}-${unit.id}`}
            >
              <a>
                <SidebarTab
                  whiteSpace="nowrap"
                  key={unit.id}
                  id={unit.id}
                  isSelected={unit.id === unitId}
                  onSelect={() => {}}
                  aria-controls={`panel-${unit.name}`}
                >
                  {unit.name}
                </SidebarTab>
              </a>
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
              mappedTopic: '',
              delivery: '1',
              completionCriteria: {},
              outcome: '',
              outcomes: []
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
      {unit && <UnitDetails key={unit.id} unit={unit} state={state} readonly={readonly} />}
    </Pane>
  );
};

export const UnitsEditor = observer(UnitsEditorView);

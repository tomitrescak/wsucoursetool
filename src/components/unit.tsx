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
  Text,
  TabNavigation,
  Tab,
  Badge,
  Textarea,
  Checkbox,
  Select,
  TextInput,
  Link as EGLink
} from 'evergreen-ui';
import { Unit, State } from './types';
import { url, buildForm } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { BlocksEditor } from './block_editor';
import { TopicBlockEditor } from './topic_block_editor';
import { OutcomeEditor } from './outcome_editor';
import { KeywordEditor, TopicEditor } from './tag_editors';
import { TextEditor } from './text_editor';
import { action } from 'mobx';
import { Expander } from './expander';
import { UnitGraph } from './unit_graph';
import { PrerequisiteEditor } from './prerequisite_editor';
import { VerticalPane } from './vertical_pane';

function urlParse(text: string) {
  var reg = /\d\d\d\d\d\d/g;
  var result: RegExpExecArray;
  let i = 0;
  let els = [];

  if (text.match(/\d\d\d\d\d\d/) == null) {
    return text;
  }

  let index = 0;
  while ((result = reg.exec(text)) !== null) {
    els.push(<Text key={i++}>{text.substring(index, result.index)}</Text>);
    els.push(
      <Link key={i++} href="/editor/[category]/[item]" as={`/editor/units/unit-${result[0]}`}>
        <a>
          <Text>{result[0]}</Text>
        </a>
      </Link>
    );
    index = reg.lastIndex;
  }

  els.push(<Text key={i++}>{text.substring(index)}</Text>);

  return els;
}

const selfColor = 'rgb(251, 230, 162)';
const depenedantColor = alpha => `rgb(${47 + alpha}, ${75 + alpha}, ${180 - alpha})`;
const dependOnColor = 'rgb(191, 14, 8)';

function findDependencies(
  unit: Unit,
  state: State,
  dependencies: Unit[],
  colorMap: { [id: string]: string },
  level: number,
  maxLevel
) {
  if (dependencies.indexOf(unit) >= 0) {
    return;
  }
  dependencies.push(unit);

  // find units depending on this unit
  let depenendants = state.courseConfig.units.filter(
    u => u.prerequisite && u.prerequisite.some(p => p === unit.id)
  );
  for (let d of depenendants) {
    colorMap[d.id] = depenedantColor(level * 50);
    if (level < maxLevel) {
      findDependencies(d, state, dependencies, colorMap, level + 1, maxLevel);
    }
  }
}

const UnitDetails: React.FC<{ unit: Unit; state: State; readonly: boolean }> = observer(
  ({ unit, state, readonly }) => {
    const form = React.useMemo(() => buildForm(unit, ['name', 'id', 'delivery', 'outcome']), [
      unit
    ]);
    // merge all keywords from blocks and topics
    let keywords = React.useMemo(() => {
      let keywords = state.courseConfig.blocks.flatMap(b => b.keywords);
      keywords = keywords.filter((item, index) => keywords.indexOf(item) === index).sort();
      return keywords;
    }, []);
    let blocks = unit.blocks.map(id => state.courseConfig.blocks.find(b => b.id === id));
    if (unit.dynamic) {
      blocks.push(
        ...state.courseConfig.blocks.filter(b =>
          (b.topics || []).some(t => unit.blockTopics.indexOf(t) >= 0)
        )
      );
      blocks.push(
        ...state.courseConfig.units
          .filter(u => !u.dynamic && u.topics.some(t => unit.blockTopics.indexOf(t) >= 0))
          .flatMap(u => u.blocks.map(ub => state.courseConfig.blocks.find(sb => sb.id === ub)))
      );
    }

    let selectionBlocks = [...blocks];
    // add practicals
    selectionBlocks.unshift({
      id: 'practicalAssignments',
      name: '[AGGREGATE] Practical Assignments'
    } as any);

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
      isOutcomePreview: false,
      level: 1
    }));

    if (unit.completionCriteria == null) {
      unit.completionCriteria = {};
    }

    // find all depenedencies
    let dependencies = [];
    let colorMap: { [id: string]: string } = { [unit.id]: selfColor };
    let ownDependencies = 0;
    // add own dependencies
    if (unit.prerequisite && unit.prerequisite.length) {
      ownDependencies = unit.prerequisite.length;
      for (let u of unit.prerequisite) {
        let found = state.courseConfig.units.find(un => un.id === u);
        if (!found) {
          found = { id: u, name: u } as any;
        }
        dependencies.push(found);
        colorMap[found.id] = dependOnColor;
      }
    }

    findDependencies(unit, state, dependencies, colorMap, 0, localState.level);

    let nextDependencies = [];
    findDependencies(unit, state, nextDependencies, colorMap, 0, localState.level + 1);

    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint2" padding={16} borderRadius={6}>
          <Pane marginBottom={16} display="flex" alignItems="center">
            <Heading size={500} marginRight={16}>
              {unit.name}
            </Heading>
            <TabNavigation flex="1">
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
            <TabNavigation>
              <Tab target="_blank" href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}`}>
                LG
              </Tab>
              <Tab
                is="a"
                target="_blank"
                href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}/details`}
              >
                Details
              </Tab>
              <Tab
                target="_blank"
                href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}/edit/activities`}
              >
                Activities
              </Tab>
            </TabNavigation>
          </Pane>
          {localState.tab === 'Description' && (
            <Pane>
              <Pane display="flex" marginBottom={8} alignItems="flex-end">
                <TextInputField
                  label="Code"
                  value={unit.id}
                  id="unitCode"
                  onChange={form.id}
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  flex="1"
                  label="Name"
                  id="unitName"
                  placeholder="Unit Name"
                  value={unit.name}
                  margin={0}
                  marginRight={8}
                  onChange={form.name}
                />
                <TextInputField
                  label="Level"
                  flex="0 0 50px"
                  value={unit.level}
                  id="level"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Cred."
                  flex="0 0 50px"
                  value={unit.credits}
                  id="credit"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="LG"
                  flex="0 0 60px"
                  value={unit.lgId}
                  id="lgId"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                {/* <SelectField
                  value={unit.delivery}
                  label="Delivery"
                  id="unitDelivery"
                  placeholder="Delivery"
                  onChange={form.delivery}
                  margin={0}
                  marginRight={8}
                >
                  <option value="1">1 semester</option>
                  <option value="2">2 semesters</option>
                  <option value="3">3 semesters</option>
                </SelectField> */}
              </Pane>
              <Pane display="flex">
                {/* TOPICS */}
                <TopicEditor owner={unit} state={state} />
                {/* KEYWORDS */}
                <KeywordEditor owner={unit} keywords={keywords} />
              </Pane>
              {/* IMPORTED TOPICS */}
              {unit.dynamic && (
                <TopicEditor
                  owner={unit}
                  state={state}
                  label="Import Blocks with Following Topics"
                  field="blockTopics"
                />
              )}
              <Checkbox
                margin={0}
                label="Dynamic"
                onChange={e => (unit.dynamic = e.currentTarget.checked)}
                checked={unit.dynamic}
              />
              {/* <Text is="label" htmlFor="topic" fontWeight={500} marginBottom={8} display="block">
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
              /> */}
              {/* COMPLETION CRITERIA */}
              <Expander title="Completion Criteria" id="unitCompletionCriteria">
                <TopicBlockEditor
                  state={state}
                  block={unit.completionCriteria}
                  items={selectionBlocks}
                />
              </Expander>

              {/* OUTCOME DESCRIPTION */}
              <Expander title="Description" id="unitDescription">
                <TextEditor owner={unit} field="outcome" label="Decription" />
                {/* PASS CRITERIA */}
                <TextEditor owner={unit} field="passCriteria" label="Pass Criteria" />
                {/* ASSUMED KNOWLEDGE */}
                {unit.assumedKnowledge && (
                  <TextEditor owner={unit} field="assumedKnowledge" label="Assumed Knowledge" />
                )}
                {/* APPROACH TO LEARNING */}
                {unit.approachToLearning && (
                  <TextEditor
                    owner={unit}
                    field="approachToLearning"
                    label="Approach to Learning"
                  />
                )}
              </Expander>

              {/* BLOCK PREREQUISITES */}
              <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16} marginTop={16}>
                <PrerequisiteEditor state={state} owner={unit} unit={unit} />
              </Pane>

              {/* Prerequisited CRITERIA */}
              <Expander title="Unit Constraints" id="unitConstraints">
                {unit.unitPrerequisites && (
                  <TextEditor
                    owner={unit}
                    field="unitPrerequisites"
                    label="Unit Prerequisites"
                    parser={urlParse}
                  />
                )}
                {unit.corequisites && (
                  <TextEditor
                    owner={unit}
                    field="corequisites"
                    label="Corequisites"
                    parser={urlParse}
                  />
                )}
                {unit.incompatible && (
                  <TextEditor
                    owner={unit}
                    field="incompatible"
                    label="Incompatible"
                    parser={urlParse}
                  />
                )}

                <UnitGraph
                  units={dependencies}
                  colorMap={colorMap}
                  height="300px"
                  buttons={
                    <>
                      <Button
                        onClick={() => localState.level++}
                        marginLeft={8}
                        iconBefore="plus"
                        disabled={nextDependencies.length + ownDependencies === dependencies.length}
                      >
                        Level
                      </Button>
                      <Button
                        onClick={() => localState.level--}
                        marginLeft={8}
                        iconBefore="minus"
                        disabled={localState.level === 1}
                      >
                        Level
                      </Button>
                    </>
                  }
                />
              </Expander>
              {/* OUTCOMES */}
              <Pane marginTop={16} elevation={2} padding={16} borderRadius={8}>
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
              unit={unit}
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
    isShown: false,
    selection: [],
    course: '',
    major: '',
    filterName: '',
    filterCode: ''
  }));
  const form = buildForm(localState, ['newUnitName', 'newUnitId', 'filterCode', 'filterName']);

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

  let selectedCourse = localState.course
    ? state.courseConfig.courses.find(c => c.id === localState.course)
    : null;
  let selectedMajor = localState.major
    ? selectedCourse.majors.find(m => m.id === localState.major)
    : null;

  return (
    <>
      <VerticalPane title="Unit List">
        <Pane paddingRight={8}>
          <Pane marginBottom={8} paddingRight={22}>
            <Pane display="flex" width="100%" marginBottom={8}>
              <TextInput
                flex={3}
                placeholder="Name ..."
                value={localState.filterName}
                onChange={form.filterName}
                marginRight={8}
                width="100%"
              />
              <TextInput
                flex={1}
                placeholder="Code ..."
                value={localState.filterCode}
                onChange={form.filterCode}
                width="100%"
              />
            </Pane>
            <Select
              value={localState.course}
              onChange={e => (localState.course = e.currentTarget.value)}
              marginRight={8}
            >
              <option value="">Select Course ...</option>
              {state.courseConfig.courses.map((c, i) => (
                <option value={c.id} key={i}>
                  {c.name}
                </option>
              ))}
            </Select>

            {selectedCourse && (
              <Select
                value={localState.major}
                onChange={e => (localState.major = e.currentTarget.value)}
              >
                <option value="">Select Major ...</option>
                {selectedCourse.majors.map((c, i) => (
                  <option value={c.id} key={i}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Pane>

          <Tablist>
            {state.courseConfig.units
              .slice()
              .filter(f => {
                let isOk = true;
                if (selectedCourse) {
                  isOk =
                    selectedCourse.core.findIndex(c => c.id === f.id) >= 0 ||
                    (selectedMajor && selectedMajor.units.findIndex(u => u.id === f.id) >= 0);
                }
                if (localState.filterName) {
                  isOk = localState.filterName
                    .toLowerCase()
                    .split(' ')
                    .every(d => f.name.toLowerCase().indexOf(d) >= 0);
                }
                if (localState.filterCode) {
                  isOk = f.id.indexOf(localState.filterCode) >= 0;
                }

                return isOk;
              })
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
                      {/* <input
                    type="checkbox"
                    checked={localState.selection.indexOf(unit.id) >= 0}
                    onClick={e => e.stopPropagation()}
                    onChange={e =>
                      e.currentTarget.checked
                        ? localState.selection.push(unit.id)
                        : localState.selection.splice(localState.selection.indexOf(unit.id), 1)
                    }
                  /> */}
                      <Badge size={300} marginRight={8}>
                        {unit.id}
                      </Badge>
                      {unit.dynamic && (
                        <Badge color="orange" marginRight={8}>
                          D
                        </Badge>
                      )}
                      {selectedCourse && selectedCourse.core.some(s => s.id === unit.id) && (
                        <Badge color="yellow" marginRight={8}>
                          C
                        </Badge>
                      )}
                      {unit.name}

                      <Badge color={unit.blocks.length > 0 ? 'green' : 'neutral'} marginLeft={8}>
                        {unit.blocks.length}
                      </Badge>
                    </SidebarTab>
                  </a>
                </Link>
              ))}

            {/* <Button
          onClick={action(() => {
            debugger;
            for (let u of localState.selection) {
              state.courseConfig.units.remove(state.courseConfig.units.find(f => f.id === u));
            }
            localState.selection = [];
          })}
        >
          Delete Selection
        </Button> */}

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
                  topics: [],
                  keywords: [],
                  blockTopics: [],
                  dynamic: false,
                  delivery: '1',
                  completionCriteria: {},
                  assumedKnowledge: '',
                  outcome: '',
                  outcomes: [],
                  blocks: []
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
        </Pane>
      </VerticalPane>
      <VerticalPane shrink={true}>
        {state.courseConfig.units.length === 0 && (
          <Alert flex={1}>There are no units defined</Alert>
        )}
        {unit && <UnitDetails key={unit.id} unit={unit} state={state} readonly={readonly} />}
      </VerticalPane>
    </>
  );
};

export const UnitsEditor = observer(UnitsEditorView);

import { BlocksEditor } from 'components/blocks/block_editor';
import { BlockDependencyGraph } from 'components/blocks/block_graph';
import { BlockTopicsEditor } from 'components/blocks/block_topics.editor';
import { Expander } from 'components/common/expander';
import { TextEditor } from 'components/common/text_editor';
import { TopicBlockEditor } from 'components/completion_criteria/completion_criteria_editor';
import { round } from 'components/courses/search/search_helpers';
import { OutcomeEditor } from 'components/outcomes/outcome_editor';
import { SfiaOwnerEditor } from 'components/sfia/sfia_owner_editor';
import {
  CourseListDocument,
  useDeleteUnitMutation,
  useSaveConfigMutation,
  useUnitDependenciesQuery,
  useUnitQuery
} from 'config/graphql';
import { UnitDependency } from 'config/resolvers';
import { Dependency } from 'config/utils';
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Heading,
  Label,
  Pane,
  SelectMenu,
  Tab,
  TabNavigation,
  Text,
  TextInputField,
  toaster
} from 'evergreen-ui';
import { buildForm, url } from 'lib/helpers';
import { model, undoMiddleware } from 'mobx-keystone';
import { observer, useLocalStore } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { createCompletionCriteria, createUnit, UnitModel } from '../classes';
import { ProgressView } from '../common/progress_view';
import { PrerequisiteEditor } from '../prerequisites/prerequisite_editor';
import { AcsKnowledge, Block, Entity, SfiaSkill, State } from '../types';
import { UnitGraph } from './unit_graph';

const selfColor = 'orange';

function unitClass(unit: UnitDependency) {
  return 'level' + unit.level;
}

function blockClass(block: Block) {
  return undefined;
}

const nodeClasses = [
  {
    selector: '.required',
    style: {
      'target-arrow-color': 'red',
      'background-color': 'red',
      'line-color': 'red'
    }
  },
  {
    selector: '.level-1',
    style: {
      backgroundColor: 'rgb(221, 235, 247)',
      color: 'black'
    }
  },
  {
    selector: '.normal',
    style: {
      backgroundColor: 'rgb(212, 238, 226)'
    }
  },
  {
    selector: '.obsolete',
    style: {
      backgroundColor: 'red',
      color: 'black'
    }
  },
  {
    selector: '.proposed',
    style: {
      backgroundColor: 'purple',
      color: 'black',
      fontWeight: 'bold'
    }
  },
  {
    selector: '.resolved',
    style: {
      backgroundColor: 'blue',
      color: 'white',
      fontWeight: 'bold'
    }
  },
  {
    selector: '.level0',
    style: {
      backgroundColor: 'rgb(255, 249, 230)'
    }
  },
  {
    selector: '.level1',
    style: {
      backgroundColor: 'rgb(212, 238, 226)'
    }
  },
  {
    selector: '.level2',
    style: {
      backgroundColor: 'rgb(221, 235, 247)'
    }
  },
  {
    selector: '.level3',
    style: {
      backgroundColor: 'rgb(221, 235, 247)'
    }
  },

  {
    selector: '.recommended',
    style: {
      'target-arrow-color': 'green',
      'background-color': 'green',
      'line-color': 'green'
    }
  }
];

function urlParse(view: string) {
  return function (text) {
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
        <Link key={i++} href={`/${view}/[category]/[item]`} as={`/${view}/units/unit-${result[0]}`}>
          <a>
            <Text>{result[0]}</Text>
          </a>
        </Link>
      );
      index = reg.lastIndex;
    }

    els.push(<Text key={i++}>{text.substring(index)}</Text>);

    return els;
  };
}

type Props = {
  id: string;
  readonly: boolean;
  state: State;
};

export const UnitDetailContainer = ({ id, readonly, state }: Props) => {
  const { loading, error, data, refetch } = useUnitQuery({
    variables: {
      id
    }
  });

  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    },
    refetchQueries: [{ query: CourseListDocument }]
  });

  const model = React.useMemo(() => {
    if (data) {
      const model = createUnit(data.unit.unit);
      const undoManager = undoMiddleware(model);
      state.undoManager = undoManager;
      state.save = () => {
        const body = model.toJS();
        save({
          variables: {
            body,
            id,
            part: 'unit'
          }
        });
      };
      return model;
    }
    return undefined;
  }, [data]);

  // const [createUnit] = useCreateUnitMutation({
  //   onCompleted() {
  //     refetch();
  //   }
  // });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  return (
    <UnitDetails
      model={model}
      sfia={data.sfia}
      readonly={readonly}
      keywords={data.keywords}
      state={state}
      topics={data.topics}
      dependencies={data.unit.dependencies}
      readonlyBlocks={data.unit.blocks}
    />
  );
};

const BlockGraphContainer = observer(({ unit, height }: { unit: UnitModel; height?: number }) => {
  const localState = useLocalStore(() => ({
    units: [],
    level: 1
  }));

  const { loading, error, data, refetch } = useUnitDependenciesQuery({
    variables: {
      id: unit.id
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const filteredUnits = data.unitDepenendencies; //.filter(d => d.level <= localState.level);

  return (
    <Pane marginTop={8}>
      <BlockDependencyGraph
        key={localState.level}
        units={filteredUnits}
        otherUnits={[]}
        owner={unit}
        classes={nodeClasses}
        unitClass={unitClass as any}
        blockClass={blockClass}
        height={500}
        // buttons={
        //   <>
        //     <Button
        //       onClick={() => localState.level++}
        //       iconBefore="plus"
        //       disabled={data.unitDepenendencies.every(d => d.level <= localState.level)}
        //     >
        //       Level
        //     </Button>
        //     <Button
        //       onClick={() => localState.level--}
        //       marginLeft={8}
        //       iconBefore="minus"
        //       disabled={localState.level === 1}
        //       marginRight={8}
        //     >
        //       Level
        //     </Button>
        //   </>
        // }
      />
    </Pane>
  );
});

const Constraints = observer(({ dependencies, unit }) => {
  const localState = useLocalStore(() => ({
    level: 1
  }));
  let colorMap: { [id: string]: string } = { [unit.id]: selfColor };

  return (
    <UnitGraph
      units={(dependencies || []).filter(d => d.level <= localState.level)}
      colorMap={colorMap}
      height="300px"
      buttons={
        <>
          <Button
            onClick={() => localState.level++}
            marginLeft={8}
            iconBefore="plus"
            disabled={dependencies.every(d => d.level <= localState.level)}
          >
            Level
          </Button>
          <Button
            onClick={() => localState.level--}
            marginLeft={8}
            marginRight={8}
            iconBefore="minus"
            disabled={localState.level === 1}
          >
            Level
          </Button>
        </>
      }
    />
  );
});

const offers = [
  { label: 'Autumn', value: 'au' },
  { label: 'Spring', value: 'sp' },
  { label: 'Summer A', value: 'sua' },
  { label: 'Summer B', value: 'sub' }
];

const UnitDetails: React.FC<{
  model: UnitModel;
  readonly: boolean;
  state: State;
  sfia: SfiaSkill[];
  topics: Entity[];
  keywords: string[];
  dependencies: Dependency[];
  readonlyBlocks: Block[];
}> = observer(
  ({ model: unit, keywords, readonly, sfia, state, dependencies, readonlyBlocks, topics }) => {
    const form = React.useMemo(
      () => buildForm(unit, ['name', 'id', 'delivery', 'outcome', 'group', 'coordinator']),
      [unit]
    );
    let selectionBlocks = [...unit.blocks];
    // add practicals
    selectionBlocks.unshift({
      id: 'practicalAssignments',
      name: '[AGGREGATE] Practical Assignments'
    } as any);

    let selectedBlockId: string | undefined;
    const router = useRouter();
    const item = router.query.item as string;

    // mutations
    const [deleteUnit] = useDeleteUnitMutation({
      refetchQueries: [{ query: CourseListDocument }],
      onCompleted() {
        toaster.notify('Deleted');
        router.push('/');
      }
    });
    const view = readonly ? 'view' : 'editor';
    const parseUrl = React.useMemo(() => urlParse(view), [view]);

    if (item) {
      const mainSplit = item.split('--');

      // find block
      const blockSplit = mainSplit.length > 1 ? mainSplit[1].split('-') : null;
      selectedBlockId = blockSplit != null ? blockSplit[blockSplit.length - 1] : null;
    }
    const localState = useLocalStore(() => ({
      tab: selectedBlockId ? 'Blocks' : 'Description',
      sfia: '',
      isOutcomePreview: false
    }));

    if (unit.completionCriteria == null) {
      unit.completionCriteria = createCompletionCriteria({});
    }

    // dependencies

    return (
      <div style={{ flex: 1 }}>
        {/* <Dialog
          isShown={!!localState.sfia}
          title="Dialog title"
          onCloseComplete={() => (localState.sfia = '')}
          confirmLabel="Custom Label"
        >
          <iframe src={localState.sfia} style={{ width: '100%', height: '100%' }}></iframe>
        </Dialog> */}

        <Pane background="tint1" elevation={1} padding={16} borderRadius={6}>
          <Pane marginBottom={16} display="flex" alignItems="center">
            <Heading size={500} marginRight={16}>
              {unit.name}
            </Heading>
            {/* <TabNavigation flex="1">
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
              <Tab
                is="a"
                target="_blank"
                href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}`}
              >
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
                is="a"
                target="_blank"
                href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}/edit/activities`}
              >
                Activities
              </Tab>
            </TabNavigation> */}
          </Pane>

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
                width={60}
              />
              <TextInputField
                flex="1"
                label="Name"
                id="unitName"
                placeholder="Unit Name"
                value={unit.name}
                disabled={readonly}
                margin={0}
                marginRight={8}
                onChange={form.name}
              />
              <Pane marginRight={8}>
                <Label size={400} margin={0} marginBottom={4} is="div">
                  Offer
                </Label>
                <SelectMenu
                  isMultiSelect={true}
                  title="Select Semester Offer"
                  options={offers}
                  selected={unit.offer}
                  hasFilter={false}
                  hasTitle={false}
                  onSelect={item => unit.addOffer(item.value as string)}
                  onDeselect={item => unit.removeOffer(item.value as string)}
                >
                  <Button disabled={readonly}>
                    {unit.offer.map(o => offers.find(l => l.value === o).label).join(', ')}
                  </Button>
                </SelectMenu>
              </Pane>

              {/* <TextInputField
              label={
                <Link
                  href={`/${view}/[category]/[item]`}
                  as={`/${view}/coordinators/${url(unit.coordinator)}`}
                >
                  <a>
                    <Text fontWeight={500}>Coordinator</Text>
                  </a>
                </Link>
              }
              value={unit.coordinator}
              id="unitCordinator"
              onChange={form.coordinator}
              margin={0}
              marginRight={8}
            /> */}
              <TextInputField
                label="Level"
                flex="0 0 50px"
                value={unit.level}
                onChange={e => (unit.level = parseInt(e.currentTarget.value))}
                id="level"
                disabled={readonly}
                type="number"
                margin={0}
                marginRight={8}
              />
              {/* <TextInputField
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
              /> */}
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
              {unit.blocks.length > 0 && (
                <Pane flex={1}>
                  <Text id="div" fontWeight={500} marginBottom={8} display="block">
                    Topics
                  </Text>
                  <Text size={300}>
                    {Array.from(
                      new Set(
                        unit.blocks
                          .flatMap(b => b.topics)
                          .map(t => topics.find(tp => tp.id === t.id)?.name)
                      )
                    ).join(', ')}
                  </Text>
                </Pane>
              )}

              {/* KEYWORDS */}
              <Pane flex={1}>
                <Text fontWeight={500} marginBottom={8} display="block">
                  Keywords
                </Text>
                <Text size={300}>
                  {Array.from(new Set(unit.blocks.flatMap(b => b.keywords))).join(', ')}
                </Text>
              </Pane>

              <Pane flex={1}>
                <Text fontWeight={500} marginBottom={8} display="block">
                  Flags
                </Text>
                {/* <Pane display="flex">
                    <Checkbox
                      margin={0}
                      label="Dynamic"
                      onChange={e => (unit.dynamic = e.currentTarget.checked)}
                      checked={unit.dynamic}
                      disabled={readonly}
                    />

                    <Checkbox
                      margin={0}
                      label="Obsolete"
                      onChange={e => (unit.obsolete = e.currentTarget.checked)}
                      checked={unit.obsolete}
                      disabled={readonly}
                      marginLeft={16}
                    />

                    <Checkbox
                      margin={0}
                      label="Outdated"
                      onChange={e => (unit.outdated = e.currentTarget.checked)}
                      checked={unit.outdated}
                      disabled={readonly}
                      marginLeft={16}
                    />
                    <Checkbox
                      margin={0}
                      label="Hidden"
                      onChange={e => (unit.hidden = e.currentTarget.checked)}
                      checked={unit.hidden}
                      disabled={readonly}
                      marginLeft={16}
                    />
                  </Pane> */}
                <Pane display="flex" marginTop={4}>
                  {/* <Checkbox
                      margin={0}
                      label="Duplicate"
                      onChange={e => (unit.duplicate = e.currentTarget.checked)}
                      checked={unit.duplicate}
                      disabled={readonly}
                    /> 

                   <Checkbox
                      margin={0}
                      label="Processed"
                      onChange={e => (unit.processed = e.currentTarget.checked)}
                      checked={unit.processed}
                      disabled={readonly}
                      marginLeft={16}
                    /> 
                    
                     <Checkbox
                      margin={0}
                      label="Proposed"
                      onChange={e => (unit.proposed = e.currentTarget.checked)}
                      checked={unit.proposed}
                      disabled={readonly}
                      marginLeft={16}
                    /> 

                    <Checkbox
                      margin={0}
                      label="Contacted"
                      onChange={e => (unit.contacted = e.currentTarget.checked)}
                      checked={unit.contacted}
                      disabled={readonly}
                      marginLeft={16}
                    />
                    */}

                  <Checkbox
                    margin={0}
                    label="Fixed"
                    onChange={e => (unit.fixed = e.currentTarget.checked)}
                    checked={unit.fixed}
                    disabled={readonly}
                  />
                </Pane>
              </Pane>
            </Pane>

            {/* <TextEditor owner={unit} field="notes" label="Notes" readonly={readonly} /> */}
          </Pane>
        </Pane>

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

        <Expander title={`Blocks`} id="blocks">
          <BlocksEditor
            readonly={readonly}
            blocks={unit.blocks}
            readonlyBlocks={readonlyBlocks}
            selectedBlockId={selectedBlockId}
            state={state}
            unit={unit}
            title="Blocks"
            keywords={keywords}
            url={block =>
              `/${view}/units/${url(unit.name)}-${unit.id}--${url(block.name)}-${block.id}`
            }
          />
        </Expander>

        {/* Block CRITERIA */}
        {unit.blocks.length === 0 && (
          <BlockTopicsEditor block={unit} readonly={readonly} topics={topics} />
        )}

        {/* SFIA SKills */}
        {unit.blocks.length ? (
          <Expander title="Calculated SFIA" id="sfiaSkillsUnit">
            {unit.blocks
              .flatMap(u => u.sfiaSkills)
              .reduce((p, n) => {
                let existing = p.find(l => l.id === n.id);
                if (!existing) {
                  p.push({
                    id: n.id,
                    level: n.level
                  });
                } else if (existing.level < n.level) {
                  existing.level = n.level;
                }
                return p;
              }, [])
              .map(item => {
                let s = sfia.find(s => s.id === item.id);
                item.name = s?.name;
                item.url = s?.url;
                return item;
              })
              .sort((a, b) => (a.name || '').localeCompare(b.name))
              .map((item, idx) => (
                <Text is="div" marginTop={4} key={item.id}>
                  <Badge>Level {round(item.level, 2)}</Badge>{' '}
                  <a href={item.url} target="__blank" style={{ cursor: 'pointer' }}>
                    {item.name} ({item.id})
                  </a>
                </Text>
              ))}
          </Expander>
        ) : (
          <Expander
            title={`SFIA Skills ${unit.blocks.length ? '(🤷‍♂️ WILL BE HIDDEN)' : ''}`}
            id="sfiaSkillsUnit"
          >
            <SfiaOwnerEditor owner={unit} readonly={readonly} hasMax={false} />
          </Expander>
        )}

        {/* ACS Skills */}
        {/* <Pane marginTop={16} elevation={2} padding={16} borderRadius={8} background="tint1">
              <OutcomeEditor acss={acs} owner={unit} state={state} readonly={readonly} />
            </Pane> */}

        {/* COMPLETION CRITERIA */}
        {/* <Expander title="Completion Criteria" id="unitCompletionCriteria">
              <TopicBlockEditor
                block={unit.completionCriteria}
                items={selectionBlocks}
                readonly={readonly}
              />
            </Expander> */}

        {/* OUTCOME DESCRIPTION */}
        {/* <Expander title="Description" id="unitDescription">
              <TextEditor owner={unit} field="outcome" label="Decription" readonly={readonly} />
             
              <TextEditor
                owner={unit}
                field="passCriteria"
                label="Pass Criteria"
                readonly={readonly}
              />
             
              {unit.assumedKnowledge && (
                <TextEditor
                  owner={unit}
                  field="assumedKnowledge"
                  label="Assumed Knowledge"
                  readonly={readonly}
                />
              )}
             
              {unit.approachToLearning && (
                <TextEditor
                  owner={unit}
                  field="approachToLearning"
                  label="Approach to Learning"
                  readonly={readonly}
                />
              )}
            </Expander> */}

        {/* BLOCK PREREQUISITES */}
        <Pane
          elevation={1}
          background="tint1"
          padding={16}
          borderRadius={8}
          marginBottom={16}
          marginTop={16}
        >
          <PrerequisiteEditor
            owner={unit}
            unit={unit}
            state={state}
            readonly={readonly}
            id="unitPrerequisites"
          />
        </Pane>

        {/* Block CRITERIA */}
        <Expander title="Dependency Graph" id="blockConstraints">
          <BlockGraphContainer unit={unit} height={400} />
        </Expander>

        {/* Prerequisited CRITERIA */}
        {/* <Expander title="Legacy Dependencies" id="unitConstraints">
              {unit.unitPrerequisites && (
                <TextEditor
                  readonly={readonly}
                  owner={unit}
                  field="unitPrerequisites"
                  label="Unit Prerequisites"
                  parser={parseUrl}
                />
              )}
              {unit.corequisites && (
                <TextEditor
                  readonly={readonly}
                  owner={unit}
                  field="corequisites"
                  label="Corequisites"
                  parser={parseUrl}
                />
              )}
              {unit.incompatible && (
                <TextEditor
                  readonly={readonly}
                  owner={unit}
                  field="incompatible"
                  label="Incompatible"
                  parser={parseUrl}
                />
              )}

              <Constraints dependencies={dependencies} unit={unit} />
            </Expander> */}

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure? You canot undo this action!')) {
              deleteUnit({
                variables: {
                  id: unit.id
                }
              });
            }
          }}
        >
          Delete
        </Button>
      </div>
    );
  }
);

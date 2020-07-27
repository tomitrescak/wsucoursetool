import React from 'react';
import marked from 'marked';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Heading,
  Button,
  Text,
  TabNavigation,
  Tab,
  Checkbox,
  toaster
} from 'evergreen-ui';
import { Unit, State, Block } from './types';
import { url, buildForm } from 'lib/helpers';
import Link from 'next/link';

import { useRouter, Router } from 'next/router';
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
import { ProgressView } from './progress_view';
import { model, Model, prop, undoMiddleware } from 'mobx-keystone';
import { BlockModel, UnitModel, createBlocks, createUnit } from './classes';

import { useUnitQuery, useDeleteUnitMutation, CourseListDocument } from 'config/graphql';

const selfColor = 'rgb(251, 230, 162)';
const depenedantColor = alpha => `rgb(${47 + alpha}, ${75 + alpha}, ${180 - alpha})`;
const dependOnColor = 'rgb(191, 14, 8)';

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

@model('Editor/Unit')
class UnitEditorModel extends Model({
  unit: prop<UnitModel>(),
  blocks: prop<BlockModel[]>()
}) {}

type Props = {
  id: string;
  readonly: boolean;
  state: State;
};

export const UnitDetailContainer = ({ id, readonly, state }: Props) => {
  const { loading, error, data } = useUnitQuery({
    variables: {
      id
    }
  });

  const model = React.useMemo(() => {
    if (data) {
      const model = new UnitEditorModel({
        unit: createUnit(data.unit.unit),
        blocks: createBlocks(data.unit.blocks)
      });

      const undoManager = undoMiddleware(model);
      state.undoManager = undoManager;

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

  return <UnitDetails model={model} readonly={readonly} state={state} />;
};

const UnitDetails: React.FC<{ model: UnitEditorModel; readonly: boolean; state: State }> = observer(
  ({ model: { unit, blocks }, readonly, state }) => {
    const form = React.useMemo(() => buildForm(unit, ['name', 'id', 'delivery', 'outcome']), [
      unit
    ]);
    // merge all keywords from blocks and topics
    let keywords = React.useMemo(() => {
      let keywords = blocks.flatMap(b => b.keywords);
      keywords = keywords.filter((item, index) => keywords.indexOf(item) === index).sort();
      return keywords;
    }, []);

    let selectionBlocks = [...blocks];
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

    // dependencies
    let colorMap: { [id: string]: string } = { [unit.id]: selfColor };

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
                <TopicEditor owner={unit} />

                {/* KEYWORDS */}
                <KeywordEditor owner={unit} keywords={keywords} />
              </Pane>
              {/* IMPORTED TOPICS */}
              {unit.dynamic && (
                <TopicEditor
                  owner={unit}
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
                <TopicBlockEditor block={unit.completionCriteria} items={selectionBlocks} />
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
                <PrerequisiteEditor owner={unit} unit={unit} />
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

                {/* TODO <UnitGraph
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
                /> */}
              </Expander>
              {/* OUTCOMES */}
              {/* TODO <Pane marginTop={16} elevation={2} padding={16} borderRadius={8}>
                <OutcomeEditor state={state} owner={unit} />
              </Pane> */}
            </Pane>
          )}
          {/* TODO {localState.tab === 'Blocks' && (
            <BlocksEditor
              readonly={readonly}
              blocks={unitBlocks}
              selectedBlockId={selectedBlockId}
              state={state}
              unit={unit}
              title="Blocks"
              url={block =>
                `/editor/units/${url(unit.name)}-${unit.id}--${url(block.name)}-${block.id}`
              }
            />
          )} */}
        </Pane>
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

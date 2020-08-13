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
import { State, AcsKnowledge, Block } from '../types';
import { buildForm, url } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { KeywordEditor, TopicEditor } from 'components/common/tag_editors';
import { action } from 'mobx';
import { Expander } from 'components/common/expander';
import { PrerequisiteEditor } from '../prerequisites/prerequisite_editor';
import { ProgressView } from '../common/progress_view';
import {
  BlockModel,
  UnitModel,
  createBlocks,
  createUnit,
  createCompletionCriteria
} from '../classes';

import {
  useUnitQuery,
  useDeleteUnitMutation,
  CourseListDocument,
  useSaveConfigMutation
} from 'config/graphql';
import { model, prop, Model, undoMiddleware } from 'mobx-keystone';
import { TopicBlockEditor } from 'components/completion_criteria/completion_criteria_editor';
import { TextEditor } from 'components/common/text_editor';
import { OutcomeEditor } from 'components/outcomes/outcome_editor';
import { Dependency } from 'config/utils';
import { UnitGraph } from './unit_graph';
import { BlocksEditor } from 'components/blocks/block_editor';

const selfColor = 'rgb(251, 230, 162)';

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
    }
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
      acs={data.acs}
      readonly={readonly}
      keywords={data.keywords}
      state={state}
      dependencies={data.unit.dependencies}
      readonlyBlocks={data.unit.blocks}
    />
  );
};

const UnitDetails: React.FC<{
  model: UnitModel;
  readonly: boolean;
  state: State;
  acs: AcsKnowledge[];
  keywords: string[];
  dependencies: Dependency[];
  readonlyBlocks: Block[];
}> = observer(({ model: unit, keywords, readonly, acs, state, dependencies, readonlyBlocks }) => {
  const form = React.useMemo(() => buildForm(unit, ['name', 'id', 'delivery', 'outcome']), [unit]);
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
    unit.completionCriteria = createCompletionCriteria({});
  }

  // dependencies
  let colorMap: { [id: string]: string } = { [unit.id]: selfColor };
  const view = readonly ? 'view' : 'editor';
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint1" elevation={1} padding={16} borderRadius={6}>
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
            <Tab is="a" target="_blank" href={`https://lgms.westernsydney.edu.au/lg/${unit.lgId}`}>
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
                disabled={readonly}
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
              <TopicEditor owner={unit} readonly={readonly} />

              {/* KEYWORDS */}
              <KeywordEditor owner={unit} keywords={keywords} readonly={readonly} />
            </Pane>

            <Checkbox
              margin={0}
              label="Dynamic"
              onChange={e => (unit.dynamic = e.currentTarget.checked)}
              checked={unit.dynamic}
              disabled={readonly}
            />
          </Pane>
        )}
        {localState.tab === 'Blocks' && (
          <BlocksEditor
            readonly={readonly}
            blocks={unit.blocks}
            readonlyBlocks={readonlyBlocks}
            selectedBlockId={selectedBlockId}
            state={state}
            unit={unit}
            title="Blocks"
            acs={acs}
            keywords={keywords}
            url={block =>
              `/${view}/units/${url(unit.name)}-${unit.id}--${url(block.name)}-${block.id}`
            }
          />
        )}
      </Pane>
      {localState.tab === 'Description' && (
        <Pane>
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
              block={unit.completionCriteria}
              items={selectionBlocks}
              readonly={readonly}
            />
          </Expander>

          {/* OUTCOME DESCRIPTION */}
          <Expander title="Description" id="unitDescription">
            <TextEditor owner={unit} field="outcome" label="Decription" readonly={readonly} />
            {/* PASS CRITERIA */}
            <TextEditor
              owner={unit}
              field="passCriteria"
              label="Pass Criteria"
              readonly={readonly}
            />
            {/* ASSUMED KNOWLEDGE */}
            {unit.assumedKnowledge && (
              <TextEditor
                owner={unit}
                field="assumedKnowledge"
                label="Assumed Knowledge"
                readonly={readonly}
              />
            )}
            {/* APPROACH TO LEARNING */}
            {unit.approachToLearning && (
              <TextEditor
                owner={unit}
                field="approachToLearning"
                label="Approach to Learning"
                readonly={readonly}
              />
            )}
          </Expander>

          {/* BLOCK PREREQUISITES */}
          <Pane
            elevation={1}
            background="tint1"
            padding={16}
            borderRadius={8}
            marginBottom={16}
            marginTop={16}
          >
            <PrerequisiteEditor owner={unit} unit={unit} state={state} readonly={readonly} />
          </Pane>

          {/* Prerequisited CRITERIA */}
          <Expander title="Unit Constraints" id="unitConstraints">
            {unit.unitPrerequisites && (
              <TextEditor
                readonly={readonly}
                owner={unit}
                field="unitPrerequisites"
                label="Unit Prerequisites"
                parser={urlParse}
              />
            )}
            {unit.corequisites && (
              <TextEditor
                readonly={readonly}
                owner={unit}
                field="corequisites"
                label="Corequisites"
                parser={urlParse}
              />
            )}
            {unit.incompatible && (
              <TextEditor
                readonly={readonly}
                owner={unit}
                field="incompatible"
                label="Incompatible"
                parser={urlParse}
              />
            )}

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
          <Pane marginTop={16} elevation={2} padding={16} borderRadius={8} background="tint1">
            <OutcomeEditor acss={acs} owner={unit} state={state} readonly={readonly} />
          </Pane>
        </Pane>
      )}

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
});

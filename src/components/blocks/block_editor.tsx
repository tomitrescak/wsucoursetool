import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Alert,
  Heading,
  Button,
  IconButton,
  Badge,
  Icon,
  Select,
  TextInput,
  Text,
  SelectField,
  Checkbox,
  Combobox
} from 'evergreen-ui';
import { Range, createSliderWithTooltip } from 'rc-slider';

import Router from 'next/router';
import { State, Block, BlockType as ActivityType, Activity, Unit, AcsKnowledge } from '../types';
import { buildForm, findMaxId, findNumericMaxId } from 'lib/helpers';
import Link from 'next/link';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from '../common/tab';
import { OutcomeEditor } from '../outcomes/outcome_editor';
import { PrerequisiteEditor, PrerequisiteOwner } from '../prerequisites/prerequisite_editor';
import { TopicBlockEditor } from '../completion_criteria/completion_criteria_editor';
import { TextEditor } from '../common/text_editor';
import { KeywordEditor, TopicEditor } from 'components/common/tag_editors';
import { action, toJS } from 'mobx';
import { Dnd, DragContainer } from 'components/common/dnd';
import { BlockModel, UnitModel, ActivityModel } from 'components/classes';
import units from 'pages/units';
import { Expander } from 'components/common/expander';
import { Handler, ActivityEditor } from './activity_editor';
import { useUnitsQuery, useUnitBaseQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { SfiaOwnerEditor } from 'components/sfia/sfia_owner_editor';
import { BlockTopicsEditor } from './block_topics.editor';
import { round } from 'components/courses/search/search_helpers';
import build from 'next/dist/build';

const TooltipRange = createSliderWithTooltip(Range);

function blockCredits(block: Block) {
  if (block.completionCriteria && block.completionCriteria.credit) {
    return block.completionCriteria.credit;
  }
}

const BlockDetails: React.FC<{
  block: BlockModel;
  state: State;
  unit: UnitModel;
  keywords: string[];
  readonly: boolean;
}> = observer(({ block, state, unit, keywords, readonly }) => {
  const form = React.useMemo(
    () => buildForm(block, ['name', 'description', 'outcome', 'credits']),
    [block]
  );

  const { loading, error, data } = useUnitsQuery();
  const { loading: unitLoading, data: unitData } = useUnitBaseQuery({
    variables: {
      id: block.replacedByUnit || ''
    }
  });
  if (loading || unitLoading || error) {
    return <ProgressView loading={loading || unitLoading} error={error} />;
  }

  const view = readonly ? 'view' : 'editor';

  function addBlock(name = '<New Block>') {
    const newBlock: Block = {
      id: findMaxId(unit.blocks),
      name,
      prerequisites: [
        {
          id: block.id,
          type: 'block',
          recommended: true
        }
      ],
      completionCriteria: {},
      description: '',
      keywords: [],
      outcome: '',
      outcomes: [],
      topics: [],
      // credits: 0,
      activities: [],
      level: '',
      offline: false,
      length: 0,
      credits: 0,
      sfiaSkills: []
    };
    if (unit) {
      unit.addBlock(newBlock);
    }

    // TODO: sync route
    Router.push(
      `/${view}/[category]/[item]`,
      unit
        ? `/${view}/units/unit-${unit.id}--new-block-${newBlock.id}`
        : `/${view}/blocks/new-block-${newBlock.id}`
      // { shallow: true }
    );
  }

  function addActivity(type: ActivityType, name = '<New Activity>') {
    const newActivity: Activity = {
      id: findMaxId(block.activities),
      name,
      description: '',
      type,
      lengthHours: 2
    };
    block.addActivity(newActivity);
    state.delaySave();
  }

  const creditSum = round(
    unit.blocks.reduce((p, n) => parseFloat(n.credits as any) + p, 0),
    2
  );

  return (
    <div style={{ flex: 1 }} key={block.id}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Pane display="flex" alignItems="center" marginBottom={8}>
          <Heading size={500} flex="1">
            <Icon marginRight={8} icon="build" size={14} />
            {block.name}
          </Heading>
          {unit && !readonly && (
            <>
              <IconButton
                icon="arrow-up"
                iconSize={12}
                marginRight={2}
                width={20}
                onClick={() => {
                  const index = unit.blocks.findIndex(b => b.id === block.id);
                  if (index >= 1) {
                    unit.removeBlock(index);
                    unit.insertBlock(block, index - 1);
                  }
                }}
              />
              <IconButton
                icon="arrow-down"
                iconSize={12}
                marginRight={2}
                width={20}
                onClick={() => {
                  const index = unit.blocks.findIndex(b => b.id === block.id);
                  if (index < block.activities.length - 1) {
                    unit.removeBlock(index);
                    unit.insertBlock(block, index + 1);
                  }
                }}
              />
            </>
          )}

          {!readonly && (
            <Button
              appearance="primary"
              intent="success"
              marginRight={8}
              iconBefore="plus"
              onClick={() => {
                addBlock();
              }}
            >
              Block
            </Button>
          )}
        </Pane>

        {/* DETAILS */}
        <Expander id="blockDetails" title="Details">
          {!readonly && (
            <Pane display="flex" alignItems="center">
              <TextInputField
                flex="1"
                label="Name"
                placeholder="Block Name"
                value={block.name}
                onChange={form.name}
                marginBottom={8}
              />
            </Pane>
          )}

          <Pane display="flex" marginBottom={8}>
            <Checkbox
              margin={0}
              label="Unit Only"
              onChange={e => (block.offline = e.currentTarget.checked)}
              checked={block.offline}
              disabled={readonly}
            />
            <Checkbox
              margin={0}
              marginLeft={16}
              label="Recommended"
              onChange={e => (block.recommended = e.currentTarget.checked)}
              checked={block.recommended}
              disabled={readonly}
            />
            <Checkbox
              margin={0}
              marginLeft={16}
              label="Required"
              onChange={e => (block.required = e.currentTarget.checked)}
              checked={block.required}
              disabled={readonly}
            />
          </Pane>

          {/* <TextEditor owner={block} field="outcome" label="Description" readonly={readonly} /> */}

          <Pane display="flex">
            {/* TOPICS */}
            {/* <TopicEditor owner={block} readonly={readonly} /> */}

            <TextInputField
              width={60}
              label="Credits"
              placeholder="Credit"
              type="number"
              step={0.1}
              value={block.credits}
              onChange={form.credits}
              margin={0}
              marginBottom={8}
              marginTop={4}
              marginRight={8}
              disabled={readonly}
            />

            {/* KEYWORDS */}
            <KeywordEditor owner={block} keywords={keywords} readonly={readonly} />

            {/* <TextInputField
              width={50}
              label="Length"
              placeholder="Length"
              type="number"
              value={block.length}
              onChange={form.length}
              margin={0}
              marginBottom={8}
              marginTop={4}
              marginLeft={8}
              disabled={readonly}
            /> */}
          </Pane>

          {creditSum != 10 ? (
            <Alert intent="danger" title={`The sum of credits is ${creditSum} and not 10`}></Alert>
          ) : null}

          {/* <Pane display="flex" marginBottom={8}>
            {(!readonly || block.replacedByUnit) && (
              <Pane flex={1} marginRight={8}>
                <Text fontWeight={500} display="block">
                  Replace by Unit:
                </Text>
                {!readonly ? (
                  <Combobox
                    id="block"
                    width="100%"
                    selectedItem={
                      block.replacedByUnit && data.units.find(u => u.id === block.replacedByUnit)
                    }
                    items={data.units}
                    itemToString={item => (item ? item.name : '')}
                    onChange={selected => (block.replacedByUnit = selected.id)}
                  />
                ) : (
                  <span>{block.replacedByUnit}</span>
                )}
              </Pane>
            )}

            {(!readonly || block.replacedByBlock) && (
              <Pane flex={1}>
                <Text fontWeight={500} display="block">
                  Replace by Block:
                </Text>
                {!readonly ? (
                  <Combobox
                    width="100%"
                    id="block"
                    selectedItem={
                      block.replacedByBlock &&
                      unitData.unitBase.blocks.find(u => u.id === block.replacedByBlock)
                    }
                    items={unitData.unitBase ? unitData.unitBase.blocks : []}
                    itemToString={item => (item ? item.name : '')}
                    onChange={selected => (block.replacedByBlock = selected.id)}
                  />
                ) : (
                  <span>{block.replacedByBlock}</span>
                )}
              </Pane>
            )}
          </Pane> */}

          <Pane display="flex">
            {/* LEVEL */}
            {/* <SelectField
              label="Level"
              value={block.level}
              id="level"
              onChange={e => (block.level = e.currentTarget.value)}
              margin={0}
              marginRight={8}
              disabled={readonly}
            >
              <option value="">Please Select ...</option>
              <option value="Fundamentals">Fundamentals</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Applied">Applied</option>
            </SelectField> */}

            {!readonly && (
              <Button
                iconBefore="duplicate"
                onClick={action(() => {
                  let blockIndex = unit.blocks.indexOf(block);
                  let b1 = unit.blocks[blockIndex];
                  for (let i = blockIndex + 1; i < unit.blocks.length; i++) {
                    let b2 = unit.blocks[i];
                    for (let j = b2.topics.length; j >= 0; j--) {
                      b2.removeTopic(j);
                    }
                    for (let j = 0; j < b1.topics.length; j++) {
                      b2.addTopic(b1.topics[j].toJS());
                    }
                  }
                })}
                marginTop={20}
              >
                Copy Topics
              </Button>
            )}
            {!readonly && (
              <Button
                marginLeft={8}
                iconBefore="duplicate"
                onClick={action(() => {
                  let blockIndex = unit.blocks.indexOf(block);
                  let b1 = unit.blocks[blockIndex];
                  for (let i = blockIndex + 1; i < unit.blocks.length; i++) {
                    let b2 = unit.blocks[i];
                    for (let j = b2.sfiaSkills.length; j >= 0; j--) {
                      b2.removeSfiaSkill(j);
                    }
                    for (let j = 0; j < b1.sfiaSkills.length; j++) {
                      b2.addSfiaSkill({
                        id: b1.sfiaSkills[j].id,
                        level: b1.sfiaSkills[j].level
                      });
                    }
                  }
                })}
                marginTop={20}
              >
                Copy SFIA
              </Button>
            )}
            {!readonly && (
              <Button
                marginLeft={8}
                iconBefore="duplicate"
                onClick={action(() => {
                  let blockIndex = unit.blocks.indexOf(block);
                  let b1 = unit.blocks[blockIndex];
                  for (let i = blockIndex + 1; i < unit.blocks.length; i++) {
                    let b2 = unit.blocks[i];

                    for (let j = b2.keywords.length; j >= 0; j--) {
                      b2.removeKeyword(j);
                    }

                    for (let j = 0; j < b1.keywords.length; j++) {
                      b2.addKeyword(b1.keywords[j]);
                    }
                  }
                })}
                marginTop={20}
              >
                Copy Keywords
              </Button>
            )}
          </Pane>
        </Expander>

        {/* ACTIVITIES */}

        {/* <Pane elevation={1} padding={16} borderRadius={8} marginBottom={16} marginTop={16}>
          <ActivityEditor
            addActivity={addActivity}
            block={block}
            dnd={dnd}
            readonly={readonly}
            unit={unit}
          />
        </Pane> */}

        {/* TOPICS */}
        <BlockTopicsEditor block={block} readonly={readonly} topics={data.topics} />

        {/* PREREQUSTIES */}
        <Pane elevation={1} padding={16} borderRadius={8} marginBottom={16} marginTop={16}>
          <PrerequisiteEditor
            state={state}
            owner={block}
            unit={unit}
            readonly={readonly}
            id="blockPrerequisites"
          />
        </Pane>

        {/* SFIA SKILLS */}

        <Expander title="SFIA Skills" id="sfiaSkillsUnit">
          <SfiaOwnerEditor owner={block} readonly={readonly} hasMax={true} />
        </Expander>

        {/* ACS Skills */}

        {/* <Pane elevation={1} padding={16} borderRadius={8} marginBottom={16} marginTop={16}>
          <OutcomeEditor state={state} owner={block} acss={acs} readonly={readonly} />
        </Pane> */}

        {/* COMPLETION CRITERIA */}

        {/* <Pane elevation={2} padding={16} borderRadius={8} marginBottom={16} marginTop={16}>
          <Heading
            size={500}
            marginBottom={expanded ? 8 : 0}
            borderBottom={expanded ? 'dashed 1px #dedede' : ''}
            display="flex"
            alignItems="center"
          >
            <Icon
              size={16}
              marginRight={8}
              icon={expanded ? 'chevron-down' : 'chevron-right'}
              cursor="pointer"
              onClick={() => {
                const exp = !expanded;
                setExpanded(exp);
                localStorage.setItem('blockDetails', exp.toString());
              }}
            />
           
            Completion Criteria
          </Heading>

          {expanded && (
            <TopicBlockEditor
              block={block.completionCriteria}
              items={block.activities}
              readonly={readonly}
            />
          )}
        </Pane> */}

        <Button
          appearance="primary"
          intent="danger"
          onClick={() => {
            unit.removeBlock(unit.blocks.indexOf(block));
          }}
          iconBefore="trash"
          marginTop={8}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  blocks: BlockModel[];
  readonlyBlocks: Block[];
  unit: UnitModel;
  selectedBlockId: string;
  url: (block: Block) => string;
  title?: string;
  readonly: boolean;
  keywords: string[];
};

function createRanges(arr: number[]) {
  let start = null;
  let end = null; // track start and end
  end = start = arr[0];
  let result: string[] = [];
  for (let i = 1; i < arr.length; i++) {
    // as long as entries are consecutive, move end forward
    if (arr[i] == arr[i - 1] + 1) {
      end = arr[i];
    } else {
      // when no longer consecutive, add group to result
      // depending on whether start=end (single item) or not
      if (start == end) result.push(start);
      else result.push(start + '-' + end);

      start = end = arr[i];
    }
  }

  // handle the final group
  if (start == end) result.push(start);
  else result.push(start + '-' + end);

  return result;
}

function requisiteRanges(blocks: Block[], block: Block, recommended: boolean) {
  const prerequisites = (block.prerequisites || [])
    .filter(
      p =>
        p.type === 'block' &&
        (p.recommended == recommended || (recommended === false && p.recommended == null))
    )
    .sort((a, b) =>
      blocks.findIndex(s => s.id === a.id) < blocks.findIndex(s => s.id === b.id) ? -1 : 1
    );

  const indices = prerequisites.map(b => blocks.findIndex(s => s.id === b.id) + 1);
  if (indices.length > 0) {
    return createRanges(indices);
  }
  return [];
}

function blockColor(block: Block) {
  if (block.offline) {
    return 'orange';
  }
  return undefined;
}

const BlocksEditorView: React.FC<Props> = ({
  selectedBlockId,
  url,
  state,
  unit,
  title,
  keywords,
  readonly,
  readonlyBlocks
}) => {
  const selectedBlock = selectedBlockId ? unit.blocks.find(b => b.id === selectedBlockId) : null;
  const dnd = React.useMemo(() => new Dnd({ splitColor: 'transparent', id: 'blocks' }), []);
  const view = readonly ? 'view' : 'editor';

  const mergeWithNext = direction =>
    action(() => {
      if (!selectedBlockId) {
        return;
      }
      const blockIndex = unit.blocks.findIndex(b => b.id === selectedBlockId);
      const nextBlock = unit.blocks[blockIndex + direction];

      if (!nextBlock) {
        return;
      }
      const currentBlock = unit.blocks[blockIndex];

      let maxId = findNumericMaxId(currentBlock.activities);

      // reasign ids
      let activities = nextBlock.activities.map(a => ({
        ...a.toJS(),
        id: (maxId++).toString()
      }));

      // if (unit.completionCriteria && unit.completionCriteria.criteria) {
      //   let cc = unit.completionCriteria.criteria.find(c => c.id === nextBlock.id);
      //   if (cc) {
      //     // fill in the current block
      //     currentBlock.completionCriteria.type = 'allOf';

      //     if (currentBlock.completionCriteria.criteria == null) {
      //       currentBlock.completionCriteria.criteria = [];
      //     }
      //     currentBlock.completionCriteria.addCompletionCriteria({
      //       ...cc.toJS(),
      //       id: activities[0]?.id as any
      //     });

      //     // remove from original
      //     unit.completionCriteria.removeCompletionCriteria(
      //       unit.completionCriteria.criteria.indexOf(cc)
      //     );
      //   }
      // }

      // assign new id

      currentBlock.length += nextBlock.length;
      currentBlock.credits += nextBlock.credits;
      currentBlock.topics = [...currentBlock.topics, ...nextBlock.topics].filter(
        (v, i) => currentBlock.topics.findIndex(t => t.id === v.id) === i
      );
      currentBlock.topics.forEach(
        t => (t.ratio = Math.round((1 / currentBlock.topics.length) * 100) / 100)
      );
      currentBlock.keywords = Array.from(
        new Set([...currentBlock.keywords, ...nextBlock.keywords])
      );

      // aggregate existing
      for (let sfia of currentBlock.sfiaSkills) {
        let existing = nextBlock.sfiaSkills.find(s => s.id === sfia.id);
        if (existing) {
          sfia.level += existing.level;
        }
      }

      // add from other
      nextBlock.sfiaSkills
        .filter(s => currentBlock.sfiaSkills.every(c => c.id !== s.id))
        .forEach(n => currentBlock.sfiaSkills.push(n));

      currentBlock.addActivities(activities);
      unit.removeBlock(blockIndex + direction);
    });

  const blockModifier = React.useMemo(
    () => ({
      splice(position: number, count: number, element?: BlockModel): void {
        unit.spliceBlock(position, count, element);
      },
      findIndex(condition: (id: Block) => boolean): number {
        return unit.blocks.findIndex(condition);
      }
    }),
    [unit]
  );

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8} marginTop={8}>
      <Tablist flexBasis={300} width={200} marginRight={8}>
        <Pane display="flex">
          {title && (
            <Heading size={500} marginBottom={16} flex="1">
              {/* {title} */}
            </Heading>
          )}
          {!readonly && (
            <>
              <IconButton
                icon="symbol-triangle-up"
                title="Merge with previous block"
                onClick={mergeWithNext(-1)}
              />
              <IconButton
                icon="symbol-triangle-down"
                title="Merge with next block"
                onClick={mergeWithNext(1)}
              />
            </>
          )}
        </Pane>
        <Tabs>
          <DragContainer>
            {unit.blocks.map((block, index) => (
              <Pane
                display="flex"
                alignItems="center"
                key={block.id}
                {...dnd.props(block, blockModifier, true)}
              >
                {!readonly && <Handler dnd={dnd} />}
                <Pane flex="1" width="130px" marginRight={8}>
                  <Link key={block.id} href={`/${view}/[category]/[item]`} as={url(block)}>
                    <a>
                      <SideTab
                        key={block.id}
                        id={block.id}
                        isSelected={selectedBlock && block.id === selectedBlock.id}
                        aria-controls={`panel-${block.name}`}
                        display="flex"
                        alignItems="center"
                        backgroundColor={
                          selectedBlock && block.id === selectedBlock.id ? '#f0f0f0' : undefined
                        }
                        outline={
                          selectedBlock && block.id === selectedBlock.id
                            ? 'solid 1px #d0d0d0'
                            : undefined
                        }
                        padding={2}
                        borderRadius={3}
                        color={
                          block.required
                            ? 'salmon'
                            : block.offline
                            ? 'orange'
                            : block.recommended
                            ? 'green'
                            : undefined
                        }
                        // textDecoration={block.replacedByBlock ? 'line-through' : undefined}
                      >
                        <IconButton
                          intent="danger"
                          icon="trash"
                          appearance="primary"
                          iconSize={8}
                          onClick={() => unit.removeBlock(index)}
                        />
                        <Badge color={blockColor(block) as any} marginRight={8}>
                          {block.credits}¢
                        </Badge>

                        {block.name}
                      </SideTab>
                    </a>
                  </Link>
                </Pane>
                <Pane>
                  {blockCredits(block) && (
                    <Badge
                      color={block.activities.some(a => a.type === 'exam') ? 'red' : 'orange'}
                      marginLeft={-4}
                      marginRight={8}
                    >
                      {blockCredits(block)}¢
                    </Badge>
                  )}
                  {requisiteRanges(unit.blocks, block, false).map(r => (
                    <Badge key={r} color={'red'}>
                      {r}
                    </Badge>
                  ))}
                  {requisiteRanges(unit.blocks, block, true).map(r => (
                    <Badge key={r} color={'green'}>
                      {r}
                    </Badge>
                  ))}
                </Pane>
              </Pane>
            ))}
          </DragContainer>

          {/* <Heading size={400}>Credits</Heading> */}

          {/* <Pane paddingTop={8} paddingBottom={20}>
            <TooltipRange
              value={unit.blocks.slice(0, unit.blocks.length - 1).map((t, i) => {
                let val = 0;
                for (let j = 0; j < i; j++) {
                  val += unit.blocks[j].credits;
                }
                return t.credits + val;
              })}
              tipFormatter={value => value}
              min={0}
              max={10}
              step={0.5}
              marks={unit.blocks.reduce((p, n, i) => {
                let credits = 0;
                for (let j = 0; j <= i; j++) {
                  credits += unit.blocks[j].credits;
                }
                p[credits] = n.credits;

                return p;
              }, {} as any)}
              onChange={e => {
                for (let i = 0; i < e.length; i++) {
                  let val = 0;
                  for (let j = 0; j < i; j++) {
                    val += unit.blocks[j].credits;
                  }
                  unit.blocks[i].credits = e[i] - val;
                }
                unit.blocks[unit.blocks.length - 1].credits = 10 - e[e.length - 1];
              }}
              dots={true}
              pushable={true}
            />
          </Pane> */}

          {/* {readonlyBlocks && (
            <>
              <Heading size={400}>Imported Blocks</Heading>
              {readonlyBlocks.map((b, i) => {
                return (
                  <Link
                    key={b.id}
                    href={`/${view}/[category]/[item]`}
                    as={`/${view}/units/imported-${b.unitId}--${b.name}-${b.id}`}
                  >
                    <a>
                      <SideTab
                        id={b.id}
                        aria-controls={`panel-${b.name}`}
                        display="flex"
                        alignItems="center"
                      >
                        <Badge color="orange" marginRight={8}>
                          {i + 1}
                        </Badge>

                        {b.name}
                      </SideTab>
                    </a>
                  </Link>
                );
              })}
            </>
          )} */}
        </Tabs>
        {!readonly && (
          <Pane marginTop={16}>
            <AddBlockModal state={state} unit={unit} />
          </Pane>
        )}
      </Tablist>
      {unit.blocks.length === 0 && <Alert flex={1}>This unit has no blocks</Alert>}
      {selectedBlock && (
        <BlockDetails
          keywords={keywords}
          block={selectedBlock}
          unit={unit}
          state={state}
          readonly={readonly}
        />
      )}
    </Pane>
  );
};

export const BlocksEditor = observer(BlocksEditorView);

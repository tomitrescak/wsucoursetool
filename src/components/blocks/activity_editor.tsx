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
  Checkbox
} from 'evergreen-ui';
import Router from 'next/router';
import { State, Block, BlockType as ActivityType, Activity, Unit, AcsKnowledge } from '../types';
import { buildForm, findMaxId, findNumericMaxId } from 'lib/helpers';
import Link from 'next/link';

import { AddBlockModal } from './add_block_modal';
import { SideTab, Tabs } from '../common/tab';
import { OutcomeEditor } from '../outcomes/outcome_editor';
import { PrerequisiteEditor } from '../prerequisites/prerequisite_editor';
import { TopicBlockEditor } from '../completion_criteria/completion_criteria_editor';
import { TextEditor } from '../common/text_editor';
import { KeywordEditor, TopicEditor } from 'components/common/tag_editors';
import { action, toJS } from 'mobx';
import { Dnd, DragContainer } from 'components/common/dnd';
import { BlockModel, UnitModel, ActivityModel } from 'components/classes';
import units from 'pages/units';
import { Expander } from 'components/common/expander';

export const Handler = ({ dnd }) => (
  <Pane width={10} height={20} marginRight="2" pointer="drag" color="#999" {...dnd.handlerProps}>
    <Icon icon="drag-handle-vertical" size={14} />
  </Pane>
);

export const ActivityDetail: React.FC<{
  unit: UnitModel;
  activity: ActivityModel;
  block: BlockModel;
  dnd: Dnd;
  readonly: boolean;
}> = observer(({ block, activity, dnd, unit, readonly }) => {
  const form = React.useMemo(
    () => buildForm(activity, ['name', 'type', 'description', 'lengthHours']),
    [activity]
  );
  const activityModifier = React.useMemo(
    () => ({
      splice(position: number, count: number, element?: ActivityModel): void {
        block.spliceActivity(position, count, element);
      },
      findIndex(condition: (c: Activity) => boolean): number {
        return block.activities.findIndex(condition);
      }
    }),
    [block]
  );

  return (
    <div
      {...dnd.props(activity, activityModifier, true)}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}
    >
      <div style={{ flex: '0 0 10px', marginRight: '8px' }}>
        <Handler dnd={dnd} />
      </div>

      <Badge
        marginRight={8}
        color={
          activity.type === 'knowledge'
            ? 'green'
            : activity.type === 'exam'
            ? 'red'
            : activity.type === 'practical'
            ? 'blue'
            : activity.type === 'assignment'
            ? 'yellow'
            : 'teal'
        }
        title={
          activity.type === 'knowledge'
            ? 'Lecture'
            : activity.type === 'exam'
            ? 'Exam or Assessment'
            : activity.type === 'practical'
            ? 'Practical'
            : activity.type === 'assignment'
            ? 'Assignment or Project'
            : 'WIL'
        }
      >
        {activity.type === 'knowledge'
          ? 'K'
          : activity.type === 'exam'
          ? 'E'
          : activity.type === 'practical'
          ? 'P'
          : activity.type === 'assignment'
          ? 'A'
          : 'W'}
      </Badge>

      {readonly ? (
        <Text is="div" flex={1} size={400}>
          {activity.name}
        </Text>
      ) : (
        <TextInput
          flex="1"
          placeholder="Activity Name"
          value={activity.name}
          onChange={form.name}
          width="100%"
          marginRight={4}
        />
      )}

      {/* <td>
          <TextInput
            placeholder="Activity Description Name"
            value={activity.description}
            onChange={form.description}
            width="100%"
          />
        </td> */}

      {!readonly && (
        <>
          <Select
            flex="0 0 100px"
            value={activity.type}
            id="type"
            placeholder="Activity Type"
            onChange={form.type}
            marginRight={4}
          >
            <option value="">Please Select ...</option>
            <option value="knowledge">Knowledge</option>
            <option value="practical">Practical</option>
            <option value="assignment">Assignment (Project)</option>
            <option value="exam">Exam / Quiz</option>
            <option value="wif">WIL</option>
          </Select>
          <TextInput
            flex="0 0 50px"
            placeholder="Hours"
            width={40}
            marginRight={4}
            value={activity.lengthHours}
            onChange={form.lengthHours}
          />

          <IconButton
            icon="eject"
            iconSize={12}
            width={24}
            marginRight={4}
            intent="warning"
            appearance="primary"
            onClick={() => {
              const clone = activity.toJS();
              unit.addBlock({
                id: findMaxId(unit.blocks),
                name: activity.name,
                outcome: '',
                outcomes: [],
                description: '',
                activities: [clone],
                completionCriteria: {},
                keywords: [],
                prerequisites: [],
                topics: [],
                level: undefined,
                flagged: false,
                credit: 0,
                length: 0,
                sfiaSkills: [],
                replacedByBlock: null,
                replacedByUnit: null,
                unitId: unit.id
              });
              block.spliceActivity(block.activities.indexOf(activity), 1);
            }}
          />

          <IconButton
            icon="trash"
            iconSize={12}
            width={24}
            intent="danger"
            appearance="primary"
            onClick={() => block.spliceActivity(block.activities.indexOf(activity), 1)}
          />
        </>
      )}
    </div>
  );
});

export const ActivityEditor = observer(({ readonly, addActivity, block, unit, dnd }) => {
  const [expanded, setExpanded] = React.useState(localStorage.getItem('activities') === 'true');

  return (
    <>
      <Pane
        display="flex"
        alignItems="center"
        marginBottom={expanded ? 16 : undefined}
        paddingBottom={4}
        borderBottom={expanded ? 'dashed 1px #dedede' : undefined}
      >
        <Heading size={500} flex="1">
          <Icon
            size={16}
            marginRight={8}
            icon={expanded ? 'chevron-down' : 'chevron-right'}
            cursor="pointer"
            onClick={() => {
              const exp = !expanded;
              setExpanded(exp);
              localStorage.setItem('prerequisites', exp.toString());
            }}
          />
          Activities
        </Heading>
        {!readonly && expanded && (
          <>
            <Button
              appearance="primary"
              intent="success"
              marginRight={8}
              iconBefore="plus"
              onClick={() => {
                addActivity('knowledge', 'Lecture');
              }}
            >
              Lecture
            </Button>
            <Button
              appearance="primary"
              intent="none"
              iconBefore="plus"
              marginRight={8}
              onClick={() => {
                addActivity('practical', 'Practical'); // - ' + block.name);
              }}
            >
              Practical
            </Button>
            <Button
              appearance="primary"
              intent="warning"
              iconBefore="plus"
              marginRight={8}
              onClick={() => {
                addActivity('assignment', 'Portfolio'); // - ' + block.name);
              }}
            >
              Assig.
            </Button>
            <Button
              appearance="primary"
              intent="danger"
              iconBefore="plus"
              onClick={() => {
                addActivity('exam', 'Exam');
              }}
            >
              Exam
            </Button>
          </>
        )}
      </Pane>

      {expanded && (
        <Pane>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ flex: '0 0 50px' }} />
            <div style={{ flex: 1 }}>
              <Heading size={400}>Name</Heading>
            </div>
            {/* <th style={{ width: '100%' }}>
                    <Heading size={400}>Description</Heading>
                  </th> */}
            {!readonly && (
              <>
                <div style={{ flex: ' 0 0 100px' }}>
                  <Heading size={400}>Type</Heading>
                </div>
                <div style={{ flex: '0 0 78px' }}>
                  <Heading size={400}>Hrs.</Heading>
                </div>
              </>
            )}
          </div>

          <DragContainer>
            {block.activities.map(a => (
              <ActivityDetail
                unit={unit}
                block={block}
                activity={a}
                key={a.id}
                dnd={dnd}
                readonly={readonly}
              />
            ))}
          </DragContainer>
        </Pane>
      )}
    </>
  );
});

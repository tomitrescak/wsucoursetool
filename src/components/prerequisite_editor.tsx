import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  Pane,
  Heading,
  Button,
  Select,
  Combobox,
  ListItem,
  UnorderedList,
  IconButton,
  Text,
  Checkbox,
  Badge
} from 'evergreen-ui';

import { bloom } from './bloom';
import { State, Prerequisite } from './types';

export type Props = {
  state: State;
  owner: { prerequisites: Prerequisite[] };
};

export const PrerequisiteEditor: React.FC<Props> = observer(({ state, owner }) => {
  const acsSkills = React.useMemo(
    () =>
      state.courseConfig.acsKnowledge
        .map(m => m.items)
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const localState = useLocalStore(() => ({
    type: '',
    topicId: '',
    blockId: '',
    acsSkillId: '',
    rating: -1,
    blockTopicId: '',
    recommended: false
  }));
  return (
    <Pane flex={1}>
      <Heading size={500} marginBottom={16} borderBottom="dashed 1px #dedede">
        Prerequisites and Recommendations
      </Heading>

      <UnorderedList icon="tick" iconColor="success" alignItems="center">
        {(owner.prerequisites || []).map((o, i) => (
          <ListItem display="flex">
            {o.type === 'skill' && (
              <Text flex="1">
                <Badge color="orange">Skill</Badge> {acsSkills.find(s => s.id === o.id)?.name} -{' '}
                {o.value} [{bloom[o.value - 1].title}]{' '}
              </Text>
            )}
            {o.type === 'block' && (
              <Text flex="1">
                <Badge color="blue">Block</Badge>{' '}
                {state.courseConfig.blocks.find(s => s.id === o.id)?.name}
              </Text>
            )}
            {o.type === 'topic' && (
              <Text flex="1">
                <Badge color="purple">Topic</Badge>{' '}
                {state.courseConfig.topics.find(s => s.id === o.id)?.name}
              </Text>
            )}

            <Badge marginRight={16} marginLeft={8} color={o.recommended ? 'green' : 'red'}>
              {o.recommended ? 'Recommended' : 'Required'}
            </Badge>

            <IconButton
              marginTop={-4}
              flex="0 0 40px"
              icon="trash"
              intent="danger"
              appearance="primary"
              marginRight={16}
              onClick={() => {
                owner.prerequisites.splice(i, 1);
              }}
            />
          </ListItem>
        ))}
      </UnorderedList>

      <Pane display="flex" alignItems="center">
        <Select
          marginRight={8}
          flex="0 0 80px"
          value={localState.type || ''}
          onChange={e => (localState.type = e.currentTarget.value)}
        >
          <option value="">None</option>
          <option value="block">Block</option>
          <option value="topic">Topic</option>
          <option value="skill">Skill</option>
        </Select>

        {/* PREREQUSTIE TYPE = BLOCK */}

        {localState.type === 'block' && (
          <Pane display="flex" alignItems="center" flex="1" marginRight={8}>
            <Combobox
              flex="1"
              width="100%"
              id="block"
              items={state.courseConfig.blocks}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localState.blockId = selected.id)}
            />
          </Pane>
        )}

        {/* PREREQUSTIE TYPE = TOPIC */}

        {localState.type === 'topic' && (
          <Pane display="flex" alignItems="center" flex="1" marginRight={8}>
            <Combobox
              flex="1"
              width="100%"
              id="topic"
              items={state.courseConfig.topics}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localState.topicId = selected.id)}
            />
          </Pane>
        )}

        {/* PREREQUSTIE TYPE = SKILL */}

        {localState.type === 'skill' && (
          <Pane display="flex" alignItems="center" flex="1">
            <Combobox
              flex="1"
              width="100%"
              id="mapping"
              items={acsSkills}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localState.acsSkillId = selected.id)}
            />
            <Select
              marginLeft={8}
              marginRight={8}
              flex="0 0 140px"
              value={localState.rating ? localState.rating.toString() : ''}
              onChange={e => (localState.rating = parseInt(e.currentTarget.value))}
            >
              <option value="">None</option>
              <option value="1">1 - Knowledge</option>
              <option value="2">2 - Comprehension</option>
              <option value="3">3 - Application</option>
              <option value="4">4 - Analysis</option>
              <option value="5">5 - Synthesis</option>
              <option value="6">6 - Evaluation</option>
            </Select>
          </Pane>
        )}

        <Checkbox
          checked={localState.recommended}
          onChange={e => (localState.recommended = e.currentTarget.checked)}
        />
        <Text display="block" marginLeft={8} marginRight={8}>
          Rec.
        </Text>

        {localState.type && (
          <Button
            iconBefore="plus"
            appearance="primary"
            onClick={() => {
              if (!owner.prerequisites) {
                owner.prerequisites = [];
              }
              if (localState.type === 'skill') {
                owner.prerequisites.push({
                  id: localState.acsSkillId,
                  type: 'skill',
                  value: localState.rating,
                  recommended: localState.recommended
                });
              } else if (localState.type === 'block') {
                owner.prerequisites.push({
                  id: localState.blockId,
                  type: 'block',
                  recommended: localState.recommended
                });
              } else if (localState.type === 'topic') {
                owner.prerequisites.push({
                  id: localState.topicId,
                  type: 'topic',
                  recommended: localState.recommended
                });
              }
            }}
          >
            Add
          </Button>
        )}
      </Pane>
    </Pane>
  );
});

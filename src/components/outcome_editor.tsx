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
  Badge,
  Icon
} from 'evergreen-ui';

import { bloom } from './bloom';
import { State, Outcome } from './types';

export type Props = {
  state: State;
  owner: { outcomes: Outcome[] };
};

export const OutcomeEditor: React.FC<Props> = observer(({ state, owner }) => {
  const localState = useLocalStore(() => ({
    outcomeId: '',
    outcomeRating: -1,
    expanded: false
  }));

  function setOutcome(id: string, value: number) {
    if (owner.outcomes == null) {
      owner.outcomes = [];
    }
    let outcome = owner.outcomes.find(o => o.acsSkillId === id);
    if (outcome) {
      outcome.bloomRating = value;
    } else {
      owner.outcomes.push({ acsSkillId: id, bloomRating: value });
    }
  }
  return (
    <Pane flex={1}>
      <Heading display="flex" alignItems="center" size={400} marginBottom={16}>
        Outcomes{' '}
        <Badge
          display="flex"
          alignItems="center"
          cursor="pointer"
          is="a"
          marginLeft={16}
          height={30}
          onClick={() => (localState.expanded = !localState.expanded)}
        >
          <Icon
            marginRight={4}
            size={16}
            icon={localState.expanded ? 'chevron-up' : 'chevron-down'}
          />{' '}
          {localState.expanded ? 'Collapse' : 'Expand'}
        </Badge>
      </Heading>

      {/* <UnorderedList icon="tick" iconColor="success" alignItems="center">
        {(owner.outcomes || []).map((o, i) => (
          <ListItem display="flex">
            <Text flex="1">
              {acsSkills.find(s => s.id === o.acsSkillId)!.name} - {o.bloomRating} [
              {bloom[o.bloomRating - 1].title}]
            </Text>
            <IconButton
              marginTop={-4}
              flex="0 0 40px"
              icon="trash"
              intent="danger"
              appearance="primary"
              marginRight={16}
              onClick={() => {
                owner.outcomes.splice(i, 1);
              }}
            />
          </ListItem>
        ))}
      </UnorderedList> */}

      {state.courseConfig.acsKnowledge.map((acs, i) =>
        localState.expanded ||
        (owner.outcomes || []).some(o =>
          acs.items.some(a => o.acsSkillId === a.id && o.bloomRating != 0)
        ) ? (
          <Pane key={i}>
            <Heading size={400} marginTop={8} marginBottom={4}>
              {acs.name}
            </Heading>

            {acs.items.map((s, i) =>
              localState.expanded ||
              (owner.outcomes || []).some(o => o.acsSkillId === s.id && o.bloomRating != 0) ? (
                <Pane display="flex" key={i} marginTop={4}>
                  <Pane flex="0 0 240px">
                    <Text size={300}>{s.name}</Text>
                  </Pane>

                  <Select
                    marginLeft={8}
                    marginRight={8}
                    flex="0 0 140px"
                    value={
                      (owner.outcomes || [])
                        .find(o => o.acsSkillId === s.id)
                        ?.bloomRating.toString() || '0'
                    }
                    onChange={e => setOutcome(s.id, parseInt(e.currentTarget.value))}
                  >
                    <option value="0">None</option>
                    <option value="1">1 - Knowledge</option>
                    <option value="2">2 - Comprehension</option>
                    <option value="3">3 - Application</option>
                    <option value="4">4 - Analysis</option>
                    <option value="5">5 - Synthesis</option>
                    <option value="6">6 - Evaluation</option>
                  </Select>
                </Pane>
              ) : null
            )}
          </Pane>
        ) : null
      )}
    </Pane>
  );
});

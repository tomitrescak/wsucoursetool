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
  Icon,
  TextInputField
} from 'evergreen-ui';
import { action } from 'mobx';
import { State, Outcome, AcsKnowledge } from '../types';
import { AcsUnitGraph } from 'components/acs/acs_graph';
import { bloom } from 'components/acs/bloom';

export type Props = {
  acss: AcsKnowledge[];
  state: State;
  readonly: boolean;
  owner: {
    outcomes: ReadonlyArray<Outcome>;
    addOutcome({ acsSkillId: string, bloomRating: number });
  };
};

export const skills = [
  'b0',
  'b1',
  'a0',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'c0',
  'c1',
  'c2',
  'd0',
  'd1',
  'd2',
  'd3',
  'e0',
  'e1',
  'e2',
  'e3'
];

export const OutcomeEditor: React.FC<Props> = observer(({ acss, owner, readonly }) => {
  const localState = useLocalStore(() => ({
    outcomeId: '',
    outcomeRating: -1
  }));
  const [expanded, setExpanded] = React.useState((owner.outcomes || []).length > 0);

  function setOutcome(id: string, value: number) {
    if (owner.outcomes == null) {
      owner.outcomes = [];
    }
    let outcome = owner.outcomes.find(o => o.acsSkillId === id);
    if (outcome) {
      outcome.bloomRating = value;
    } else {
      owner.addOutcome({ acsSkillId: id, bloomRating: value });
    }
  }

  let parsedValue = skills
    .map(s => (owner.outcomes || []).find(o => o.acsSkillId === s)?.bloomRating || ' ')
    .join('\t');

  return (
    <Pane flex={1}>
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
          onClick={() => setExpanded(!expanded)}
        />
        ACS Skills
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

      {expanded && !readonly && (
        <TextInputField
          label="Parse Outcomes"
          placeholder="Please paste the outcomes, separated by tab"
          value={parsedValue}
          onChange={action(e => {
            const line = e.currentTarget.value.split('\t');

            owner.outcomes = [];

            skills.forEach((f, i) => {
              if (line[i] && line[i] !== ' ') {
                owner.addOutcome({
                  acsSkillId: f,
                  bloomRating: line[i] === 'x' ? 1 : isNaN(line[i]) ? 1 : parseInt(line[i])
                });
              }
            });
          })}
        />
      )}

      {expanded && (
        <Pane display="flex">
          {readonly && (
            <Pane marginRight={16}>
              <Pane padding={8} elevation={2} borderRadius={4} background="tint2">
                {bloom.map((b, i) => (
                  <Text is="div" key={i}>
                    {i + 1} - {b.title}
                  </Text>
                ))}
              </Pane>
            </Pane>
          )}
          {!readonly && (
            <Pane flex={1} overflow="auto" marginRight={8}>
              {acss.map((acs, i) => (
                <Pane key={i}>
                  <Heading size={400} marginTop={8} marginBottom={4}>
                    {acs.name}
                  </Heading>

                  {acs.items.map((s, i) => (
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
                  ))}
                </Pane>
              ))}
            </Pane>
          )}

          <Pane flex={1} overflow="auto">
            <AcsUnitGraph units={[owner as any]} acs={acss} readonly={readonly} />
          </Pane>
        </Pane>
      )}
    </Pane>
  );
});

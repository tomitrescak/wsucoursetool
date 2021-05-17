import styled from '@emotion/styled';
import { SfiaSkillMapping } from 'components/types';
import { useSfiaQuery } from 'config/graphql';
import {
  Badge,
  Button,
  Checkbox,
  Combobox,
  Heading,
  IconButton,
  Pane,
  Text,
  TextInput
} from 'evergreen-ui';
import { buildForm, url } from 'lib/helpers';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import Link from 'next/link';
import units from 'pages/units';
import React from 'react';

import { SfiaSkillMappingModel } from '../classes';
import { ProgressView } from '../common/progress_view';
import { SfiaSelect } from './sfia_select';

const Stripes = styled.div`
  > div {
    padding: 2px;
    display: flex;
    align-items: center;
    padding-left: 4px;
  }
  div:nth-child(even) {
    background: #f0f0f0;
  }
`;

const SfiaSkill = observer(({ data, skill, unit, index, readonly, hasMax }) => {
  const selected = data.sfia.find(s => s.id === skill.id);
  const form = React.useMemo(() => buildForm(skill, ['level', 'max']), [skill]);
  return (
    <Pane display="flex" marginTop={8}>
      <Pane flex="1" marginRight={8}>
        {readonly && (
          <>
            <Badge marginRight={8}>
              Level {skill.level} {skill.max ? `/ ${skill.max}` : ''}
            </Badge>
          </>
        )}
        <Text>
          <a href={selected.url} target="__blank">
            {selected.name} ({selected.id})
          </a>
        </Text>
      </Pane>
      {!readonly && (
        <SfiaSelect
          skill={skill}
          width={100}
          flex="0 0 100px"
          placeholder="Level"
          marginRight={8}
        />
      )}
      {/* {!readonly && hasMax && (
        <TextInput
          width={60}
          placeholder="Max"
          disabled={true}
          value={skill.max}
          type="number"
          onChange={form.max}
          marginRight={8}
        />
      )} */}
      {!readonly && (
        <IconButton
          icon="trash"
          onClick={() => unit.removeSfiaSkill(unit.sfiaSkills.indexOf(skill))}
          intent="danger"
          appearance="primary"
        />
      )}
    </Pane>
  );
});

export const SfiaOwnerEditor = observer(
  ({
    owner,
    readonly,
    hasMax
  }: {
    owner: {
      sfiaSkills: Array<SfiaSkillMappingModel>;
      addSfiaSkill(mapping: SfiaSkillMapping): void;
      removeSfiaSkill(ix: number): void;
    };
    readonly: boolean;
    hasMax: boolean;
  }) => {
    const { loading, error, data, refetch } = useSfiaQuery();

    const localState = useLocalStore(() => ({ newSkill: '', max: 0, level: 0 }));
    if (loading || error) {
      return <ProgressView loading={loading} error={error} />;
    }

    return (
      <>
        <Pane display="flex" marginBottom={4} marginTop={8}>
          <Text is="div" flex="1" marginRight={8}>
            Name
          </Text>
          {!readonly && (
            <Text is="div" width={60} marginRight={8}>
              Level
            </Text>
          )}
          {/* {!readonly && hasMax && (
            <Text is="div" width={60} marginRight={8}>
              Max
            </Text>
          )} */}
          {!readonly && <Pane width={30}></Pane>}
        </Pane>

        <Stripes>
          {owner.sfiaSkills
            .slice()
            .sort((a, b) => {
              const sfiaA = data.sfia.find(s => s.id === a.id);
              const sfiaB = data.sfia.find(s => s.id === b.id);
              return sfiaA.name.localeCompare(sfiaB.name);
            })
            .map((skill, index) => (
              <SfiaSkill
                key={index + '_' + skill.id}
                data={data}
                index={index}
                skill={skill}
                unit={owner}
                readonly={readonly}
                hasMax={hasMax}
              />
            ))}
        </Stripes>

        {!readonly && (
          <Pane display="flex" alignItems="center" marginTop={16}>
            <Heading>Add: </Heading>
            <Pane flex="2" marginRight={8} marginLeft={8}>
              <Combobox
                id="skill"
                placeholder={'SFIA Skill'}
                width="100%"
                items={data.sfia}
                itemToString={item => item?.name || ''}
                selectedItem={
                  localState.newSkill
                    ? data.sfia.find(s => s.id === localState.newSkill)
                    : { name: '' }
                }
                onChange={selected => {
                  if (selected) {
                    localState.newSkill = selected.id;
                  } else {
                    localState.newSkill = '';
                  }
                }}
              />
            </Pane>
            <SfiaSelect
              skill={localState}
              width={100}
              flex="0 0 100px"
              placeholder="Level"
              marginRight={8}
            />
            <IconButton
              icon="plus"
              onClick={() =>
                owner.addSfiaSkill({
                  id: localState.newSkill,
                  level: localState.level,
                  max: localState.max
                })
              }
              intent="success"
              appearance="primary"
            />
          </Pane>
        )}
      </>
    );
  }
);

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
  toaster,
  Combobox,
  TextInput,
  IconButton,
  Badge
} from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { ProgressView } from '../common/progress_view';
import { SfiaSkillMappingModel, SfiaSkillModel, UnitModel } from '../classes';

import { useSfiaQuery } from 'config/graphql';
import { SfiaSkillMapping } from 'components/types';

const SfiaSkill = observer(({ data, skill, unit, index, readonly, hasMax }) => {
  const selected = data.sfia.find(s => s.id === skill.id);
  const form = React.useMemo(() => buildForm(skill, ['level', 'max']), [skill]);
  return (
    <Pane display="flex" marginTop={8}>
      <Pane flex="1" marginRight={8}>
        {readonly ? (
          <>
            <Badge marginRight={8}>
              Level {skill.level} {skill.max ? `/ ${skill.max}` : ''}
            </Badge>
            <Text>
              {selected.name} ({selected.id})
            </Text>
          </>
        ) : (
          // <Combobox
          //   id="skill"
          //   width="100%"
          //   initialSelectedItem={{ label: '' }}
          //   items={data.sfia}
          //   itemToString={item => (item ? `${item.name} (${item.id})` : '')}
          //   selectedItem={selected}
          //   onChange={selected => (skill.id = selected.id)}
          // />
          <TextInput width="100%" disabled={true} value={`${selected.name} (${selected.id})`} />
        )}
      </Pane>
      {!readonly && (
        <TextInput
          width={60}
          placeholder="Level"
          value={skill.level}
          type="number"
          onChange={form.level}
          marginRight={8}
        />
      )}
      {!readonly && hasMax && (
        <TextInput
          width={60}
          placeholder="Max"
          disabled={true}
          value={skill.max}
          type="number"
          onChange={form.max}
          marginRight={8}
        />
      )}
      {!readonly && (
        <IconButton
          icon="trash"
          onClick={() => unit.removeSfiaSkill(index)}
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
    const localState = useLocalStore(() => ({ newSkill: '', max: 0, newLevel: 0, flagged: false }));
    if (loading || error) {
      return <ProgressView loading={loading} error={error} />;
    }

    return (
      <>
        <Pane display="flex" marinBottom={4} marginTop={8}>
          <Text is="div" flex="1" marginRight={8}>
            Name
          </Text>
          {!readonly && (
            <Text is="div" width={60} marginRight={8}>
              Level
            </Text>
          )}
          {!readonly && hasMax && (
            <Text is="div" width={60} marginRight={8}>
              Max
            </Text>
          )}
          {!readonly && <Pane width={30}></Pane>}
        </Pane>
        {owner.sfiaSkills
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

        {!readonly && (
          <Pane display="flex" alignItems="center" marginTop={16}>
            <Heading>Add: </Heading>
            <Pane flex="2" marginRight={8} marginLeft={8}>
              <Combobox
                id="skill"
                placeholder={'SFIA Skill'}
                width="100%"
                initialSelectedItem={{ label: '' }}
                items={data.sfia}
                itemToString={item => (item ? item.name : '')}
                onChange={selected =>
                  selected ? (localState.newSkill = selected.id) : (localState.newSkill = '')
                }
              />
            </Pane>
            <TextInput
              width={80}
              placeholder="Level"
              value={localState.newLevel}
              type="number"
              onChange={e => (localState.newLevel = parseInt(e.currentTarget.value))}
              marginRight={8}
            />
            <Checkbox
              checked={localState.flagged}
              onChange={e => (localState.flagged = e.currentTarget.checked)}
              marginRight={8}
            />
            <IconButton
              icon="plus"
              onClick={() =>
                owner.addSfiaSkill({
                  id: localState.newSkill,
                  level: localState.newLevel,
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

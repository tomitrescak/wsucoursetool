import {
  CourseCompletionCriteriaModel,
  FrameworkConditionModel,
  TopicConditionModel
} from 'components/classes';
import { Expander } from 'components/common/expander';
import { ProgressView } from 'components/common/progress_view';
import { FrameworkCondition, SfiaSkill, Topic, TopicCondition } from 'components/types';
import {
  TopicList,
  useAcsQuery,
  useSfiaQuery,
  useTopicsQuery,
  useUnitsQuery
} from 'config/graphql';
import { Combobox, Heading, IconButton, Pane, Text, TextInput } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';

type FrameworkOwner = {
  // addSfia(conditon: FrameworkCondition): void;
  // removeSfia(model: FrameworkConditionModel): void;
};

type Props = {
  model?: FrameworkConditionModel;
  elements: Array<{ id: string; name: string }>;
  owner: FrameworkOwner;
};

const UnitListEditor = observer(
  ({
    elements,
    owner,
    addFunction,
    itemToString
  }: Props & { addFunction: string; itemToString: (any) => string }) => {
    const localState = useLocalStore(() => ({ id: '', level: 0 }));
    const form = React.useMemo(() => buildForm(localState, ['level']), [localState]);

    return (
      <Pane display="flex" alignItems="center">
        <Combobox
          id="block"
          width="100%"
          items={elements}
          itemToString={itemToString}
          onChange={selected => (localState.id = selected.id)}
        />
        <TextInput
          value={localState.level}
          onChange={form.level}
          width={60}
          type="number"
          marginLeft={8}
        />
        <IconButton
          marginLeft={8}
          intent="success"
          icon="plus"
          onClick={() =>
            localState.id && owner[addFunction]({ id: localState.id, level: localState.level })
          }
          appearance="primary"
        />
      </Pane>
    );
  }
);

const UnitItemEditor = observer(
  ({ model, elements, owner, removeFunction }: Props & { removeFunction: string }) => {
    const form = React.useMemo(() => buildForm(model, ['level']), [model]);
    return (
      <Pane display="flex" marginBottom={4} alignItems="center">
        <IconButton
          icon="trash"
          marginRight={8}
          appearance="primary"
          intent="danger"
          onClick={() => owner[removeFunction](model)}
        />
        <Text is="div" flex={1}>
          {elements.find(u => u.id === model.id).name}
        </Text>
        <TextInput width={60} type="number" value={model.level} onChange={form.level} />
      </Pane>
    );
  }
);

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

export const CourseCompletionSfiaEditor = observer(({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useSfiaQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Expander title="SFIA" id="sfiacc">
      <Pane paddingTop={8}>
        {criteria.sfia.map((u, i) => (
          <UnitItemEditor
            elements={data.sfia}
            model={u}
            owner={criteria}
            key={u.id + i}
            removeFunction="removeSfia"
          />
        ))}

        <UnitListEditor
          elements={data.sfia}
          model={null}
          owner={criteria}
          addFunction="addSfia"
          itemToString={item => (item ? `${item.name} (${item.id})` : '')}
        />
      </Pane>
    </Expander>
  );
});

export const CourseCompletionAcsEditor = observer(({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useAcsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  const elements = data.acs.flatMap(m => m.items);
  return (
    <Expander title="ACS" id="acscc">
      <Pane paddingTop={8}>
        {criteria.acs.map((u, i) => (
          <UnitItemEditor
            elements={elements}
            model={u}
            owner={criteria}
            key={u.id + i}
            removeFunction="removeAcs"
          />
        ))}

        <UnitListEditor
          elements={elements}
          model={null}
          owner={criteria}
          addFunction="addAcs"
          itemToString={item =>
            item ? `${data.acs.find(e => e.items.indexOf(item) >= 0).name} > ${item.name}` : ''
          }
        />
      </Pane>
    </Expander>
  );
});

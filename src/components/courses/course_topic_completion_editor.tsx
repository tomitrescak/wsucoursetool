import { CourseCompletionCriteriaModel, TopicConditionModel } from 'components/classes';
import { Expander } from 'components/common/expander';
import { ProgressView } from 'components/common/progress_view';
import { Topic, TopicCondition } from 'components/types';
import { TopicList, useTopicsQuery, useUnitsQuery } from 'config/graphql';
import { Combobox, Heading, IconButton, Pane, Text, TextInput } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';

type TopicOwner = {
  addTopic(conditon: TopicCondition): void;
  removeTopic(mode: TopicConditionModel): void;
};

type Props = { topic?: TopicConditionModel; topics: TopicList[]; owner: TopicOwner };

const UnitListEditor = observer(({ topics, owner }: Props) => {
  const localState = useLocalStore(() => ({ id: '', credits: 0 }));
  const form = React.useMemo(() => buildForm(localState, ['credits']), [localState]);

  return (
    <Pane display="flex" alignItems="center">
      <Combobox
        id="block"
        width="100%"
        items={topics}
        itemToString={item => (item ? item.name : '')}
        onChange={selected => (localState.id = selected?.id)}
      />
      <TextInput
        value={localState.credits}
        onChange={form.credits}
        width={60}
        type="number"
        marginLeft={8}
      />
      <IconButton
        marginLeft={8}
        intent="success"
        icon="plus"
        onClick={() =>
          localState.id && owner.addTopic({ id: localState.id, credits: localState.credits })
        }
        appearance="primary"
      />
    </Pane>
  );
});

const UnitItemEditor = observer(({ topic, topics, owner }: Props) => {
  const form = React.useMemo(() => buildForm(topic, ['credits']), [topic]);
  return (
    <Pane display="flex" marginBottom={4} alignItems="center">
      <IconButton
        icon="trash"
        marginRight={8}
        appearance="primary"
        intent="danger"
        onClick={() => owner.removeTopic(topic)}
      />
      <Text is="div" flex={1}>
        {topics.find(u => u.id === topic.id).name}
      </Text>
      <TextInput width={60} type="number" value={topic.credits} onChange={form.credits} />
    </Pane>
  );
});

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

export const CourseTopicUnitEditor = observer(({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useTopicsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Expander title="Topics" id="topiccc">
      <Pane paddingTop={8}>
        {criteria.topics.map((u, i) => (
          <UnitItemEditor topics={data.topics} topic={u} owner={criteria} key={u.id + i} />
        ))}

        <UnitListEditor topics={data.topics} topic={null} owner={criteria} />
      </Pane>
    </Expander>
  );
});

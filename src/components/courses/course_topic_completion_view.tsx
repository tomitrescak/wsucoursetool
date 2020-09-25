import { CourseCompletionCriteriaModel, TopicConditionModel } from 'components/classes';
import { ProgressView } from 'components/common/progress_view';
import { TopicCondition } from 'components/types';
import { TopicList, useTopicsQuery } from 'config/graphql';
import { Badge, Heading, Pane, Text } from 'evergreen-ui';

import React from 'react';

type Props = { topic?: TopicConditionModel; topics: TopicList[] };

const UnitItemView = ({ topic, topics }: Props) => {
  return (
    <Pane display="flex" marginBottom={4} alignItems="center">
      <Badge width={80} marginRight={8}>
        {topic.credits} credits
      </Badge>
      <Text is="div" flex={1}>
        {topics.find(u => u.id === topic.id).name}
      </Text>
    </Pane>
  );
};

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

export const CourseTopicUnitView = ({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useTopicsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Pane marginBottom={8}>
      <Heading size={400} marginBottom={8}>
        Topics
      </Heading>

      {criteria.topics.map((u, i) => (
        <UnitItemView topics={data.topics} topic={u} key={u.id + i} />
      ))}
    </Pane>
  );
};

import {
  CourseCompletionCriteriaModel,
  FrameworkConditionModel,
  TopicConditionModel
} from 'components/classes';
import { ProgressView } from 'components/common/progress_view';
import { useAcsQuery, useSfiaQuery } from 'config/graphql';
import { Badge, Heading, Pane, Text } from 'evergreen-ui';
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

const UnitItemEditor = ({ model, elements }: Props & { removeFunction: string }) => {
  return (
    <Pane display="flex" marginBottom={4} alignItems="center">
      <Badge width={80} marginRight={8}>
        Level {model.level}
      </Badge>
      <Text is="div" flex={1}>
        {elements.find(u => u.id === model.id).name}
      </Text>
    </Pane>
  );
};

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

export const CourseCompletionSfiaView = ({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useSfiaQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Pane marginBottom={8}>
      <Heading size={400} marginBottom={8}>
        SFIA
      </Heading>

      {criteria.sfia.map((u, i) => (
        <UnitItemEditor
          elements={data.sfia}
          model={u}
          owner={criteria}
          key={u.id + i}
          removeFunction="removeSfia"
        />
      ))}
    </Pane>
  );
};

export const CourseCompletionAcsView = ({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useAcsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  const elements = data.acs.flatMap(m => m.items);
  return (
    <Pane marginBottom={8}>
      <Heading size={400} marginBottom={8}>
        ACS
      </Heading>

      {criteria.acs.map((u, i) => (
        <UnitItemEditor
          elements={elements}
          model={u}
          owner={criteria}
          key={u.id + i}
          removeFunction="removeAcs"
        />
      ))}
    </Pane>
  );
};

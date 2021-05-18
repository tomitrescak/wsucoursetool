import { CourseCompletionCriteriaModel, UnitConditionModel } from 'components/classes';
import { ProgressView } from 'components/common/progress_view';
import { UnitCondition } from 'components/types';
import { UnitList, useUnitsQuery } from 'config/graphql';
import { Heading, Pane, Text } from 'evergreen-ui';
import groupByArray from 'lib/helpers';
import { observer } from 'mobx-react';
import React from 'react';

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

type UnitOwner = {
  addUnitCondition(conditon: UnitCondition): void;
  removeUnitCondition(mode: UnitConditionModel): void;
};

const UnitItemView = observer(
  ({ unit, units, owner }: { unit: UnitConditionModel; units: UnitList[]; owner: UnitOwner }) => {
    if (unit.or && unit.or.length) {
      return (
        <Pane paddingLeft={16} marginBottom={8}>
          {unit.or.map((o, i) => (
            <React.Fragment key={i}>
              <UnitItemView units={units} unit={o} key={o.id + i} owner={owner} />
              {i < unit.or.length - 1 && <Heading size={300}>-- Or --</Heading>}
            </React.Fragment>
          ))}
        </Pane>
      );
    }
    const u = units.find(u => u.id === unit.id);
    if (!u) {
      return <Pane>Not found: {unit.id}</Pane>;
    }
    return (
      <Pane display="flex" marginBottom={4} alignItems="center">
        <Text>
          {u.name} ({u.id})
        </Text>
      </Pane>
    );
  }
);

export const CourseCompletionUnitView = observer(({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useUnitsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Pane marginBottom={8}>
      <Heading size={500}>Units</Heading>

      {groupByArray(criteria.units, 'semester').map(group => (
        <React.Fragment key={group.key as any}>
          <Heading size={400} marginTop={8}>
            Semester {group.key}
          </Heading>
          {group.values.map((u, i) => (
            <UnitItemView units={data.units} unit={u} owner={criteria} key={u.id + i} />
          ))}
        </React.Fragment>
      ))}
    </Pane>
  );
});

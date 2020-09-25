import { CourseCompletionCriteriaModel, UnitConditionModel } from 'components/classes';
import { ProgressView } from 'components/common/progress_view';
import { UnitCondition } from 'components/types';
import { UnitList, useUnitsQuery } from 'config/graphql';
import { Button, Combobox, Heading, IconButton, Pane, Text } from 'evergreen-ui';
import { observer, useLocalStore } from 'mobx-react';
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
    return (
      <Pane display="flex" marginBottom={4} alignItems="center">
        <Text>{units.find(u => u.id === unit.id).name}</Text>
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
      <Heading size={400} marginBottom={8}>
        Units
      </Heading>

      {criteria.units.map((u, i) => (
        <UnitItemView units={data.units} unit={u} owner={criteria} key={u.id + i} />
      ))}
    </Pane>
  );
});

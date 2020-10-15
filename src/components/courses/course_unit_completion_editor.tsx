import { CourseCompletionCriteriaModel, UnitConditionModel } from 'components/classes';
import { Expander } from 'components/common/expander';
import { ProgressView } from 'components/common/progress_view';
import { UnitCondition } from 'components/types';
import { UnitList, useUnitsQuery } from 'config/graphql';
import { Badge, Button, Combobox, Heading, IconButton, Pane, Text, TextInput } from 'evergreen-ui';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

type UnitOwner = {
  addUnitCondition(conditon: UnitCondition): void;
  removeUnitCondition(mode: UnitConditionModel): void;
};

const UnitListEditor = observer(
  ({ units, unit, owner }: { units: UnitList[]; unit: UnitConditionModel; owner: UnitOwner }) => {
    const selectedItem = unit?.id ? units.find(u => u.id === unit.id) : null;
    const localState = useLocalStore(() => ({ unitId: '', semester: 0 }));
    return (
      <Pane display="flex" alignItems="center">
        <Combobox
          id="block"
          width="100%"
          selectedItem={selectedItem}
          items={units}
          itemToString={item => (item ? `${item.name} (${item.id})` : '')}
          onChange={selected => (localState.unitId = selected.id)}
        />
        <TextInput
          placeholder="semester"
          type="number"
          width="50px"
          marginLeft={8}
          onChange={e => (localState.semester = e.currentTarget.value)}
          value={localState.semester}
        />
        <IconButton
          marginLeft={8}
          width={30}
          flex="0 0 30px"
          intent="success"
          icon="plus"
          onClick={() =>
            localState.unitId &&
            owner.addUnitCondition({ id: localState.unitId, semester: localState.semester })
          }
          appearance="primary"
        />
        <Button
          marginLeft={8}
          iconBefore="plus"
          onClick={() =>
            localState.unitId &&
            owner.addUnitCondition({
              id: null,
              semester: undefined,
              or: [{ id: localState.unitId, semester: localState.semester }]
            })
          }
          appearance="primary"
        >
          Or
        </Button>
      </Pane>
    );
  }
);

const UnitItemEditor = observer(
  ({ unit, units, owner }: { unit: UnitConditionModel; units: UnitList[]; owner: UnitOwner }) => {
    if (unit.or && unit.or.length) {
      return (
        <Pane paddingLeft={16} marginBottom={8}>
          {unit.or.map((o, i) => (
            <React.Fragment key={i + o.id}>
              <UnitItemEditor units={units} unit={o} key={o.id + i} owner={owner} />
              <Heading size={300}>-- Or --</Heading>
            </React.Fragment>
          ))}
          <UnitListEditor units={units} unit={unit} owner={unit} />
        </Pane>
      );
    }
    return (
      <Pane display="flex" marginBottom={4} alignItems="center">
        <IconButton
          icon="trash"
          marginRight={8}
          appearance="primary"
          intent="danger"
          onClick={() => owner.removeUnitCondition(unit)}
        />
        <Text>
          <Badge>{unit.semester}</Badge> {units.find(u => u.id === unit.id).name}
        </Text>
      </Pane>
    );
  }
);

export const CourseCompletionUnitEditor = observer(({ criteria }: CriteriaProps) => {
  const { loading, error, data } = useUnitsQuery();
  if (loading) {
    return <ProgressView loading={loading} error={error} />;
  }
  return (
    <Expander title="Units" id="unitcc">
      <Pane paddingTop={8}>
        {criteria.units.map((u, i) => (
          <UnitItemEditor units={data.units} unit={u} owner={criteria} key={u.id + i} />
        ))}

        <UnitListEditor units={data.units} unit={null} owner={criteria} />
      </Pane>
    </Expander>
  );
});

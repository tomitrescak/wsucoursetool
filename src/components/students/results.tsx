import React from 'react';
import { observer } from 'mobx-react';
import { Pane, Button, IconButton, toaster, Select, Combobox, TextInput } from 'evergreen-ui';
import { StudentModel, RegisteredBlockModel } from 'components/classes';
import { useUnitsQuery, useUnitBaseQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

type ResultLineParams = {
  index: number;
  localState: any;
  student: StudentModel;
  block: RegisteredBlockModel;
};

export const ResultLine = observer(({ index, localState, student, block }: ResultLineParams) => {
  const { loading, error, data: unitsData } = useUnitsQuery();
  const { loading: unitLoading, data: unitData } = useUnitBaseQuery({
    variables: {
      id: block.unitId
    }
  });
  if (loading || unitLoading || error) {
    return <ProgressView loading={loading || unitLoading} error={error} />;
  }

  if (localState.editLineIndex == index) {
    return (
      <Pane display="flex" key={index}>
        <Pane flex={1}>
          <Combobox
            width="100%"
            id="unitName"
            //selectedItem={data.units.find(u => u.id === block.unitId)}
            items={unitsData.units}
            itemToString={item => (item ? item.name : '')}
            selectedItem={unitsData.units.find(unit => unit.id === block.unitId)}
            onChange={selected => (block.unitId = selected.id)}
          />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          <Combobox
            width="100%"
            id="blockName"
            selectedItem={
              unitData.unitBase ? unitData.unitBase.blocks.find(b => b.id === block.blockId) : ''
            }
            //items={student.registeredBlocks}
            items={unitData.unitBase ? unitData.unitBase.blocks : []}
            itemToString={item => (item ? item.name : '')}
            onChange={selected => (block.blockId = selected.id)}
          />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          {/* Results */}
          {block.results.map((result, index) => (
            <Pane key={index} display="flex" marginBottom={8}>
              <Pane flex={3} marginRight={8}>
                <Select
                  value={result.grade}
                  onChange={e => (result.grade = e.currentTarget.value)}
                  //margin={0}

                  width="100%"
                  label="Grade"
                >
                  <option value="">No Grade</option>
                  <option value="F">F - Fail</option>
                  <option value="P">P - Pass</option>
                  <option value="C">C - Credit</option>
                  <option value="D">D - Distinction</option>
                  <option value="HD">HD - High Distinction</option>
                </Select>
              </Pane>

              <TextInput
                type="date"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                value={result.date}
                onChange={e => {
                  result.date = e.currentTarget.value;
                }}
                width={90}
                margin={0}
                marginRight={-1}
                flex={2}
              />

              <TextInput
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                value={result.result}
                onChange={e => {
                  result.result = e.currentTarget.value;
                }}
                id="result"
                disabled={false}
                margin={0}
                marginRight={8}
                flex={1}
                width={50}
              />

              <IconButton
                intent="danger"
                icon="trash"
                appearance="primary"
                //margin={0}
                onClick={() => {
                  block.removeResult(index);
                  toaster.notify('Result Removed.');
                }}
              />
            </Pane>
          ))}

          <IconButton
            icon="plus"
            marginTop={4}
            marginBottom={4}
            intent="success"
            appearance="primary"
            //margin={0}
            onClick={() => {
              block.addResult({
                date: new Date().toLocaleDateString(),
                grade: '',
                result: 0
              });
            }}
          />
        </Pane>
        <IconButton
          intent="success"
          icon="tick"
          appearance="primary"
          marginLeft={8}
          onClick={() => (localState.editLineIndex = -1)}
        />
      </Pane>
    );
  } else {
    return (
      <Pane display="flex" key={index} marginBottom={4}>
        <Pane flex={1}>
          <TextInput
            disabled
            width="100%"
            value={unitsData.units.find(unit => unit.id === block.unitId)?.name}
          />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          <TextInput
            width="100%"
            disabled
            value={unitData.unitBase.blocks.find(b => b.id === block.blockId)?.name}
          />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          {/* Results */}
          {block.results.map((result, index) => (
            <Pane key={index} display="flex" marginBottom={8}>
              <Pane flex={3} marginRight={8}>
                <TextInput width="100%" value={result.grade} disabled />
              </Pane>
              <TextInput
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                value={result.date}
                //width={90}
                width="100%"
                margin={0}
                marginRight={-1}
                disabled
                flex={2}
              />
              <TextInput
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                value={result.result + '%'}
                margin={0}
                //width={50}
                width="100%"
                disabled
                marginRight={8}
                flex={1}
              />
              <IconButton intent="danger" icon="trash" appearance="primary" disabled />
            </Pane>
          ))}
        </Pane>

        <Pane flex="0 0 175px" display="flex">
          <IconButton
            intent="none"
            icon="edit"
            marginLeft={8}
            onClick={() => (localState.editLineIndex = index)}
          />
          <Button
            intent="danger"
            iconBefore="trash"
            appearance="primary"
            marginLeft={8}
            //width={}
            onClick={() => {
              if (confirm('Changes cannot be reverted. Are you sure?')) {
                student.removeBlock(index);
                toaster.notify('Unit Removed.');
              }
            }}
          >
            Remove Block
          </Button>
        </Pane>
      </Pane>
    );
  }
});

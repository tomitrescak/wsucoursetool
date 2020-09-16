import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Heading,
  Button,
  IconButton,
  toaster,
  Text,
  Select,
  Dialog,
  Combobox,
  TextInput,
  Icon
} from 'evergreen-ui';
import { State, Student, Entity, AcsKnowledge, Unit } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from 'components/common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { TextEditor } from 'components/common/text_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { model, Model, prop, modelAction, undoMiddleware, jsonPatchToPatch } from 'mobx-keystone';
import {
  StudentModel,
  RegisteredBlockModel,
  // RegisteredUnitModel,
  ResultModel,
  createStudent
} from 'components/classes';
import {
  useSaveConfigMutation,
  useTopicsQuery,
  useBlockQuery,
  RegisteredUnit,
  UnitList,
  RegisteredBlock,
  useUnitsQuery,
  useUnitBaseQuery
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { useStudentListQuery } from 'config/graphql';
import { BlocksEditor } from 'components/blocks/block_editor';
import build from 'next/dist/build';

@model('Editor/Students')
class StudentListModel extends Model({
  students: prop<StudentModel[]>()
  //blocks: prop<RegisteredBlock[]>()
}) {
  @modelAction
  add(pre: Student) {
    this.students.push(new StudentModel(pre));
  }

  @modelAction
  remove(ix: number) {
    this.students.splice(ix, 1);
  }
}

// @model('Editor/Units')
// class UnitListModel extends Model({
//   units: prop<RegisteredUnitModel[]>()
// }) {
//   @modelAction
//   addUnit(pre: RegisteredUnit) {
//     this.units.push(new RegisteredUnitModel(pre));
//   }

//   @modelAction
//   removeUnit(ix: number) {
//     this.units.splice(ix, 1);
//   }
// }

type UnitDetailsParams = {
  units: Array<{ id: string; name: string }>;
  unit: RegisteredUnit;
};

const UnitResult = observer(({ units, unit }: UnitDetailsParams) => {
  return (
    <Pane display="flex" marginBottom={8}>
      <TextInputField
        label="Unit Name"
        value={units.find(u => u.id === unit.unitId)?.name}
        id="unitName"
        disabled={true}
        width={300}
        margin={0}
        marginRight={8}
      />
      <TextInputField
        label="Unit Id"
        value={unit.unitId}
        id="unitId"
        disabled={true}
        margin={0}
        marginRight={8}
      />
      <Select
        value={unit.results.grade}
        onChange={e => (unit.results.grade = e.currentTarget.value)}
        marginTop={24}
        marginLeft={8}
        marginRight={8}
        flex="0 0 140px"
        label="Grade"
      >
        <option value="">No Grade</option>
        <option value="f">F - Fail</option>
        <option value="p">P - Pass</option>
        <option value="c">C - Credit</option>
        <option value="d">D - Distinction</option>
        <option value="hd">HD - High Distinction</option>
      </Select>
      <TextInputField
        label="Result"
        value={unit.results.result}
        onChange={e => (unit.results.result = e.currentTarget.value)}
        id="result"
        disabled={false}
        margin={0}
        marginRight={8}
      />
      <Button
        intent="warning"
        //iconBefore="trash"
        appearance="primary"
        marginTop={24}
        width={100}
        onClick={() => {
          if (confirm('This change will be permanent!')) {
          }
        }}
      >
        Save Result
      </Button>
    </Pane>
  );
});

type BlockDetailsParams = {
  units: Array<{ id: string; name: string }>;
  block: RegisteredBlock;
};

type ResultLineParams = {
  index: number;
  localState: any;
  student: StudentModel;
  block: RegisteredBlockModel;
};

const ResultLine = observer(({ index, localState, student, block }: ResultLineParams) => {
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
            id="unitId"
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
                  <option value="f">F - Fail</option>
                  <option value="p">P - Pass</option>
                  <option value="c">C - Credit</option>
                  <option value="d">D - Distinction</option>
                  <option value="hd">HD - High Distinction</option>
                </Select>
              </Pane>

              <TextInput
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                value={result.date}
                width={90}
                margin={0}
                marginRight={-1}
                disabled
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
                  toaster.notify('Results Removed.');
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
                grade: 0,
                result: ''
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
        <Pane flex={1}>{unitsData.units.find(unit => unit.id === block.unitId)?.name}</Pane>
        <Pane flex={1} marginLeft={8}>
          {unitData.unitBase.blocks.find(b => b.id === block.blockId)?.name}
        </Pane>
        <Pane flex={1} marginLeft={8}>
          {/* Results */}
          {block.results.map((result, index) => (
            <Pane key={index} display="flex" marginBottom={8}>
              <Pane flex={3} marginRight={8}>
                {result.grade}
              </Pane>

              <Pane flex={2}>{result.date}</Pane>
              <Pane flex={1}>{result.result}</Pane>
            </Pane>
          ))}
        </Pane>
        <IconButton
          intent="none"
          icon="edit"
          marginLeft={8}
          onClick={() => (localState.editLineIndex = index)}
        />
      </Pane>
    );
  }
});

const BlockResult = observer(({ units, block }: BlockDetailsParams) => {
  const { loading, error, data } = useBlockQuery({
    variables: {
      blockId: block.blockId,
      unitId: block.unitId
    }
  });

  const localState = useLocalStore(() => ({
    // result: parseInt(''),
    // grade: '',
    unitId: '',
    blockId: '',
    results: block.results,
    isShown: false
  }));

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }
  const unitName = units.find(u => u.id === block.unitId)?.name;

  return (
    <Pane display="flex" marginBottom={8}>
      <TextInputField
        label="Block Name"
        value={
          data.block ? data.block.name : `Block ${unitName} > ${block.blockId} does not exists`
        }
        id="blockName"
        disabled={true}
        width={300}
        margin={0}
        marginRight={8}
      />
      <TextInputField
        label="Block Id"
        value={block.blockId}
        id="blockId"
        disabled={true}
        margin={0}
        marginRight={8}
      />
      <TextInputField
        label="Unit Id"
        value={block.unitId}
        id="unitId"
        disabled={true}
        margin={0}
        marginRight={8}
      />
      <Select
        value={block.results.grade}
        onChange={e => (block.results.grade = e.currentTarget.value)}
        marginTop={24}
        marginLeft={8}
        marginRight={8}
        flex="0 0 140px"
        label="Grade"
      >
        <option value="">No Grade</option>
        <option value="f">F - Fail</option>
        <option value="p">P - Pass</option>
        <option value="c">C - Credit</option>
        <option value="d">D - Distinction</option>
        <option value="hd">HD - High Distinction</option>
      </Select>

      <TextInputField
        label="Result"
        value={block.results.result}
        onChange={e => (block.results.result = e.currentTarget.value)}
        id="result"
        disabled={false}
        margin={0}
        marginRight={8}
      />
      <Pane display="flex" marginBottom={8}></Pane>
    </Pane>
  );
});

const Details: React.FC<{ item: StudentModel; owner: StudentListModel; state: State }> = observer(
  ({ item: student, owner, state }) => {
    const { loading, error, data } = useStudentListQuery({});

    // data.block ? data.block.name : `Block ${unitName} > ${block.blockId} does not exists

    const form = React.useMemo(() => buildForm(student, ['id', 'firstName', 'lastName']), [
      student
    ]);

    const [save] = useSaveConfigMutation({
      onCompleted() {
        toaster.notify('Student Updated. Config saved.');
      },
      onError(e) {
        toaster.danger('Error ;(: ' + e.message);
      }
    });

    const localState = useLocalStore(() => ({
      isShownBlock: false,
      isShownUnit: false,
      unitId: '',
      blockId: '',
      results: [],
      date: '',
      grade: '',
      editLineIndex: -1
    }));

    const blockForm = buildForm(localState, ['unitId', 'blockId', 'result', 'date', 'grade']);

    if (loading || error) {
      return <ProgressView loading={loading} error={error} />;
    }

    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint3" borderRadius={6} marginLeft={24}>
          <Heading size={500} marginBottom={16}>
            {student.firstName + ' ' + student.lastName}
          </Heading>

          <TextInputField
            label="Student Id"
            placeholder="Student Id"
            value={student.id}
            disabled={true}
            //onChange={form.id}
            marginBottom={8}
          />

          <TextInputField
            label="First Name"
            placeholder="First Name"
            value={student.firstName}
            onChange={form.firstName}
            marginBottom={8}
          />

          <TextInputField
            label="Last Name"
            placeholder="Last Name"
            value={student.lastName}
            onChange={form.lastName}
            marginBottom={8}
          />

          <TextEditor owner={student} field="details" label="Details (TEMP)" />
          <Button
            intent="danger"
            iconBefore="trash"
            appearance="primary"
            marginTop={8}
            onClick={() => {
              if (confirm('Are You Sure?')) {
                owner.remove(owner.students.findIndex(p => p === student));
              }
            }}
          >
            Delete Student
          </Button>
        </Pane>

        <br></br>
        <Heading marginBottom={16}>Registered Block/Unit Results</Heading>

        {/* {item.registeredUnits &&
          item.registeredUnits.map((unit, i) => {
            return unit && <UnitResult key={i} units={data.units} unit={item.registeredUnits[i]} />;
          })}

        {item.registeredBlocks &&
          item.registeredBlocks.map((block, i) => {
            return (
              block && <BlockResult key={i} units={data.units} block={item.registeredBlocks[i]} />
            );
          })} */}

        <Pane display="flex">
          <Heading size={400} flex={1}>
            Unit Name
          </Heading>
          <Heading size={400} flex={1}>
            Block Name
          </Heading>
          <Heading size={400} flex={1}>
            Results
          </Heading>
        </Pane>

        {student.registeredBlocks.map((block, index) => (
          <ResultLine
            block={block}
            index={index}
            localState={localState}
            student={student}
            key={index}
          />
        ))}

        {/*
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Unit Id</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Block Id</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Grade</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Result</Heading>
              </th>
              <td>
                <Button
                  iconBefore="plus"
                  appearance="primary"
                  //margin={0}
                  marginTop={4}
                  width={110}
                  onClick={() => {
                    toaster.notify('Result Added.');
                  }}
                >
                  Add Result
                </Button>
              </td>
            </tr>
          </thead>
          <tbody>
            {student.registeredBlocks &&
              student.registeredBlocks.slice().map((block, i) => {
                // units.find(u => u.id === block.unitId)?.name
                return (
                  <tr key={block.unitId + block.blockId}>
                    <td>
                      <Combobox
                        flex="1"
                        width={160}
                        id="unitId"
                        //selectedItem={data.units.find(u => u.id === block.unitId)}
                        items={student.registeredBlocks}
                        itemToString={item => (item ? item.unitId : '')}
                        onChange={selected => (localState.unitId = selected.unitId)}
                      />
                    </td>
                    <td>
                      <TextInputField
                        value={block.blockId}
                        id="blockId"
                        disabled={true}
                        margin={0}
                        marginRight={8}
                      />
                    </td>
                    <td>
                      <Select
                        value={block.results.grade}
                        onChange={e => (block.results.grade = e.currentTarget.value)}
                        //margin={0}
                        marginTop={4}
                        marginRight={8}
                        flex="0 0 140px"
                        label="Grade"
                      >
                        <option value="">No Grade</option>
                        <option value="f">F - Fail</option>
                        <option value="p">P - Pass</option>
                        <option value="c">C - Credit</option>
                        <option value="d">D - Distinction</option>
                        <option value="hd">HD - High Distinction</option>
                      </Select>
                    </td>
                    <td>
                      <Pane display="flex">
                        <TextInputField
                          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          value="13 Jan 2020"
                          width={90}
                          margin={0}
                          marginRight={-1}
                          disabled
                        />
                        <TextInputField
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                          value={block.results.result}
                          onChange={e => {
                            block.results.result = e.currentTarget.value;
                          }}
                          id="result"
                          disabled={false}
                          margin={0}
                          marginRight={8}
                        />
                      </Pane>
                    </td>
                    <td>
                      <IconButton
                        intent="danger"
                        icon="trash"
                        appearance="primary"
                        //margin={0}
                        marginTop={4}
                        onClick={() => {
                          toaster.notify('Results Removed.');
                        }}
                      ></IconButton>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
            */}

        <Pane display="flex" alignItems="center" marginTop={16}>
          <Button
            iconBefore="plus"
            appearance="primary"
            width={110}
            onClick={() => {
              localState.isShownBlock = true;
            }}
            marginRight={8}
          >
            Add Block
          </Button>
          <Button
            intent="warning"
            appearance="primary"
            margin={0}
            width={60}
            onClick={() => {
              console.log(student.toJS());
              if (confirm('Changes cannot be reverted. Are you sure?')) {
                save({
                  variables: {
                    part: 'student',
                    id: student.id,
                    body: student.toJS()
                  }
                });
              }
            }}
          >
            Save
          </Button>
        </Pane>
        <Dialog
          isShown={localState.isShownBlock}
          title="Add New Block"
          onCloseComplete={() => (localState.isShownBlock = false)}
          onConfirm={close => {
            student.addRegisteredBlock({
              unitId: localState.unitId,
              blockId: localState.blockId,
              registrationDate: '',
              // ========== FIX THIS ==========
              results: {
                date: '',
                grade: localState.grade,
                result: parseInt(localState.result)
              }
            });
            close();
          }}
          confirmLabel="Add Block"
        >
          <Pane display="flex" alignItems="flex-baseline">
            <Combobox
              flex="1"
              width={400}
              marginTop={4}
              id="unitId"
              //selectedItem={data.units.find(u => u.id === block.unitId)}
              items={data.units}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (blockForm.unitId = selected.id)}
            />
            <TextInputField
              value={blockForm.unitId}
              id="unitName"
              disabled={true}
              margin={0}
              marginRight={8}
              wdith={32}
            />
          </Pane>
          <Pane display="flex" alignItems="flex-baseline">
            <Combobox
              flex="1"
              width={80}
              marginTop={24}
              id="blockId"
              //selectedItem={data.units.find(u => u.id === block.unitId)}
              items={data.blocks.filter(b => b.unitId === blockForm.unitId)}
              itemToString={item => (item ? item.id : '')}
              onChange={selected => (blockForm.blockId = selected.blockId)}
            />
            <TextInputField
              label="Date"
              //style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              type="date"
              marginRight={8}
              onChange={blockForm.date}
            />

            <Select
              onChange={blockForm.grade}
              margin={0}
              marginTop={24}
              marginRight={8}
              flex="0 0 140px"
              label="Grade"
            >
              <option value="">No Grade</option>
              <option value="f">F - Fail</option>
              <option value="p">P - Pass</option>
              <option value="c">C - Credit</option>
              <option value="d">D - Distinction</option>
              <option value="hd">HD - High Distinction</option>
            </Select>
            <TextInputField
              label="Result"
              placeholder="Result"
              onChange={blockForm.result}
              marginRight={4}
              //flex={1}
            />
          </Pane>
        </Dialog>
      </div>
    );
  }
);

const DetailsReadonly: React.FC<{ item: StudentModel }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.id}
        </Heading>

        {/* <TextField label="Description" html={marked(item.details)} /> */}
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  readonly: boolean;
};

const ListItem = observer(({ view, student, selectedItem }) => {
  return (
    <Link
      key={student.id}
      href={`/${view}/[category]/[item]`}
      as={`/${view}/students/${url(student.firstName + '-' + student.lastName)}-${student.id}`}
    >
      <a>
        <SideTab
          key={student.id}
          id={student.id}
          isSelected={selectedItem && student.id === selectedItem.id}
          aria-controls={`panel-${student.firstName /* + ' ' + student.lastName */}`}
        >
          {student.firstName + ' ' + student.lastName}
        </SideTab>
      </a>
    </Link>
  );
});

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;

  const localState = useLocalStore(() => ({
    id: '',
    firstName: '',
    lastName: '',
    isShown: false
  }));

  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Student Updated. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const { loading, error, data } = useStudentListQuery();

  const model = React.useMemo(() => {
    if (data) {
      let model = new StudentListModel({
        students: data.students.map(student => createStudent(student))
      });

      state.undoManager = undoMiddleware(model);
      state.save = () => {
        const body = model.students.map(i => i.toJS());
        save({
          variables: {
            body,
            part: 'students'
          }
        });
      };
      return model;
    }

    return null;
  }, [data]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem = selectedId ? model.students.find(b => b.id === selectedId) : null;
  const form = buildForm(localState, ['id', 'firstName', 'lastName']);
  const view = readonly ? 'view' : 'editor';

  return (
    <>
      <VerticalPane title="Student List">
        <Tablist flexBasis={200} width={200} marginRight={8}>
          <Tabs>
            {model.students
              .slice()
              .sort((a, b) => a.firstName.localeCompare(b.firstName))
              .map(student => (
                <ListItem student={student} view={view} selectedItem={selectedItem} />
              ))}
          </Tabs>
        </Tablist>

        <Pane
          display="flex"
          alignItems="center"
          marginTop={16}
          paddingTop={8}
          borderTop="dotted 1px #dedede"
        >
          <Dialog
            isShown={localState.isShown}
            title="Add New Student"
            onCloseComplete={() => (localState.isShown = false)}
            onConfirm={close => {
              model.add({
                id: localState.id,
                firstName: localState.firstName,
                lastName: localState.lastName,
                registeredBlocks: []
              });
              console.log(model);
              close();
            }}
            confirmLabel="Add Student"
          >
            <Pane display="flex" alignItems="flex-baseline">
              <TextInputField
                label="Student Id"
                placeholder="Student Id"
                onChange={form.id}
                marginRight={4}
                flex={1}
              />
            </Pane>
            <Pane display="flex" alignItems="flex-baseline">
              <TextInputField
                label="First Name"
                placeholder="First Name"
                onChange={form.firstName}
                marginRight={4}
              />
              <TextInputField
                label="Last Name"
                placeholder="Last Name"
                onChange={form.lastName}
                marginRight={4}
                flex={1}
              />
            </Pane>
          </Dialog>
          <Button
            appearance="primary"
            iconBefore="plus"
            onClick={() => (localState.isShown = true)}
          >
            Add Student
          </Button>
        </Pane>
      </VerticalPane>

      <VerticalPane title="Student" shrink={true}>
        {selectedItem &&
          (readonly ? (
            <DetailsReadonly item={selectedItem} />
          ) : (
            <Details item={selectedItem} owner={model} state={state} />
          ))}
      </VerticalPane>
    </>
  );
};

export const StudentList = observer(EditorView);

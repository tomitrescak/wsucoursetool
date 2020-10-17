import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Heading,
  Button,
  toaster,
  Select,
  Dialog,
  Combobox,
  Tab,
  TabNavigation
} from 'evergreen-ui';
import { State, Student } from '../types';
import { buildForm, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs } from 'components/common/tab';
import { useRouter } from 'next/router';
import { TextEditor } from 'components/common/text_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { model, Model, prop, modelAction, undoMiddleware } from 'mobx-keystone';
import { StudentModel, createStudent } from 'components/classes';
import {
  useSaveConfigMutation,
  useUnitsQuery,
  useUnitBaseQuery,
  useJobQuery,
  useJobsQuery
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { useStudentListQuery } from 'config/graphql';
import { ResultLine } from './results';
import { MatchedJob } from './matched_jobs';

@model('Editor/Students')
class StudentListModel extends Model({
  students: prop<StudentModel[]>()
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

const Details: React.FC<{ item: StudentModel; owner: StudentListModel; state: State }> = observer(
  ({ item: student, owner, state }) => {
    const { loading, error, data } = useStudentListQuery({});

    const localState = useLocalStore(() => ({
      isShownBlock: false,
      isShownUnit: false,
      unitId: '',
      blockId: '',
      result: '',
      date: '',
      grade: '',
      editLineIndex: -1,
      showMoreJobs: false,
      tab: 'Student Information'
    }));

    const blockForm = buildForm(localState, ['unitId', 'blockId', 'result', 'date', 'grade']);

    const { loading: unitsLoading, data: unitsData } = useUnitsQuery({});
    const { loading: unitLoading, data: unitData } = useUnitBaseQuery({
      variables: {
        id: localState.unitId
      }
    });
    const { loading: jobsLoading, data: jobsData } = useJobsQuery({});
    const { loading: jobLoading, data: jobData } = useJobQuery({});

    const form = React.useMemo(
      () => buildForm(student, ['id', 'firstName', 'lastName', 'details']),
      [student]
    );

    const [save] = useSaveConfigMutation({
      onCompleted() {
        toaster.notify('Student Updated. Config saved.');
      },
      onError(e) {
        toaster.danger('Error ;(: ' + e.message);
      }
    });

    if (loading || unitLoading || unitsLoading || jobsLoading || jobLoading || error) {
      return (
        <ProgressView
          loading={loading || unitLoading || unitsLoading || jobsLoading || jobLoading}
          error={error}
        />
      );
    }

    return (
      <div style={{ flex: 1 }}>
        <TabNavigation flex="1" marginBottom={16}>
          {['Student Information', 'Results', 'Matched Jobs'].map((tab, index) => (
            <Tab
              onSelect={() => {
                localState.tab = tab;
              }}
              key={tab}
              is="a"
              href="#"
              id={tab}
              isSelected={tab === localState.tab}
            >
              {tab}
            </Tab>
          ))}
        </TabNavigation>
        {localState.tab === 'Student Information' && (
          <Pane background="tint3" borderRadius={6}>
            <Heading size={500} marginBottom={16}>
              {student.firstName + ' ' + student.lastName}
            </Heading>

            <TextInputField
              label="Student Id"
              placeholder="Student Id"
              value={student.id}
              disabled={true}
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

            <TextEditor owner={student} field="details" label="Details" />
            <Pane display="flex" alignItems="center" marginTop={8}>
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
              <Button
                intent="warning"
                appearance="primary"
                marginTop={8}
                marginLeft={8}
                width={60}
                onClick={() => {
                  console.log(student.toJS());
                  console.log(blockForm);
                  if (confirm('Save changes?')) {
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
          </Pane>
        )}

        {localState.tab === 'Results' && (
          <Pane background="tint3" borderRadius={6}>
            <Heading size={500} marginBottom={16}>
              Registered Block/Unit Results
            </Heading>

            <Pane display="flex">
              <Heading size={400} flex={1}>
                Unit Name
              </Heading>
              <Heading size={400} flex={1} marginLeft={8}>
                Block Name
              </Heading>
              <Heading size={400} flex={1} marginLeft={8} marginRight={175}>
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

            <Pane display="flex" alignItems="center" marginTop={8}>
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
                  console.log(blockForm);
                  if (confirm('Save changes?')) {
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
                  results: [
                    {
                      date: localState.date,
                      grade: localState.grade,
                      result: parseInt(localState.result)
                    }
                  ]
                });
                close();
              }}
              confirmLabel="Add Block"
            >
              <Pane display="flex" alignItems="flex-baseline">
                <Combobox
                  width="100%"
                  id="unitName"
                  items={unitsData.units}
                  itemToString={item => (item ? item.name : '')}
                  selectedItem={unitsData.units.find(unit => unit.id === localState.unitId)}
                  onChange={selected => (localState.unitId = selected.id)}
                />
                <Combobox
                  width="100%"
                  id="blockName"
                  items={unitData.unitBase ? unitData.unitBase.blocks : []}
                  itemToString={item => (item ? item.name : '')}
                  selectedItem={
                    unitData.unitBase
                      ? unitData.unitBase.blocks.find(b => b.id === localState.blockId)
                      : ''
                  }
                  onChange={selected => (localState.blockId = selected.id)}
                />
              </Pane>
              <Pane display="flex" alignItems="flex-baseline">
                <TextInputField
                  label="Date"
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
                  <option value="F">F - Fail</option>
                  <option value="P">P - Pass</option>
                  <option value="C">C - Credit</option>
                  <option value="D">D - Distinction</option>
                  <option value="HD">HD - High Distinction</option>
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
          </Pane>
        )}

        {localState.tab === 'Matched Jobs' && (
          <Pane background="tint3" borderRadius={6}>
            <Heading size={500} marginBottom={16}>
              Matched Jobs
            </Heading>
            <Pane display="flex">
              <Heading size={400} flex={0.3}>
                Job Name
              </Heading>
              <Heading size={400} flex={1}>
                Matched Percentage
              </Heading>
            </Pane>

            {jobsData.jobs.map((job, index) => (
              <Pane display="flex" alignItems="center" marginTop={16}>
                <Pane flex={1}>
                  <MatchedJob
                    id={job.id}
                    name={job.name}
                    student={student}
                    index={index}
                    localState={localState}
                    key={index}
                  />
                </Pane>
              </Pane>
            ))}
            <Pane display="flex" alignItems="center" marginTop={16}>
              <Button
                appearance="primary"
                margin={0}
                onClick={() => {
                  localState.showMoreJobs = !localState.showMoreJobs;
                }}
              >
                {localState.showMoreJobs ? 'Show Less' : 'Show More'}
              </Button>
            </Pane>
          </Pane>
        )}
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
          aria-controls={`panel-${student.firstName}`}
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
                registeredBlocks: [],
                details: ''
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

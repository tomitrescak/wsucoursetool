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
import { State, Student, Entity, AcsKnowledge, Unit, Job } from '../types';
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
  createStudent,
  JobModel
} from 'components/classes';
import {
  useSaveConfigMutation,
  useTopicsQuery,
  useBlockQuery,
  RegisteredUnit,
  UnitList,
  RegisteredBlock,
  useUnitsQuery,
  useUnitBaseQuery,
  useJobQuery,
  useJobsQuery,
  useUnitQuery,
  useUnitsWithDetailsQuery
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { useStudentListQuery } from 'config/graphql';
import { BlocksEditor } from 'components/blocks/block_editor';
import build from 'next/dist/build';
import { skills } from 'components/outcomes/outcome_editor';
import { UnitDetailContainer } from 'components/units/unit_details';

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
    );
  }
});

type MatchedJobParams = {
  job: JobModel;
  index: number;
  localState: any;
  student: StudentModel;
};

function uniqueValues(array: string[]) {
  return Array.from(new Set(array));
}

const MatchedJob = observer(({ index, student, job, localState }: MatchedJobParams) => {
  const { loading, error, data } = useJobQuery({
    variables: {
      id: job.id
    }
  });

  const ids = uniqueValues(student.registeredBlocks.map(b => b.unitId));

  const { loading: unitsLoading, error: unitsError, data: unitsData } = useUnitsWithDetailsQuery({
    variables: {
      ids
    }
  });

  if (loading || error || unitsLoading || unitsError) {
    return <ProgressView loading={loading || unitsLoading} error={error || unitsError} />;
  }

  // student.registeredBlocks.map((block, i) => {
  //   console.log(block.unitId);
  // });
  // console.log(unitData.unit.unit);
  // console.log(unitData.unit.unit.outcomes);
  // console.log(unitData.unit.unit.outcomes.find(s => s.acsSkillId === 'b0').bloomRating);

  var allStudentSkills = [];
  var studentSkill;
  var allJobSkills = [];
  //var jobSkill;

  //creates array of objects skillId and skillLevel for each job skill
  // and initialises the studentSkills bloomRatings to 0
  data.job.skills.map((skill, i) => {
    // jobSkill = {};
    // jobSkill['skillId'] = skill.skillId;
    // jobSkill['skillLevel'] = skill.bloomRating;
    allJobSkills.push(skill.bloomRating);

    studentSkill = {};
    studentSkill['skillId'] = skill.skillId;
    studentSkill['skillLevel'] = 0;
    allStudentSkills.push(studentSkill);
  });
  console.log(allJobSkills);
  console.log(allStudentSkills);

  // === This needs to be placed in a loop of student.registeredBlocks ===
  for (var block of student.registeredBlocks) {
    const unit: Unit = unitsData.unitsWithDetails.find(u => u.id == block.unitId);
    console.log(unit);
    for (var i = 0; i < allStudentSkills.length; i++) {
      // gets skills from unit based on required skills of job
      // and compares their bloomRatings
      var unitOutcomes = unit.outcomes.find(s => s.acsSkillId === allStudentSkills[i].skillId);
      if (unitOutcomes && unitOutcomes.bloomRating > allStudentSkills[i].skillLevel) {
        allStudentSkills[i].skillLevel = unitOutcomes.bloomRating;
      }
    }
  }

  // calc individual skills

  // calculate percentage
  var studentTotal = 0;
  var singleSkillPercentage;
  for (var i = 0; i < allStudentSkills.length; i++) {
    if (allStudentSkills[i].skillLevel >= allJobSkills[i]) {
      studentTotal++;
    }
  }
  var percentage = Math.round((studentTotal / allJobSkills.length) * 100) + '%';

  if (!localState.showMoreJobs && index < 3) {
    return (
      <Pane display="flex" key={index} marginBottom={8}>
        <Pane flex={0.3}>
          <Heading>{job.name}</Heading>
        </Pane>
        <Pane flex={1}>
          <div id="emptyBar" style={{ width: '50%', backgroundColor: 'grey' }}>
            <div
              id="progressBar"
              style={{
                width: percentage,
                height: '30',
                backgroundColor: 'green',
                color: 'white'
              }}
            >
              {percentage}
            </div>
          </div>
        </Pane>
      </Pane>
    );
  } else if (localState.showMoreJobs) {
    return (
      <Pane display="flex" key={index} marginBottom={8}>
        <Pane flex={0.3}>
          <Heading>{job.name}</Heading>
        </Pane>
        <Pane flex={1}>
          <div id="emptyBar" style={{ width: '50%', backgroundColor: 'grey' }}>
            <div
              id="progressBar"
              style={{
                width: percentage,
                height: '30',
                backgroundColor: 'green',
                color: 'white'
              }}
            >
              {percentage}
            </div>
          </div>
        </Pane>
      </Pane>
    );
  }
});

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
      showMoreJobs: false
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

          <TextEditor owner={student} field="details" label="Details" />
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
              console.log(blockForm);
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

        <br></br>
        <Heading marginBottom={16}>Matched Jobs</Heading>
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
                job={job}
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
            width={100}
            onClick={() => {
              localState.showMoreJobs = true;
            }}
          >
            Show More
          </Button>
          <Button
            appearance="primary"
            marginLeft={8}
            width={100}
            onClick={() => {
              localState.showMoreJobs = false;
            }}
          >
            Show Less
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

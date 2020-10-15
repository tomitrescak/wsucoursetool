import React from 'react';
import marked from 'marked';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  SidebarTab,
  Alert,
  Heading,
  Dialog,
  Button,
  Text,
  Badge,
  Checkbox,
  TextInput,
  IconButton,
  toaster,
  Tab,
  Combobox,
  SelectMenu
} from 'evergreen-ui';
import {
  Unit,
  State,
  Course,
  AcsKnowledge,
  CourseCompletionCriteria,
  UnitCondition
} from '../types';
import { url, buildForm, extractCriteriaUnits } from 'lib/helpers';
import Link from 'next/link';

import Router, { useRouter } from 'next/router';

import { skills } from 'components/outcomes/outcome_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { Expander } from 'components/common/expander';
import {
  useCourseListQuery,
  CourseList,
  useCreateCourseMutation,
  useCourseQuery,
  useDeleteCourseMutation,
  useSaveConfigMutation,
  useUnitsQuery,
  UnitList
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { CourseModel, CourseUnitModel, createCourse, MajorModel } from 'components/classes';
import { BlockDependencyGraph } from 'components/blocks/block_graph';
import { AcsUnitGraph } from 'components/acs/acs_graph';
import { undoMiddleware } from 'mobx-keystone';
import { CourseOverview } from './course_overview';
import { CourseReport } from './course_report';
import { CourseCompletionCriteriaRoot } from './course_completion_criteria';

const classes = [
  {
    selector: '.required',
    style: {
      'target-arrow-color': 'red',
      'background-color': 'red',
      'line-color': 'red'
    }
  },
  {
    selector: '.proposed',
    style: {
      backgroundColor: 'purple',
      color: 'black',
      fontWeight: 'bold'
    }
  },
  {
    selector: '.core',
    style: {
      backgroundColor: '#efefe0',
      color: 'black'
    }
  },
  {
    selector: '.elective',
    style: {
      backgroundColor: 'rgb(212, 238, 226)',
      color: 'black'
    }
  },
  {
    selector: '.proposed',
    style: {
      color: 'purple',
      fontWeight: 'bold',
      borderColor: 'purple',
      borderWidth: '4px'
    }
  },
  {
    selector: '.obsolete',
    style: {
      border: 'solid red 3px'
    }
  }
];

/*!
 * Group items from an array together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
const groupBy = function (arr, criteria) {
  return arr.reduce(function (obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    var key = typeof criteria === 'function' ? criteria(item) : item[criteria];

    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
};

function urlParse(text: string) {
  var reg = /\d\d\d\d\d\d/g;
  var result: RegExpExecArray;
  let i = 0;
  let els = [];

  if (text.match(/\d\d\d\d\d\d/) == null) {
    return text;
  }

  let index = 0;
  while ((result = reg.exec(text)) !== null) {
    els.push(<Text key={i++}>{text.substring(index, result.index)}</Text>);
    els.push(
      <Link key={i++} href="/editor/[category]/[item]" as={`/editor/units/unit-${result[0]}`}>
        <a>
          <Text>{result[0]}</Text>
        </a>
      </Link>
    );
    index = reg.lastIndex;
  }

  els.push(<Text key={i++}>{text.substring(index)}</Text>);

  return els;
}

type SimpleEntity = {
  id: string;
  name: string;
};

type SemesterProps = {
  units: UnitList[];
  course: CourseList;
  courseUnits: UnitCondition[];
  topics: SimpleEntity[];
  localState: {
    semesterSelection: string[];
    selection: string[];
  };
  view: string;
};

const UnitsBySemester = observer(
  ({ units, courseUnits, localState, course, view }: SemesterProps) => {
    let semesters = groupBy(courseUnits, 'semester');

    return (
      <Expander title="Units by Semester" id="semesterUnits">
        <Pane display="flex">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>
                  <Heading size={400}>Code</Heading>
                </th>
                <th style={{ textAlign: 'left' }}>
                  <Heading size={400}>Name</Heading>
                </th>
                <th style={{ textAlign: 'left' }}>
                  <Heading size={400}>Sem.</Heading>
                </th>
                <th></th>
              </tr>
            </thead>
            {Object.keys(semesters).map(sem => (
              <React.Fragment key={sem}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }} colSpan={3}>
                      <Heading size={400}>
                        <Checkbox
                          fontWeight="bold"
                          fontSize="16px"
                          label={
                            <Heading size={400}>
                              {sem === '0' ? 'Electives' : `Semester ${sem}`}
                            </Heading>
                          }
                          checked={localState.semesterSelection.indexOf(sem) >= 0}
                          onChange={e => {
                            e.currentTarget.checked
                              ? localState.semesterSelection.push(sem)
                              : localState.semesterSelection.splice(
                                  localState.semesterSelection.indexOf(sem),
                                  1
                                );
                          }}
                        />
                      </Heading>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {semesters[sem].map((c, i) => {
                    let unit = units.find(u => u.id === c.id);
                    let cunit = courseUnits.find(u => u.id === c.id);

                    if (unit == null) {
                      return <div key={c.id}>Missing: {c.id}</div>;
                    }

                    // console.log(c.id);
                    // console.log(cunit.semester);

                    // console.log(
                    //   localState.semesterSelection.some(s => parseInt(s) === cunit.semester) ||
                    //     localState.selection.indexOf(unit.id) >= 0
                    // );

                    return (
                      <tr key={c.id}>
                        <td>
                          <Checkbox
                            margin={0}
                            label={unit.id}
                            checked={
                              localState.semesterSelection.some(
                                s => parseInt(s) === cunit.semester
                              ) || localState.selection.indexOf(unit.id) >= 0
                            }
                            onChange={e =>
                              e.currentTarget.checked
                                ? localState.selection.push(unit.id)
                                : localState.selection.splice(
                                    localState.selection.indexOf(unit.id),
                                    1
                                  )
                            }
                          />
                        </td>
                        <Text
                          is="td"
                          cursor="pointer"
                          onClick={() => (localState.selection = [unit.id])}
                          size={300}
                        >
                          {unit.name}
                        </Text>

                        <td>
                          <TextInput
                            height={25}
                            width={50}
                            type="number"
                            value={c.semester}
                            onChange={e => (c.semester = parseInt(e.currentTarget.value))}
                          />
                        </td>
                        <td>
                          <Link
                            key={course.id}
                            href={`/${view}/[category]/[item]`}
                            as={`/${view}/units/${url(unit.name)}-${unit.id}`}
                          >
                            <a>
                              <IconButton height={25} icon="link" appearance="minimal" />
                            </a>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </Pane>
      </Expander>
    );
  }
);

const UnitsByTopic = observer(({ units, topics, localState }: SemesterProps) => {
  let semesters: { [index: string]: Unit[] } = React.useMemo(() => {
    let unitInfos = units; //.map(u => units.find(un => un.id === u.id));
    let topicSetInitial = unitInfos.flatMap(u => u.topics);
    let topicSet = topicSetInitial
      // .filter((f, i) => topicSetInitial.indexOf(f) === i)
      .map(id => topics.find(t => t.id === id))
      .sort((a, b) => a.name.localeCompare(b.name));
    let result = {};
    for (let topic of topicSet) {
      if (topic) {
        result[topic.name] = unitInfos.filter(u => (u.topics || []).some(t => t === topic.id));
      }
    }
    return result;
  }, [units]);

  return (
    <Expander title="Units by Topic" id="topicUnits">
      <Pane display="flex">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Code</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Name</Heading>
              </th>
            </tr>
          </thead>
          {Object.keys(semesters).map(sem => (
            <React.Fragment key={sem}>
              <thead>
                <tr>
                  <th
                    style={{ textAlign: 'left', paddingTop: '8px', paddingBottom: '4px' }}
                    colSpan={3}
                  >
                    <Heading size={400}>{sem}</Heading>
                  </th>
                </tr>
              </thead>
              <tbody>
                {semesters[sem].map((c, i) => {
                  // console.log(c.id);
                  // console.log(cunit.semester);

                  // console.log(
                  //   localState.semesterSelection.some(s => parseInt(s) === cunit.semester) ||
                  //     localState.selection.indexOf(unit.id) >= 0
                  // );

                  return (
                    <tr key={c.id}>
                      <td>
                        <Checkbox
                          margin={0}
                          label={c.id}
                          checked={localState.selection.indexOf(c.id) >= 0}
                          onChange={e =>
                            e.currentTarget.checked
                              ? localState.selection.push(c.id)
                              : localState.selection.splice(localState.selection.indexOf(c.id), 1)
                          }
                        />
                      </td>
                      <Text
                        is="td"
                        cursor="pointer"
                        onClick={() => (localState.selection = [c.id])}
                        size={300}
                      >
                        {c.name}
                      </Text>
                    </tr>
                  );
                })}
              </tbody>
            </React.Fragment>
          ))}
        </table>
      </Pane>
    </Expander>
  );
});

type Props = {
  allUnits: UnitList[];
  courseUnits: UnitCondition[];
  selectedUnits: UnitCondition[];
  acs: AcsKnowledge[];
  course: Course;
  majorIds: string[];
  report?: Array<{
    id: string;
    name: string;
    issues: Array<{ type: 'error' | 'info' | 'warning'; info: any; text: string }>;
  }>;
};

const AcsGraphContainer = observer(({ allUnits, selectedUnits, acs }: Props) => {
  const units: UnitList[] = selectedUnits.map(cu => allUnits.find(u => u.id === cu.id));
  return <AcsUnitGraph acs={acs} units={units} />;
});

const TabHeader = observer(({ tab, children, state }) => {
  return (
    <Tab
      key={tab}
      id={tab}
      onSelect={() => (state.tab = tab)}
      isSelected={tab === state.tab}
      aria-controls={`panel-${tab}`}
    >
      {children}
    </Tab>
  );
});

const TabContent = observer(
  ({ tab, children, state }: React.PropsWithChildren<{ tab: string; state: any }>) => {
    return (
      <Pane
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={tab}
        aria-hidden={state.tab !== tab}
        display={state.tab === tab ? 'block' : 'none'}
      >
        {state.tab === tab && children}
      </Pane>
    );
  }
);

const CourseTabs = observer(
  ({ acs, course, majorIds, allUnits, courseUnits, selectedUnits, report }: Props) => {
    const state = useLocalStore(() => ({
      tab: 'over'
    }));

    function unitClass(unit: Unit) {
      let cls = [courseUnits.some(c => c.id === unit.id) ? 'core' : 'elective'];
      if (unit.proposed) {
        cls.push('proposed');
      }
      if (unit.obsolete || unit.outdated) {
        cls.push('obsolete');
      }
      return cls;
    }

    function blockClass() {
      return null;
    }

    const units = selectedUnits
      .filter(s => courseUnits.some(u => u.id === s.id))
      .map(u => {
        let unit = { ...allUnits.find(cu => u.id === cu.id) };
        unit.name += ` [${u.semester}]`;
        return unit;
      });

    return (
      <Pane>
        <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
          <TabHeader tab="rep" state={state}>
            Course Report
          </TabHeader>
          <TabHeader tab="over" state={state}>
            Course Overview
          </TabHeader>
          <TabHeader tab="dep" state={state}>
            Dependencies
          </TabHeader>
          <TabHeader tab="acs" state={state}>
            ACS CBOK
          </TabHeader>
        </Tablist>
        <TabContent tab="rep" state={state}>
          <CourseReport />
        </TabContent>
        <TabContent tab="over" state={state}>
          <CourseOverview report={report} />
        </TabContent>
        <TabContent tab="acs" state={state}>
          <AcsGraphContainer
            acs={acs}
            courseUnits={courseUnits}
            allUnits={units}
            selectedUnits={selectedUnits}
            course={course}
            majorIds={majorIds}
          />
        </TabContent>
        <TabContent tab="dep" state={state}>
          <BlockDependencyGraph
            key={course.id + '_' + majorIds.join('.')}
            units={units}
            otherUnits={allUnits}
            owner={course}
            classes={classes}
            unitClass={unitClass}
            blockClass={blockClass}
          />
        </TabContent>
      </Pane>
    );
  }
);

const CourseDetails: React.FC<{
  course: CourseList;
  readonly: boolean;
  state: State;
  listRefetch: Function;
}> = observer(({ course: courseListItem, readonly, state, listRefetch }) => {
  const { loading, error, data, refetch } = useCourseQuery({
    variables: {
      id: courseListItem.id
    }
  });

  const [deleteCourse] = useDeleteCourseMutation({
    onCompleted() {
      toaster.notify('Course deleted. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const localState = useLocalStore(() => ({
    newUnitName: '',
    newUnitId: '',
    newMajorName: '',
    newMajorId: '',
    isShown: false,
    course: '',
    selection: [],
    semesterSelection: []
  }));
  const router = useRouter();

  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const course = React.useMemo(() => {
    if (loading || data == null) {
      return null;
    }
    const model = createCourse(data.course);
    const undoManager = undoMiddleware(model);
    state.undoManager = undoManager;
    state.save = () => {
      const body = model.toJS();
      save({
        variables: {
          body,
          id: course.id,
          part: 'course'
        }
      });
    };
    return model;
  }, [loading]);

  const form = React.useMemo(() => buildForm(course, ['name', 'id']), [course]);
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const addForm = buildForm(localState, ['newMajorName', 'newMajorId']);

  let selectedMajorIds: string[] | undefined = [];
  const item = router.query.item as string;

  if (item) {
    const mainSplit = item.split('--');

    // find block
    for (let i = 1; i < mainSplit.length; i++) {
      const blockSplit = mainSplit[i].split('-');
      const id = blockSplit[blockSplit.length - 1];
      if (id) {
        selectedMajorIds.push(id);
      }
    }
  }

  // find all depenedencies

  // const majors = selectedMajorIds.map(id => course.majors.find(f => f.id === id));
  // const courseUnits: CourseUnit[] = [...course.core];

  // for (let major of majors) {
  //   for (let unit of major.units) {
  //     if (courseUnits.every(u => u.id !== unit.id)) {
  //       courseUnits.push(unit);
  //     }
  //   }
  // }

  const courseUnits = extractCriteriaUnits(course.completionCriteria);
  const selectedUnits = courseUnits.filter(u => {
    if (localState.selection.length || localState.semesterSelection.length) {
      return (
        localState.selection.some(s => u.id === s) ||
        localState.semesterSelection.some(s => u.semester === parseInt(s))
      );
    }
    return true;
  });
  const view = readonly ? 'view' : 'editor';

  function changeRoute() {
    router.push(
      `/${view}/[category]/[item]`,
      `/${view}/courses/${url(course.name)}-${course.id}--${selectedMajorIds
        .map(id => `${url(course.majors.find(m => m.id === id).name)}-${id}`)
        .join('--')}`
    );
  }

  return (
    <>
      <VerticalPane title="Details">
        <Pane background="tint2" padding={16} borderRadius={6}>
          <Pane marginBottom={16} display="flex" alignItems="center">
            <Heading size={500} marginRight={16}>
              {course.name}
            </Heading>
          </Pane>

          <Pane display="flex" marginBottom={8} alignItems="flex-end">
            <TextInputField
              label="Code"
              value={course.id}
              id="unitCode"
              onChange={form.id}
              disabled={true}
              margin={0}
              marginRight={8}
            />
            <TextInputField
              flex="1"
              label="Name"
              id="unitName"
              placeholder="Course Name"
              value={course.name}
              disabled={readonly}
              margin={0}
              marginRight={8}
              onChange={form.name}
            />
          </Pane>

          <Pane display="flex" marginBottom={24} alignItems="flex-end">
            <SelectMenu
              isMultiSelect
              title="Select multiple majors"
              options={course.majors.map(m => ({ label: m.name, value: m.id }))}
              selected={selectedMajorIds}
              onSelect={item => {
                selectedMajorIds.push(item.value as string);
                changeRoute();
              }}
              onDeselect={item => {
                selectedMajorIds = selectedMajorIds.filter(i => i !== (item.value as string));
                if (selectedMajorIds.length) {
                  changeRoute();
                } else {
                  router.push(
                    '/editor/[category]/[item]',
                    `/editor/courses/${url(course.name)}-${course.id}`
                  );
                }
              }}
            >
              <Button>
                {selectedMajorIds.length
                  ? selectedMajorIds.map(id => course.majors.find(m => m.id === id).name).join(', ')
                  : 'Select multiple...'}
              </Button>
            </SelectMenu>

            {/* <Dialog
                isShown={localState.isShown}
                title="Add New Major"
                onCloseComplete={() => (localState.isShown = false)}
                onConfirm={close => {
                  course.majors.push({
                    id: localState.newUnitId,
                    name: localState.newUnitName,
                    units: []
                  });

                  close();
                }}
                confirmLabel="Add Major"
              >
                <Pane display="flex" alignItems="flex-baseline">
                  <TextInputField
                    label="Major Code"
                    placeholder="Major Id"
                    onChange={addForm.newUnitId}
                    marginRight={4}
                  />
                  <TextInputField
                    label="Major Name"
                    placeholder="Major Name"
                    onChange={addForm.newUnitName}
                    marginRight={4}
                    flex={1}
                  />
                </Pane>
              </Dialog> */}

            {!readonly && (
              <>
                <Dialog
                  isShown={localState.isShown}
                  title="Add New Major"
                  onCloseComplete={() => (localState.isShown = false)}
                  onConfirm={close => {
                    course.addMajor({
                      completionCriteria: {
                        acs: [],
                        sfia: [],
                        units: [],
                        topics: [],
                        totalCredits: 0
                      },
                      id: localState.newMajorId,
                      name: localState.newMajorName
                      // units: []
                    });

                    router.push(
                      '/editor/[category]/[item]',
                      `/editor/courses/${url(course.name)}-${course.id}--${url(
                        localState.newMajorName
                      )}-${localState.newMajorId}`
                    );

                    close();
                  }}
                  confirmLabel="Add Major"
                >
                  <Pane display="flex" alignItems="flex-baseline">
                    <TextInputField
                      label="Code"
                      placeholder="Mahor Id"
                      onChange={addForm.newMajorId}
                      marginRight={4}
                    />
                    <TextInputField
                      label="Name"
                      placeholder="Major Name"
                      onChange={addForm.newMajorName}
                      marginRight={4}
                      flex={1}
                    />
                  </Pane>
                </Dialog>

                <Button
                  marginLeft={8}
                  appearance="primary"
                  iconBefore="plus"
                  onClick={() => (localState.isShown = true)}
                >
                  Add Major
                </Button>
              </>
            )}
          </Pane>

          <Expander title="Course Completion Criteria" id="courseCompletionCriteria">
            <CourseCompletionCriteriaRoot
              readonly={readonly}
              criteria={course.completionCriteria}
            />
          </Expander>

          {selectedMajorIds.map(selectedMajorId => {
            const major = course.majors.find(m => m.id === selectedMajorId);
            return (
              <Expander
                key={selectedMajorId}
                title={`"${major.name}" Major`}
                id={'courseMajorCompletionCriteria' + major.name}
              >
                <CourseCompletionCriteriaRoot
                  readonly={readonly}
                  criteria={major.completionCriteria}
                />

                {/* <ClassList
                  owner={major}
                  units={major.units}
                  readonly={readonly}
                  title="Major Units"
                /> */}

                <Button
                  intent="danger"
                  iconBefore="trash"
                  appearance="primary"
                  marginTop={8}
                  marginLeft={8}
                  onClick={() => {
                    if (confirm('Are You Sure?')) {
                      course.removeMajor(major);
                    }
                    router.push(
                      '/editor/[category]/[item]',
                      `/editor/courses/${url(course.name)}-${course.id}`
                    );
                  }}
                >
                  Delete Major
                </Button>
              </Expander>
            );
          })}

          {/* <ClassList owner={course} units={course.core} readonly={readonly} title="Core Units" /> */}

          <UnitsBySemester
            course={course}
            courseUnits={courseUnits}
            units={data.units}
            topics={data.topics}
            localState={localState}
            view={view}
          />
          <UnitsByTopic
            course={course}
            courseUnits={courseUnits}
            units={data.units}
            topics={data.topics}
            localState={localState}
            view={view}
          />
        </Pane>
        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure? This action cannot be undone!')) {
              deleteCourse({
                variables: {
                  id: course.id
                }
              }).then(() => {
                listRefetch();
                Router.push('/editor/[category]', `/editor/courses`);
              });
            }
          }}
        >
          Delete Course
        </Button>
      </VerticalPane>
      <VerticalPane shrink={true}>
        <CourseTabs
          acs={data.acs}
          report={data.courseReport}
          selectedUnits={selectedUnits}
          allUnits={data.units}
          courseUnits={courseUnits}
          course={course}
          majorIds={selectedMajorIds}
        />
      </VerticalPane>
    </>
  );
});

// const ClassList = observer(
//   ({
//     owner,
//     units,
//     readonly,
//     title
//   }: {
//     units: CourseUnitModel[];
//     owner: { addUnit(unit: CourseUnit): void; removeUnit(unit: CourseUnitModel): void };
//     readonly: boolean;
//     title: string;
//   }) => {
//     const { loading, error, data, refetch } = useUnitsQuery();
//     const localState = useLocalStore(() => ({
//       id: '',
//       semester: 0
//     }));
//     if (loading || error) {
//       return <ProgressView loading={loading} error={error} />;
//     }

//     return (
//       <Expander title={title} id={title}>
//         <Pane paddingTop={8}>
//           {units.map(c => (
//             <Pane key={c.id} display="flex" alignItems="center" marginBottom={4}>
//               {!readonly && (
//                 <IconButton
//                   icon="trash"
//                   marginRight={8}
//                   appearance="primary"
//                   intent="danger"
//                   onClick={() => owner.removeUnit(c)}
//                 />
//               )}
//               <Text flex={1} is="div">
//                 {data.units.find(u => u.id === c.id).name}
//               </Text>
//               <TextInput
//                 type="number"
//                 width={80}
//                 disabled={readonly}
//                 placeholder="Semester"
//                 value={c.semester}
//                 onChange={e => (c.semester = parseInt(e.currentTarget.value))}
//               />
//             </Pane>
//           ))}

//           {!readonly && (
//             <Pane marginTop={8} display="flex">
//               <Combobox
//                 id="block"
//                 width="100%"
//                 items={data.units}
//                 itemToString={item => (item ? item.name : '')}
//                 onChange={selected => (localState.id = selected.id)}
//               />
//               <TextInput
//                 type="number"
//                 width={80}
//                 placeholder="Semester"
//                 value={localState.semester}
//                 onChange={e => (localState.semester = parseInt(e.currentTarget.value))}
//                 marginLeft={8}
//               />
//               <IconButton
//                 marginLeft={8}
//                 intent="success"
//                 icon="plus"
//                 onClick={() =>
//                   localState.id &&
//                   owner.addUnit({ id: localState.id, semester: localState.semester })
//                 }
//                 appearance="primary"
//               />
//             </Pane>
//           )}
//         </Pane>
//       </Expander>
//     );
//   }
// );

const CoursesEditorView: React.FC<{ state: State; readonly: boolean }> = ({ state, readonly }) => {
  const view = readonly ? 'view' : 'editor';
  const localState = useLocalStore(() => ({
    newCourseName: '',
    newCourseId: '',
    isShown: false,
    course: ''
  }));
  const router = useRouter();

  const [createCourse] = useCreateCourseMutation({
    onCompleted() {
      toaster.notify('Course created. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });
  const { loading, error, data, refetch } = useCourseListQuery();
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const form = buildForm(localState, ['newCourseName', 'newCourseId']);

  const item = router.query.item as string;
  let courseId = '';
  let course: CourseList | undefined;

  if (item) {
    const mainSplit = item.split('--');

    // find unit
    const split = mainSplit[0].split('-');
    courseId = split[split.length - 1];
    course = data.courses.find(u => u.id === courseId);
  }

  return (
    <>
      <VerticalPane title="Course List">
        <Tablist>
          {data.courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/courses/${url(course.name)}-${course.id}`}
            >
              <a>
                <SidebarTab
                  whiteSpace="nowrap"
                  key={course.id}
                  id={course.id}
                  isSelected={course.id === courseId}
                  onSelect={() => {}}
                  aria-controls={`panel-${course.name}`}
                  minWidth="120px"
                >
                  <Badge size={300} marginRight={8}>
                    {course.id}
                  </Badge>
                  {course.name}
                </SidebarTab>
              </a>
            </Link>
          ))}

          {!readonly && (
            <>
              <Dialog
                isShown={localState.isShown}
                title="Add new course"
                onCloseComplete={() => (localState.isShown = false)}
                onConfirm={close => {
                  createCourse({
                    variables: {
                      id: localState.newCourseId,
                      name: localState.newCourseName
                    }
                  }).then(() => refetch());

                  close();
                }}
                confirmLabel="Add Course"
              >
                <Pane display="flex" alignItems="flex-baseline">
                  <TextInputField
                    label="Course Code"
                    placeholder="Course Id"
                    onChange={form.newCourseId}
                    marginRight={4}
                  />
                  <TextInputField
                    label="Course Name"
                    placeholder="Course Name"
                    onChange={form.newCourseName}
                    marginRight={4}
                    flex={1}
                  />
                </Pane>
              </Dialog>

              <Pane
                display="flex"
                alignItems="center"
                marginTop={16}
                paddingTop={8}
                borderTop="dotted 1px #dedede"
              >
                <Button
                  appearance="primary"
                  iconBefore="plus"
                  onClick={() => (localState.isShown = true)}
                >
                  Add Course
                </Button>
              </Pane>
            </>
          )}
        </Tablist>
      </VerticalPane>

      {data.courses.length === 0 && (
        <VerticalPane shrink={true}>
          {' '}
          <Alert flex={1}>There are no courses defined</Alert>
        </VerticalPane>
      )}
      {course && (
        <CourseDetails
          key={course.id}
          course={course}
          readonly={readonly}
          state={state}
          listRefetch={refetch}
        />
      )}
    </>
  );
};

export const CoursesEditor = observer(CoursesEditorView);

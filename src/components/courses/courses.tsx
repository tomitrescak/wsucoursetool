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
  SelectField,
  Text,
  Badge,
  Checkbox,
  TextInput,
  IconButton,
  toaster,
  Tab
} from 'evergreen-ui';
import { Unit, State, Course, CourseUnit, Topic, AcsKnowledge } from '../types';
import { url, buildForm } from 'lib/helpers';
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
  useSaveConfigMutation
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { createCourse } from 'components/classes';
import { BlockDependencyGraph } from 'components/blocks/block_graph';
import { AcsUnitGraph } from 'components/acs/acs_graph';
import { undoMiddleware } from 'mobx-keystone';

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
  units: Unit[];
  courseUnits: CourseUnit[];
  course: CourseList;
  topics: SimpleEntity[];
  localState: {
    semesterSelection: string[];
    selection: string[];
  };
  view: string;
};

const UnitsBySemester = observer(
  ({ courseUnits, units, localState, course, view }: SemesterProps) => {
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
                        <td>
                          <IconButton
                            height={25}
                            icon="trash"
                            intent="danger"
                            appearance="primary"
                            onClick={e => course.core.splice(i, 1)}
                          />
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

const UnitsByTopic = observer(
  ({ units, topics, courseUnits, localState, course }: SemesterProps) => {
    let semesters: { [index: string]: Unit[] } = React.useMemo(() => {
      let unitInfos = units; //.map(u => units.find(un => un.id === u.id));

      let topicSet = Array.from(new Set(unitInfos.flatMap(u => u.topics)))
        .map(id => topics.find(t => t.id === id))
        .sort();
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
  }
);

type Props = {
  courseUnits: Unit[];
  selectedUnits: CourseUnit[];
  acs: AcsKnowledge[];
  course: Course;
};

const AcsGraphContainer = observer(({ courseUnits, selectedUnits, acs }: Props) => {
  const units: Unit[] = selectedUnits.map(cu => courseUnits.find(u => u.id === cu.id));
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

const Visualisations = observer(({ acs, course, courseUnits, selectedUnits }: Props) => {
  const state = useLocalStore(() => ({
    tab: 'dep'
  }));
  return (
    <Pane>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        <TabHeader tab="dep" state={state}>
          Dependencies
        </TabHeader>
        <TabHeader tab="acs" state={state}>
          ACS CBOK
        </TabHeader>
      </Tablist>
      <TabContent tab="acs" state={state}>
        <AcsGraphContainer
          acs={acs}
          courseUnits={courseUnits}
          selectedUnits={selectedUnits}
          course={course}
        />
      </TabContent>
      <TabContent tab="dep" state={state}>
        <BlockDependencyGraph
          units={selectedUnits.map(u => courseUnits.find(cu => u.id === cu.id))}
          owner={course}
        />
      </TabContent>
    </Pane>
  );
});

const CourseDetails: React.FC<{ course: CourseList; readonly: boolean; state: State }> = observer(
  ({ course: courseListItem, readonly, state }) => {
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
      if (loading) {
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

    const addForm = buildForm(localState, ['newUnitName', 'newUnitId']);
    let selectedMajorId: string | undefined;
    const item = router.query.item as string;

    if (item) {
      const mainSplit = item.split('--');

      // find block
      const blockSplit = mainSplit.length > 1 ? mainSplit[1].split('-') : null;
      selectedMajorId = blockSplit != null ? blockSplit[blockSplit.length - 1] : null;
    }

    // find all depenedencies

    const major = selectedMajorId
      ? course.majors.find(f => f.id === selectedMajorId)
      : { units: [] };
    const courseUnits: CourseUnit[] = [
      ...course.core.filter(c => major.units.every(u => u.id !== c.id)),
      ...major.units
    ];

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
                margin={0}
                marginRight={8}
                onChange={form.name}
              />
            </Pane>

            <Pane display="flex" marginBottom={24} alignItems="flex-end">
              <SelectField
                value={selectedMajorId}
                label="Major"
                margin={0}
                onChange={e => {
                  router.push(
                    '/editor/[category]/[item]',
                    `/editor/courses/${url(course.name)}-${course.id}--${url(
                      course.majors.find(m => m.id === e.currentTarget.value).name
                    )}-${e.currentTarget.value}`
                  );
                }}
              >
                <option value="">Please Select ...</option>
                {course.majors.map(m => (
                  <option value={m.id} key={m.id}>
                    {m.name}
                  </option>
                ))}
              </SelectField>
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
                <Button
                  appearance="primary"
                  iconBefore="plus"
                  marginLeft={8}
                  onClick={() => (localState.isShown = true)}
                >
                  Add Major
                </Button>
              )}
            </Pane>
            <UnitsBySemester
              course={course}
              courseUnits={courseUnits}
              units={data.courseUnits}
              topics={data.topics}
              localState={localState}
              view={view}
            />
            <UnitsByTopic
              course={course}
              courseUnits={courseUnits}
              units={data.courseUnits}
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
                  refetch();
                  Router.push('/editor/[category]', `/editor/courses`);
                });
              }
            }}
          >
            Delete
          </Button>
        </VerticalPane>
        <VerticalPane shrink={true}>
          <Visualisations
            acs={data.acs}
            selectedUnits={selectedUnits}
            courseUnits={data.courseUnits}
            course={course}
          />
        </VerticalPane>
      </>
    );
  }
);

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
          {data.courses
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((course, index) => (
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
        <CourseDetails key={course.id} course={course} readonly={readonly} state={state} />
      )}
    </>
  );
};

export const CoursesEditor = observer(CoursesEditorView);

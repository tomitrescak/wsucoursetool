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
  TabNavigation,
  Tab,
  Badge,
  Textarea,
  Checkbox,
  Select,
  TextInput,
  Link as EGLink,
  Table,
  IconButton
} from 'evergreen-ui';
import { Unit, State, Course, CourseUnit } from './types';
import { url, buildForm } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries
} from 'react-vis';
import { skills } from './outcome_editor';
import { VerticalPane } from './vertical_pane';
import { Expander } from './expander';

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

type SemesterProps = {
  units: CourseUnit[];
  course: Course;
  state: State;
};

const UnitsBySemester = observer(({ units, localState, state, course }: SemesterProps) => {
  let semesters = groupBy(units, 'semester');

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
                  <th style={{ textAlign: 'left' }}>
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
                  let unit = state.courseConfig.units.find(u => u.id === c.id);
                  let cunit = units.find(u => u.id === c.id);

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
});

const UnitsByTopic = observer(({ units, localState, state, course }: SemesterProps) => {
  let semesters: { [index: string]: Unit[] } = React.useMemo(() => {
    let unitInfos = units.map(u => state.courseConfig.units.find(un => un.id === u.id));
    let topics = Array.from(new Set(unitInfos.flatMap(u => u.topics)))
      .map(id => state.courseConfig.topics.find(t => t.id === id))
      .sort();
    let result = {};
    for (let topic of topics) {
      result[topic.name] = unitInfos.filter(u => u.topics.some(t => t === topic.id));
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
                  <th style={{ textAlign: 'left' }}>
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

const CourseDetails: React.FC<{ course: Course; state: State; readonly: boolean }> = observer(
  ({ course, state, readonly }) => {
    const map = React.useMemo(() => {
      const result = {
        units: {},
        blocks: {}
      };
      state.courseConfig.units.forEach(u => (result.units[u.id] = u));
      state.courseConfig.blocks.forEach(b => (result.blocks[b.id] = b));
      return result;
    }, []);

    const form = React.useMemo(() => buildForm(course, ['name', 'id']), [course]);
    const localState = useLocalStore(() => ({
      newUnitName: '',
      newUnitId: '',
      isShown: false,
      course: '',
      selection: [],
      semesterSelection: []
    }));
    const addForm = buildForm(localState, ['newUnitName', 'newUnitId']);

    let selectedMajorId: string | undefined;
    const router = useRouter();
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
    const units: CourseUnit[] = [
      ...course.core.filter(c => major.units.every(u => u.id !== c.id)),
      ...major.units
    ];
    const selectedUnits = units.filter(u => {
      if (localState.selection.length || localState.semesterSelection.length) {
        return (
          localState.selection.some(s => u.id === s) ||
          localState.semesterSelection.some(s => u.semester === parseInt(s))
        );
      }
      return true;
    });

    const courseUnits = selectedUnits.map(cu => state.courseConfig.units.find(u => u.id === cu.id));
    const titles = {};

    let bars = skills.map((s, i) => {
      let ascSkill = state.courseConfig.acsKnowledge.flatMap(k => k.items).find(k => k.id === s);
      // find maximum

      let max = courseUnits.reduce((max, unit) => {
        let maxValue = unit.blocks.reduce((blockMax, blockId) => {
          let maxBlockValue =
            map.blocks[blockId].outcomes?.find(o => o.acsSkillId === s)?.bloomRating || 0;
          return blockMax < maxBlockValue ? maxBlockValue : blockMax;
        }, unit.outcomes?.find(o => o.acsSkillId === s)?.bloomRating || 0);
        return max < maxValue ? maxValue : max;
      }, 0);

      titles[i] = ascSkill.name;

      return { y: i, x: max };
    });

    return (
      <>
        <VerticalPane shrink={true}>
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
              <Dialog
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
              </Dialog>

              <Button
                appearance="primary"
                iconBefore="plus"
                marginLeft={8}
                onClick={() => (localState.isShown = true)}
              >
                Add Major
              </Button>
            </Pane>
            <UnitsBySemester course={course} units={units} state={state} localState={localState} />
            <UnitsByTopic course={course} units={units} state={state} localState={localState} />
          </Pane>
          <Button
            intent="danger"
            iconBefore="trash"
            appearance="primary"
            marginTop={8}
            onClick={() => {
              if (confirm('Are You Sure?')) {
                state.courseConfig.courses.splice(
                  state.courseConfig.courses.findIndex(p => p === course),
                  1
                );
              }
            }}
          >
            Delete
          </Button>
        </VerticalPane>
        <VerticalPane>
          <Heading>ACS CBOK Breakdown</Heading>
          <XYPlot height={400} width={400} margin={{ left: 200 }} xDomain={[0, 6]}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis
              tickValues={[0, 1, 2, 3, 4, 5, 6]}
              hideTicks={false}
              tickFormat={e => Math.round(e) as any}
            />
            <YAxis
              tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
              tickFormat={e => titles[e]}
              width={200}
            />

            <HorizontalBarSeries data={bars} barWidth={0.7} />
          </XYPlot>
          <TextInputField label="Values" value={bars.map(b => b.x).join('\t')} />

          <Pane elevation={2}></Pane>
        </VerticalPane>
      </>
    );
  }
);

const CoursesEditorView: React.FC<{ state: State; readonly: boolean }> = ({ state, readonly }) => {
  const localState = useLocalStore(() => ({
    newUnitName: '',
    newUnitId: '',
    isShown: false,
    course: ''
  }));
  const form = buildForm(localState, ['newUnitName', 'newUnitId']);

  const router = useRouter();
  const item = router.query.item as string;
  let courseId = '';
  let course: Course | undefined;

  if (item) {
    const mainSplit = item.split('--');

    // find unit
    const split = mainSplit[0].split('-');
    courseId = split[split.length - 1];
    course = state.courseConfig.courses.find(u => u.id === courseId);
  }

  return (
    <>
      <VerticalPane title="Course List">
        <Tablist>
          {state.courseConfig.courses
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((course, index) => (
              <Link
                key={course.id}
                href="/editor/[category]/[item]"
                as={`/editor/courses/${url(course.name)}-${course.id}`}
              >
                <a>
                  <SidebarTab
                    whiteSpace="nowrap"
                    key={course.id}
                    id={course.id}
                    isSelected={course.id === courseId}
                    onSelect={() => {}}
                    aria-controls={`panel-${course.name}`}
                  >
                    <Badge size={300} marginRight={8}>
                      {course.id}
                    </Badge>
                    {course.name}
                  </SidebarTab>
                </a>
              </Link>
            ))}

          <Dialog
            isShown={localState.isShown}
            title="Add new course"
            onCloseComplete={() => (localState.isShown = false)}
            onConfirm={close => {
              state.courseConfig.courses.push({
                id: localState.newUnitId,
                name: localState.newUnitName,
                core: [],
                majors: []
              });

              close();
            }}
            confirmLabel="Add Course"
          >
            <Pane display="flex" alignItems="flex-baseline">
              <TextInputField
                label="Course Code"
                placeholder="Course Id"
                onChange={form.newUnitId}
                marginRight={4}
              />
              <TextInputField
                label="Course Name"
                placeholder="Course Name"
                onChange={form.newUnitName}
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
        </Tablist>
      </VerticalPane>

      {state.courseConfig.units.length === 0 && (
        <VerticalPane shrink={true}>
          {' '}
          <Alert flex={1}>There are no units defined</Alert>
        </VerticalPane>
      )}
      {course && (
        <CourseDetails key={course.id} course={course} state={state} readonly={readonly} />
      )}
    </>
  );
};

export const CoursesEditor = observer(CoursesEditorView);

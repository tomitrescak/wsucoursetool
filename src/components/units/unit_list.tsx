import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  SidebarTab,
  Alert,
  Dialog,
  Button,
  Badge,
  Select,
  TextInput,
  Text,
  SelectMenu,
  Icon,
  IconButton,
  Checkbox
} from 'evergreen-ui';
import { Unit, State } from '../types';
import { url, buildForm, extractCriteriaUnits } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { VerticalPane } from 'components/common/vertical_pane';
import { useCourseListQuery, UnitList, useCreateUnitMutation } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { UnitDetailContainer } from './unit_details';

const TopicBadge = ({ children }) => (
  <Text
    marginRight={4}
    size={300}
    background="#E4E7EB"
    paddingLeft={4}
    paddingRight={4}
    borderRadius={3}
  >
    {children}
  </Text>
);

function exportToCsv(rows: string[][]) {
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach(function (rowArray) {
    for (var i = 0, len = rowArray.length; i < len; i++) {
      if (typeof rowArray[i] == 'string') rowArray[i] = rowArray[i].replace(/<(?:.|\n)*?>/gm, '');
      rowArray[i] = rowArray[i].replace(/,/g, '');
    }

    let row = rowArray.join(',');
    csvContent += row + '\r\n'; // add carriage return
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'export.csv');
  document.body.appendChild(link);
  link.click();
}

const UnitListItem = ({ unit, view, unitId, topics, selectedCourse }) => {
  return (
    <Pane key={unit.id}>
      <Link href={`/${view}/[category]/[item]`} as={`/${view}/units/${url(unit.name)}-${unit.id}`}>
        <a>
          <SidebarTab
            whiteSpace="nowrap"
            key={unit.id}
            id={unit.id}
            isSelected={unit.id === unitId}
            onSelect={() => {}}
            aria-controls={`panel-${unit.name}`}
          >
            {/* <input
                    type="checkbox"
                    checked={localState.selection.indexOf(unit.id) >= 0}
                    onClick={e => e.stopPropagation()}
                    onChange={e =>
                      e.currentTarget.checked
                        ? localState.selection.push(unit.id)
                        : localState.selection.splice(localState.selection.indexOf(unit.id), 1)
                    }
                  /> */}

            <Badge size={300} marginRight={8} color={unit.level < 7 ? 'green' : 'red'}>
              {unit.id}
            </Badge>

            {unit.dynamic && (
              <Badge color="orange" marginRight={8}>
                D
              </Badge>
            )}

            {selectedCourse && selectedCourse.core.some(s => s.id === unit.id) && (
              <Badge color="yellow" marginRight={8}>
                C
              </Badge>
            )}
            {unit.name}

            <Badge color={unit.blockCount > 0 ? 'green' : 'neutral'} marginLeft={8}>
              {unit.blockCount}
            </Badge>
          </SidebarTab>
        </a>
      </Link>

      <Pane marginLeft={65} marginTop={-10} marginBottom={8} maxWidth={300}>
        {unit.outdated && (
          <Badge color="red" marginRight={8}>
            Outdated
          </Badge>
        )}
        {unit.obsolete && (
          <Badge color="red" marginRight={8}>
            Obsolete
          </Badge>
        )}
        {unit.processed && (
          <Badge color="green" marginRight={8}>
            Processed
          </Badge>
        )}
        {unit.proposed && (
          <Badge color="purple" marginRight={8}>
            Proposed
          </Badge>
        )}
        {unit.hidden && (
          <Badge color="red" marginRight={8}>
            Hidden
          </Badge>
        )}
        {(unit.topics || []).map(t => (
          <TopicBadge key={t}>{topics.find(p => p.id === t).name.replace(/ /g, '\xa0')}</TopicBadge>
        ))}
      </Pane>
    </Pane>
  );
};

const UnitsEditorView: React.FC<{ state: State; readonly: boolean }> = ({ state, readonly }) => {
  const view = readonly ? 'view' : 'editor';
  const localState = useLocalStore(() => ({
    newUnitName: '',
    newUnitId: '',
    isShown: false,
    selection: [],
    course: '',
    major: '',
    filterName: '',
    filterCode: '',
    level: 'ug',
    selectedTopics: [],
    showHidden: false
  }));
  const form = buildForm(localState, ['newUnitName', 'newUnitId', 'filterCode', 'filterName']);
  const router = useRouter();

  const { loading, error, data, refetch } = useCourseListQuery();
  const [createUnit] = useCreateUnitMutation({
    onCompleted() {
      refetch();
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const item = router.query.item as string;
  let unitId = '';
  let unit: UnitList | undefined;

  if (item) {
    const mainSplit = item.split('--');

    // find unit
    const split = mainSplit[0].split('-');
    unitId = split[split.length - 1];
    unit = data.units.find(u => u.id === unitId);
  }

  let selectedCourse = localState.course
    ? data.courses.find(c => c.id === localState.course)
    : null;

  let selectedMajor = localState.major
    ? selectedCourse.majors.find(m => m.id === localState.major)
    : null;

  const courseUnits = selectedCourse ? extractCriteriaUnits(selectedCourse.completionCriteria) : [];
  const filteredUnits = data.units.slice().filter(f => {
    let isOk = true;
    if (localState.showHidden == false && f.hidden) {
      return false;
    }
    if (selectedCourse) {
      isOk = courseUnits.findIndex(c => c.id === f.id) >= 0;
      // || (selectedMajor && selectedMajor.units.findIndex(u => u.id === f.id) >= 0);
    }
    if (localState.filterName) {
      isOk =
        isOk &&
        localState.filterName
          .toLowerCase()
          .split(' ')
          .every(d => f.name.toLowerCase().indexOf(d) >= 0);
    }
    if (localState.filterCode) {
      isOk = isOk && f.id.indexOf(localState.filterCode) >= 0;
    }
    isOk =
      isOk &&
      (localState.level === 'both' ? true : localState.level === 'ug' ? f.level < 7 : f.level > 6);

    isOk =
      isOk &&
      (localState.selectedTopics.length === 0
        ? true
        : localState.selectedTopics.some(t => f.topics.some(p => p === t)));
    return isOk;
  });
  filteredUnits.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <VerticalPane title="Unit List">
        <Pane paddingRight={8}>
          <Pane paddingRight={22} display="flex" marginBottom={8}>
            <TextInput
              flex={3}
              placeholder="Name ..."
              value={localState.filterName}
              onChange={form.filterName}
              marginRight={8}
              width="100%"
            />
            <TextInput
              flex={1}
              placeholder="Code ..."
              value={localState.filterCode}
              onChange={form.filterCode}
              width="100%"
            />
          </Pane>

          <Pane display="flex" width="100%" marginBottom={8}>
            <Select
              value={localState.level || 'ug'}
              onChange={e => (localState.level = e.currentTarget.value)}
              marginRight={8}
            >
              <option value="ug">Undergraduate</option>
              <option value="pg">Postgraduate</option>
              <option value="both">Both</option>
            </Select>
            <Select
              value={localState.course}
              onChange={e => (localState.course = e.currentTarget.value)}
              marginRight={8}
            >
              <option value="">Select Course ...</option>
              {data.courses.map((c, i) => (
                <option value={c.id} key={i}>
                  {c.name}
                </option>
              ))}
            </Select>
            {selectedCourse && (
              <Select
                value={localState.major}
                onChange={e => (localState.major = e.currentTarget.value)}
              >
                <option value="">Select Major ...</option>
                {selectedCourse.majors.map((c, i) => (
                  <option value={c.id} key={i}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Pane>

          <Pane display="flex">
            <SelectMenu
              isMultiSelect
              title="Select topics"
              options={data.topics.map(t => ({ label: t.name, value: t.id }))}
              selected={localState.selectedTopics}
              onSelect={item => {
                localState.selectedTopics.push(item.value);
              }}
              onDeselect={item => {
                localState.selectedTopics.splice(localState.selectedTopics.indexOf(item.value), 1);
              }}
            >
              <Button maxWidth={300} marginRight={8}>
                {localState.selectedTopics.length > 3
                  ? `${localState.selectedTopics.length} selected`
                  : localState.selectedTopics.length > 0
                  ? localState.selectedTopics
                      .map(t => data.topics.find(p => p.id === t).name)
                      .join(', ')
                  : 'Select topics...'}
                <Icon size={12} icon="caret-down" marginLeft={4} />
              </Button>
            </SelectMenu>
            <IconButton
              icon="export"
              onClick={() =>
                exportToCsv(
                  filteredUnits.map(u => [u.id, u.name, u.level == null ? '-' : u.level.toString()])
                )
              }
            />
            <Checkbox
              marginTop={8}
              label="Show Hidden"
              checked={localState.showHidden}
              onChange={e => {
                localState.showHidden = !localState.showHidden;
              }}
            />
          </Pane>

          <Tablist>
            {filteredUnits.map((unit, index) => (
              <UnitListItem
                key={unit.id}
                unit={unit}
                unitId={unitId}
                topics={data.topics}
                selectedCourse={selectedCourse}
                view={view}
              />
            ))}

            {/* <Button
          onClick={action(() => {
            debugger;
            for (let u of localState.selection) {
              state.courseConfig.units.remove(state.courseConfig.units.find(f => f.id === u));
            }
            localState.selection = [];
          })}
        >
          Delete Selection
        </Button> */}

            <Dialog
              isShown={localState.isShown}
              title="Dialog title"
              onCloseComplete={() => (localState.isShown = false)}
              onConfirm={close => {
                if (data.units.some(u => u.id === localState.newUnitId)) {
                  alert('Unit Already exists');
                  return false;
                }

                createUnit({
                  variables: {
                    id: localState.newUnitId,
                    name: localState.newUnitName
                  }
                });

                close();
              }}
              confirmLabel="Add Unit"
            >
              <Pane display="flex" alignItems="flex-baseline">
                <TextInputField
                  label="Unit Code"
                  placeholder="Unit Id"
                  onChange={form.newUnitId}
                  marginRight={4}
                />
                <TextInputField
                  label="Unit Name"
                  placeholder="Unit Name"
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
                Add Unit
              </Button>
            </Pane>
          </Tablist>
        </Pane>
      </VerticalPane>
      <VerticalPane shrink={true}>
        {data.units.length === 0 && <Alert flex={1}>There are no units defined</Alert>}
        {unit && (
          <UnitDetailContainer key={unit.id} id={unit.id} state={state} readonly={readonly} />
        )}
      </VerticalPane>
    </>
  );
};

export const UnitsEditor = observer(UnitsEditorView);

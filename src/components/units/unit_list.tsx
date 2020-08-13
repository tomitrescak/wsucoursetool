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
  TextInput
} from 'evergreen-ui';
import { Unit, State } from '../types';
import { url, buildForm } from 'lib/helpers';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { VerticalPane } from 'components/common/vertical_pane';
import { useCourseListQuery, UnitList, useCreateUnitMutation } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { UnitDetailContainer } from './unit_details';

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
    filterCode: ''
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

  return (
    <>
      <VerticalPane title="Unit List">
        <Pane paddingRight={8}>
          <Pane marginBottom={8} paddingRight={22}>
            <Pane display="flex" width="100%" marginBottom={8}>
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

          <Tablist>
            {data.units
              .slice()
              .filter(f => {
                let isOk = true;
                if (selectedCourse) {
                  isOk =
                    selectedCourse.core.findIndex(c => c.id === f.id) >= 0 ||
                    (selectedMajor && selectedMajor.units.findIndex(u => u.id === f.id) >= 0);
                }
                if (localState.filterName) {
                  isOk = localState.filterName
                    .toLowerCase()
                    .split(' ')
                    .every(d => f.name.toLowerCase().indexOf(d) >= 0);
                }
                if (localState.filterCode) {
                  isOk = f.id.indexOf(localState.filterCode) >= 0;
                }

                return isOk;
              })
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((unit, index) => (
                <Link
                  key={unit.id}
                  href={`/${view}/[category]/[item]`}
                  as={`/${view}/units/${url(unit.name)}-${unit.id}`}
                >
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
                      <Badge size={300} marginRight={8}>
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

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
  Select
} from 'evergreen-ui';
import { State, Student, Entity, AcsKnowledge, Unit } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from 'components/common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { TextEditor } from 'components/common/text_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { model, Model, prop, modelAction, undoMiddleware } from 'mobx-keystone';
import { TestModel } from 'components/classes';
import { useSaveConfigMutation, useTopicsQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { useStudentListQuery } from 'config/graphql';
import { Expander } from 'components/common/expander';

@model('Editor/Students')
class StudentListModel extends Model({
  items: prop<TestModel[]>()
}) {
  // @modelAction
  // add(pre: Entity) {
  //   this.items.push(new EntityModel(pre));
  // }
  // @modelAction
  // remove(ix: number) {
  //   this.items.splice(ix, 1);
  // }
}

const Details: React.FC<{ item: Student; owner: StudentListModel }> = observer(
  ({ item, owner }) => {
    const { loading, error, data } = useStudentListQuery({});

    // const model = React.useMemo(() => {
    //   console.log('Creating Student!');
    //   if (data) {
    //     let model = new StudentListModel({
    //       items: data.students.map(t => new TestModel(t))
    //     });
    //     return model;
    //   }
    //   return null;
    // }, [data]);

    const form = React.useMemo(
      () =>
        buildForm(item, [
          'id',
          'firstName',
          'lastName',
          'details',
          'registeredUnits',
          'registeredBlocks'
        ]),
      [item]
    );

    if (loading || error) {
      return <ProgressView loading={loading} error={error} />;
    }

    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint3" borderRadius={6} marginLeft={24}>
          <Heading size={500} marginBottom={16}>
            {item.firstName + ' ' + item.lastName}
          </Heading>

          <TextInputField
            label="Student Id"
            placeholder="Student Id"
            value={item.id}
            onChange={form.id}
            marginBottom={8}
          />

          <TextInputField
            label="First Name"
            placeholder="First Name"
            value={item.firstName}
            onChange={form.firstName}
            marginBottom={8}
          />

          <TextInputField
            label="Last Name"
            placeholder="Last Name"
            value={item.lastName}
            onChange={form.lastName}
            marginBottom={8}
          />

          <TextEditor owner={item} field="details" label="Details (TEMP)" />
        </Pane>

        <br></br>

        <Heading>Registered Units</Heading>
        {item.registeredUnits.map((unit, i) => {
          return (
            <Expander title={item.registeredUnits[i].unitId} id="registeredUnitDetails">
              <Pane display="flex" marginBottom={8}>
                <TextInputField
                  label="Unit Id"
                  value={item.registeredUnits[i].unitId}
                  id="unitId"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Registration Date"
                  value={item.registeredUnits[i].registrationDate}
                  id="registrationDate"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
              </Pane>
              <Pane display="flex" marginBottom={8}>
                <TextInputField
                  label="Completion Date"
                  value={item.registeredUnits[i].results.date}
                  id="unitId"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Grade"
                  value={item.registeredUnits[i].results.grade}
                  id="grade"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Result"
                  value={item.registeredUnits[i].results.result}
                  id="result"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
              </Pane>
            </Expander>
          );
        })}
        <br></br>

        <Heading>Registered Blocks</Heading>
        {item.registeredBlocks.map((block, i) => {
          return (
            <Expander
              title={item.registeredBlocks[i].unitId + '(' + item.registeredBlocks[i].blockId + ')'}
              id="registeredUnitDetails"
            >
              <Pane display="flex" marginBottom={8}>
                <TextInputField
                  label="Block Id"
                  value={item.registeredBlocks[i].blockId}
                  id="blockId"
                  disabled={true}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  flex="1"
                  label="Unit Code"
                  id="unitId"
                  placeholder="Unit Code"
                  value={item.registeredBlocks[i].unitId}
                  margin={0}
                  marginRight={8}
                  disabled={true}
                />
              </Pane>
              <Pane display="flex" marginBottom={8}>
                <TextInputField
                  label="Completion Date"
                  value={item.registeredBlocks[i].results.date}
                  id="unitId"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Grade"
                  value={item.registeredBlocks[i].results.grade}
                  id="grade"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
                <TextInputField
                  label="Result"
                  value={item.registeredBlocks[i].results.result}
                  id="result"
                  disabled={false}
                  margin={0}
                  marginRight={8}
                />
              </Pane>
            </Expander>
          );
        })}
      </div>
    );
  }
);

const DetailsReadonly: React.FC<{ item: TestModel }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.id}
        </Heading>

        <TextField label="Description" html={marked(item.details)} />
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
      as={`/${view}/students/${url(student.firstName + '-' + student.firstName)}-${student.id}`}
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
    name: ''
  }));

  // // useCreateStudentMutation doesnt actually exist
  // const [createStudent] = useCreateStudentMutation({
  //   onCompleted() {
  //     toaster.notify('Student created. Config saved.');
  //   },
  //   onError(e) {
  //     toaster.danger('Error ;(: ' + e.message);
  //   }
  // });

  const { loading, error, data } = useStudentListQuery();

  const model = React.useMemo(() => {
    if (data) {
      let model = new StudentListModel({
        items: data.students.map(t => new TestModel(t))
      });
      // state.undoManager = undoMiddleware(model);
      // state.save = () => {
      //   const body = model.items.map(i => i.toJS());
      //   save({
      //     variables: {
      //       body,
      //       part: 'students'
      //     }
      //   });
      // };
      return model;
    }

    return null;
  }, [data]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem = selectedId ? model.items.find(b => b.id === selectedId) : null;
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <>
      <VerticalPane title="Student List">
        <Tablist flexBasis={200} width={200} marginRight={8}>
          <Tabs>
            {model.items
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
          <Button appearance="primary" iconBefore="plus" onClick={() => console.log('Add Student')}>
            Add Student
          </Button>
        </Pane>
      </VerticalPane>

      <VerticalPane title="Student" shrink={true}>
        {selectedItem &&
          (readonly ? (
            <DetailsReadonly item={selectedItem} />
          ) : (
            <Details item={selectedItem} owner={model} />
          ))}
      </VerticalPane>
    </>
  );
};

export const StudentList = observer(EditorView);

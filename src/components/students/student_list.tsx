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
  Dialog
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
import {
  useSaveConfigMutation,
  useTopicsQuery,
  useBlockQuery,
  RegisteredUnit,
  UnitList,
  RegisteredBlock
} from 'config/graphql';
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

type UnitDetailsParams = {
  units: Array<{ id: string; name: string }>;
  unit: RegisteredUnit;
};

const UnitResult = ({ units, unit }: UnitDetailsParams) => {
  return (
    <Expander title={unit.unitId} id="registeredUnitDetails">
      <Pane display="flex" marginBottom={8}>
        <TextInputField
          label="Unit Id"
          value={unit.unitId}
          id="unitId"
          disabled={true}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Registration Date"
          value={unit.registrationDate}
          id="registrationDate"
          disabled={true}
          margin={0}
          marginRight={8}
        />
        {units.find(u => u.id === unit.unitId)?.name}
      </Pane>
      <Pane display="flex" marginBottom={8}>
        <TextInputField
          label="Completion Date"
          value={unit.results.date}
          id="unitId"
          disabled={false}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Grade"
          value={unit.results.grade}
          id="grade"
          disabled={false}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Result"
          value={unit.results.result}
          id="result"
          disabled={false}
          margin={0}
          marginRight={8}
        />
      </Pane>
    </Expander>
  );
};

type BlockDetailsParams = {
  units: Array<{ id: string; name: string }>;
  block: RegisteredBlock;
};

const BlockResult = ({ units, block }: BlockDetailsParams) => {
  const { loading, error, data } = useBlockQuery({
    variables: {
      blockId: block.blockId,
      unitId: block.unitId
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }
  const unitName = units.find(u => u.id === block.unitId)?.name;

  return (
    <Expander title={block.unitId} id="registeredUnitDetails">
      <Pane display="flex" marginBottom={8}>
        <TextInputField
          label="Unit Id"
          value={block.unitId}
          id="unitId"
          disabled={true}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Registration Date"
          value={block.registrationDate}
          id="registrationDate"
          disabled={true}
          margin={0}
          marginRight={8}
        />
        {unitName}
        {data.block ? data.block.name : `Block ${unitName} > ${block.blockId} does not exists`}
      </Pane>
      <Pane display="flex" marginBottom={8}>
        <TextInputField
          label="Completion Date"
          value={block.results.date}
          id="unitId"
          disabled={false}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Grade"
          value={block.results.grade}
          id="grade"
          disabled={false}
          margin={0}
          marginRight={8}
        />
        <TextInputField
          label="Result"
          value={block.results.result}
          id="result"
          disabled={false}
          margin={0}
          marginRight={8}
        />
      </Pane>
    </Expander>
  );
};

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
          return <UnitResult key={i} units={data.units} unit={item.registeredUnits[i]} />;
        })}
        <br></br>

        <Heading>Registered Blocks</Heading>
        {item.registeredBlocks.map((block, i) => {
          return <BlockResult key={i} units={data.units} block={item.registeredBlocks[i]} />;
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
    name: '',
    isShown: false
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

  // omit reg date, completion date for now
  // unit ID, unit name, block name, grade, result, SEMESTER
  // group by semesters
  // GRADE - select box

  // add, delete student

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
          <Dialog
            isShown={localState.isShown}
            title="Add New Student"
            onCloseComplete={() => (localState.isShown = false)}
            onConfirm={close => {
              close();
            }}
            confirmLabel="Add Student"
          >
            <Pane display="flex" alignItems="flex-baseline">
              <TextInputField
                label="Student Id"
                placeholder="Student Id"
                //onChange={form.newStudentName}
                marginRight={4}
                flex={1}
              />
            </Pane>
            <Pane display="flex" alignItems="flex-baseline">
              <TextInputField
                label="First Name"
                placeholder="First Name"
                //onChange={form.newStudentId}
                marginRight={4}
              />
              <TextInputField
                label="Last Name"
                placeholder="Last Name"
                //onChange={form.newStudentName}
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
            <Details item={selectedItem} owner={model} />
          ))}
      </VerticalPane>
    </>
  );
};

export const StudentList = observer(EditorView);

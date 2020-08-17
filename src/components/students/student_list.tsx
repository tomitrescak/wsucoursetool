// import React from 'react';1
// import { useStudentListQuery } from 'config/graphql';
// import { ProgressView } from 'components/common/progress_view';
// import { VerticalPane } from 'components/common/vertical_pane';

// import { State, Specialisation, Entity } from '../types';
// import { buildForm, findMaxId, url } from 'lib/helpers';

// import {
//   TextInputField,
//   Pane,
//   Tablist,
//   SidebarTab,
//   Alert,
//   Heading,
//   Dialog,
//   Button,
//   SelectField,
//   Text,
//   Badge,
//   Checkbox,
//   TextInput,
//   IconButton,
//   toaster,
//   Tab,
//   Link
// } from 'evergreen-ui';

// import { SideTab, Tabs } from 'components/common/tab';
// import { renderToStringWithData } from '@apollo/react-ssr';

// export const StudentList = () => {
//   // see an example in tag_editors.tsx
//   const { loading, error, data } = useStudentListQuery();
//   if (loading || error) {
//     return <ProgressView loading={loading} error={error} />;
//   }

//   interface state {
//     isOpen: boolean;
//   }

//   function showDetails(id, name) {
//     // testing: accessing and printing data
//     console.log('Student Id: ' + id);
//     console.log('Student Name: ' + name);
//   }

//   // now work with data
//   return (
//     <div>
//       <Tablist flexBasis={200} width={200} marginRight={8}>
//         <VerticalPane title="Student List">
//           {/* <ul>
//             {data.students.map(student => (
//               <li key={student.id}>
//                 {student.name} [{student.id}]
//               </li>
//             ))}
//           </ul> */}

//           <Tabs>
//             {data.students.map(student => (
//               <Link
//                 onClick={() => { showDetails(student.id, student.name) }}
//                 key={student.id}
//                 //href={`/${view}/[category]/[item]`}
//                 //as={`/${view}/specialisations/${url(student.name)}-${student.id}`}
//               >
//                 <a>
//                   <SideTab
//                     key={student.id}
//                     id={student.id}
//                     //isSelected={selectedItem && student.id === selectedItem.id}
//                     aria-controls={`panel-${student.name}`}
//                   >
//                     {student.name}
//                   </SideTab>
//                 </a>
//               </Link>
//             ))}
//           </Tabs>

//           <Pane
//             display="flex"
//             alignItems="center"
//             marginTop={16}
//             paddingTop={8}
//             borderTop="dotted 1px #dedede"
//           >
//             <Button appearance="primary" iconBefore="plus" /* onClick={() => addStudent() } */>
//               Add Student
//             </Button>
//           </Pane>
//         </VerticalPane>
//       </Tablist>
//     </div>
//   );
// };

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
import { State, Student, Entity, AcsKnowledge } from '../types';
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

type KeywordProps = {
  item: Student;
};

// updates on the page for now until refresh
// since its just reading from the json file
const Details: React.FC<{ item: Student; owner: StudentListModel }> = observer(
  ({ item, owner }) => {
    const form = React.useMemo(() => buildForm(item, ['id', 'fname', 'lname', 'details']), [item]);

    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint3" borderRadius={6} marginLeft={24}>
          <Heading size={500} marginBottom={16}>
            {item.fname + ' ' + item.lname}
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
            value={item.fname}
            onChange={form.fname}
            marginBottom={8}
          />

          <TextInputField
            label="Last Name"
            placeholder="Last Name"
            value={item.lname}
            onChange={form.lname}
            marginBottom={8}
          />

          <TextEditor owner={item} field="details" label="Details (TEMP)" />

          {/* <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              owner.remove(owner.items.findIndex(p => p === item));
            }
          }}
        >
          Delete
        </Button> */}
        </Pane>

        <br></br>
        <Heading>Registed Units/Blocks</Heading>
        <Pane display="flex" marginBottom={8}>
          {/* <IconButton
            marginTop={-4}
            flex="0 0 40px"
            icon="trash"
            intent="danger"
            appearance="primary"
            marginRight={16}
            // onClick={() => {
            //   job.removeSkill(i);
            // }}
          /> */}
          <Text display="block" flex="1">
            Example Unit
            {/* {acs && acs.name} */}
          </Text>

          <Select
            marginLeft={8}
            marginRight={8}
            flex="0 0 140px"
            //value={localState.rating ? localState.rating.toString() : ''}
            //onChange={e => (localState.rating = parseInt(e.currentTarget.value))}
          >
            <option value="">Not Completed</option>
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
          </Select>

          {/* <Text display="block" flex="1">
                {sfia.name}
              </Text> */}
        </Pane>

        <br></br>
        <Heading>Completed Units</Heading>
        <Pane>
          <Pane display="flex" marginBottom={8} alignItems="flex-end">
            <TextInputField
              label="Unit Code"
              value="(example) 123456"
              //value={unit.id}
              id="unitCode"
              onChange={form.id}
              disabled={true}
              margin={0}
              marginRight={8}
            />
            <TextInputField
              flex="1"
              label="Unit Name"
              id="unitName"
              placeholder="Unit Name"
              value="(example) Some Unit"
              //value={unit.name}
              margin={0}
              marginRight={8}
              //onChange={form.name}
              disabled={true}
            />
            <TextInputField
              label="Result"
              flex="0 0 50px"
              value="75"
              //value={unit.level}
              id="result"
              disabled={false}
              margin={0}
              marginRight={8}
              //onChange={form.result}
            />
          </Pane>
        </Pane>
      </div>
    );
  }
);

const DetailsReadonly: React.FC<{ item: Student }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.fname + ' ' + item.lname}
        </Heading>

        <TextField label="Details" html={marked(item.details)} />
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  readonly: boolean;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

const ListItem = observer(({ view, student, selectedItem }) => {
  return (
    <Link
      key={student.id}
      href={`/${view}/[category]/[item]`}
      as={`/${view}/students/${url(student.fname + '-' + student.lname)}-${student.id}`}
    >
      <a>
        <SideTab
          key={student.id}
          id={student.id}
          isSelected={selectedItem && student.id === selectedItem.id}
          aria-controls={`panel-${student.fname /* + ' ' + student.lname */}`}
        >
          {student.fname + ' ' + student.lname}
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

  // const { loading, error, data, refetch } = useStudentListQuery();
  // const [save] = useSaveConfigMutation({
  //   onCompleted() {
  //     toaster.notify('Saved');
  //     refetch();
  //   },
  //   onError() {
  //     toaster.danger('Error ;(');
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

    // changed

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
              .sort((a, b) => a.fname.localeCompare(b.fname))
              .map(student => (
                <ListItem student={student} view={view} selectedItem={selectedItem} />
              ))}
          </Tabs>

          {/* {!readonly && (
            <Pane marginTop={16} display="flex" alignItems="center">
              <TextInputField
                flex={1}
                label="Name"
                value={localState.name}
                placeholder="Please specify name ..."
                onChange={form.name}
                marginRight={4}
              />
              <IconButton
                appearance="primary"
                intent="success"
                icon="plus"
                onClick={() => {
                  model.add({
                    id: findMaxId(model.items),
                    name: localState.name,
                    details: ''
                  });
                }}
              />
            </Pane>
          )} */}
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

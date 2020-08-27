// import React from 'react';123
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
  Select,
  Combobox
} from 'evergreen-ui';
import { State, Student, Unit } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from 'components/common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { TextEditor } from 'components/common/text_editor';
import { VerticalPane } from 'components/common/vertical_pane';
import { model, Model, prop, modelAction, undoMiddleware } from 'mobx-keystone';
import { StudentModel } from 'components/classes';
import { useSaveConfigMutation, useTopicsQuery, StudentListQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { useStudentListQuery, useUnitsQuery, UnitList, useCreateUnitMutation } from 'config/graphql';
import { Expander } from 'components/common/expander';


@model('Editor/Students')
class StudentListModel extends Model({
  items: prop<StudentModel[]>()
})
{
  @modelAction
  add(pre: Student) {
    this.items.push(new StudentModel(pre));
  }
}
 
{
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

/*const localState = useLocalStore(() => ({
  newUnitName: '',
  newUnitId: '',
  isShown: false,
  selection: []
}) */

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}
//const { loading, error, data } = useUnitsQuery();



const ListItem = observer(({ view, student, selectedItem }) => {
  return (
    <Link
      key={student.studentID}
      href={`/${view}/[category]/[item]`}
      as={`/${view}/students/${url(student.fname + '-' + student.lname)}-${student.studentID}`}
    >
      <a>
        <SideTab
          key={student.studentID}
          id={student.studentID}
          isSelected={selectedItem && student.studentID === selectedItem.studentID}
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
  const selectedName = split ? split[split.length - 1] : null;
  //const selectedCode = split ? split[split.length - 1] : null;
  const localState = useLocalStore(() => ({
    name: '',
    registeredName: '',
    registeredUnit: '',
    registeredID: ''
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
  /*const [createUnitMutation, { data, loading, error }] = useCreateUnitMutation({
    variables: {
       id: unit.id,  // value for 'id'
       name: unit.name // value for 'name'
    },
  }); */
  const { loading, error, data } = useStudentListQuery();

  const model = React.useMemo(() => {
    if (data) {
      let model = new StudentListModel({
        items: data.students.map(t => new StudentModel(t))
      });
      return model;
    }
    return null;
  }, [data]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem = selectedId ? model.items.find(b => b.studentID === selectedId) : null;
  const selected = selectedName ? model.items.find(a => a.name == selectedName) : null;

  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';
  const units = data.units;

 
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
            <Details item={selectedItem} owner={model} /*unit={data.units}*/ />
          ))}
      </VerticalPane>

    </>
  );
};
// updates on the page for now until refresh
// since its just reading from the json file
const Details: React.FC<{ 
  item: Student; 
  owner: StudentListModel; 
  unit: Unit[];
}> = observer(({ unit, owner, item }) => { //added id: '' remove if no gud
    const localState = useLocalStore(() => ({  
    name: '',
    registeredName: '',
    registeredUnit: '',
    registeredID: ''
  }));
    const form = React.useMemo(() => buildForm(item,  ['studentID', 'fname', 'lname', 'details', 'id', 'name']), [item]);
    const router = useRouter();
    const unitItem = router.query.item as string;
    const mainSplit = unitItem ? unitItem.split('--') : null;
    const split = mainSplit ? mainSplit[0].split('-') : null;
    const selectedId = split ? split[split.length - 1] : null;
    const selectedName = split ? split[split.length - 1] : null;
   
   const { loading, error, data } = useStudentListQuery();

   const model = React.useMemo(() => {
     if (data) {
       let model = new StudentListModel({
         items: data.units.map(t => new StudentModel(t))
       });
       return model;
     }
     return null;
   }, [data]);
 
   if (loading || error) {
     return <ProgressView loading={loading} error={error} />;
   }
   //const items = unit.map(m => m.id).flat();
   const units = data.units;
   const selectedItem = selectedId ? model.items.find(b => b.studentID === selectedId) : null;
  const selected = selectedName ? model.items.find(a => a.name == selectedName) : null;
    return (
      <div style={{ flex: 1 }}>
        <Pane background="tint3" borderRadius={6} marginLeft={24}>
          <Heading size={500} marginBottom={16}>
            {item.fname + ' ' + item.lname}
            {item.id + '' + item.name}
          </Heading>

          <TextInputField
            label="Student ID"
            placeholder="Student ID"
            value={item.studentID}
            onChange={form.studentID}
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

        <Expander title="Registered Units/Blocks" id="unitCompletionCriteria">
        <Pane display="flex" marginBottom={8}>
          <Text display="block" flex="1">
          <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Unit Code</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Unit Name</Heading>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Heading size={400}>Status</Heading>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
           <tr>
             <td>
               {localState.registeredID}
             </td>
              <td>
                {localState.registeredUnit}
              </td>
              <td>
              <Select
            marginLeft={8}
            marginRight={8}
            flex="0 0 140px"
          >
            <option value="">Not Completed</option>
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
          </Select>
              </td>
           </tr>
          </tbody>
          </table>
          </Text>
        </Pane>  
            </Expander>

            <Expander title="Add Units" id="unitCompletionCriteria">
        <Pane display="flex" marginBottom={8}>
        <Pane display="flex" marginBottom={8} alignItems="flex-end">
        <Combobox
        label="Unit Code"
          id="mapping"
          flex="1"
          marginRight={8}
          data={units[0].id}
          defaultValue={e => { if (selected.name = localState.registeredUnit) {
            localState.registeredID = selected.id
          }}
        }
          items={units}
          itemToString={item => (item ? item.id : '')}
          selectedItem={selected}
          onChange={
           
            selected => (localState.registeredID = selected.id) } 
        />
        <Combobox 
          //label="Unit Name"
          id="mapping"
          flex="1"
          marginRight={8}
          initialSelectedItem={{ label: 'Unit Name' }}
          data={units[0].name}
          defaultValue={"Unit Name"}
          items={units}
          itemToString={item => (item ? item.name : '')}
          selectedItem={selected}
          onChange={
            selected => (localState.registeredUnit = selected.name)} 
        />
        <Button
          //intent="danger"
          iconBefore="plus"
          appearance="primary"
          marginTop={8}
          onClick={() => {
           // if (confirm('Are You Sure?')) {
           () => localState.registeredUnit = localState.registeredName
          }} 
        >
          Add
        </Button>
        </Pane>  
        </Pane>
            </Expander>

            <Expander title="Completed Units" id="unitCompletionCriteria">
        <Pane display="flex" marginBottom={8}>
        <Pane display="flex" marginBottom={8} alignItems="flex-end">
            <TextInputField
              label="Unit Code"
              //value={"(example) 123456"}
              //value={units[0].id} // thisssssssssss here 2 am <------------------------------
              id="unitCode"
              //onChange={unit[0].id}
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
            </Expander>
        <br></br>
      </div>
    );
  }
  );


export const StudentList = observer(EditorView);

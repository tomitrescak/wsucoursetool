import React from 'react';
import { CompletionCriteria, State } from '../types';
import { observer, useLocalStore } from 'mobx-react';
import {
  Pane,
  Heading,
  Combobox,
  TextInput,
  Select,
  IconButton,
  Text,
  Badge,
  Icon,
  Table
} from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { CompletionCriteriaModel } from 'components/classes';

type Item = { id: string; name: string };

type Props = {
  block: CompletionCriteriaModel;
  items?: Item[];
};

type ItemEditorProps = {
  completionCriteria: CompletionCriteriaModel;
  items?: Item[];
};

const ItemEditor = observer(({ items, completionCriteria }: ItemEditorProps) => {
  return (
    <Combobox
      flex="1"
      width="100%"
      id="block"
      items={items}
      selectedItem={completionCriteria.id ? items.find(b => b.id === completionCriteria.id) : null}
      itemToString={item => (item ? item.name : '')}
      onChange={selected => (completionCriteria.id = selected.id)}
    />
  );
});

type SiProps = {
  completionCriteria: CompletionCriteria;
};
const MarkEditor = observer(({ completionCriteria }: SiProps) => {
  return (
    <Pane display="flex" alignItems="center">
      <TextInput
        type="number"
        width="100%"
        minWidth={65}
        placeholder={'Mark'}
        onChange={e => (completionCriteria.minimumValue = parseFloat(e.currentTarget.value))}
        value={completionCriteria.minimumValue}
      />
      <Text marginLeft={4} marginRight={8}>
        {' '}
        %
      </Text>
    </Pane>
  );
});
const AttendanceEditor = observer(({ completionCriteria }: SiProps) => {
  return (
    <Pane display="flex" alignItems="center">
      <TextInput
        type="number"
        width="100%"
        placeholder={'Attendance'}
        onChange={e => (completionCriteria.minimumCount = parseFloat(e.currentTarget.value))}
        value={completionCriteria.minimumCount}
      />
      <Text marginLeft={4} marginRight={8}>
        {' '}
        %
      </Text>
    </Pane>
  );
});
const WeightEditor = observer(({ completionCriteria }: SiProps) => {
  return (
    <Pane display="flex" alignItems="center">
      <TextInput
        type="number"
        width="100%"
        placeholder={'Weight'}
        onChange={e => (completionCriteria.weight = parseFloat(e.currentTarget.value))}
        value={completionCriteria.weight}
      />
      <Text marginLeft={4} marginRight={8}>
        {' '}
        %
      </Text>
    </Pane>
  );
});

const CreditEditor = observer(({ completionCriteria }: SiProps) => {
  return (
    <TextInput
      type="number"
      width="100%"
      placeholder={'Credit'}
      onChange={e => (completionCriteria.credit = parseFloat(e.currentTarget.value))}
      value={completionCriteria.credit}
    />
  );
});

const TypeEditor = observer(({ completionCriteria }: SiProps) => (
  <Select
    value={completionCriteria.type}
    width="100%"
    onChange={e => (completionCriteria.type = e.currentTarget.value as any)}
  >
    <option value="">Simple</option>
    <option value="allOf">All Of</option>
    {/*<option value="someOf">Some Of</option>
     <option value="anyOf">Any Of</option>
    <option value="oneOfOf">One Of</option> */}
  </Select>
));

type EditorProps = {
  items: Item[];
  completionCriteria: CompletionCriteriaModel;
  sub?: boolean;
};

const SimpleEditor = observer(({ items, completionCriteria }: EditorProps) => {
  return (
    <Pane display="flex" alignItems="center">
      <Pane flex={1}>
        <Heading size={300} marginBottom={4}>
          Activity
        </Heading>
        <ItemEditor items={items} completionCriteria={completionCriteria} />
      </Pane>
      <Pane marginLeft={8} flex="0 0 80px">
        <Heading size={300} marginBottom={4}>
          Mark
        </Heading>
        <MarkEditor completionCriteria={completionCriteria} />
      </Pane>
      <Pane marginLeft={8} flex="0 0 60px">
        <Heading size={300} marginBottom={4}>
          Credit
        </Heading>
        <CreditEditor completionCriteria={completionCriteria} />
      </Pane>

      <Pane marginLeft={8} flex="0 0 100px">
        <Heading size={300} marginBottom={4}>
          Type
        </Heading>
        <TypeEditor completionCriteria={completionCriteria} />
      </Pane>
    </Pane>
  );
});

const AllOfEditor = observer(({ items, completionCriteria, sub }: EditorProps) => {
  return (
    <Pane>
      {completionCriteria.criteria && completionCriteria.criteria.length > 0 && (
        <table
          style={{
            marginBottom: '8px',

            width: '100%'
          }}
        >
          <thead>
            <tr>
              {!sub && (
                <th style={{ minWidth: '80px', textAlign: 'left' }}>
                  <Heading size={300} marginBottom={4}>
                    Weight
                  </Heading>
                </th>
              )}
              <th style={{ textAlign: 'left', width: '100%' }}>
                <Heading size={300} marginBottom={4}>
                  Item
                </Heading>
              </th>
              <th style={{ textAlign: 'left', width: '100%' }}>
                <Heading size={300} marginBottom={4}>
                  Mark
                </Heading>
              </th>
              {!sub && <th style={{ minWidth: '80px', textAlign: 'left' }}></th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(completionCriteria.criteria || []).map((c, i) => (
              <tr key={i}>
                {!sub && (
                  <td
                    style={
                      sub
                        ? {}
                        : {
                            borderBottom: 'dashed 1px #cdcdcd',
                            paddingBottom: '4px',
                            paddingTop: '4px'
                          }
                    }
                  >
                    <WeightEditor completionCriteria={c} />
                  </td>
                )}
                <td
                  style={
                    sub
                      ? {}
                      : {
                          borderBottom: 'dashed 1px #cdcdcd',
                          paddingBottom: '4px',
                          paddingTop: '4px'
                        }
                  }
                >
                  {c.type === 'allOf' ? (
                    <AllOfEditor completionCriteria={c} items={items} sub={true} />
                  ) : (
                    <ItemEditor items={items} completionCriteria={c} />
                  )}
                </td>
                <td
                  style={
                    sub
                      ? {}
                      : {
                          borderBottom: 'dashed 1px #cdcdcd',
                          paddingBottom: '4px',
                          paddingTop: '4px'
                        }
                  }
                >
                  <MarkEditor completionCriteria={c} />
                </td>
                {!sub && (
                  <td
                    style={
                      sub
                        ? {}
                        : {
                            borderBottom: 'dashed 1px #cdcdcd',
                            paddingBottom: '4px',
                            paddingTop: '4px'
                          }
                    }
                  >
                    <TypeEditor completionCriteria={c} />
                  </td>
                )}
                <td
                  style={
                    sub
                      ? {}
                      : {
                          borderBottom: 'dashed 1px #cdcdcd',
                          paddingBottom: '4px',
                          paddingTop: '4px'
                        }
                  }
                >
                  <IconButton
                    appearance="primary"
                    icon="trash"
                    intent="danger"
                    onClick={() => completionCriteria.removeCompletionCriteria(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(!completionCriteria.criteria || completionCriteria.criteria.length == 0) && (
        <Pane marginTop={8} marginBottom={8}>
          <Text size={300}>No Items ...</Text>
        </Pane>
      )}

      <Pane display="flex" alignItems="flex-end">
        <Pane flex={1}>
          <Heading size={300} marginBottom={4}>
            Attendance
          </Heading>
          <AttendanceEditor completionCriteria={completionCriteria} />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          <Heading size={300} marginBottom={4}>
            Mark
          </Heading>
          <MarkEditor completionCriteria={completionCriteria} />
        </Pane>
        {!sub && (
          <Pane flex={1} marginLeft={8}>
            <Heading size={300} marginBottom={4}>
              Credit
            </Heading>
            <CreditEditor completionCriteria={completionCriteria} />
          </Pane>
        )}

        {!sub && (
          <Pane flex={1} marginLeft={8}>
            <Heading size={300} marginBottom={4}>
              Type
            </Heading>
            <TypeEditor completionCriteria={completionCriteria} />
          </Pane>
        )}

        <IconButton
          marginLeft={8}
          icon="plus"
          appearance="primary"
          intent="success"
          onClick={() => {
            completionCriteria.addCompletionCriteria({});
          }}
        />
      </Pane>
    </Pane>
  );
});

export const TopicBlockEditor: React.FC<Props> = observer(
  ({ block: completionCriteria, items }) => {
    if (completionCriteria.type === '' || completionCriteria.type === 'simple') {
      return <SimpleEditor completionCriteria={completionCriteria} items={items} />;
    }
    if (completionCriteria.type === 'allOf') {
      return <AllOfEditor completionCriteria={completionCriteria} items={items} />;
    }
    return (
      <Pane marginTop={4}>
        <SimpleEditor completionCriteria={completionCriteria} items={items} />
        {/* {completionCriteria.allOf && (
          <SingleEditor blocks={completionCriteria.allOf} state={state} title="All Of" unitId={unitId} />
        )}
        {completionCriteria.someOf && (
          <SingleEditor blocks={completionCriteria.someOf} state={state} title="Some Of" unitId={unitId} />
        )}
        {completionCriteria.anyOf && (
          <SingleEditor blocks={completionCriteria.anyOf} state={state} title="Any Of" unitId={unitId} />
        )}
        {completionCriteria.oneOf && (
          <SingleEditor blocks={completionCriteria.oneOf} state={state} title="One Of" unitId={unitId} />
        )} */}

        {/* <Pane display="flex" alignItems="center">
          <Combobox
            flex="1"
            width="100%"
            id="block"
            items={items}
            selectedItem={
              completionCriteria.id
                ? state.courseConfig.blocks.find(b => b.id === completionCriteria.id)
                : null
            }
            itemToString={item => (item ? item.name : '')}
            onChange={selected => (completionCriteria.id = selected.id)}
          />
          <TextInput
            marginLeft={8}
            type="number"
            width={50}
            placeholder={'Mark'}
            onChange={form.minimumValue}
            value={completionCriteria.minimumValue}
          />
          <Text marginLeft={4} marginRight={8}>
            {' '}
            %
          </Text>
          <TextInput
            marginLeft={8}
            type="number"
            width={50}
            placeholder={'Att.'}
            onChange={form.minimumCount}
            value={completionCriteria.minimumCount}
          />
          <Text marginLeft={4} marginRight={8}>
            {' '}
            %
          </Text>
          <TextInput
            marginLeft={8}
            type="number"
            width={50}
            placeholder={'Weight'}
            onChange={form.weight}
            value={completionCriteria.weight}
          />
          <Text marginLeft={4} marginRight={8}>
            {' '}
            %
          </Text>
          <TextInput
            marginLeft={8}
            type="number"
            width={50}
            placeholder={'Credits'}
            onChange={form.credit}
            value={completionCriteria.credit}
          />
          <Text marginLeft={4} marginRight={8}>
            {' '}
            Credit
          </Text>

          <IconButton
            flex="0 0 30px"
            icon="plus"
            marginLeft={8}
            intent="success"
            appearance="primary"
            onClick={() => {
              if (localState.type === 'allOf') {
                if (completionCriteria.allOf == null) {
                  completionCriteria.allOf = [];
                }
                completionCriteria.allOf.push({});
              } else if (localState.type === 'anyOf') {
                if (completionCriteria.anyOf == null) {
                  completionCriteria.anyOf = [];
                }
                completionCriteria.anyOf.push({});
              } else if (localState.type === 'someOf') {
                if (completionCriteria.someOf == null) {
                  completionCriteria.someOf = [];
                }
                completionCriteria.someOf.push({});
              } else if (localState.type === 'oneOf') {
                if (completionCriteria.oneOf == null) {
                  completionCriteria.oneOf = [];
                }
                completionCriteria.oneOf.push({});
              }
            }}
          />
          {deleteItem && (
            <IconButton
              flex="0 0 30px"
              marginLeft={8}
              width={30}
              intent="danger"
              appearance="primary"
              icon="trash"
              onClick={deleteItem}
            />
          )} 
        </Pane>*/}
      </Pane>
    );
  }
);

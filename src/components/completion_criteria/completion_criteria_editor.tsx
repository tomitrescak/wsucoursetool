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
  readonly?: boolean;
};

type ItemEditorProps = {
  completionCriteria: CompletionCriteriaModel;
  items?: Item[];
  readonly: boolean;
};

const ItemEditor = observer(({ items, completionCriteria, readonly }: ItemEditorProps) => {
  if (readonly) {
    return (
      <Text>
        {completionCriteria.id ? items.find(b => b.id === completionCriteria.id)?.name : null}
      </Text>
    );
  }
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
  readonly: boolean;
};
const MarkEditor = observer(({ completionCriteria, readonly }: SiProps) => {
  if (readonly) {
    return <Text>{completionCriteria.minimumValue || '--'} %</Text>;
  }
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
const AttendanceEditor = observer(({ completionCriteria, readonly }: SiProps) => {
  if (readonly) {
    return <Text>{completionCriteria.minimumCount || '--'} %</Text>;
  }
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
const WeightEditor = observer(({ completionCriteria, readonly }: SiProps) => {
  if (readonly) {
    return (
      <Pane display="flex" alignItems="center">
        <Text marginLeft={4} marginRight={8}>
          {completionCriteria.weight} %
        </Text>
      </Pane>
    );
  }
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

const CreditEditor = observer(({ completionCriteria, readonly }: SiProps) => {
  if (readonly) {
    return <Text>{completionCriteria.credit || '--'} %</Text>;
  }
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
  readonly: boolean;
};

const SimpleEditor = observer(({ items, completionCriteria, readonly }: EditorProps) => {
  return (
    <Pane display="flex" alignItems="center">
      <Pane flex={1}>
        <Heading size={300} marginBottom={4}>
          Activity
        </Heading>
        <ItemEditor items={items} completionCriteria={completionCriteria} readonly={readonly} />
      </Pane>
      <Pane marginLeft={8} flex="0 0 80px">
        <Heading size={300} marginBottom={4}>
          Mark
        </Heading>
        <MarkEditor completionCriteria={completionCriteria} readonly={readonly} />
      </Pane>
      <Pane marginLeft={8} flex="0 0 60px">
        <Heading size={300} marginBottom={4}>
          Credit
        </Heading>
        <CreditEditor completionCriteria={completionCriteria} readonly={readonly} />
      </Pane>

      {!readonly && (
        <Pane marginLeft={8} flex="0 0 100px">
          <Heading size={300} marginBottom={4}>
            Type
          </Heading>
          <TypeEditor completionCriteria={completionCriteria} readonly={readonly} />
        </Pane>
      )}
    </Pane>
  );
});

const AllOfEditor = observer(({ items, completionCriteria, sub, readonly }: EditorProps) => {
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
              {!readonly && (
                <>
                  {!sub && <th style={{ minWidth: '80px', textAlign: 'left' }}></th>}
                  <th></th>
                </>
              )}
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
                    {<WeightEditor completionCriteria={c} readonly={readonly} />}
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
                    <AllOfEditor
                      completionCriteria={c}
                      items={items}
                      sub={true}
                      readonly={readonly}
                    />
                  ) : (
                    <ItemEditor items={items} completionCriteria={c} readonly={readonly} />
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
                  <MarkEditor completionCriteria={c} readonly={readonly} />
                </td>
                {!readonly && (
                  <>
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
                        <TypeEditor completionCriteria={c} readonly={readonly} />
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
                  </>
                )}
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
          <AttendanceEditor completionCriteria={completionCriteria} readonly={readonly} />
        </Pane>
        <Pane flex={1} marginLeft={8}>
          <Heading size={300} marginBottom={4}>
            Mark
          </Heading>
          <MarkEditor completionCriteria={completionCriteria} readonly={readonly} />
        </Pane>
        {!sub && (
          <Pane flex={1} marginLeft={8}>
            <Heading size={300} marginBottom={4}>
              Credit
            </Heading>
            <CreditEditor completionCriteria={completionCriteria} readonly={readonly} />
          </Pane>
        )}

        {!sub && !readonly && (
          <Pane flex={1} marginLeft={8}>
            <Heading size={300} marginBottom={4}>
              Type
            </Heading>
            <TypeEditor completionCriteria={completionCriteria} readonly={readonly} />
          </Pane>
        )}

        {!readonly && (
          <IconButton
            marginLeft={8}
            icon="plus"
            appearance="primary"
            intent="success"
            onClick={() => {
              completionCriteria.addCompletionCriteria({});
            }}
          />
        )}
      </Pane>
    </Pane>
  );
});

export const TopicBlockEditor: React.FC<Props> = observer(
  ({ block: completionCriteria, items, readonly }) => {
    if (completionCriteria.type === '' || completionCriteria.type === 'simple') {
      return (
        <SimpleEditor completionCriteria={completionCriteria} items={items} readonly={readonly} />
      );
    }
    if (completionCriteria.type === 'allOf') {
      return (
        <AllOfEditor completionCriteria={completionCriteria} items={items} readonly={readonly} />
      );
    }
    return (
      <Pane marginTop={4}>
        <SimpleEditor completionCriteria={completionCriteria} items={items} readonly={readonly} />
      </Pane>
    );
  }
);

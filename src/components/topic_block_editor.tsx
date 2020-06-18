import React from 'react';
import { CompletionCriteria, State } from './types';
import { observer, useLocalStore } from 'mobx-react';
import { Pane, Heading, Combobox, TextInput, Select, IconButton, Text, Badge } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';

type Props = {
  block: CompletionCriteria;
  state: State;
  deleteItem?: Function;
  unitId?: string;
};

const SingleEditor: React.FC<{
  blocks: CompletionCriteria[];
  title: string;
  state: State;
  unitId?: string;
}> = observer(({ blocks, title, state, unitId }) => {
  return (
    <Pane marginBottom={8}>
      <Heading size={400} marginBottom={8}>
        {title}{' '}
        <Badge
          onClick={() => {
            blocks.push(
              ...state.courseConfig.blocks
                .filter(b => b.mappedUnitId === unitId)
                .filter(u => u.type === 'practical')
                .map(b => ({
                  id: b.id
                }))
            );
          }}
        >
          Import Practicals
        </Badge>
      </Heading>
      <Pane marginLeft={16}>
        {blocks.map((b, i) => (
          <TopicBlockEditor
            key={i}
            block={b}
            state={state}
            deleteItem={() => blocks.splice(i, 1)}
            unitId={unitId}
          />
        ))}
      </Pane>
    </Pane>
  );
});

export const TopicBlockEditor: React.FC<Props> = observer(
  ({ block, unitId, state, deleteItem }) => {
    const form = buildForm(block, ['minimumCount', 'minimumValue', 'credit', 'weight']);
    const localState = useLocalStore(() => ({ type: '' }));
    return (
      <Pane marginTop={4}>
        {block.allOf && (
          <SingleEditor blocks={block.allOf} state={state} title="All Of" unitId={unitId} />
        )}
        {block.someOf && (
          <SingleEditor blocks={block.someOf} state={state} title="Some Of" unitId={unitId} />
        )}
        {block.anyOf && (
          <SingleEditor blocks={block.anyOf} state={state} title="Any Of" unitId={unitId} />
        )}
        {block.oneOf && (
          <SingleEditor blocks={block.oneOf} state={state} title="One Of" unitId={unitId} />
        )}

        <Pane display="flex" alignItems="center">
          <Combobox
            flex="1"
            width="100%"
            id="block"
            items={
              unitId
                ? state.courseConfig.blocks.filter(b => b.mappedUnitId === unitId)
                : state.courseConfig.blocks
            }
            selectedItem={block.id ? state.courseConfig.blocks.find(b => b.id === block.id) : null}
            itemToString={item => (item ? item.name : '')}
            onChange={selected => (block.id = selected.id)}
          />
          <TextInput
            marginLeft={8}
            type="number"
            width={50}
            placeholder={'Mark'}
            onChange={form.minimumValue}
            value={block.minimumValue}
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
            value={block.minimumCount}
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
            value={block.weight}
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
            value={block.credit}
          />
          <Text marginLeft={4} marginRight={8}>
            {' '}
            Credit
          </Text>
          <Select
            value={localState.type}
            onChange={e => (localState.type = e.currentTarget.value)}
            marginLeft={8}
            flex="0 0 80px"
          >
            <option value="">Select ...</option>
            <option value="allOf">All Of</option>
            <option value="someOf">Some Of</option>
            <option value="anyOf">Any Of</option>
            <option value="oneOfOf">One Of</option>
          </Select>
          <IconButton
            flex="0 0 30px"
            icon="plus"
            marginLeft={8}
            intent="success"
            appearance="primary"
            onClick={() => {
              if (localState.type === 'allOf') {
                if (block.allOf == null) {
                  block.allOf = [];
                }
                block.allOf.push({});
              } else if (localState.type === 'anyOf') {
                if (block.anyOf == null) {
                  block.anyOf = [];
                }
                block.anyOf.push({});
              } else if (localState.type === 'someOf') {
                if (block.someOf == null) {
                  block.someOf = [];
                }
                block.someOf.push({});
              } else if (localState.type === 'oneOf') {
                if (block.oneOf == null) {
                  block.oneOf = [];
                }
                block.oneOf.push({});
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
        </Pane>
      </Pane>
    );
  }
);

import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Alert,
  Heading,
  Button,
  Textarea,
  Badge,
  IconButton,
  Text,
  Combobox,
  toaster,
  TextInput,
  Checkbox
} from 'evergreen-ui';
import { State, Job, SfiaSkill, AcsKnowledge } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from '../common/tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { Model, prop, modelAction, model, undoMiddleware } from 'mobx-keystone';
import { SfiaSkillModel, createSfias } from 'components/classes';
import { useSfiaQuery, useSaveConfigMutation, useSfiaUnitsQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { toJS } from 'mobx';
import { VerticalPane } from 'components/common/vertical_pane';

const sfiaCategories = [
  {
    id: '0',
    name: 'Strategy and Architecture',
    subcategories: [
      { id: '0-0', name: 'Information Strategy' },
      { id: '0-1', name: 'Advice and Guidance' },
      { id: '0-2', name: 'Business Strategy and Planning' },
      { id: '0-3', name: 'Technical Strategy and Planning' }
    ]
  },
  {
    id: '1',
    name: 'Change and transformation',
    subcategories: [
      { id: '1-0', name: 'Business change implementation' },
      { id: '1-1', name: 'Business change management' }
    ]
  },
  {
    id: '2',
    name: 'Development and implementation',
    subcategories: [
      { id: '2-0', name: 'Systems development' },
      { id: '2-1', name: 'User experience' },
      { id: '2-2', name: 'Installation and integration' }
    ]
  },
  {
    id: '3',
    name: 'Delivery and operation',
    subcategories: [
      { id: '3-0', name: 'Service design' },
      { id: '3-1', name: 'Service transition' },
      { id: '3-2', name: 'Service operation' }
    ]
  },
  {
    id: '4',
    name: 'Skills and quality',
    subcategories: [
      { id: '4-0', name: 'Skill management' },
      { id: '4-1', name: 'People management' },
      { id: '4-2', name: 'Quality and conformance' }
    ]
  },
  {
    id: '5',
    name: 'Relationships and engagement',
    subcategories: [
      { id: '5-0', name: 'Stakeholder management' },
      { id: '5-1', name: 'Sales and marketing' }
    ]
  }
];

@model('Editor/Sfia')
class SfiaEditorModel extends Model({
  items: prop<SfiaSkillModel[]>()
}) {
  @modelAction
  add(pre: SfiaSkill) {
    this.items.push(new SfiaSkillModel(pre));
  }

  @modelAction
  remove(ix: number) {
    this.items.splice(ix, 1);
  }
}

const Details: React.FC<{
  item: SfiaSkillModel;
  owner: SfiaEditorModel;
  acs: AcsKnowledge[];
  state: State;
  readonly: boolean;
}> = observer(({ item, owner, acs, readonly, state }) => {
  const localState = useLocalStore(() => ({
    isPreview: false,
    unitId: '',
    level: 0,
    flagged: false,
    parsed: ''
  }));
  const { loading, error, data, refetch } = useSfiaUnitsQuery({
    variables: {
      id: item.id
    }
  });
  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError() {
      toaster.danger('Error ;(');
    }
  });

  const form = React.useMemo(() => buildForm(item, ['name', 'description', 'code', 'url']), [item]);
  const addForm = React.useMemo(() => buildForm(localState, ['unitId', 'level']), [localState]);

  const items = acs.map(m => m.items).flat();
  const selected = item.acsSkillId ? items.find(i => i.id === item.acsSkillId) : null;

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const sortedSfiaUnits = [...data.sfiaUnits].sort((a, b) =>
    a.level < b.level ? -1 : a.level > b.level ? 1 : a.name.localeCompare(b.name)
  );

  const selectedCategory = item.category ? sfiaCategories.find(c => c.id === item.category) : null;
  const selectedSubCategory = item.subCategory
    ? selectedCategory.subcategories.find(c => c.id === item.subCategory)
    : null;

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          <a href={item.url || '#'}>{item.name}</a>
        </Heading>

        <Pane display="flex" marginBottom={8}>
          <TextInputField
            flex="1"
            label="Name"
            id="skillName"
            placeholder="Name"
            value={item.name}
            onChange={form.name}
            margin={0}
            marginRight={8}
          />
          {/* <TextInputField
            width={100}
            label="Code"
            id="code"
            placeholder="Code"
            value={item.code || ''}
            onChange={form.code}
            margin={0}
          /> */}
          <Pane flex={1} marginLeft={8}>
            <Text
              is="label"
              htmlFor="description"
              fontWeight={500}
              marginBottom={4}
              display="block"
            >
              ACS Mapping
            </Text>
            <Combobox
              id="mapping"
              width="100%"
              initialSelectedItem={{ label: '' }}
              items={items}
              itemToString={item => (item ? item.name : '')}
              selectedItem={selected}
              onChange={selected => (item.acsSkillId = selected.id)}
            />
          </Pane>
        </Pane>

        <Pane display="flex" marginBottom={8}>
          <Pane flex={1}>
            <Text is="label" htmlFor="category" fontWeight={500} marginBottom={4} display="block">
              Category
            </Text>
            <Combobox
              id="category"
              width="100%"
              items={sfiaCategories}
              itemToString={item => (item ? item.name : '')}
              selectedItem={selectedCategory}
              onChange={selected => (item.category = selected.id)}
            />
          </Pane>
          <Pane flex={1} marginLeft={8}>
            <Text
              is="label"
              htmlFor="subcategory"
              fontWeight={500}
              marginBottom={4}
              display="block"
            >
              Subcategory
            </Text>
            <Combobox
              id="subcategory"
              width="100%"
              initialSelectedItem={{ label: '' }}
              items={selectedCategory ? selectedCategory.subcategories : []}
              itemToString={item => (item ? item.name : '')}
              selectedItem={selectedSubCategory}
              onChange={selected => (item.subCategory = selected.id)}
            />
          </Pane>
        </Pane>

        <TextInputField
          label="Url"
          id="url"
          placeholder="Url"
          value={item.url || ''}
          onChange={form.url}
          marginBottom={16}
        />

        <Text fontWeight={500} htmlFor="mapping" display="block" marginBottom={8}>
          Units
        </Text>

        {sortedSfiaUnits.map(u => (
          <Pane key={u.id} display="flex" alignItems="center" marginBottom={4}>
            {!readonly && (
              <IconButton
                appearance="primary"
                intent="danger"
                icon="trash"
                marginRight={8}
                onClick={() =>
                  save({
                    variables: {
                      id: item.id,
                      part: 'sfiaSkill',
                      body: {
                        unitId: u.id,
                        level: u.level,
                        action: 'remove'
                      }
                    }
                  })
                }
              />
            )}
            <Badge marginRight={8} width={60} color={u.flagged ? 'red' : 'neutral'}>
              Level: {u.level}
            </Badge>
            <Text>
              {u.name} ({u.id})
            </Text>
          </Pane>
        ))}

        {!readonly && (
          <Pane display="flex" alignItems="center" marginTop={16} marginBottom={8}>
            <Heading marginRight={8}>Add: </Heading>
            <Pane flex="1" marginRight={8}>
              <Combobox
                id="unit"
                width="100%"
                items={data.units}
                itemToString={item => (item ? `${item.name} (${item.id})` : '')}
                onChange={item => (item ? (localState.unitId = item.id) : '')}
              />
            </Pane>
            <TextInput
              width={80}
              placeholder="Level"
              value={localState.level}
              type="number"
              onChange={e => (localState.level = parseInt(e.currentTarget.value))}
              marginRight={8}
            />
            {/* <Checkbox
              checked={localState.flagged}
              onChange={e => (localState.flagged = e.currentTarget.checked)}
              marginRight={8}
            /> */}
            <IconButton
              icon="plus"
              width={30}
              onClick={() => {
                if (data.sfiaUnits.some(u => u.id === localState.unitId)) {
                  alert('This unit is already added');
                  return;
                }
                save({
                  variables: {
                    id: item.id,
                    part: 'sfiaSkill',
                    body: {
                      unitId: localState.unitId,
                      level: localState.level,
                      action: 'add',
                      flagged: true
                    }
                  }
                });
              }}
              intent="success"
              appearance="primary"
            />
          </Pane>
        )}

        {!readonly && (
          <Pane display="flex" alignItems="center" marginTop={16} marginBottom={8}>
            <Heading marginRight={8}>Parsed: </Heading>
            <TextInput
              placeholder="Parse from e.g. 300143*, 300166*, 300575*, 301124*"
              value={localState.parsed}
              onChange={e => (localState.parsed = e.currentTarget.value)}
              marginRight={8}
              width="100%"
            />
            <TextInput
              width={80}
              placeholder="Level"
              value={localState.level}
              type="number"
              onChange={e => (localState.level = parseInt(e.currentTarget.value))}
              marginRight={8}
            />
            <IconButton
              width={30}
              flexGrow={0}
              flexShrink={0}
              flexBase={30}
              icon="plus"
              onClick={async () => {
                let value = localState.parsed.replace(/\*/g, '');
                let values = value.split(',').map(v => v.trim());

                for (let unitId of values) {
                  if (data.sfiaUnits.some(u => u.id === unitId)) {
                    console.warn(`Unit '${unitId}' is already added`);
                    continue;
                  }
                  await save({
                    variables: {
                      id: item.id,
                      part: 'sfiaSkill',
                      body: {
                        unitId,
                        level: localState.level,
                        action: 'add',
                        flagged: true
                      }
                    }
                  });
                }
              }}
              intent="success"
              appearance="primary"
            />
          </Pane>
        )}

        {/* <Text is="label" htmlFor="description" fontWeight={500} marginBottom={8} display="block">
          Description{' '}
          <Badge cursor="pointer" onClick={() => (localState.isPreview = !localState.isPreview)}>
            {localState.isPreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isPreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(item.description) }} />
        ) : (
          <Textarea value={item.description} onChange={form.description} />
        )} */}

        <Button
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
        </Button>
      </Pane>
    </div>
  );
});

export const DetailsReadonly: React.FC<{ item: SfiaSkill }> = observer(({ item }) => {
  const category = sfiaCategories.find(c => c.id === item.category);
  const subCategory = category?.subcategories.find(c => c.id === item.subCategory);

  const { loading, error, data } = useSfiaUnitsQuery({
    variables: {
      id: item.id
    }
  });

  if (category == null) {
    return <Alert>We do not register skill with category: {item.category}</Alert>;
  }

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const sortedSfiaUnits = [...data.sfiaUnits].sort((a, b) =>
    a.level < b.level ? -1 : a.level > b.level ? 1 : a.name.localeCompare(b.name)
  );

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {category.name} &gt; {subCategory?.name} &gt;{' '}
          <a href={item.url}>
            {item.name} ({item.id})
          </a>
        </Heading>

        <Pane display="flex">
          <Pane flex={1} textAlign="justify" paddingRight={16}>
            <Text
              is="div"
              dangerouslySetInnerHTML={{ __html: item.description }}
              lineHeight="inherit"
              id="QQQ"
            />
          </Pane>
          <Pane flex={1}>
            <Heading size={400} marginBottom={16}>
              Units
            </Heading>
            {sortedSfiaUnits.map(u => (
              <Pane key={u.id} display="flex" alignItems="center" marginBottom={4}>
                <Badge marginRight={8} width={60} color={u.flagged ? 'red' : 'neutral'}>
                  Level: {u.level}
                </Badge>
                <Text>
                  <Link as={`/view/units/${url(u.name)}-${u.id}`} href={`/view/[category]/[item]`}>
                    <a>
                      {u.name} ({u.id})
                    </a>
                  </Link>
                </Text>
              </Pane>
            ))}
          </Pane>
        </Pane>
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  readonly: boolean;
};

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));

  const { loading, error, data, refetch } = useSfiaQuery();
  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError() {
      toaster.danger('Error ;(');
    }
  });

  const model = React.useMemo(() => {
    if (data) {
      let model = new SfiaEditorModel({
        items: createSfias(data.sfia)
      });
      state.undoManager = undoMiddleware(model);
      state.save = () => {
        const body = model.items.map(i => i.toJS());
        save({
          variables: {
            body,
            part: 'sfia'
          }
        });
      };
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
      <VerticalPane title="Unit List">
        <Tablist marginRight={8}>
          <Tabs>
            {model.items
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(block => (
                <Link
                  key={block.id}
                  href={`/${view}/[category]/[item]`}
                  as={`/${view}/sfia-skills/${url(block.name)}-${block.id}`}
                >
                  <a>
                    <SideTab
                      key={block.id}
                      id={block.id}
                      isSelected={selectedItem && block.id === selectedItem.id}
                      aria-controls={`panel-${block.name}`}
                    >
                      <Badge color="green" marginRight={4}>
                        {block.count}
                      </Badge>
                      {!block.acsSkillId && (
                        <Badge title="No Mapping" marginRight={4}>
                          !
                        </Badge>
                      )}
                      {block.name} ({block.id})
                    </SideTab>
                  </a>
                </Link>
              ))}
          </Tabs>
          {!readonly && (
            <Pane marginTop={16} display="flex" alignItems="center">
              <TextInputField
                flex={1}
                id="newSkillName"
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
                  const name = localState.name
                    .trim()
                    .split(' ')
                    .map(s => s[0].toUpperCase() + s.substring(1))
                    .join(' ')
                    .replace(/([A-Z][A-Z][A-Z][A-Z])/, '($1)');
                  model.add({
                    id: findMaxId(model.items),
                    name,
                    description: '',
                    acsSkillId: '',
                    subCategory: null,
                    category: null,
                    url: `https://sfia-online.org/en/sfia-7/skills/${name
                      .split('(')[0]
                      .trim()
                      .toLowerCase()
                      .replace(/\W/g, '-')}`
                  });
                }}
              />
            </Pane>
          )}
        </Tablist>
      </VerticalPane>
      <VerticalPane shrink={true}>
        {selectedItem &&
          (readonly ? (
            <DetailsReadonly item={selectedItem} />
          ) : (
            <Details
              item={selectedItem}
              owner={model}
              acs={data.acs}
              state={state}
              readonly={readonly}
            />
          ))}
      </VerticalPane>
    </>
  );
};

export const SfiaEditor = observer(EditorView);

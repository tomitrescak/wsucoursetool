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
  TextInput,
  Tooltip,
  Paragraph,
  InfoSignIcon,
  Select
} from 'evergreen-ui';
import { State, Job } from './types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from './tab';
import marked from 'marked';
import { useRouter } from 'next/router';
import { AcsKnowledgeItem } from './acs_knowledge_item';
import { bloom } from './bloom';

const Details: React.FC<{ item: Job; state: State }> = observer(({ item, state }) => {
  const localState = useLocalStore(() => ({ isPreview: false, acsId: '', rating: 0, bloom: -1 }));
  const form = React.useMemo(() => buildForm(item, ['name', 'description']), [item]);
  const acsSkills = state.courseConfig.acsKnowledge
    .map(m => m.items)
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name));
  const sfiaSkills = state.courseConfig.sfiaSkills;

  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextInputField
          label="Name"
          placeholder="Name"
          value={item.name}
          onChange={form.name}
          marginBottom={8}
        />
        <Text is="label" htmlFor="description" fontWeight={500} marginBottom={8} display="block">
          Description{' '}
          <Badge cursor="pointer" onClick={() => (localState.isPreview = !localState.isPreview)}>
            {localState.isPreview ? 'Editor' : 'Preview'}
          </Badge>
        </Text>
        {localState.isPreview ? (
          <Text dangerouslySetInnerHTML={{ __html: marked(item.description) }} />
        ) : (
          <Textarea value={item.description} onChange={form.description} />
        )}

        <Heading size={500} marginBottom={8} marginTop={16}>
          Skills
        </Heading>

        {item.skills.map((skill, i) => {
          //const sfia = sfiaSkills.find(s => s.id === skill.skillId);
          const acs = acsSkills.find(s => s.id === skill.skillId);

          return (
            <Pane display="flex" marginBottom={8}>
              <IconButton
                marginTop={-4}
                flex="0 0 40px"
                icon="trash"
                intent="danger"
                appearance="primary"
                marginRight={16}
                onClick={() => {
                  item.skills.splice(i, 1);
                }}
              />
              <Text
                display="block"
                // width={140}
                onMouseOver={() => (localState.bloom = skill.bloomRating - 1)}
              >
                <Tooltip
                  content={
                    <Paragraph>
                      <Text
                        size={300}
                        dangerouslySetInnerHTML={{
                          __html: marked(bloom[skill.bloomRating - 1].description)
                        }}
                      />
                    </Paragraph>
                  }
                  appearance="card"
                >
                  <Text>[{skill.bloomRating}]</Text>
                </Tooltip>
                &nbsp;-&nbsp; {/* {' '}
                - {bloom[skill.bloomRating - 1].title} */}
              </Text>
              <Text display="block" flex="1">
                {acs && acs.name}
              </Text>

              {/* <Text display="block" flex="1">
                {sfia.name}
              </Text> */}
            </Pane>
          );
        })}

        <Pane display="flex" alignItems="center" marginTop={16}>
          <Combobox
            flex="1"
            width="100%"
            id="mapping"
            items={acsSkills}
            itemToString={item => (item ? item.name : '')}
            onChange={selected => (localState.acsId = selected.id)}
          />

          <Select
            marginLeft={8}
            marginRight={8}
            flex="0 0 140px"
            value={localState.rating ? localState.rating.toString() : ''}
            onChange={e => (localState.rating = parseInt(e.currentTarget.value))}
          >
            <option value="">None</option>
            <option value="1">1 - Knowledge</option>
            <option value="2">2 - Comprehension</option>
            <option value="3">3 - Application</option>
            <option value="4">4 - Analysis</option>
            <option value="5">5 - Synthesis</option>
            <option value="6">6 - Evaluation</option>
          </Select>
          <IconButton
            width={50}
            icon="plus"
            appearance="primary"
            intent="success"
            onClick={() => {
              item.skills.push({
                bloomRating: localState.rating,
                skillId: localState.acsId
              });
            }}
          />
        </Pane>

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure?')) {
              state.courseConfig.jobs.splice(
                state.courseConfig.jobs.findIndex(p => p === item),
                1
              );
            }
          }}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

const DetailsReadonly: React.FC<{ item: Job }> = observer(({ item }) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <TextField label="Description" html={marked(item.description)} />
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

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;
  const selectedItem = selectedId ? state.courseConfig.jobs.find(b => b.id === selectedId) : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {state.courseConfig.jobs.map(block => (
            <Link
              key={block.id}
              href={`/${view}/[category]/[item]`}
              as={`/${view}/jobs/${url(block.name)}-${block.id}`}
            >
              <a>
                <SideTab
                  key={block.id}
                  id={block.id}
                  isSelected={selectedItem && block.id === selectedItem.id}
                  aria-controls={`panel-${block.name}`}
                >
                  {block.name}
                </SideTab>
              </a>
            </Link>
          ))}
        </Tabs>
        {!readonly && (
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
                state.courseConfig.jobs.push({
                  id: findMaxId(state.courseConfig.acsKnowledge),
                  name: localState.name,
                  description: '',
                  skills: []
                });
              }}
            />
          </Pane>
        )}
      </Tablist>

      {selectedItem &&
        (readonly ? (
          <DetailsReadonly item={selectedItem} />
        ) : (
          <Details item={selectedItem} state={state} />
        ))}
    </Pane>
  );
};

export const JobsEditor = observer(EditorView);

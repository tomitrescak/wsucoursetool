import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  TextInputField,
  Pane,
  Tablist,
  Heading,
  Button,
  Textarea,
  Badge,
  IconButton,
  Text,
  Combobox,
  Tooltip,
  Paragraph,
  Select,
  toaster
} from 'evergreen-ui';
import { State, Job, AcsKnowledge, Entity } from '../types';
import { buildForm, findMaxId, url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from '../common/tab';
import marked from 'marked';
import Router, { useRouter } from 'next/router';
import { bloom } from '../acs/bloom';
import {
  useJobsQuery,
  useCreateJobMutation,
  useJobQuery,
  useDeleteJobMutation,
  useSaveConfigMutation
} from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { EntityModel, createJob } from 'components/classes';
import { undoMiddleware } from 'mobx-keystone';
import { TextEditor } from 'components/common/text_editor';
import { AcsGraph } from 'components/acs/acs_graph';
import { skills } from 'components/outcomes/outcome_editor';

const Details: React.FC<{
  item: Entity;
  state: State;
  refetch: Function;
}> = observer(({ item, refetch, state }) => {
  const localState = useLocalStore(() => ({ isPreview: false, acsId: '', rating: 0, bloom: -1 }));
  const { loading, error, data } = useJobQuery({
    variables: {
      id: item.id
    }
  });
  const [deleteJob] = useDeleteJobMutation({
    onCompleted() {
      toaster.notify('Job deleted. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });
  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const job = React.useMemo(() => {
    console.log('Createing job!');
    if (data) {
      const job = createJob(data.job);
      state.undoManager = undoMiddleware(job);
      state.save = () =>
        save({
          variables: {
            body: job.toJS(),
            part: 'job',
            id: item.id
          }
        }).then(() => refetch());
      return job;
    }
    return null;
  }, [data]);

  const form = React.useMemo(() => buildForm(job, ['name', 'description']), [job]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const acsSkills: AcsKnowledge[] = data.acs
    .map(m => m.items)
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name));

  // const sfiaSkills = state.courseConfig.sfiaSkills;

  return (
    <div
      style={{ flex: 1, overflow: 'auto', height: '100%', paddingRight: '8px' }}
      className="scroll1"
    >
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {job.name}
        </Heading>

        <TextInputField
          label="Name"
          placeholder="Name"
          value={job.name}
          onChange={form.name}
          marginBottom={8}
        />

        <TextEditor field="description" label="Description" owner={job} readonly={false} />

        <Heading size={500} marginBottom={8} marginTop={16}>
          Skills
        </Heading>

        {job.skills.map((skill, i) => {
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
                  job.removeSkill(i);
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
              job.addSkill(localState.acsId, localState.rating);
            }}
          />
        </Pane>

        <Button
          intent="danger"
          iconBefore="trash"
          appearance="primary"
          marginTop={8}
          onClick={() => {
            if (confirm('Are You Sure? This action cannot be undone!')) {
              deleteJob({
                variables: {
                  id: item.id
                }
              }).then(() => {
                refetch();
                Router.push('/editor/[category]', `/editor/jobs`);
              });
            }
          }}
        >
          Delete
        </Button>
      </Pane>
    </div>
  );
});

const DetailsReadonly: React.FC<{ item: Entity }> = observer(({ item }) => {
  const { loading, error, data } = useJobQuery({
    variables: {
      id: item.id
    }
  });

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }
  const job: Job = data.job;
  const acs: AcsKnowledge[] = data.acs;
  const acsItems = acs.flatMap(m => m.items);

  let bars = skills.map((s, i) => {
    return {
      x: job.skills.find(j => j.skillId === s)?.bloomRating || 0,
      y: i
    };
  });
  return (
    <div
      style={{ flex: 1, overflow: 'auto', height: '100%', paddingRight: '8px' }}
      className="scroll1"
    >
      <Pane background="tint3" borderRadius={6} marginLeft={24}>
        <Heading size={500} marginBottom={16}>
          {job.name}
        </Heading>

        <Text dangerouslySetInnerHTML={{ __html: marked(job.description || '') }} />

        <Heading size={400} marginBottom={8}>
          Skills
        </Heading>

        <Pane display="flex">
          <Pane marginRight={16}>
            <Pane padding={8} elevation={2} borderRadius={4} background="tint2">
              {bloom.map((b, i) => (
                <Text is="div" key={i}>
                  {i + 1} - {b.title}
                </Text>
              ))}
            </Pane>
          </Pane>
          <Pane>
            <AcsGraph acs={acs} bars={bars} />
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

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const mainSplit = item ? item.split('--') : null;
  const split = mainSplit ? mainSplit[0].split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;

  const localState = useLocalStore(() => ({
    name: ''
  }));

  const [createJob] = useCreateJobMutation({
    onCompleted() {
      toaster.notify('Job created. Config saved.');
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });
  const { loading, error, data, refetch } = useJobsQuery();
  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  const selectedItem: Entity = selectedId ? data.jobs.find(b => b.id === selectedId) : null;
  const form = buildForm(localState, ['name']);
  const view = readonly ? 'view' : 'editor';

  return (
    <Pane display="flex" flex={1} alignItems="flex-start" paddingRight={8}>
      <Tablist flexBasis={200} width={200} marginRight={8}>
        <Tabs>
          {data.jobs.map(block => (
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
                createJob({
                  variables: {
                    id: findMaxId(data.jobs),
                    name: localState.name
                  }
                }).then(() => {
                  refetch();
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
          <Details item={selectedItem} state={state} refetch={refetch} />
        ))}
    </Pane>
  );
};

export const JobsEditor = observer(EditorView);

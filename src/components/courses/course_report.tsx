import { Course, Job, Major, SfiaSkillMapping, Topic } from 'components/types';
import { Entity, useJobsWithDetailsQuery, useSfiaQuery } from 'config/graphql';
import { UnitList } from 'config/resolvers';
import {
  Alert,
  Badge,
  Button,
  Dialog,
  Heading,
  Icon,
  IconButton,
  ListItem,
  Pane,
  Spinner,
  Text,
  TextInput,
  UnorderedList
} from 'evergreen-ui';
import groupByArray, { groupBy, url } from 'lib/helpers';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { Debugger } from './search/debugger';
import { Explorer, ExplorerNode, Study } from './search/explorer';
// import { Debugger } from './search/debugger';
import { calculateCredits, CombinationReport, Finder } from './search/finder';
import {
  buildProfile,
  logSearchNode,
  round,
  SearchNode,
  TopicProfile
} from './search/search_helpers';

import ValidationWorker from './search/validation.worker';
import StudyWorker from './search/study.worker';
import { ProgressView } from 'components/common/progress_view';
import { Expander } from 'components/common/expander';
import Link from 'next/link';

// import ValidationWorker from './search/validation.worker';

type Props = {
  units: UnitList[];
  course: Course;
  majors: Major[];
  topics: Entity[];
};

const maxCombinations = 20;

type Combination = {
  id: string;
  combinations: SearchNode[][];
  missing: number;
};

type TopicReportProps = {
  profile: TopicProfile[];
  finder: Finder;
  combinationReport: Combination[];
  required: SearchNode[];
};

const TopicReport = ({ profile, finder, combinationReport, required }: TopicReportProps) => (
  <div style={{ flex: 1 }}>
    {profile.map((p, i) => {
      const used = finder.study.flatMap(s => s).filter(f => f.topics.some(t => t.id === p.topicId));

      const unused = finder.requiredDoing
        .concat(
          finder.optionalDoing
            .filter(f => f.topics.some(t => t.id === p.topicId))
            .sort((a, b) =>
              a.topics.find(t => t.id === p.topicId).credits <
              b.topics.find(t => t.id === p.topicId).credits
                ? 1
                : -1
            )
        )
        .filter(f => f.topics.some(t => t.id === p.topicId));

      const total = unused
        .flatMap(u => u.topics)
        .filter(t => t.id === p.topicId)
        .reduce((prev, next) => prev + next.credits, 0);

      const completed = used
        .flatMap(u => u.topics)
        .filter(t => t.id === p.topicId)
        .reduce((prev, next) => prev + next.credits, 0);

      const criteria = finder.courseCompletionCriteria.topics.find(t => t.id === p.topicId);
      const report = combinationReport.find(t => t.id === p.topicId);

      const title = `${p.name} - ${p.completion}% - Required: ${
        finder.courseCompletionCriteria.topics.find(t => t.id === p.topicId).credits
      }¢, Completed: ${Math.round(p.credits * 10) / 10}¢`;

      return (
        <Alert
          key={p.topicId}
          intent={p.completion >= 100 ? 'success' : 'warning'}
          marginBottom={8}
          title={title}
        >
          {criteria.credits - completed - total > 0 ? (
            <Text>
              <Icon icon="ban-circle" color="red" size={16} /> Missing{' '}
              {round(criteria.credits - completed - total)} credits
            </Text>
          ) : null}

          {criteria.credits - completed - total < 0 ? (
            <Pane marginTop={8} marginBottom={8}>
              <Text>
                <Icon size={16} icon="tick" color="green" /> Available {round(total)} credits
                {p.completion < 100 && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: report.missing ? 'salmon' : 'lightGreen',
                      borderRadius: 3,
                      padding: 2
                    }}
                    title={combinationReport
                      .find(t => t.id === p.topicId)
                      .combinations.map(c => c.map(p => logSearchNode(p)).join(', '))
                      .join('\n')}
                  >
                    <span>
                      {report.combinations.length > maxCombinations
                        ? `${maxCombinations}+`
                        : report.combinations.length}{' '}
                      combination(s) for {report.missing}¢
                    </span>

                    {/* <ul style={{ background: 'pink', padding: 8 }}>
                          {combinationReport
                            .find(t => t.id === p.topicId)
                            .combinations.map(c =>
                              c
                                .map(n => n.node.unit.name)
                                .sort()
                                .join(', ')
                            )
                            .sort()
                            .map((v, i) => (
                              <li key={i}>{v}</li>
                            ))}
                        </ul> */}
                  </span>
                )}
              </Text>
            </Pane>
          ) : null}

          {used.map(n => (
            <div key={n.id} title={logSearchNode(n)}>
              +{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: 40
                }}
              >
                {round(n.topics.find(t => t.id === p.topicId).credits)}c
              </span>{' '}
              {logSearchNode(n)}{' '}
            </div>
          ))}

          {unused.map(n => (
            <Text is="div" key={n.id} title={logSearchNode(n)}>
              {required.some(r => r === n) ? (
                <Icon size={16} icon="crown" color="green" />
              ) : (
                <Icon size={16} icon="dot" color="default" />
              )}{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: 40
                }}
              >
                {round(n.topics.find(t => t.id === p.topicId).credits)}c
              </span>{' '}
              {logSearchNode(n)}{' '}
            </Text>
          ))}
        </Alert>
      );
    })}
  </div>
);

type CombinationProps = {
  combinations: SearchNode[][];
  required: SearchNode[];
  finder: Finder;
};

const CombinationExplorer = observer(({ combinations, required }: CombinationProps) => {
  const state = useLocalStore(() => ({
    item: 0,
    debuggerShowing: false
  }));

  const { combination, explorer } = React.useMemo(() => {
    let combination = [...required, ...(combinations[state.item] || [])];

    return { combination, explorer: new Explorer(combination) };
  }, [state.item]);

  return (
    <Pane flex={1} elevation={2} marginRight={16} background="tint1" padding={8}>
      <Pane background="tint2" display="flex" alignItems="center" justifyContent="center">
        <IconButton
          disabled={state.item == 0}
          icon="double-chevron-left"
          onClick={() => (state.item = 0)}
        />
        <IconButton
          disabled={state.item == 0}
          icon="chevron-left"
          marginLeft={8}
          onClick={() => state.item--}
        />
        <TextInput
          width={50}
          type="number"
          marginLeft={8}
          marginRight={8}
          value={state.item + 1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            (state.item = parseInt(e.currentTarget.value) - 1)
          }
        />
        <Text marginRight={8}>/ {combinations.length}</Text>
        <IconButton
          icon="chevron-right"
          onClick={() => state.item++}
          disabled={state.item == combinations.length - 1}
        />
        <IconButton
          icon="double-chevron-right"
          onClick={() => (state.item = combinations.length - 1)}
          marginLeft={8}
          disabled={state.item == combinations.length - 1}
        />

        <Dialog
          isShown={state.debuggerShowing}
          onCloseComplete={() => (state.debuggerShowing = false)}
          preventBodyScrolling
          width="95%"
          hasHeader={false}
          hasFooter={false}
        >
          <Debugger explorer={explorer} />
        </Dialog>

        <Button marginLeft={8} iconBefore="wrench" onClick={() => (state.debuggerShowing = true)}>
          Show Debugger
        </Button>
      </Pane>
      <Text is="div" marginTop={8}>
        Total Credits: {combination.reduce((prev, next) => next.credits + prev, 0)}¢ / Autumn{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('sp') === -1)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢ / Spring{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('au') === -1)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢ / Rest{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('au') >= 0 && d.unit.offer.indexOf('sp') >= 0)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢
      </Text>

      <div>
        {explorer.nodes.map((item, ix) => (
          <div key={ix}>
            <Heading>Item {item.key}</Heading>
            <ul>
              {item.values.map((m, i) => (
                <li key={i}>{logSearchNode(m)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Pane>
  );
});

type StudyProps = {
  required: SearchNode[];
  combinationReport: CombinationReport[];
};

type SfiaMappingWithName = SfiaSkillMapping & { name: string; unit: string };

const StudyView = ({ study }) => {
  const { loading, error, data } = useSfiaQuery();
  const { loading: jobsLoading, error: jobsError, data: jobsData } = useJobsWithDetailsQuery();

  if (loading || error || jobsLoading || jobsError) {
    return <ProgressView loading={loading || jobsLoading} error={error || jobsError} />;
  }

  if (!study) {
    return null;
  }
  const combination: SearchNode[] = study.flat().map(n => n.node);
  const sfiaSkills: SfiaMappingWithName[] = [];

  for (let node of combination) {
    for (let sfia of node.sfiaSkills) {
      let existing = sfiaSkills.find(s => s.id === sfia.id);
      if (!existing) {
        sfiaSkills.push({
          ...sfia,
          name: data.sfia.find(s => s.id === sfia.id).name,
          unit: node.unit.name
        });
      } else if (existing.level < sfia.level) {
        existing.level = sfia.level;
        existing.unit = node.unit.name;
      }
    }
  }

  sfiaSkills.sort((a, b) => (a.level < b.level ? 1 : -1));

  const jobsCompletion: Array<{ job: { name; id }; completion: number }> = [];
  for (let job of jobsData.jobs.filter(j => j.sfia.length > 0)) {
    let requiredTotal = 0;
    let completedTotal = 0;

    for (let skill of job.sfia) {
      let existing = sfiaSkills.find(s => s.id === skill.id);
      if (existing) {
        completedTotal += existing.level;
      }
      requiredTotal += skill.level;
    }

    jobsCompletion.push({
      job,
      completion: round(completedTotal / requiredTotal, 2) * 100
    });
  }
  jobsCompletion.sort((a, b) => (a.completion < b.completion ? 1 : -1));

  return (
    <>
      <Text is="div" marginTop={8}>
        Total Credits: {combination.reduce((prev, next) => next.credits + prev, 0)}¢ / Autumn{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('sp') === -1)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢ / Spring{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('au') === -1)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢ / Rest{' '}
        {combination
          .filter(d => d.unit.offer.indexOf('au') >= 0 && d.unit.offer.indexOf('sp') >= 0)
          .reduce((prev, next) => next.credits + prev, 0)}
        ¢
      </Text>

      <Expander title="Study Schedule" id="studySchedule">
        <Pane>
          {study.map((s, i) => (
            <Pane key={i}>
              <Heading marginTop={8}>Semester {i + 1}</Heading>
              {s.map((c, i) => (
                <Text is="div" key={i}>
                  {logSearchNode(c.node)}
                </Text>
              ))}
            </Pane>
          ))}
        </Pane>
      </Expander>

      <Expander title="SFIA Skills" id="studySFIA">
        {sfiaSkills.map(s => (
          <Text is="div" key={s.id} marginTop={4}>
            <Badge
              width={70}
              marginRight={8}
              color={
                s.level > 5 ? 'green' : s.level > 4 ? 'orange' : s.level > 2 ? 'yellow' : 'red'
              }
            >
              Level {round(s.level, 1)}
            </Badge>{' '}
            <Link href={`/view/sfia-skills/${url(s.name)}-${s.id}`}>
              <a>
                <Text>
                  {s.name} from {s.unit}
                </Text>
              </a>
            </Link>
          </Text>
        ))}
      </Expander>

      <Expander title="Jobs" id="studyJobs">
        <UnorderedList icon="tick" iconColor="success">
          {jobsCompletion.map(s => (
            <ListItem
              key={s.job.id}
              icon={s.completion >= 100 ? 'tick' : 'cross'}
              iconColor={s.completion > 80 ? 'green' : s.completion > 60 ? 'orange' : 'red'}
            >
              <Badge color={s.completion > 80 ? 'green' : s.completion > 60 ? 'orange' : 'red'}>
                Completed {s.completion > 100 ? 100 : round(s.completion, 1)}%
              </Badge>{' '}
              <Link href={`/editor/jobs/${url(s.job.name)}-${s.job.id}`}>
                <a>
                  <Text>{s.job.name}</Text>
                </a>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Expander>
    </>
  );
};

const Pager = ({ required, combinationReport, state, viableCombinations }) => {
  const [viableCombinationsCount, setViableCombinationsCount] = React.useState(0);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    viableCombinations.current = [];
    state.item = -1;
    const worker = new StudyWorker();
    worker.postMessage({
      requiredUnits: required,
      combinations: combinationReport
    });
    worker.onmessage = function (e) {
      if (e.data.status === 'Result') {
        viableCombinations.current.push(e.data.study);
        setViableCombinationsCount(viableCombinations.current.length);

        if (state.item === -1) {
          state.item = 0;
        }
      }
      if (e.data.status === 'Finished') {
        setRunning(false);
      }
    };
    return () => worker.terminate();
  }, [combinationReport]);

  return (
    <Pane background="tint2" display="flex" alignItems="center" justifyContent="center">
      <IconButton
        disabled={state.item == 0}
        icon="double-chevron-left"
        onClick={() => (state.item = 0)}
      />
      <IconButton
        disabled={state.item == 0}
        icon="chevron-left"
        marginLeft={8}
        onClick={() => state.item--}
      />
      <TextInput
        width={50}
        type="number"
        marginLeft={8}
        marginRight={8}
        value={state.item + 1}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          (state.item = parseInt(e.currentTarget.value) - 1)
        }
      />
      <Text marginRight={8}>
        &nbsp;/&nbsp;{running && <Spinner size={16} />} {viableCombinationsCount}
      </Text>
      <IconButton
        icon="chevron-right"
        onClick={() => state.item++}
        disabled={state.item == viableCombinations.current.length - 1}
      />
      <IconButton
        icon="double-chevron-right"
        onClick={() => (state.item = viableCombinations.current.length - 1)}
        marginLeft={8}
        disabled={state.item == viableCombinations.current.length - 1}
      />
    </Pane>
  );
};

const StudyExplorer = observer(({ required, combinationReport }: StudyProps) => {
  const viableCombinations = React.useRef([]);
  const state = useLocalStore(() => ({
    item: -1
  }));

  const study =
    state.item >= 0 && viableCombinations.current.length > 0
      ? viableCombinations.current[state.item]
      : null;

  return (
    <Pane flex={1} elevation={2} marginRight={16} background="tint1" padding={8}>
      <Pager
        viableCombinations={viableCombinations}
        required={required}
        combinationReport={combinationReport}
        state={state}
      />

      {study && <StudyView study={study} />}
    </Pane>
  );
});

export const CourseReport = ({ units, course, majors, topics }: Props) => {
  const [viableCombinations, setViableCombinations] = React.useState<SearchNode[][]>(null);
  const [isDebugger, toggleDebugger] = React.useState(!!localStorage.getItem('courseDebugger'));

  const finder = React.useMemo(() => {
    const finder = new Finder(topics, units);
    finder.initSearch({
      course,
      majors,
      includeUnits: [],
      excludeUnits: [],
      includeBlocks: [],
      excludeBlocks: [],
      jobs: []
    });
    return finder;
  }, [course, majors]);

  // build current completion profile
  const {
    combinationReport,
    completion,
    completed,
    missing,
    available,
    required,
    profile,
    totalCombinationCount
  } = React.useMemo(() => {
    const result = finder.combinationReport(maxCombinations);

    return result;
  }, [finder]);

  //// START
  React.useEffect(() => {
    if (isDebugger) {
      const worker = new ValidationWorker();
      worker.postMessage({
        requiredUnits: required,
        combinations: combinationReport
      });
      worker.onmessage = function (e) {
        setViableCombinations(e.data.result);
      };

      return () => worker.terminate();
    }
  }, [isDebugger]);
  ///// END

  //// START
  if (isDebugger && viableCombinations) {
    viableCombinations.sort((a, b) => (calculateCredits(a) < calculateCredits(b) ? -1 : 1));
  }
  //// END

  return (
    <div>
      <Heading is="h1" size={600} marginBottom={12}>
        Completion Criteria
        <Button
          float="right"
          onClick={() => {
            if (isDebugger) {
              localStorage.removeItem('courseDebugger');
            } else {
              localStorage.setItem('courseDebugger', 'true');
            }
            toggleDebugger(!isDebugger);
          }}
        >
          Show {isDebugger ? 'Study' : 'Debugger'}
        </Button>
      </Heading>
      <Heading marginBottom={8} size={500}>
        Completed: {Math.round(completion * 100)}%
      </Heading>
      <Text is="div">
        <div>
          Core Credits: Completed {Math.round(completed)}¢ out of{' '}
          {finder.courseCompletionCriteria.totalCredits}¢
        </div>
        {/* <div>Available Credits: {available}¢ / 240¢</div> */}
        <Pane display="flex" alignItems="center">
          Calculating validity of {totalCombinationCount} combinations
        </Pane>
      </Text>

      <Pane display="flex" marginTop={16}>
        {isDebugger ? (
          <>
            {viableCombinations && viableCombinations.length && (
              <CombinationExplorer
                combinations={viableCombinations}
                required={required}
                finder={finder}
              />
            )}
          </>
        ) : (
          <StudyExplorer
            // combinations={viableCombinations}
            required={required}
            combinationReport={combinationReport}
          />
        )}

        <TopicReport
          profile={profile}
          finder={finder}
          combinationReport={combinationReport}
          required={required}
        />
      </Pane>
    </div>
  );
};

import { Course, Major, Topic } from 'components/types';
import { Entity } from 'config/graphql';
import { UnitList } from 'config/resolvers';
import {
  Alert,
  Button,
  Dialog,
  Heading,
  Icon,
  IconButton,
  Pane,
  Spinner,
  Text,
  TextInput
} from 'evergreen-ui';
import groupByArray, { groupBy } from 'lib/helpers';
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

// function topologicalSortHelper(
//   node: QNode,
//   explored: Set<QNode>,
//   s: QNode[],
//   dependencies: { [index: string]: QNode[] }
// ) {
//   explored.add(node);
//   // Marks this node as visited and goes on to the nodes
//   // that are dependent on this node, the edge is node ----> n
//   dependencies[node.node.id].forEach(n => {
//     if (!explored.has(n)) {
//       topologicalSortHelper(n, explored, s, dependencies);
//     }
//   });

//   // All dependencies are resolved for this node, we can now add
//   // This to the stack.

//   if (s.every(n => n.node.id !== node.node.id)) {
//     s.push(node);
//   }
// }

// function topologicalSort(nodes: QNode[]) {
//   // Create a Stack to keep track of all elements in sorted order
//   // let s: QNode[] = [];
//   // let explored = new Set<QNode>();
//   const dependencies = buildDependencyMap(nodes);
//   // const dependencyArray = Object.keys(dependencies).flatMap(key => dependencies[key]);

//   // // For every unvisited node in our graph, call the helper.
//   // nodes.forEach(node => {
//   //   if (!explored.has(node)) {
//   //     topologicalSortHelper(node, explored, s, dependencies);
//   //   }
//   // });

//   let s = nodes;

//   // we have topologically sorted the nodes
//   // now we sort them so that the nodes with depenencies will always come before those without depenencied

//   let depSorted = [];
//   // let noSorted = [...s];
//   s = s.reverse();

//   while (s.length) {
//     let withDependants = [];
//     for (let node of s) {
//       if (s.some(d => dependencies[d.node.id].findIndex(i => i.node.id === node.node.id) >= 0)) {
//         withDependants.push(node);
//       } else {
//         depSorted.push(node);
//       }
//     }
//     s = withDependants;
//   }

//   // while (s.length) {
//   //   console.log(logSimpleName(s.pop()));
//   // }
//   return depSorted;
// }

// function buildDependencyMap(nodes: QNode[]) {
//   let dependencies: { [index: string]: QNode[] } = {};
//   for (let node of nodes) {
//     let deps: QNode[] = [];

//     // add unit dependencies
//     deps.push(...node.dependencies);

//     // add block dependences
//     for (let block of node.node.blocks) {
//       dependencies[block.id] = [
//         ...block.dependsOn.map(b => nodes.find(n => n.node === b)).filter(t => t)
//       ];

//       for (let bd of block.dependsOn) {
//         let q = nodes.find(n => n.node.unit.id === bd.unit.id && n.node.block == null);
//         // we add unit dependencies that are not dependant on the same unit
//         if (
//           q &&
//           node.node.unit.id !== q.node.unit.id &&
//           deps.findIndex(d => d.node.id === q.node.id) === -1
//         ) {
//           // console.log('Adding ' + logSimpleName(node) + ' ---> ' + logSimpleName(q));
//           deps.push(q);
//         }
//       }
//     }
//     dependencies[node.node.id] = deps;
//   }
//   return dependencies;
//   // debugger;
// }

const CombinationExplorer = observer(({ combinations, required }: CombinationProps) => {
  const [study, setStudy] = React.useState(null);
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

const StudyView = ({ study }) => {
  if (!study) {
    return null;
  }
  const combination: SearchNode[] = study.flat().map(n => n.node);
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

      {study && (
        <Pane marginBottom={24}>
          {study.map((s, i) => (
            <Pane key={i}>
              <Heading>Semester {i + 1}</Heading>
              {s.map((c, i) => (
                <Text is="li" key={i}>
                  {logSearchNode(c.node)}
                </Text>
              ))}
            </Pane>
          ))}
        </Pane>
      )}
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

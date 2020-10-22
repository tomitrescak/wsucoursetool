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
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
// import { Debugger } from './search/debugger';
import { calculateCredits, Finder } from './search/finder';
import {
  buildProfile,
  logSearchNode,
  round,
  SearchNode,
  TopicProfile
} from './search/search_helpers';

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
              <Icon icon="ban-circle" color="red" /> Missing{' '}
              {round(criteria.credits - completed - total)} credits
            </Text>
          ) : null}

          {criteria.credits - completed - total < 0 ? (
            <Pane marginTop={8} marginBottom={8}>
              <Text>
                <Icon icon="tick" color="green" /> Available {round(total)} credits
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
                <Icon icon="crown" color="green" />
              ) : (
                <Icon icon="dot" color="default" />
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

function inResult(result: Array<SearchNode[]>, node: SearchNode) {
  for (let i = 0; i < result.length; i++) {
    // if (node === result[i]) {
    //   return [i];
    // }
    // if (Array.isArray(result[i])) {
    for (let j = 0; j < (result[i] as SearchNode[]).length; j++) {
      if (node.id === result[i][j].id) {
        return [i, j];
      }
    }
  }
  // }
  return null;
}

type TopoConfig = {
  explored: Set<number>;
  result: SearchNode[];
  nodes: SearchNode[];
};

function addDependency(node: SearchNode, dependency: SearchNode, config: TopoConfig) {
  if (!config.explored.has(dependency.id)) {
    // we still have not explored this node
    expandDependencies(dependency, config, 1);
  }

  if (dependency.level != null) {
    // if it it unexplored dependency, we shift it one level up, where dependant nodes reside
    if (dependency.level === 0) {
      console.log('Reposition from 0');
      dependency.level = 1;
    }
  } else {
    // we add dependency to level 1 where dependant nodes reside
    dependency.level = 1;
  }

  // if the original node is not there, we add it une level up
  if (node.level == null) {
    node.level = dependency.level + 1;
  } else {
    // we have the original node, we may need to move it
    if (node.level <= dependency.level) {
      node.level = dependency.level + 1;
    }
  }
}

const emptyArray = [];

function expandDependencies(node: SearchNode, config: TopoConfig, index = 0) {
  config.explored.add(node.id);

  // add unit dependencies
  for (let dependency of node.dependsOn) {
    // find if this depdency does not exists in
    addDependency(node, dependency, config);
  }

  // add unit block dependencies
  for (let block of node.blocks || emptyArray) {
    for (let bd of block.dependsOn.filter(b => b.unit.id !== block.unit.id)) {
      let blockUnitDependency = config.nodes.find(n => n.unit.id === bd.unit.id && n.block == null);
      addDependency(node, blockUnitDependency, config);
    }
  }

  // try to find if any of the dependencies is in the array

  // this node has not been processed with dependencies, we add it to the no-dependency collection
  config.result.push(node);

  // if (config.result.length > 1) {
  //   for (let i = 0; i < config.result.length - 1; i++) {
  //     for (let node of config.result[i]) {
  //       for (let j = i + 1; j < config.result.length; j++) {
  //         if (config.result[j].indexOf(node) !== -1) {
  //           throw new Error('Not good');
  //         }
  //       }
  //     }
  //   }
  // }
}

function topologicalSort(nodes: SearchNode[]) {
  let config: TopoConfig = { result: [], explored: new Set(), nodes };

  // we will continue until we use all the nodes
  for (let node of nodes) {
    if (!config.explored.has(node.id)) {
      node.level = 0;
      expandDependencies(node, config);
    }
  }

  return groupByArray(config.result, 'level').sort((a, b) => (a.key < b.key ? -1 : 1));
}

function checkFeasibilityLevel(
  nodes: Array<{ key: number; value: SearchNode[] }>,
  autumnCredits: number,
  springCredits: number,
  explored: Set<SearchNode>,
  level: number,
  maxLevel: number
) {
  // we have six semesters so we explore all semesters going from current level till depenedency level
}

function checkFeasibility(nodes: Array<{ key: number; values: SearchNode[] }>) {
  const explored = new Set<SearchNode>();

  // for (let group of nodes) {
  //   for (let node of group.values) {
  //     if (!explored.has(node)) {
  //       // check level
  //     }
  //   }
  // }

  // we do this in two steps
  // 1. we explore all the dependency routes and count the path lengths to the latest nodes
  // 2. we propagate path lengths
  // 2. we sort the latest nodes by path lengths and then start positioning from the longest to shortest
  // 3. we do this for all nodes, checking if we have processed that node
}

const CombinationExplorer = observer(({ combinations, required, finder }: CombinationProps) => {
  const state = useLocalStore(() => ({
    item: 0,
    debuggerShowing: false,
    study: null,
    calculating: true,
    message: null
  }));
  let combination = [...required, ...(combinations[state.item] || [])];

  let result = topologicalSort(combination);

  // finder.requiredDoing.forEach(r => {
  //   r.semesters = [];
  //   r.dependencies.forEach(d => (d.semesters = []));
  // });

  // finder.requiredDoing = combination;
  // finder.requiredDone = [];
  // finder.optionalDoing = [];
  // finder.optionalDone = [];
  // finder.study = [[], [], [], [], [], []];

  // React.useEffect(() => {
  //   state.calculating = true;
  //   state.message = '';

  //   setTimeout(() => {
  //     let study = finder.fullSearch();
  //     state.calculating = false;
  //     if (study) {
  //       state.study = study;
  //     } else {
  //       state.message = 'Could not find placement!';
  //     }
  //   }, 10);
  // }, [state.item]);

  // const result = finder.fullSearch();

  // let assigned = combination.filter(c => c.node.semester > 0);
  // let pending = combination.filter(c => !c.node.semester);

  // const sorted = finder.dependencies.filter(d => combination.some(c => c.node.id === d?.id));
  // console.log(sorted.map(d => (d ? logSearchNode(d) : 'Empty')).join('\n'));
  // const noDeps = combination.filter(c => sorted.every(s => s.id !== c.node.id));

  // console.log('== NO DEPS');
  // console.log(noDeps.map(d => logSearchNode(d.node)).join('\n'));

  // const withDeps = combination
  //   .filter(c => sorted.some(s => s.id === c.node.id))
  //   .sort((a, b) => {
  //     console.log(
  //       `${sorted.findIndex(d => a.node.id === d.id)} < ${sorted.findIndex(
  //         d => d.id === b.node.id
  //       )}`
  //     );
  //     return sorted.findIndex(d => a.node.id === d.id) < sorted.findIndex(d => d.id === b.node.id)
  //       ? -1
  //       : 1;
  //   });

  // console.log('== YES DEPS');
  // console.log(withDeps.map(d => logSearchNode(d.node)).join('\n'));

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

        {/* <Dialog
          isShown={state.debuggerShowing}
          onCloseComplete={() => (state.debuggerShowing = false)}
          preventBodyScrolling
          width="95%"
          hasHeader={false}
          hasFooter={false}
        >
          <Debugger finder={finder} />
        </Dialog> */}

        {/* <Button marginLeft={8} iconBefore="wrench" onClick={() => (state.debuggerShowing = true)}>
          Show Debugger
        </Button> */}
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
        {result.map((item, ix) => (
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

      {/* {state.calculating && (
        <Pane marginTop={8} display="flex" alignItems="center">
          <Spinner size={20} marginRight={8} /> <Text>Calculating Semester Placement ...</Text>{' '}
        </Pane>
      )}

      {state.message && <Alert title={state.message} />}

      {state.study ? (
        <Pane>
          {state.study.map((s, i) => (
            <Pane key={i}>
              <Heading>Semester {i + 1}</Heading>
              {s.map((c, i) => (
                <Text is="li" key={i}>
                  {logSearchNode(c)}
                </Text>
              ))}
            </Pane>
          ))}
        </Pane>
      ) : (
        <ul>
          {combination.map((c, i) => (
            <Text is="li">{logSearchNode(c.node)}</Text>
          ))}
        </ul>
      )} */}
    </Pane>
  );
});

export const CourseReport = ({ units, course, majors, topics }: Props) => {
  const [viableCombinations, setViableCombinations] = React.useState<SearchNode[][]>(null);

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

    const myWorker = new Worker('/worker.js');
    myWorker.postMessage({
      requiredUnits: result.required,
      combinations: result.combinationReport
    });
    myWorker.onmessage = function (e) {
      setViableCombinations(e.data.result);
    };

    return result;
  }, [finder]);

  if (viableCombinations) {
    viableCombinations.sort((a, b) => (calculateCredits(a) < calculateCredits(b) ? -1 : 1));
  }

  return (
    <div>
      <Heading is="h1" size={600} marginBottom={12}>
        Completion Criteria
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
        <div>
          Total {totalCombinationCount} combinations with{' '}
          {viableCombinations ? viableCombinations.length : 'Loading ...'} viable combinations
        </div>
      </Text>

      <Pane display="flex" marginTop={16}>
        {viableCombinations && viableCombinations.length && (
          <CombinationExplorer
            combinations={viableCombinations}
            required={required}
            finder={finder}
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

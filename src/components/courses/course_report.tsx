import { Course, Major, Topic } from 'components/types';
import { Entity } from 'config/graphql';
import { UnitList } from 'config/resolvers';
import React from 'react';
import { Finder } from './search/finder';
import { buildProfile, logSearchNode, logSimpleName, round } from './search/search_helpers';

// import ValidationWorker from './search/validation.worker';

type Props = {
  units: UnitList[];
  course: Course;
  majors: Major[];
  topics: Entity[];
};

export const CourseReport = ({ units, course, majors, topics }: Props) => {
  const [viableCombinations, setViableCombinations] = React.useState(null);

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
    const result = finder.combinationReport();

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

  return (
    <div>
      <h3>Completion Criteria</h3>
      <h4>Total: {Math.round(completion * 100)}%</h4>
      <div>
        Completed: {Math.round(completed)} / {finder.courseCompletionCriteria.totalCredits}
      </div>
      <div>
        Missing: {Math.round(missing)} / {available}
      </div>
      <div>All combinations: {totalCombinationCount}</div>
      <div>
        Viable combinations: {viableCombinations ? viableCombinations.length : 'Loading ...'}
      </div>

      <div style={{ marginTop: '16px' }}>
        {profile.map((p, i) => {
          const used = finder.study
            .flatMap(s => s)
            .filter(f => f.topics.some(t => t.id === p.topicId));

          const unused = finder.requiredDoing
            .concat(finder.optionalDoing)
            .filter(f => f.node.topics.some(t => t.id === p.topicId));

          const total = unused
            .flatMap(u => u.node.topics)
            .filter(t => t.id === p.topicId)
            .reduce((prev, next) => prev + next.credits, 0);

          const completed = used
            .flatMap(u => u.topics)
            .filter(t => t.id === p.topicId)
            .reduce((prev, next) => prev + next.credits, 0);

          const criteria = finder.courseCompletionCriteria.topics.find(t => t.id === p.topicId);

          // const combinations = [];

          // const gNodes: GNode[] = unused
          //   .map((u) => ({
          //     ...u,
          //     topicCredits: u.node.topics.find((t) => t.id === p.topicId)
          //       .credits,
          //   }))
          //   .sort((a, b) => (a.topicCredits < b.topicCredits ? 1 : -1));

          // console.log("=======================================");
          // console.log("Combinations for: " + p.name);
          // console.log("=======================================");

          // generateCombinations(
          //   null,
          //   gNodes,
          //   p.topicId,
          //   criteria.credits,
          //   combinations
          // );

          // console.log(combinations.length + " combination(s)");

          const report = combinationReport.find(t => t.id === p.topicId);

          return (
            <div style={{ color: p.completion >= 100 ? 'green' : 'red' }}>
              {p.name}{' '}
              {`${finder.courseCompletionCriteria.topics.find(t => t.id === p.topicId).credits}c`}/{' '}
              {Math.round(p.credits * 10) / 10}c / {Math.round((p.missing || 0) * 10) / 10}c /{' '}
              {p.completion} %
              <div
                style={{
                  maxWidth: 350,
                  paddingLeft: 20,
                  color: 'black',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
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
                {criteria.credits - completed - total > 0 ? (
                  <div>
                    <span role="img">🤬</span> Missing {round(criteria.credits - completed - total)}{' '}
                    credits
                  </div>
                ) : null}

                {criteria.credits - completed - total < 0 ? (
                  <div>
                    <span role="img">👍 </span> Available {round(total)} credits,{' '}
                    <span
                      style={{
                        background: report.missing ? 'salmon' : 'lightGreen',
                        borderRadius: 3,
                        padding: 2
                      }}
                      title={combinationReport
                        .find(t => t.id === p.topicId)
                        .combinations.map(c =>
                          c.map(p => logSimpleName(p, false, false)).join(', ')
                        )
                        .join('\n')}
                    >
                      {report.combinations.length} combination(s) for {report.missing} c
                    </span>
                  </div>
                ) : null}

                {unused.map(n => (
                  <div key={n.node.id} title={logSimpleName(n)}>
                    {required.some(r => r.node === n.node) ? '!' : '-'}{' '}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 40
                      }}
                    >
                      {round(n.node.topics.find(t => t.id === p.topicId).credits)}c
                    </span>{' '}
                    {logSimpleName(n)}{' '}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { Block, CourseCompletionCriteria, CourseConfig } from 'components/types';

function round(num: number) {
  return Math.round(num * 100) / 100;
}

export function processReport(
  db: CourseConfig,
  completionCriteria: CourseCompletionCriteria,
  blocks: Block[]
) {
  let credits = {};
  let report = [];

  // check course
  for (let topic of completionCriteria.topics || []) {
    const topicBlocks = blocks.filter(b => (b.topics || []).some(t => t.id === topic.id));

    if (credits[topic.id] == null) {
      credits[topic.id] = round(
        topicBlocks.reduce((prev, next) => {
          let blockTopic = next.topics.find(t => t.id === topic.id);
          return next.credits * blockTopic.ratio + prev;
        }, 0)
      );
    }
    let t = db.topics.find(tp => tp.id === topic.id);
    const units = db.units.filter(u =>
      u.blocks.some(b => (b.topics || []).some(t => t.id === topic.id))
    );
    let info = units.map(u => ({
      id: u.id,
      name: u.name,
      blocks: u.blocks
        .filter(b => (b.topics || []).some(t => t.id === topic.id))
        .map(b => ({ id: b.id, name: b.name }))
    }));

    if (credits[topic.id] < topic.credits) {
      report.push({
        type: 'error',
        text: `Insufficient credits for topic "${t.name}" ${credits[topic.id]} / ${topic.credits}`,
        info
      });
    } else if (credits[topic.id] - topic.credits <= 10) {
      report.push({
        type: 'warning',
        text: `Possibly needs more credits ${credits[topic.id]} / ${topic.credits} for topic "${
          t.name
        }" from ${units.length} units and ${topicBlocks.length} blocks`,
        info
      });
    } else {
      report.push({
        type: 'info',
        text: `Available ${credits[topic.id]} / ${topic.credits} credits for topic "${
          t.name
        }" from ${units.length} units and ${topicBlocks.length} blocks`,
        info
      });
    }
  }

  return report;
}

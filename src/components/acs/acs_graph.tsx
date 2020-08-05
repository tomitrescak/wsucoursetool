import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries
} from 'react-vis';

import { skills } from 'components/outcomes/outcome_editor';
import { Unit, AcsKnowledge } from 'components/types';
import { Pane, Heading, TextInputField } from 'evergreen-ui';

type AcsGraphProps = {
  units: Unit[];
  acs: AcsKnowledge[];
};

export const AcsGraph = ({ units, acs }: AcsGraphProps) => {
  const titles = {};

  let bars = skills.map((s, i) => {
    let ascSkill = acs.flatMap(k => k.items).find(k => k.id === s);
    // find maximum

    let max = units.reduce((max, unit) => {
      if (unit.blocks) {
        let maxValue = unit.blocks.reduce((blockMax, block) => {
          let maxBlockValue = block.outcomes?.find(o => o.acsSkillId === s)?.bloomRating || 0;
          return blockMax < maxBlockValue ? maxBlockValue : blockMax;
        }, unit.outcomes?.find(o => o.acsSkillId === s)?.bloomRating || 0);
        return max < maxValue ? maxValue : max;
      }
      return unit.outcomes?.find(o => o.acsSkillId === s)?.bloomRating || 0;
    }, 0);

    titles[i] = ascSkill.name;

    return { y: i, x: max };
  });

  return (
    <Pane>
      <Heading>ACS CBOK Breakdown</Heading>
      <XYPlot height={400} width={400} margin={{ left: 200 }} xDomain={[0, 6]}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickValues={[0, 1, 2, 3, 4, 5, 6]}
          hideTicks={false}
          tickFormat={e => Math.round(e) as any}
        />
        <YAxis
          tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
          tickFormat={e => titles[e]}
          width={200}
        />

        <HorizontalBarSeries data={bars} barWidth={0.7} />
      </XYPlot>
      <TextInputField label="Values" value={bars.map(b => b.x).join('\t')} />

      <Pane elevation={2}></Pane>
    </Pane>
  );
};
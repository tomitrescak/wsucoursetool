import React from 'react';
import { observer } from 'mobx-react';
import { Pane, Heading } from 'evergreen-ui';

import { StudentModel } from 'components/classes';
import { useJobQuery, useUnitsWithDetailsQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';

import { CircularProgressbar } from 'react-circular-progressbar';
import { Unit } from 'components/types';

type MatchedJobParams = {
  index: number;
  id: string;
  name: string;
  localState: any;
  student: StudentModel;
};

function uniqueValues(array: string[]) {
  return Array.from(new Set(array));
}

export const MatchedJob = observer(({ index, id, name, student, localState }: MatchedJobParams) => {
  const { loading, error, data } = useJobQuery({
    variables: {
      id: id
    }
  });

  const ids = uniqueValues(student.registeredBlocks.map(b => b.unitId));

  const { loading: unitsLoading, error: unitsError, data: unitsData } = useUnitsWithDetailsQuery({
    variables: {
      ids
    }
  });

  if (loading || error || unitsLoading || unitsError) {
    return <ProgressView loading={loading || unitsLoading} error={error || unitsError} />;
  }

  var allStudentSkills = [];
  var studentSkill;
  var allJobSkills = [];

  data.job.skills.map((skill, i) => {
    allJobSkills.push(skill.bloomRating);

    studentSkill = {};
    studentSkill['skillId'] = skill.skillId;
    studentSkill['skillLevel'] = 0;
    allStudentSkills.push(studentSkill);
  });
  console.log(allJobSkills);
  console.log(allStudentSkills);

  for (var block of student.registeredBlocks) {
    const unit: Unit = unitsData.unitsWithDetails.find(u => u.id == block.unitId);
    console.log(unit);
    for (var i = 0; i < allStudentSkills.length; i++) {
      var unitOutcomes = unit.outcomes.find(s => s.acsSkillId === allStudentSkills[i].skillId);
      if (unitOutcomes && unitOutcomes.bloomRating > allStudentSkills[i].skillLevel) {
        allStudentSkills[i].skillLevel = unitOutcomes.bloomRating;
      }
    }
  }

  var studentTotal = 0;
  var skillsPercentage = [];
  for (var i = 0; i < allStudentSkills.length; i++) {
    if (allStudentSkills[i].skillLevel < allJobSkills[i]) {
      skillsPercentage.push(allStudentSkills[i].skillLevel / allJobSkills[i]);
    } else {
      skillsPercentage.push(1);
    }
  }

  for (var i = 0; i < skillsPercentage.length; i++) {
    studentTotal += skillsPercentage[i];
  }
  var percentage = Math.round((studentTotal / allJobSkills.length) * 100) + '%';

  if (!localState.showMoreJobs && index < 3) {
    return (
      <Pane display="flex" key={index} marginBottom={8}>
        <Pane flex={0.3}>
          <Heading size={400}>{name}</Heading>
        </Pane>
        <Pane flex={1}>
          <div>
            <div style={{ width: '10%' }}>
              <CircularProgressbar value={parseInt(percentage)} text={`${percentage}`} />
            </div>
          </div>
        </Pane>
      </Pane>
    );
  } else if (localState.showMoreJobs) {
    return (
      <Pane display="flex" key={index} marginBottom={8}>
        <Pane flex={0.3}>
          <Heading size={400}>{name}</Heading>
        </Pane>
        <Pane flex={1}>
          <div>
            <div style={{ width: '10%' }}>
              <CircularProgressbar value={parseInt(percentage)} text={`${percentage}`} />
            </div>
          </div>
        </Pane>
      </Pane>
    );
  }
});

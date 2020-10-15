import { CourseCompletionCriteriaModel } from 'components/classes';
import { Heading, Pane } from 'evergreen-ui';
import React from 'react';
import {
  CourseCompletionAcsEditor,
  CourseCompletionSfiaEditor
} from './course_framework_completion_editor';
import {
  CourseCompletionAcsView,
  CourseCompletionSfiaView
} from './course_framework_completion_view';
import { CourseTopicUnitEditor } from './course_topic_completion_editor';
import { CourseTopicUnitView } from './course_topic_completion_view';
import { CourseCompletionUnitEditor } from './course_unit_completion_editor';
import { CourseCompletionUnitView } from './course_unit_completion_view';

type CriteriaProps = {
  criteria: CourseCompletionCriteriaModel;
};

const CourseCompletionCriteriaView = ({ criteria }: CriteriaProps) => {
  return (
    <Pane paddingTop={8}>
      {criteria.units.length > 0 && <CourseCompletionUnitView criteria={criteria} />}
      {criteria.topics.length > 0 && <CourseTopicUnitView criteria={criteria} />}
      {criteria.sfia.length > 0 && <CourseCompletionSfiaView criteria={criteria} />}
      {criteria.acs.length > 0 && <CourseCompletionAcsView criteria={criteria} />}
    </Pane>
  );
};

const CourseCompletionCriteriaEditor = ({ criteria }: CriteriaProps) => {
  return (
    <>
      <CourseCompletionUnitEditor criteria={criteria} />
      <CourseTopicUnitEditor criteria={criteria} />
      <CourseCompletionSfiaEditor criteria={criteria} />
      <CourseCompletionAcsEditor criteria={criteria} />
    </>
  );
};

type Props = {
  criteria: CourseCompletionCriteriaModel;
  readonly: boolean;
};

export const CourseCompletionCriteriaRoot = ({ criteria, readonly }: Props) => {
  if (readonly) {
    return <CourseCompletionCriteriaView criteria={criteria} />;
  }
  return <CourseCompletionCriteriaEditor criteria={criteria} />;
};

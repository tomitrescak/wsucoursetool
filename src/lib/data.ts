import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

export const SAVE = gql`
  mutation SaveCourses($courses: String!) {
    saveCourses(courses: $courses)
  }
`;

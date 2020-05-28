import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const SAVE = gql`
  mutation SaveCourses($courses: String!) {
    saveCourses(courses: $courses)
  }
`;

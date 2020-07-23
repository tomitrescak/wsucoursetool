import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { CourseAdmin } from './course_admin';

const QUERY = gql`
  query LoadCourses {
    loadCourses
  }
`;

export function AdminContainer({ readonly }) {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(QUERY, {
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true
  });

  if (error) return <div>Error loading</div>;
  if (loading) return <div>Loading ...</div>;

  return (
    <>
      <CourseAdmin readonly={readonly} data={JSON.parse(data.loadCourses)} />
    </>
  );
}

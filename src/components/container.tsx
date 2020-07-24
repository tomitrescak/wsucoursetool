import React from 'react';
import { useLoadCoursesQuery } from 'config/graphql';

import { CourseAdmin } from './course_admin';

export function AdminContainer({ readonly }) {
  // const { loading, error, data } = useLoadCoursesQuery();

  // if (error) return <div>Error loading</div>;
  // if (loading) return <div>Loading ...</div>;

  return <CourseAdmin readonly={readonly} />;
}

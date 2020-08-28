import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};


export type UnitList = {
  id: Scalars['String'];
  name: Scalars['String'];
  blockCount: Scalars['Int'];
  dynamic: Scalars['Boolean'];
};

export type Entity = {
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type SpecialisationList = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type JobList = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TopicList = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type BlockList = {
  id: Scalars['String'];
  unitId: Scalars['String'];
  name: Scalars['String'];
};

export type Identifiable = {
  id?: Maybe<Scalars['String']>;
};

export type MajorList = {
  id: Scalars['String'];
  name: Scalars['String'];
  units: Array<Identifiable>;
};

export type CourseList = {
  id: Scalars['String'];
  name: Scalars['String'];
  majors: Array<MajorList>;
  core: Array<Identifiable>;
};

export type Student = {
  id: Scalars['String'];
  fname: Scalars['String'];
  lname: Scalars['String'];
};

export type Query = {
  legacyUnits?: Maybe<Scalars['String']>;
  unit: Scalars['JSON'];
  unitBase?: Maybe<Scalars['JSON']>;
  units: Array<UnitList>;
  course: Scalars['JSON'];
  courses: Array<CourseList>;
  courseUnits: Scalars['JSON'];
  jobs: Array<JobList>;
  job: Scalars['JSON'];
  specialisations: Array<SpecialisationList>;
  specialisation: Scalars['JSON'];
  keywords: Array<Scalars['String']>;
  blocks: Array<BlockList>;
  acs: Scalars['JSON'];
  sfia: Scalars['JSON'];
  topics: Array<TopicList>;
  students: Array<Student>;
};


export type QueryUnitArgs = {
  id: Scalars['String'];
};


export type QueryUnitBaseArgs = {
  id: Scalars['String'];
};


export type QueryCourseArgs = {
  id: Scalars['String'];
};


export type QueryCourseUnitsArgs = {
  id: Scalars['String'];
};


export type QueryJobArgs = {
  id: Scalars['String'];
};


export type QuerySpecialisationArgs = {
  id: Scalars['String'];
};

export type Mutation = {
  createUnit: UnitList;
  deleteUnit?: Maybe<Scalars['Boolean']>;
  createJob?: Maybe<Scalars['Boolean']>;
  deleteJob?: Maybe<Scalars['Boolean']>;
  createSpecialisation?: Maybe<Scalars['Boolean']>;
  deleteSpecialisation?: Maybe<Scalars['Boolean']>;
  createCourse?: Maybe<Scalars['Boolean']>;
  deleteCourse?: Maybe<Scalars['Boolean']>;
  save: Scalars['Boolean'];
};


export type MutationCreateUnitArgs = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type MutationDeleteUnitArgs = {
  id: Scalars['String'];
};


export type MutationCreateJobArgs = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type MutationDeleteJobArgs = {
  id: Scalars['String'];
};


export type MutationCreateSpecialisationArgs = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type MutationDeleteSpecialisationArgs = {
  id: Scalars['String'];
};


export type MutationCreateCourseArgs = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['String'];
};


export type MutationSaveArgs = {
  part: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  body: Scalars['JSON'];
};

export type AcsQueryVariables = Exact<{ [key: string]: never; }>;


export type AcsQuery = Pick<Query, 'acs'>;

export type BlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type BlocksQuery = { blocks: Array<Pick<BlockList, 'id' | 'name' | 'unitId'>> };

export type CreateCourseMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateCourseMutation = Pick<Mutation, 'createCourse'>;

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCourseMutation = Pick<Mutation, 'deleteCourse'>;

export type CourseQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type CourseQuery = (
  Pick<Query, 'course' | 'courseUnits' | 'acs'>
  & { units: Array<Pick<UnitList, 'blockCount' | 'id' | 'name' | 'dynamic'>>, topics: Array<Pick<TopicList, 'id' | 'name'>> }
);

export type CourseListQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseListQuery = { units: Array<Pick<UnitList, 'blockCount' | 'id' | 'name' | 'dynamic'>>, courses: Array<(
    Pick<CourseList, 'id' | 'name'>
    & { core: Array<Pick<Identifiable, 'id'>>, majors: Array<(
      Pick<MajorList, 'id' | 'name'>
      & { units: Array<Pick<Identifiable, 'id'>> }
    )> }
  )> };

export type CreateJobMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateJobMutation = Pick<Mutation, 'createJob'>;

export type DeleteJobMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteJobMutation = Pick<Mutation, 'deleteJob'>;

export type JobQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type JobQuery = Pick<Query, 'job' | 'acs'>;

export type JobsQueryVariables = Exact<{ [key: string]: never; }>;


export type JobsQuery = { jobs: Array<Pick<JobList, 'id' | 'name'>> };

export type PrerequisitesQueryVariables = Exact<{ [key: string]: never; }>;


export type PrerequisitesQuery = (
  Pick<Query, 'acs'>
  & { topics: Array<Pick<TopicList, 'id' | 'name'>>, blocks: Array<Pick<BlockList, 'id' | 'name' | 'unitId'>> }
);

export type SaveConfigMutationVariables = Exact<{
  part: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  body: Scalars['JSON'];
}>;


export type SaveConfigMutation = Pick<Mutation, 'save'>;

export type SfiaQueryVariables = Exact<{ [key: string]: never; }>;


export type SfiaQuery = Pick<Query, 'sfia' | 'acs'>;

export type CreateSpecialisationMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateSpecialisationMutation = Pick<Mutation, 'createSpecialisation'>;

export type DeleteSpecialisationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSpecialisationMutation = Pick<Mutation, 'deleteSpecialisation'>;

export type SpecialisationQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type SpecialisationQuery = Pick<Query, 'specialisation'>;

export type SpecialisationsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpecialisationsQuery = { specialisations: Array<Pick<SpecialisationList, 'id' | 'name'>> };

export type StudentListQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentListQuery = { students: Array<Pick<Student, 'id' | 'fname' | 'lname'>>, units: Array<Pick<UnitList, 'id' | 'name'>> };

export type TopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsQuery = { topics: Array<Pick<TopicList, 'id' | 'name'>> };

export type CreateUnitMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateUnitMutation = { createUnit: Pick<UnitList, 'id' | 'name' | 'dynamic' | 'blockCount'> };

export type UnitBaseQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UnitBaseQuery = Pick<Query, 'unitBase'>;

export type DeleteUnitMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUnitMutation = Pick<Mutation, 'deleteUnit'>;

export type UnitQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UnitQuery = Pick<Query, 'unit' | 'acs' | 'keywords'>;

export type UnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnitsQuery = { units: Array<Pick<UnitList, 'blockCount' | 'dynamic' | 'id' | 'name'>> };


export const AcsDocument = gql`
    query Acs {
  acs
}
    `;

/**
 * __useAcsQuery__
 *
 * To run a query within a React component, call `useAcsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAcsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAcsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAcsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AcsQuery, AcsQueryVariables>) {
        return ApolloReactHooks.useQuery<AcsQuery, AcsQueryVariables>(AcsDocument, baseOptions);
      }
export function useAcsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AcsQuery, AcsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AcsQuery, AcsQueryVariables>(AcsDocument, baseOptions);
        }
export type AcsQueryHookResult = ReturnType<typeof useAcsQuery>;
export type AcsLazyQueryHookResult = ReturnType<typeof useAcsLazyQuery>;
export type AcsQueryResult = ApolloReactCommon.QueryResult<AcsQuery, AcsQueryVariables>;
export const BlocksDocument = gql`
    query Blocks {
  blocks {
    id
    name
    unitId
  }
}
    `;

/**
 * __useBlocksQuery__
 *
 * To run a query within a React component, call `useBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlocksQuery({
 *   variables: {
 *   },
 * });
 */
export function useBlocksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<BlocksQuery, BlocksQueryVariables>) {
        return ApolloReactHooks.useQuery<BlocksQuery, BlocksQueryVariables>(BlocksDocument, baseOptions);
      }
export function useBlocksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BlocksQuery, BlocksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<BlocksQuery, BlocksQueryVariables>(BlocksDocument, baseOptions);
        }
export type BlocksQueryHookResult = ReturnType<typeof useBlocksQuery>;
export type BlocksLazyQueryHookResult = ReturnType<typeof useBlocksLazyQuery>;
export type BlocksQueryResult = ApolloReactCommon.QueryResult<BlocksQuery, BlocksQueryVariables>;
export const CreateCourseDocument = gql`
    mutation CreateCourse($id: String!, $name: String!) {
  createCourse(id: $id, name: $name)
}
    `;
export type CreateCourseMutationFn = ApolloReactCommon.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

/**
 * __useCreateCourseMutation__
 *
 * To run a mutation, you first call `useCreateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCourseMutation, { data, loading, error }] = useCreateCourseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateCourseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, baseOptions);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = ApolloReactCommon.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const DeleteCourseDocument = gql`
    mutation DeleteCourse($id: String!) {
  deleteCourse(id: $id)
}
    `;
export type DeleteCourseMutationFn = ApolloReactCommon.MutationFunction<DeleteCourseMutation, DeleteCourseMutationVariables>;

/**
 * __useDeleteCourseMutation__
 *
 * To run a mutation, you first call `useDeleteCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCourseMutation, { data, loading, error }] = useDeleteCourseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCourseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCourseMutation, DeleteCourseMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument, baseOptions);
      }
export type DeleteCourseMutationHookResult = ReturnType<typeof useDeleteCourseMutation>;
export type DeleteCourseMutationResult = ApolloReactCommon.MutationResult<DeleteCourseMutation>;
export type DeleteCourseMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const CourseDocument = gql`
    query Course($id: String!) {
  course(id: $id)
  courseUnits(id: $id)
  units {
    blockCount
    id
    name
    dynamic
  }
  acs
  topics {
    id
    name
  }
}
    `;

/**
 * __useCourseQuery__
 *
 * To run a query within a React component, call `useCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCourseQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseQuery, CourseQueryVariables>) {
        return ApolloReactHooks.useQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
      }
export function useCourseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseQuery, CourseQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CourseQuery, CourseQueryVariables>(CourseDocument, baseOptions);
        }
export type CourseQueryHookResult = ReturnType<typeof useCourseQuery>;
export type CourseLazyQueryHookResult = ReturnType<typeof useCourseLazyQuery>;
export type CourseQueryResult = ApolloReactCommon.QueryResult<CourseQuery, CourseQueryVariables>;
export const CourseListDocument = gql`
    query CourseList {
  units {
    blockCount
    id
    name
    dynamic
  }
  courses {
    id
    name
    core {
      id
    }
    majors {
      id
      name
      units {
        id
      }
    }
  }
}
    `;

/**
 * __useCourseListQuery__
 *
 * To run a query within a React component, call `useCourseListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseListQuery({
 *   variables: {
 *   },
 * });
 */
export function useCourseListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseListQuery, CourseListQueryVariables>) {
        return ApolloReactHooks.useQuery<CourseListQuery, CourseListQueryVariables>(CourseListDocument, baseOptions);
      }
export function useCourseListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseListQuery, CourseListQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CourseListQuery, CourseListQueryVariables>(CourseListDocument, baseOptions);
        }
export type CourseListQueryHookResult = ReturnType<typeof useCourseListQuery>;
export type CourseListLazyQueryHookResult = ReturnType<typeof useCourseListLazyQuery>;
export type CourseListQueryResult = ApolloReactCommon.QueryResult<CourseListQuery, CourseListQueryVariables>;
export const CreateJobDocument = gql`
    mutation CreateJob($id: String!, $name: String!) {
  createJob(id: $id, name: $name)
}
    `;
export type CreateJobMutationFn = ApolloReactCommon.MutationFunction<CreateJobMutation, CreateJobMutationVariables>;

/**
 * __useCreateJobMutation__
 *
 * To run a mutation, you first call `useCreateJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createJobMutation, { data, loading, error }] = useCreateJobMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateJobMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateJobMutation, CreateJobMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateJobMutation, CreateJobMutationVariables>(CreateJobDocument, baseOptions);
      }
export type CreateJobMutationHookResult = ReturnType<typeof useCreateJobMutation>;
export type CreateJobMutationResult = ApolloReactCommon.MutationResult<CreateJobMutation>;
export type CreateJobMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateJobMutation, CreateJobMutationVariables>;
export const DeleteJobDocument = gql`
    mutation DeleteJob($id: String!) {
  deleteJob(id: $id)
}
    `;
export type DeleteJobMutationFn = ApolloReactCommon.MutationFunction<DeleteJobMutation, DeleteJobMutationVariables>;

/**
 * __useDeleteJobMutation__
 *
 * To run a mutation, you first call `useDeleteJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteJobMutation, { data, loading, error }] = useDeleteJobMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteJobMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteJobMutation, DeleteJobMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteJobMutation, DeleteJobMutationVariables>(DeleteJobDocument, baseOptions);
      }
export type DeleteJobMutationHookResult = ReturnType<typeof useDeleteJobMutation>;
export type DeleteJobMutationResult = ApolloReactCommon.MutationResult<DeleteJobMutation>;
export type DeleteJobMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteJobMutation, DeleteJobMutationVariables>;
export const JobDocument = gql`
    query Job($id: String!) {
  job(id: $id)
  acs
}
    `;

/**
 * __useJobQuery__
 *
 * To run a query within a React component, call `useJobQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useJobQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<JobQuery, JobQueryVariables>) {
        return ApolloReactHooks.useQuery<JobQuery, JobQueryVariables>(JobDocument, baseOptions);
      }
export function useJobLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<JobQuery, JobQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<JobQuery, JobQueryVariables>(JobDocument, baseOptions);
        }
export type JobQueryHookResult = ReturnType<typeof useJobQuery>;
export type JobLazyQueryHookResult = ReturnType<typeof useJobLazyQuery>;
export type JobQueryResult = ApolloReactCommon.QueryResult<JobQuery, JobQueryVariables>;
export const JobsDocument = gql`
    query Jobs {
  jobs {
    id
    name
  }
}
    `;

/**
 * __useJobsQuery__
 *
 * To run a query within a React component, call `useJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobsQuery({
 *   variables: {
 *   },
 * });
 */
export function useJobsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<JobsQuery, JobsQueryVariables>) {
        return ApolloReactHooks.useQuery<JobsQuery, JobsQueryVariables>(JobsDocument, baseOptions);
      }
export function useJobsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<JobsQuery, JobsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<JobsQuery, JobsQueryVariables>(JobsDocument, baseOptions);
        }
export type JobsQueryHookResult = ReturnType<typeof useJobsQuery>;
export type JobsLazyQueryHookResult = ReturnType<typeof useJobsLazyQuery>;
export type JobsQueryResult = ApolloReactCommon.QueryResult<JobsQuery, JobsQueryVariables>;
export const PrerequisitesDocument = gql`
    query Prerequisites {
  acs
  topics {
    id
    name
  }
  blocks {
    id
    name
    unitId
  }
}
    `;

/**
 * __usePrerequisitesQuery__
 *
 * To run a query within a React component, call `usePrerequisitesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrerequisitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrerequisitesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePrerequisitesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PrerequisitesQuery, PrerequisitesQueryVariables>) {
        return ApolloReactHooks.useQuery<PrerequisitesQuery, PrerequisitesQueryVariables>(PrerequisitesDocument, baseOptions);
      }
export function usePrerequisitesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PrerequisitesQuery, PrerequisitesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<PrerequisitesQuery, PrerequisitesQueryVariables>(PrerequisitesDocument, baseOptions);
        }
export type PrerequisitesQueryHookResult = ReturnType<typeof usePrerequisitesQuery>;
export type PrerequisitesLazyQueryHookResult = ReturnType<typeof usePrerequisitesLazyQuery>;
export type PrerequisitesQueryResult = ApolloReactCommon.QueryResult<PrerequisitesQuery, PrerequisitesQueryVariables>;
export const SaveConfigDocument = gql`
    mutation SaveConfig($part: String!, $id: String, $body: JSON!) {
  save(part: $part, id: $id, body: $body)
}
    `;
export type SaveConfigMutationFn = ApolloReactCommon.MutationFunction<SaveConfigMutation, SaveConfigMutationVariables>;

/**
 * __useSaveConfigMutation__
 *
 * To run a mutation, you first call `useSaveConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveConfigMutation, { data, loading, error }] = useSaveConfigMutation({
 *   variables: {
 *      part: // value for 'part'
 *      id: // value for 'id'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useSaveConfigMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveConfigMutation, SaveConfigMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveConfigMutation, SaveConfigMutationVariables>(SaveConfigDocument, baseOptions);
      }
export type SaveConfigMutationHookResult = ReturnType<typeof useSaveConfigMutation>;
export type SaveConfigMutationResult = ApolloReactCommon.MutationResult<SaveConfigMutation>;
export type SaveConfigMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveConfigMutation, SaveConfigMutationVariables>;
export const SfiaDocument = gql`
    query Sfia {
  sfia
  acs
}
    `;

/**
 * __useSfiaQuery__
 *
 * To run a query within a React component, call `useSfiaQuery` and pass it any options that fit your needs.
 * When your component renders, `useSfiaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSfiaQuery({
 *   variables: {
 *   },
 * });
 */
export function useSfiaQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SfiaQuery, SfiaQueryVariables>) {
        return ApolloReactHooks.useQuery<SfiaQuery, SfiaQueryVariables>(SfiaDocument, baseOptions);
      }
export function useSfiaLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SfiaQuery, SfiaQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SfiaQuery, SfiaQueryVariables>(SfiaDocument, baseOptions);
        }
export type SfiaQueryHookResult = ReturnType<typeof useSfiaQuery>;
export type SfiaLazyQueryHookResult = ReturnType<typeof useSfiaLazyQuery>;
export type SfiaQueryResult = ApolloReactCommon.QueryResult<SfiaQuery, SfiaQueryVariables>;
export const CreateSpecialisationDocument = gql`
    mutation CreateSpecialisation($id: String!, $name: String!) {
  createSpecialisation(id: $id, name: $name)
}
    `;
export type CreateSpecialisationMutationFn = ApolloReactCommon.MutationFunction<CreateSpecialisationMutation, CreateSpecialisationMutationVariables>;

/**
 * __useCreateSpecialisationMutation__
 *
 * To run a mutation, you first call `useCreateSpecialisationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecialisationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecialisationMutation, { data, loading, error }] = useCreateSpecialisationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateSpecialisationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSpecialisationMutation, CreateSpecialisationMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateSpecialisationMutation, CreateSpecialisationMutationVariables>(CreateSpecialisationDocument, baseOptions);
      }
export type CreateSpecialisationMutationHookResult = ReturnType<typeof useCreateSpecialisationMutation>;
export type CreateSpecialisationMutationResult = ApolloReactCommon.MutationResult<CreateSpecialisationMutation>;
export type CreateSpecialisationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSpecialisationMutation, CreateSpecialisationMutationVariables>;
export const DeleteSpecialisationDocument = gql`
    mutation DeleteSpecialisation($id: String!) {
  deleteSpecialisation(id: $id)
}
    `;
export type DeleteSpecialisationMutationFn = ApolloReactCommon.MutationFunction<DeleteSpecialisationMutation, DeleteSpecialisationMutationVariables>;

/**
 * __useDeleteSpecialisationMutation__
 *
 * To run a mutation, you first call `useDeleteSpecialisationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSpecialisationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSpecialisationMutation, { data, loading, error }] = useDeleteSpecialisationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSpecialisationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteSpecialisationMutation, DeleteSpecialisationMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteSpecialisationMutation, DeleteSpecialisationMutationVariables>(DeleteSpecialisationDocument, baseOptions);
      }
export type DeleteSpecialisationMutationHookResult = ReturnType<typeof useDeleteSpecialisationMutation>;
export type DeleteSpecialisationMutationResult = ApolloReactCommon.MutationResult<DeleteSpecialisationMutation>;
export type DeleteSpecialisationMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteSpecialisationMutation, DeleteSpecialisationMutationVariables>;
export const SpecialisationDocument = gql`
    query Specialisation($id: String!) {
  specialisation(id: $id)
}
    `;

/**
 * __useSpecialisationQuery__
 *
 * To run a query within a React component, call `useSpecialisationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpecialisationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpecialisationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSpecialisationQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SpecialisationQuery, SpecialisationQueryVariables>) {
        return ApolloReactHooks.useQuery<SpecialisationQuery, SpecialisationQueryVariables>(SpecialisationDocument, baseOptions);
      }
export function useSpecialisationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SpecialisationQuery, SpecialisationQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SpecialisationQuery, SpecialisationQueryVariables>(SpecialisationDocument, baseOptions);
        }
export type SpecialisationQueryHookResult = ReturnType<typeof useSpecialisationQuery>;
export type SpecialisationLazyQueryHookResult = ReturnType<typeof useSpecialisationLazyQuery>;
export type SpecialisationQueryResult = ApolloReactCommon.QueryResult<SpecialisationQuery, SpecialisationQueryVariables>;
export const SpecialisationsDocument = gql`
    query Specialisations {
  specialisations {
    id
    name
  }
}
    `;

/**
 * __useSpecialisationsQuery__
 *
 * To run a query within a React component, call `useSpecialisationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpecialisationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpecialisationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSpecialisationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SpecialisationsQuery, SpecialisationsQueryVariables>) {
        return ApolloReactHooks.useQuery<SpecialisationsQuery, SpecialisationsQueryVariables>(SpecialisationsDocument, baseOptions);
      }
export function useSpecialisationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SpecialisationsQuery, SpecialisationsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SpecialisationsQuery, SpecialisationsQueryVariables>(SpecialisationsDocument, baseOptions);
        }
export type SpecialisationsQueryHookResult = ReturnType<typeof useSpecialisationsQuery>;
export type SpecialisationsLazyQueryHookResult = ReturnType<typeof useSpecialisationsLazyQuery>;
export type SpecialisationsQueryResult = ApolloReactCommon.QueryResult<SpecialisationsQuery, SpecialisationsQueryVariables>;
export const StudentListDocument = gql`
    query StudentList {
  students {
    id
    fname
    lname
  }
  units {
    id
    name
  }
}
    `;

/**
 * __useStudentListQuery__
 *
 * To run a query within a React component, call `useStudentListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentListQuery({
 *   variables: {
 *   },
 * });
 */
export function useStudentListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StudentListQuery, StudentListQueryVariables>) {
        return ApolloReactHooks.useQuery<StudentListQuery, StudentListQueryVariables>(StudentListDocument, baseOptions);
      }
export function useStudentListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StudentListQuery, StudentListQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<StudentListQuery, StudentListQueryVariables>(StudentListDocument, baseOptions);
        }
export type StudentListQueryHookResult = ReturnType<typeof useStudentListQuery>;
export type StudentListLazyQueryHookResult = ReturnType<typeof useStudentListLazyQuery>;
export type StudentListQueryResult = ApolloReactCommon.QueryResult<StudentListQuery, StudentListQueryVariables>;
export const TopicsDocument = gql`
    query Topics {
  topics {
    id
    name
  }
}
    `;

/**
 * __useTopicsQuery__
 *
 * To run a query within a React component, call `useTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopicsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopicsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TopicsQuery, TopicsQueryVariables>) {
        return ApolloReactHooks.useQuery<TopicsQuery, TopicsQueryVariables>(TopicsDocument, baseOptions);
      }
export function useTopicsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TopicsQuery, TopicsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TopicsQuery, TopicsQueryVariables>(TopicsDocument, baseOptions);
        }
export type TopicsQueryHookResult = ReturnType<typeof useTopicsQuery>;
export type TopicsLazyQueryHookResult = ReturnType<typeof useTopicsLazyQuery>;
export type TopicsQueryResult = ApolloReactCommon.QueryResult<TopicsQuery, TopicsQueryVariables>;
export const CreateUnitDocument = gql`
    mutation CreateUnit($id: String!, $name: String!) {
  createUnit(id: $id, name: $name) {
    id
    name
    dynamic
    blockCount
  }
}
    `;
export type CreateUnitMutationFn = ApolloReactCommon.MutationFunction<CreateUnitMutation, CreateUnitMutationVariables>;

/**
 * __useCreateUnitMutation__
 *
 * To run a mutation, you first call `useCreateUnitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUnitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUnitMutation, { data, loading, error }] = useCreateUnitMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateUnitMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUnitMutation, CreateUnitMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateUnitMutation, CreateUnitMutationVariables>(CreateUnitDocument, baseOptions);
      }
export type CreateUnitMutationHookResult = ReturnType<typeof useCreateUnitMutation>;
export type CreateUnitMutationResult = ApolloReactCommon.MutationResult<CreateUnitMutation>;
export type CreateUnitMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUnitMutation, CreateUnitMutationVariables>;
export const UnitBaseDocument = gql`
    query UnitBase($id: String!) {
  unitBase(id: $id)
}
    `;

/**
 * __useUnitBaseQuery__
 *
 * To run a query within a React component, call `useUnitBaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnitBaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnitBaseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnitBaseQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UnitBaseQuery, UnitBaseQueryVariables>) {
        return ApolloReactHooks.useQuery<UnitBaseQuery, UnitBaseQueryVariables>(UnitBaseDocument, baseOptions);
      }
export function useUnitBaseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UnitBaseQuery, UnitBaseQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UnitBaseQuery, UnitBaseQueryVariables>(UnitBaseDocument, baseOptions);
        }
export type UnitBaseQueryHookResult = ReturnType<typeof useUnitBaseQuery>;
export type UnitBaseLazyQueryHookResult = ReturnType<typeof useUnitBaseLazyQuery>;
export type UnitBaseQueryResult = ApolloReactCommon.QueryResult<UnitBaseQuery, UnitBaseQueryVariables>;
export const DeleteUnitDocument = gql`
    mutation DeleteUnit($id: String!) {
  deleteUnit(id: $id)
}
    `;
export type DeleteUnitMutationFn = ApolloReactCommon.MutationFunction<DeleteUnitMutation, DeleteUnitMutationVariables>;

/**
 * __useDeleteUnitMutation__
 *
 * To run a mutation, you first call `useDeleteUnitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUnitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUnitMutation, { data, loading, error }] = useDeleteUnitMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUnitMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteUnitMutation, DeleteUnitMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteUnitMutation, DeleteUnitMutationVariables>(DeleteUnitDocument, baseOptions);
      }
export type DeleteUnitMutationHookResult = ReturnType<typeof useDeleteUnitMutation>;
export type DeleteUnitMutationResult = ApolloReactCommon.MutationResult<DeleteUnitMutation>;
export type DeleteUnitMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteUnitMutation, DeleteUnitMutationVariables>;
export const UnitDocument = gql`
    query Unit($id: String!) {
  unit(id: $id)
  acs
  keywords
}
    `;

/**
 * __useUnitQuery__
 *
 * To run a query within a React component, call `useUnitQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnitQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnitQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UnitQuery, UnitQueryVariables>) {
        return ApolloReactHooks.useQuery<UnitQuery, UnitQueryVariables>(UnitDocument, baseOptions);
      }
export function useUnitLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UnitQuery, UnitQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UnitQuery, UnitQueryVariables>(UnitDocument, baseOptions);
        }
export type UnitQueryHookResult = ReturnType<typeof useUnitQuery>;
export type UnitLazyQueryHookResult = ReturnType<typeof useUnitLazyQuery>;
export type UnitQueryResult = ApolloReactCommon.QueryResult<UnitQuery, UnitQueryVariables>;
export const UnitsDocument = gql`
    query Units {
  units {
    blockCount
    dynamic
    id
    name
  }
}
    `;

/**
 * __useUnitsQuery__
 *
 * To run a query within a React component, call `useUnitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnitsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnitsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UnitsQuery, UnitsQueryVariables>) {
        return ApolloReactHooks.useQuery<UnitsQuery, UnitsQueryVariables>(UnitsDocument, baseOptions);
      }
export function useUnitsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UnitsQuery, UnitsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UnitsQuery, UnitsQueryVariables>(UnitsDocument, baseOptions);
        }
export type UnitsQueryHookResult = ReturnType<typeof useUnitsQuery>;
export type UnitsLazyQueryHookResult = ReturnType<typeof useUnitsLazyQuery>;
export type UnitsQueryResult = ApolloReactCommon.QueryResult<UnitsQuery, UnitsQueryVariables>;
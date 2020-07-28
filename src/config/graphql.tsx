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

export type Query = {
  loadCourses?: Maybe<Scalars['String']>;
  loadUnits?: Maybe<Scalars['String']>;
  loadUnitList: Array<UnitList>;
  courseList: Array<CourseList>;
  blocks: Array<BlockList>;
  unit: Scalars['JSON'];
  course: Scalars['JSON'];
  acs: Scalars['JSON'];
  sfia: Scalars['JSON'];
  jobs: Array<JobList>;
  job: Scalars['JSON'];
  topics: Array<TopicList>;
  specialisations: Array<SpecialisationList>;
  specialisation: Scalars['JSON'];
};


export type QueryUnitArgs = {
  id: Scalars['String'];
};


export type QueryCourseArgs = {
  id: Scalars['String'];
};


export type QueryJobArgs = {
  id: Scalars['String'];
};


export type QuerySpecialisationArgs = {
  id: Scalars['String'];
};

export type Mutation = {
  saveCourses?: Maybe<Scalars['Boolean']>;
  createUnit: UnitList;
  deleteUnit?: Maybe<Scalars['Boolean']>;
  createJob?: Maybe<Scalars['Boolean']>;
  deleteJob?: Maybe<Scalars['Boolean']>;
  createSpecialisation?: Maybe<Scalars['Boolean']>;
  deleteSpecialisation?: Maybe<Scalars['Boolean']>;
  save: Scalars['Boolean'];
};


export type MutationSaveCoursesArgs = {
  courses?: Maybe<Scalars['String']>;
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


export type MutationSaveArgs = {
  part: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  body: Scalars['JSON'];
};

export type AcsQueryVariables = Exact<{ [key: string]: never; }>;


export type AcsQuery = Pick<Query, 'acs'>;

export type BlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type BlocksQuery = { blocks: Array<Pick<BlockList, 'id' | 'name' | 'unitId'>> };

export type CourseListQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseListQuery = { loadUnitList: Array<Pick<UnitList, 'blockCount' | 'id' | 'name' | 'dynamic'>>, courseList: Array<(
    Pick<CourseList, 'id' | 'name'>
    & { core: Array<Pick<Identifiable, 'id'>>, majors: Array<(
      Pick<MajorList, 'id' | 'name'>
      & { units: Array<Pick<Identifiable, 'id'>> }
    )> }
  )> };

export type LoadCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadCoursesQuery = Pick<Query, 'loadCourses'>;

export type SaveCoursesMutationVariables = Exact<{
  courses: Scalars['String'];
}>;


export type SaveCoursesMutation = Pick<Mutation, 'saveCourses'>;

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

export type TopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsQuery = { topics: Array<Pick<TopicList, 'id' | 'name'>> };

export type CreateUnitMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateUnitMutation = { createUnit: Pick<UnitList, 'id' | 'name' | 'dynamic' | 'blockCount'> };

export type DeleteUnitMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUnitMutation = Pick<Mutation, 'deleteUnit'>;

export type UnitQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UnitQuery = Pick<Query, 'unit'>;


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
export const CourseListDocument = gql`
    query CourseList {
  loadUnitList {
    blockCount
    id
    name
    dynamic
  }
  courseList {
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
export const LoadCoursesDocument = gql`
    query LoadCourses {
  loadCourses
}
    `;

/**
 * __useLoadCoursesQuery__
 *
 * To run a query within a React component, call `useLoadCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoadCoursesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LoadCoursesQuery, LoadCoursesQueryVariables>) {
        return ApolloReactHooks.useQuery<LoadCoursesQuery, LoadCoursesQueryVariables>(LoadCoursesDocument, baseOptions);
      }
export function useLoadCoursesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LoadCoursesQuery, LoadCoursesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<LoadCoursesQuery, LoadCoursesQueryVariables>(LoadCoursesDocument, baseOptions);
        }
export type LoadCoursesQueryHookResult = ReturnType<typeof useLoadCoursesQuery>;
export type LoadCoursesLazyQueryHookResult = ReturnType<typeof useLoadCoursesLazyQuery>;
export type LoadCoursesQueryResult = ApolloReactCommon.QueryResult<LoadCoursesQuery, LoadCoursesQueryVariables>;
export const SaveCoursesDocument = gql`
    mutation SaveCourses($courses: String!) {
  saveCourses(courses: $courses)
}
    `;
export type SaveCoursesMutationFn = ApolloReactCommon.MutationFunction<SaveCoursesMutation, SaveCoursesMutationVariables>;

/**
 * __useSaveCoursesMutation__
 *
 * To run a mutation, you first call `useSaveCoursesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveCoursesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveCoursesMutation, { data, loading, error }] = useSaveCoursesMutation({
 *   variables: {
 *      courses: // value for 'courses'
 *   },
 * });
 */
export function useSaveCoursesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveCoursesMutation, SaveCoursesMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveCoursesMutation, SaveCoursesMutationVariables>(SaveCoursesDocument, baseOptions);
      }
export type SaveCoursesMutationHookResult = ReturnType<typeof useSaveCoursesMutation>;
export type SaveCoursesMutationResult = ApolloReactCommon.MutationResult<SaveCoursesMutation>;
export type SaveCoursesMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveCoursesMutation, SaveCoursesMutationVariables>;
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
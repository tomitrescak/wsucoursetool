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
  jobs: Array<Entity>;
  job: Scalars['JSON'];
  topics: Array<Entity>;
  specialisations: Array<Entity>;
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

export type CreateUnitMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateUnitMutation = { createUnit: Pick<UnitList, 'id' | 'name' | 'dynamic' | 'blockCount'> };

export type LoadCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadCoursesQuery = Pick<Query, 'loadCourses'>;

export type SaveCoursesMutationVariables = Exact<{
  courses: Scalars['String'];
}>;


export type SaveCoursesMutation = Pick<Mutation, 'saveCourses'>;

export type TopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsQuery = { topics: Array<Pick<Entity, 'id' | 'name'>> };

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
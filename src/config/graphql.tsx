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

export type UnitQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UnitQuery = Pick<Query, 'unit'>;


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
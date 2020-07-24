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
};

export type UnitList = {
  id: Scalars['String'];
  name: Scalars['String'];
  blockCount: Scalars['Int'];
};

export type Query = {
  loadCourses?: Maybe<Scalars['String']>;
  loadUnits?: Maybe<Scalars['String']>;
  loadUnitList: Array<UnitList>;
};

export type Mutation = {
  saveCourses?: Maybe<Scalars['Boolean']>;
};


export type MutationSaveCoursesArgs = {
  courses?: Maybe<Scalars['String']>;
};

export type LoadCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadCoursesQuery = Pick<Query, 'loadCourses'>;

export type SaveCoursesMutationVariables = Exact<{
  courses: Scalars['String'];
}>;


export type SaveCoursesMutation = Pick<Mutation, 'saveCourses'>;


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
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


export type BlockTopic = {
  id: Scalars['String'];
  ratio: Scalars['Float'];
};

export type BlockSkill = {
  id: Scalars['String'];
  level: Scalars['Float'];
  max?: Maybe<Scalars['Int']>;
};

export type Outcome = {
  acsSkillId?: Maybe<Scalars['String']>;
  bloomRating?: Maybe<Scalars['Int']>;
};

export type UnitBlock = {
  blockId: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  prerequisites?: Maybe<Array<Prerequisite>>;
  credits: Scalars['Float'];
  topics?: Maybe<Array<BlockTopic>>;
  sfiaSkills?: Maybe<Array<BlockSkill>>;
  outcomes?: Maybe<Array<Outcome>>;
};

export type UnitList = {
  id: Scalars['String'];
  name: Scalars['String'];
  blockCount?: Maybe<Scalars['Int']>;
  dynamic?: Maybe<Scalars['Boolean']>;
  obsolete?: Maybe<Scalars['Boolean']>;
  outdated?: Maybe<Scalars['Boolean']>;
  processed?: Maybe<Scalars['Boolean']>;
  proposed?: Maybe<Scalars['Boolean']>;
  contacted?: Maybe<Scalars['Boolean']>;
  fixed?: Maybe<Scalars['Boolean']>;
  hidden?: Maybe<Scalars['Boolean']>;
  topics?: Maybe<Array<Scalars['String']>>;
  level?: Maybe<Scalars['Int']>;
  offer?: Maybe<Array<Scalars['String']>>;
  credits?: Maybe<Scalars['Float']>;
  prerequisites?: Maybe<Array<Prerequisite>>;
  blocks?: Maybe<Array<UnitBlock>>;
  outcomes?: Maybe<Array<Outcome>>;
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

export type SfiaSkillLevel = {
  id?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
};

export type JobList = {
  id: Scalars['String'];
  name: Scalars['String'];
  invalid: Array<Scalars['String']>;
  sfia?: Maybe<Array<SfiaSkillLevel>>;
};

export type TopicList = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TopicBlock = {
  unitId: Scalars['String'];
  unitName: Scalars['String'];
  blockId: Scalars['String'];
  blockName: Scalars['String'];
};

export type TopicDetails = {
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  blocks: Array<TopicBlock>;
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
  completionCriteria: Scalars['JSON'];
};

export type CourseList = {
  id: Scalars['String'];
  name: Scalars['String'];
  completionCriteria: Scalars['JSON'];
  majors: Array<MajorList>;
};

export type Coordinator = {
  name: Scalars['String'];
  units: Array<UnitList>;
};

export type Prerequisite = {
  id?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  recommended?: Maybe<Scalars['Boolean']>;
  prerequisites?: Maybe<Scalars['JSON']>;
};

export type BlockDependency = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  prerequisites?: Maybe<Array<Prerequisite>>;
};

export type UnitDependency = {
  id: Scalars['String'];
  name: Scalars['String'];
  prerequisites?: Maybe<Array<Prerequisite>>;
  blocks?: Maybe<Scalars['JSON']>;
  level?: Maybe<Scalars['Int']>;
  processed?: Maybe<Scalars['Boolean']>;
};

export type SfiaUnit = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  flagged?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  legacyUnits?: Maybe<Scalars['String']>;
  unit: Scalars['JSON'];
  unitBase?: Maybe<Scalars['JSON']>;
  units: Array<UnitList>;
  unitDepenendencies: Array<UnitDependency>;
  coordinators: Array<Coordinator>;
  course: Scalars['JSON'];
  courses: Array<CourseList>;
  courseUnits: Scalars['JSON'];
  courseReport: Scalars['JSON'];
  jobs: Array<JobList>;
  job: Scalars['JSON'];
  specialisations: Array<SpecialisationList>;
  specialisation: Scalars['JSON'];
  keywords: Array<Scalars['String']>;
  blocks: Array<BlockList>;
  acs: Scalars['JSON'];
  sfia: Scalars['JSON'];
  sfiaUnits: Array<SfiaUnit>;
  topics: Array<TopicList>;
  topicsDetails: Array<TopicDetails>;
  db: Scalars['JSON'];
};


export type QueryUnitArgs = {
  id: Scalars['String'];
};


export type QueryUnitBaseArgs = {
  id: Scalars['String'];
};


export type QueryUnitsArgs = {
  maxLevel?: Maybe<Scalars['Int']>;
};


export type QueryUnitDepenendenciesArgs = {
  id: Scalars['String'];
};


export type QueryCourseArgs = {
  id: Scalars['String'];
};


export type QueryCourseUnitsArgs = {
  id: Scalars['String'];
};


export type QueryCourseReportArgs = {
  id: Scalars['String'];
};


export type QueryJobArgs = {
  id: Scalars['String'];
};


export type QuerySpecialisationArgs = {
  id: Scalars['String'];
};


export type QuerySfiaUnitsArgs = {
  id: Scalars['String'];
};

export type Mutation = {
  saveLegacyUnits?: Maybe<Scalars['Boolean']>;
  createUnit: Scalars['JSON'];
  deleteUnit?: Maybe<Scalars['Boolean']>;
  createJob?: Maybe<Scalars['Boolean']>;
  deleteJob?: Maybe<Scalars['Boolean']>;
  createSpecialisation?: Maybe<Scalars['Boolean']>;
  deleteSpecialisation?: Maybe<Scalars['Boolean']>;
  createCourse?: Maybe<Scalars['Boolean']>;
  deleteCourse?: Maybe<Scalars['Boolean']>;
  save: Scalars['Boolean'];
};


export type MutationSaveLegacyUnitsArgs = {
  units?: Maybe<Scalars['String']>;
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

export type DbQueryVariables = Exact<{ [key: string]: never; }>;


export type DbQuery = (
  Pick<Query, 'db'>
  & { courses: Array<(
    Pick<CourseList, 'id' | 'name' | 'completionCriteria'>
    & { majors: Array<Pick<MajorList, 'id' | 'name' | 'completionCriteria'>> }
  )>, topics: Array<Pick<TopicList, 'id' | 'name'>> }
);

export type BlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type BlocksQuery = { blocks: Array<Pick<BlockList, 'id' | 'name' | 'unitId'>> };

export type CoordinatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type CoordinatorsQuery = { coordinators: Array<(
    Pick<Coordinator, 'name'>
    & { units: Array<Pick<UnitList, 'id' | 'name' | 'level' | 'obsolete' | 'outdated' | 'processed'>> }
  )> };

export type CreateCourseMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateCourseMutation = Pick<Mutation, 'createCourse'>;

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCourseMutation = Pick<Mutation, 'deleteCourse'>;

export type PrerequisiteFragment = Pick<Prerequisite, 'id' | 'type' | 'unitId' | 'recommended' | 'prerequisites'>;

export type CourseQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type CourseQuery = (
  Pick<Query, 'course' | 'courseReport'>
  & { units: Array<(
    Pick<UnitList, 'blockCount' | 'id' | 'name' | 'offer' | 'level' | 'credits' | 'dynamic' | 'topics'>
    & { prerequisites?: Maybe<Array<PrerequisiteFragment>>, outcomes?: Maybe<Array<Pick<Outcome, 'acsSkillId' | 'bloomRating'>>>, blocks?: Maybe<Array<(
      Pick<UnitBlock, 'id' | 'name' | 'credits'>
      & { prerequisites?: Maybe<Array<PrerequisiteFragment>>, topics?: Maybe<Array<Pick<BlockTopic, 'id' | 'ratio'>>>, sfiaSkills?: Maybe<Array<Pick<BlockSkill, 'id' | 'level' | 'max'>>> }
    )>> }
  )>, topics: Array<Pick<TopicList, 'id' | 'name'>> }
);

export type CourseUnitsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type CourseUnitsQuery = Pick<Query, 'courseUnits'>;

export type CourseListQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseListQuery = { units: Array<Pick<UnitList, 'blockCount' | 'id' | 'name' | 'dynamic' | 'level' | 'obsolete' | 'outdated' | 'processed' | 'proposed' | 'contacted' | 'fixed' | 'hidden' | 'topics'>>, topics: Array<Pick<TopicList, 'id' | 'name'>>, courses: Array<(
    Pick<CourseList, 'id' | 'name' | 'completionCriteria'>
    & { majors: Array<Pick<MajorList, 'completionCriteria' | 'id' | 'name'>> }
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


export type JobQuery = Pick<Query, 'job' | 'acs' | 'sfia'>;

export type JobsQueryVariables = Exact<{ [key: string]: never; }>;


export type JobsQuery = { jobs: Array<Pick<JobList, 'id' | 'name' | 'invalid'>> };

export type JobsWithDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type JobsWithDetailsQuery = { jobs: Array<(
    Pick<JobList, 'id' | 'name' | 'invalid'>
    & { sfia?: Maybe<Array<Pick<SfiaSkillLevel, 'id' | 'level'>>> }
  )> };

export type PrerequisitesQueryVariables = Exact<{ [key: string]: never; }>;


export type PrerequisitesQuery = (
  Pick<Query, 'sfia'>
  & { topics: Array<Pick<TopicList, 'id' | 'name'>>, blocks: Array<Pick<BlockList, 'id' | 'name' | 'unitId'>> }
);

export type SaveConfigMutationVariables = Exact<{
  part: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  body: Scalars['JSON'];
}>;


export type SaveConfigMutation = Pick<Mutation, 'save'>;

export type SfiaQueryVariables = Exact<{ [key: string]: never; }>;


export type SfiaQuery = Pick<Query, 'sfia'>;

export type SfiaUnitsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type SfiaUnitsQuery = { sfiaUnits: Array<Pick<SfiaUnit, 'id' | 'name' | 'level' | 'flagged'>>, units: Array<Pick<UnitList, 'id' | 'name'>> };

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

export type TopicsDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsDetailsQuery = { topicsDetails: Array<(
    Pick<TopicDetails, 'id' | 'name' | 'description'>
    & { blocks: Array<Pick<TopicBlock, 'blockName' | 'unitId' | 'unitName'>> }
  )> };

export type TopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsQuery = { topics: Array<Pick<TopicList, 'id' | 'name'>> };

export type CreateUnitMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateUnitMutation = Pick<Mutation, 'createUnit'>;

export type SaveLegacyUnitsMutationVariables = Exact<{
  units: Scalars['String'];
}>;


export type SaveLegacyUnitsMutation = Pick<Mutation, 'saveLegacyUnits'>;

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


export type UnitQuery = (
  Pick<Query, 'unit' | 'keywords'>
  & { topics: Array<Pick<TopicList, 'id' | 'name'>> }
);

export type UnitDependenciesQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UnitDependenciesQuery = { unitDepenendencies: Array<(
    Pick<UnitDependency, 'id' | 'name' | 'blocks' | 'level' | 'processed'>
    & { prerequisites?: Maybe<Array<Pick<Prerequisite, 'id' | 'unitId' | 'type' | 'recommended' | 'prerequisites'>>> }
  )> };

export type UnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnitsQuery = { topics: Array<Pick<TopicList, 'id' | 'name'>>, units: Array<Pick<UnitList, 'blockCount' | 'dynamic' | 'topics' | 'id' | 'name' | 'level' | 'outdated' | 'obsolete' | 'processed' | 'proposed' | 'contacted' | 'fixed'>> };

export const PrerequisiteFragmentDoc = gql`
    fragment Prerequisite on Prerequisite {
  id
  type
  unitId
  recommended
  prerequisites
}
    `;
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
export const DbDocument = gql`
    query db {
  courses {
    id
    name
    completionCriteria
    majors {
      id
      name
      completionCriteria
    }
    name
  }
  topics {
    id
    name
  }
  db
}
    `;

/**
 * __useDbQuery__
 *
 * To run a query within a React component, call `useDbQuery` and pass it any options that fit your needs.
 * When your component renders, `useDbQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDbQuery({
 *   variables: {
 *   },
 * });
 */
export function useDbQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DbQuery, DbQueryVariables>) {
        return ApolloReactHooks.useQuery<DbQuery, DbQueryVariables>(DbDocument, baseOptions);
      }
export function useDbLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DbQuery, DbQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DbQuery, DbQueryVariables>(DbDocument, baseOptions);
        }
export type DbQueryHookResult = ReturnType<typeof useDbQuery>;
export type DbLazyQueryHookResult = ReturnType<typeof useDbLazyQuery>;
export type DbQueryResult = ApolloReactCommon.QueryResult<DbQuery, DbQueryVariables>;
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
export const CoordinatorsDocument = gql`
    query Coordinators {
  coordinators {
    name
    units {
      id
      name
      level
      obsolete
      outdated
      processed
    }
  }
}
    `;

/**
 * __useCoordinatorsQuery__
 *
 * To run a query within a React component, call `useCoordinatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoordinatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoordinatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCoordinatorsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CoordinatorsQuery, CoordinatorsQueryVariables>) {
        return ApolloReactHooks.useQuery<CoordinatorsQuery, CoordinatorsQueryVariables>(CoordinatorsDocument, baseOptions);
      }
export function useCoordinatorsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CoordinatorsQuery, CoordinatorsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CoordinatorsQuery, CoordinatorsQueryVariables>(CoordinatorsDocument, baseOptions);
        }
export type CoordinatorsQueryHookResult = ReturnType<typeof useCoordinatorsQuery>;
export type CoordinatorsLazyQueryHookResult = ReturnType<typeof useCoordinatorsLazyQuery>;
export type CoordinatorsQueryResult = ApolloReactCommon.QueryResult<CoordinatorsQuery, CoordinatorsQueryVariables>;
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
  courseReport(id: $id)
  units(maxLevel: 7) {
    blockCount
    id
    name
    offer
    level
    credits
    dynamic
    topics
    prerequisites {
      ...Prerequisite
    }
    outcomes {
      acsSkillId
      bloomRating
    }
    blocks {
      id
      name
      prerequisites {
        ...Prerequisite
      }
      credits
      topics {
        id
        ratio
      }
      sfiaSkills {
        id
        level
        max
      }
    }
  }
  topics {
    id
    name
  }
}
    ${PrerequisiteFragmentDoc}`;

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
export const CourseUnitsDocument = gql`
    query CourseUnits($id: String!) {
  courseUnits(id: $id)
}
    `;

/**
 * __useCourseUnitsQuery__
 *
 * To run a query within a React component, call `useCourseUnitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseUnitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseUnitsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCourseUnitsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CourseUnitsQuery, CourseUnitsQueryVariables>) {
        return ApolloReactHooks.useQuery<CourseUnitsQuery, CourseUnitsQueryVariables>(CourseUnitsDocument, baseOptions);
      }
export function useCourseUnitsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CourseUnitsQuery, CourseUnitsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CourseUnitsQuery, CourseUnitsQueryVariables>(CourseUnitsDocument, baseOptions);
        }
export type CourseUnitsQueryHookResult = ReturnType<typeof useCourseUnitsQuery>;
export type CourseUnitsLazyQueryHookResult = ReturnType<typeof useCourseUnitsLazyQuery>;
export type CourseUnitsQueryResult = ApolloReactCommon.QueryResult<CourseUnitsQuery, CourseUnitsQueryVariables>;
export const CourseListDocument = gql`
    query CourseList {
  units {
    blockCount
    id
    name
    dynamic
    level
    obsolete
    outdated
    processed
    proposed
    contacted
    fixed
    hidden
    topics
  }
  topics {
    id
    name
  }
  courses {
    id
    name
    completionCriteria
    majors {
      completionCriteria
      id
      name
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
  sfia
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
    invalid
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
export const JobsWithDetailsDocument = gql`
    query JobsWithDetails {
  jobs {
    id
    name
    invalid
    sfia {
      id
      level
    }
  }
}
    `;

/**
 * __useJobsWithDetailsQuery__
 *
 * To run a query within a React component, call `useJobsWithDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobsWithDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobsWithDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useJobsWithDetailsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<JobsWithDetailsQuery, JobsWithDetailsQueryVariables>) {
        return ApolloReactHooks.useQuery<JobsWithDetailsQuery, JobsWithDetailsQueryVariables>(JobsWithDetailsDocument, baseOptions);
      }
export function useJobsWithDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<JobsWithDetailsQuery, JobsWithDetailsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<JobsWithDetailsQuery, JobsWithDetailsQueryVariables>(JobsWithDetailsDocument, baseOptions);
        }
export type JobsWithDetailsQueryHookResult = ReturnType<typeof useJobsWithDetailsQuery>;
export type JobsWithDetailsLazyQueryHookResult = ReturnType<typeof useJobsWithDetailsLazyQuery>;
export type JobsWithDetailsQueryResult = ApolloReactCommon.QueryResult<JobsWithDetailsQuery, JobsWithDetailsQueryVariables>;
export const PrerequisitesDocument = gql`
    query Prerequisites {
  sfia
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
export const SfiaUnitsDocument = gql`
    query SfiaUnits($id: String!) {
  sfiaUnits(id: $id) {
    id
    name
    level
    flagged
  }
  units {
    id
    name
  }
}
    `;

/**
 * __useSfiaUnitsQuery__
 *
 * To run a query within a React component, call `useSfiaUnitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSfiaUnitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSfiaUnitsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSfiaUnitsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SfiaUnitsQuery, SfiaUnitsQueryVariables>) {
        return ApolloReactHooks.useQuery<SfiaUnitsQuery, SfiaUnitsQueryVariables>(SfiaUnitsDocument, baseOptions);
      }
export function useSfiaUnitsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SfiaUnitsQuery, SfiaUnitsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SfiaUnitsQuery, SfiaUnitsQueryVariables>(SfiaUnitsDocument, baseOptions);
        }
export type SfiaUnitsQueryHookResult = ReturnType<typeof useSfiaUnitsQuery>;
export type SfiaUnitsLazyQueryHookResult = ReturnType<typeof useSfiaUnitsLazyQuery>;
export type SfiaUnitsQueryResult = ApolloReactCommon.QueryResult<SfiaUnitsQuery, SfiaUnitsQueryVariables>;
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
export const TopicsDetailsDocument = gql`
    query TopicsDetails {
  topicsDetails {
    blocks {
      blockName
      unitId
      unitName
    }
    id
    name
    description
  }
}
    `;

/**
 * __useTopicsDetailsQuery__
 *
 * To run a query within a React component, call `useTopicsDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopicsDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopicsDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopicsDetailsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TopicsDetailsQuery, TopicsDetailsQueryVariables>) {
        return ApolloReactHooks.useQuery<TopicsDetailsQuery, TopicsDetailsQueryVariables>(TopicsDetailsDocument, baseOptions);
      }
export function useTopicsDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TopicsDetailsQuery, TopicsDetailsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TopicsDetailsQuery, TopicsDetailsQueryVariables>(TopicsDetailsDocument, baseOptions);
        }
export type TopicsDetailsQueryHookResult = ReturnType<typeof useTopicsDetailsQuery>;
export type TopicsDetailsLazyQueryHookResult = ReturnType<typeof useTopicsDetailsLazyQuery>;
export type TopicsDetailsQueryResult = ApolloReactCommon.QueryResult<TopicsDetailsQuery, TopicsDetailsQueryVariables>;
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
  createUnit(id: $id, name: $name)
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
export const SaveLegacyUnitsDocument = gql`
    mutation SaveLegacyUnits($units: String!) {
  saveLegacyUnits(units: $units)
}
    `;
export type SaveLegacyUnitsMutationFn = ApolloReactCommon.MutationFunction<SaveLegacyUnitsMutation, SaveLegacyUnitsMutationVariables>;

/**
 * __useSaveLegacyUnitsMutation__
 *
 * To run a mutation, you first call `useSaveLegacyUnitsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveLegacyUnitsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveLegacyUnitsMutation, { data, loading, error }] = useSaveLegacyUnitsMutation({
 *   variables: {
 *      units: // value for 'units'
 *   },
 * });
 */
export function useSaveLegacyUnitsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveLegacyUnitsMutation, SaveLegacyUnitsMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveLegacyUnitsMutation, SaveLegacyUnitsMutationVariables>(SaveLegacyUnitsDocument, baseOptions);
      }
export type SaveLegacyUnitsMutationHookResult = ReturnType<typeof useSaveLegacyUnitsMutation>;
export type SaveLegacyUnitsMutationResult = ApolloReactCommon.MutationResult<SaveLegacyUnitsMutation>;
export type SaveLegacyUnitsMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveLegacyUnitsMutation, SaveLegacyUnitsMutationVariables>;
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
  keywords
  topics {
    id
    name
  }
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
export const UnitDependenciesDocument = gql`
    query UnitDependencies($id: String!) {
  unitDepenendencies(id: $id) {
    id
    name
    prerequisites {
      id
      unitId
      type
      recommended
      prerequisites
    }
    blocks
    level
    processed
  }
}
    `;

/**
 * __useUnitDependenciesQuery__
 *
 * To run a query within a React component, call `useUnitDependenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnitDependenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnitDependenciesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnitDependenciesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UnitDependenciesQuery, UnitDependenciesQueryVariables>) {
        return ApolloReactHooks.useQuery<UnitDependenciesQuery, UnitDependenciesQueryVariables>(UnitDependenciesDocument, baseOptions);
      }
export function useUnitDependenciesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UnitDependenciesQuery, UnitDependenciesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UnitDependenciesQuery, UnitDependenciesQueryVariables>(UnitDependenciesDocument, baseOptions);
        }
export type UnitDependenciesQueryHookResult = ReturnType<typeof useUnitDependenciesQuery>;
export type UnitDependenciesLazyQueryHookResult = ReturnType<typeof useUnitDependenciesLazyQuery>;
export type UnitDependenciesQueryResult = ApolloReactCommon.QueryResult<UnitDependenciesQuery, UnitDependenciesQueryVariables>;
export const UnitsDocument = gql`
    query Units {
  topics {
    id
    name
  }
  units {
    blockCount
    dynamic
    topics
    id
    name
    level
    outdated
    obsolete
    processed
    proposed
    contacted
    fixed
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
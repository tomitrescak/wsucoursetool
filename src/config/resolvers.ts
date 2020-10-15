import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
};

export type Outcome = {
  acsSkillId?: Maybe<Scalars['String']>;
  bloomRating?: Maybe<Scalars['Int']>;
};

export type Block = {
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
  hidden?: Maybe<Scalars['Boolean']>;
  topics?: Maybe<Array<Scalars['String']>>;
  level?: Maybe<Scalars['Int']>;
  offer?: Maybe<Array<Scalars['String']>>;
  credits?: Maybe<Scalars['Float']>;
  prerequisites?: Maybe<Array<Prerequisite>>;
  blocks?: Maybe<Array<Block>>;
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

export type JobList = {
  id: Scalars['String'];
  name: Scalars['String'];
  invalid: Array<Scalars['String']>;
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
};

export type CourseList = {
  id: Scalars['String'];
  name: Scalars['String'];
  majors: Array<MajorList>;
  core: Array<Identifiable>;
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



export type ResolverTypeWrapper<T> = T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  BlockTopic: ResolverTypeWrapper<BlockTopic>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  BlockSkill: ResolverTypeWrapper<BlockSkill>;
  Outcome: ResolverTypeWrapper<Outcome>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Block: ResolverTypeWrapper<Block>;
  UnitList: ResolverTypeWrapper<UnitList>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Entity: ResolverTypeWrapper<Entity>;
  SpecialisationList: ResolverTypeWrapper<SpecialisationList>;
  JobList: ResolverTypeWrapper<JobList>;
  TopicList: ResolverTypeWrapper<TopicList>;
  TopicBlock: ResolverTypeWrapper<TopicBlock>;
  TopicDetails: ResolverTypeWrapper<TopicDetails>;
  BlockList: ResolverTypeWrapper<BlockList>;
  Identifiable: ResolverTypeWrapper<Identifiable>;
  MajorList: ResolverTypeWrapper<MajorList>;
  CourseList: ResolverTypeWrapper<CourseList>;
  Coordinator: ResolverTypeWrapper<Coordinator>;
  Prerequisite: ResolverTypeWrapper<Prerequisite>;
  BlockDependency: ResolverTypeWrapper<BlockDependency>;
  UnitDependency: ResolverTypeWrapper<UnitDependency>;
  SfiaUnit: ResolverTypeWrapper<SfiaUnit>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  JSON: Scalars['JSON'];
  BlockTopic: BlockTopic;
  String: Scalars['String'];
  Float: Scalars['Float'];
  BlockSkill: BlockSkill;
  Outcome: Outcome;
  Int: Scalars['Int'];
  Block: Block;
  UnitList: UnitList;
  Boolean: Scalars['Boolean'];
  Entity: Entity;
  SpecialisationList: SpecialisationList;
  JobList: JobList;
  TopicList: TopicList;
  TopicBlock: TopicBlock;
  TopicDetails: TopicDetails;
  BlockList: BlockList;
  Identifiable: Identifiable;
  MajorList: MajorList;
  CourseList: CourseList;
  Coordinator: Coordinator;
  Prerequisite: Prerequisite;
  BlockDependency: BlockDependency;
  UnitDependency: UnitDependency;
  SfiaUnit: SfiaUnit;
  Query: {};
  Mutation: {};
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type BlockTopicResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockTopic'] = ResolversParentTypes['BlockTopic']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ratio?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BlockSkillResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockSkill'] = ResolversParentTypes['BlockSkill']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type OutcomeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Outcome'] = ResolversParentTypes['Outcome']> = {
  acsSkillId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bloomRating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['Block'] = ResolversParentTypes['Block']> = {
  blockId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<ResolversTypes['Prerequisite']>>, ParentType, ContextType>;
  credits?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<ResolversTypes['BlockTopic']>>, ParentType, ContextType>;
  sfiaSkills?: Resolver<Maybe<Array<ResolversTypes['BlockSkill']>>, ParentType, ContextType>;
  outcomes?: Resolver<Maybe<Array<ResolversTypes['Outcome']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UnitListResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnitList'] = ResolversParentTypes['UnitList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  dynamic?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  obsolete?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  outdated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  processed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  proposed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  credits?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<ResolversTypes['Prerequisite']>>, ParentType, ContextType>;
  blocks?: Resolver<Maybe<Array<ResolversTypes['Block']>>, ParentType, ContextType>;
  outcomes?: Resolver<Maybe<Array<ResolversTypes['Outcome']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SpecialisationListResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpecialisationList'] = ResolversParentTypes['SpecialisationList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type JobListResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobList'] = ResolversParentTypes['JobList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  invalid?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TopicListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicList'] = ResolversParentTypes['TopicList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TopicBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicBlock'] = ResolversParentTypes['TopicBlock']> = {
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TopicDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicDetails'] = ResolversParentTypes['TopicDetails']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blocks?: Resolver<Array<ResolversTypes['TopicBlock']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BlockListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockList'] = ResolversParentTypes['BlockList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type IdentifiableResolvers<ContextType = any, ParentType extends ResolversParentTypes['Identifiable'] = ResolversParentTypes['Identifiable']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MajorListResolvers<ContextType = any, ParentType extends ResolversParentTypes['MajorList'] = ResolversParentTypes['MajorList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CourseListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseList'] = ResolversParentTypes['CourseList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  majors?: Resolver<Array<ResolversTypes['MajorList']>, ParentType, ContextType>;
  core?: Resolver<Array<ResolversTypes['Identifiable']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CoordinatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Coordinator'] = ResolversParentTypes['Coordinator']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  units?: Resolver<Array<ResolversTypes['UnitList']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PrerequisiteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Prerequisite'] = ResolversParentTypes['Prerequisite']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unitId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recommended?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BlockDependencyResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockDependency'] = ResolversParentTypes['BlockDependency']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<ResolversTypes['Prerequisite']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UnitDependencyResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnitDependency'] = ResolversParentTypes['UnitDependency']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prerequisites?: Resolver<Maybe<Array<ResolversTypes['Prerequisite']>>, ParentType, ContextType>;
  blocks?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  processed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SfiaUnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['SfiaUnit'] = ResolversParentTypes['SfiaUnit']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  flagged?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  legacyUnits?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryUnitArgs, 'id'>>;
  unitBase?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryUnitBaseArgs, 'id'>>;
  units?: Resolver<Array<ResolversTypes['UnitList']>, ParentType, ContextType, RequireFields<QueryUnitsArgs, never>>;
  unitDepenendencies?: Resolver<Array<ResolversTypes['UnitDependency']>, ParentType, ContextType, RequireFields<QueryUnitDepenendenciesArgs, 'id'>>;
  coordinators?: Resolver<Array<ResolversTypes['Coordinator']>, ParentType, ContextType>;
  course?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryCourseArgs, 'id'>>;
  courses?: Resolver<Array<ResolversTypes['CourseList']>, ParentType, ContextType>;
  courseUnits?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryCourseUnitsArgs, 'id'>>;
  courseReport?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryCourseReportArgs, 'id'>>;
  jobs?: Resolver<Array<ResolversTypes['JobList']>, ParentType, ContextType>;
  job?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryJobArgs, 'id'>>;
  specialisations?: Resolver<Array<ResolversTypes['SpecialisationList']>, ParentType, ContextType>;
  specialisation?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QuerySpecialisationArgs, 'id'>>;
  keywords?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  blocks?: Resolver<Array<ResolversTypes['BlockList']>, ParentType, ContextType>;
  acs?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  sfia?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  sfiaUnits?: Resolver<Array<ResolversTypes['SfiaUnit']>, ParentType, ContextType, RequireFields<QuerySfiaUnitsArgs, 'id'>>;
  topics?: Resolver<Array<ResolversTypes['TopicList']>, ParentType, ContextType>;
  topicsDetails?: Resolver<Array<ResolversTypes['TopicDetails']>, ParentType, ContextType>;
  db?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUnit?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationCreateUnitArgs, 'id'>>;
  deleteUnit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUnitArgs, 'id'>>;
  createJob?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateJobArgs, 'id'>>;
  deleteJob?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteJobArgs, 'id'>>;
  createSpecialisation?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateSpecialisationArgs, 'id'>>;
  deleteSpecialisation?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteSpecialisationArgs, 'id'>>;
  createCourse?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'id'>>;
  deleteCourse?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'id'>>;
  save?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveArgs, 'part' | 'body'>>;
};

export type Resolvers<ContextType = any> = {
  JSON?: GraphQLScalarType;
  BlockTopic?: BlockTopicResolvers<ContextType>;
  BlockSkill?: BlockSkillResolvers<ContextType>;
  Outcome?: OutcomeResolvers<ContextType>;
  Block?: BlockResolvers<ContextType>;
  UnitList?: UnitListResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  SpecialisationList?: SpecialisationListResolvers<ContextType>;
  JobList?: JobListResolvers<ContextType>;
  TopicList?: TopicListResolvers<ContextType>;
  TopicBlock?: TopicBlockResolvers<ContextType>;
  TopicDetails?: TopicDetailsResolvers<ContextType>;
  BlockList?: BlockListResolvers<ContextType>;
  Identifiable?: IdentifiableResolvers<ContextType>;
  MajorList?: MajorListResolvers<ContextType>;
  CourseList?: CourseListResolvers<ContextType>;
  Coordinator?: CoordinatorResolvers<ContextType>;
  Prerequisite?: PrerequisiteResolvers<ContextType>;
  BlockDependency?: BlockDependencyResolvers<ContextType>;
  UnitDependency?: UnitDependencyResolvers<ContextType>;
  SfiaUnit?: SfiaUnitResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

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
  legacyUnits?: Maybe<Scalars['String']>;
  unit: Scalars['JSON'];
  units: Array<UnitList>;
  course: Scalars['JSON'];
  courses: Array<CourseList>;
  courseUnits: Scalars['JSON'];
  jobs: Array<JobList>;
  job: Scalars['JSON'];
  specialisations: Array<SpecialisationList>;
  specialisation: Scalars['JSON'];
  blocks: Array<BlockList>;
  acs: Scalars['JSON'];
  sfia: Scalars['JSON'];
  topics: Array<TopicList>;
};


export type QueryUnitArgs = {
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
  UnitList: ResolverTypeWrapper<UnitList>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Entity: ResolverTypeWrapper<Entity>;
  SpecialisationList: ResolverTypeWrapper<SpecialisationList>;
  JobList: ResolverTypeWrapper<JobList>;
  TopicList: ResolverTypeWrapper<TopicList>;
  BlockList: ResolverTypeWrapper<BlockList>;
  Identifiable: ResolverTypeWrapper<Identifiable>;
  MajorList: ResolverTypeWrapper<MajorList>;
  CourseList: ResolverTypeWrapper<CourseList>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  JSON: Scalars['JSON'];
  UnitList: UnitList;
  String: Scalars['String'];
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  Entity: Entity;
  SpecialisationList: SpecialisationList;
  JobList: JobList;
  TopicList: TopicList;
  BlockList: BlockList;
  Identifiable: Identifiable;
  MajorList: MajorList;
  CourseList: CourseList;
  Query: {};
  Mutation: {};
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type UnitListResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnitList'] = ResolversParentTypes['UnitList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dynamic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TopicListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicList'] = ResolversParentTypes['TopicList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  units?: Resolver<Array<ResolversTypes['Identifiable']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CourseListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseList'] = ResolversParentTypes['CourseList']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  majors?: Resolver<Array<ResolversTypes['MajorList']>, ParentType, ContextType>;
  core?: Resolver<Array<ResolversTypes['Identifiable']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  legacyUnits?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryUnitArgs, 'id'>>;
  units?: Resolver<Array<ResolversTypes['UnitList']>, ParentType, ContextType>;
  course?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryCourseArgs, 'id'>>;
  courses?: Resolver<Array<ResolversTypes['CourseList']>, ParentType, ContextType>;
  courseUnits?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryCourseUnitsArgs, 'id'>>;
  jobs?: Resolver<Array<ResolversTypes['JobList']>, ParentType, ContextType>;
  job?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryJobArgs, 'id'>>;
  specialisations?: Resolver<Array<ResolversTypes['SpecialisationList']>, ParentType, ContextType>;
  specialisation?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QuerySpecialisationArgs, 'id'>>;
  blocks?: Resolver<Array<ResolversTypes['BlockList']>, ParentType, ContextType>;
  acs?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  sfia?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['TopicList']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUnit?: Resolver<ResolversTypes['UnitList'], ParentType, ContextType, RequireFields<MutationCreateUnitArgs, 'id'>>;
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
  UnitList?: UnitListResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  SpecialisationList?: SpecialisationListResolvers<ContextType>;
  JobList?: JobListResolvers<ContextType>;
  TopicList?: TopicListResolvers<ContextType>;
  BlockList?: BlockListResolvers<ContextType>;
  Identifiable?: IdentifiableResolvers<ContextType>;
  MajorList?: MajorListResolvers<ContextType>;
  CourseList?: CourseListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

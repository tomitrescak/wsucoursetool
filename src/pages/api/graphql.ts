import { ApolloServer, gql } from 'apollo-server-micro';
import fs from 'fs';
import path from 'path';
import { CourseConfig, User } from 'components/types';
import { IResolvers } from 'config/resolvers';

const typeDefs = gql`
  type UnitList {
    id: String!
    name: String!
    blockCount: Int!
  }

  type Query {
    loadCourses: String
    loadUnits: String
    loadUnitList: [UnitList!]!
  }
  type Mutation {
    saveCourses(courses: String): Boolean
  }
`;

let g = global as any;
g.__users = {};

function getDb(): CourseConfig {
  if (g.__db == null) {
    g.__db = fs.readFileSync(path.resolve('./src/data/db.json'), {
      encoding: 'utf-8'
    });
  }
  return g.__db;
}

function getUser(id): User {
  if (g.__users[id] == null) {
    g.__users[id] = fs.readFileSync(path.resolve(`./src/data/users/${id}.json`), {
      encoding: 'utf-8'
    });
  }
  return g.__users[id];
}

const resolvers: IResolvers = {
  Mutation: {
    saveCourses(parent, { courses }) {
      const original = fs.readFileSync(path.resolve('./src/data/db.json'), {
        encoding: 'utf-8'
      });
      fs.writeFileSync(path.resolve('./src/data/db.backup.json'), original, {
        encoding: 'utf-8'
      });
      fs.writeFileSync(path.resolve('./src/data/db.json'), courses, {
        encoding: 'utf-8'
      });
      return true;
    }
  },
  Query: {
    loadUnitList() {
      let db = getDb();
      return db.units.map(u => ({ id: u.id, name: u.name, blockCount: (u.blocks || []).length }));
    },
    loadCourses(parent, args, context) {
      return fs.readFileSync(path.resolve('./src/data/db.json'), {
        encoding: 'utf-8'
      });
    },
    loadUnits(parent, args, context) {
      return fs.readFileSync(path.resolve('./src/data/units.json'), {
        encoding: 'utf-8'
      });
    }
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false
  }
};

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb'
//     }
//   }
// };

export default apolloServer.createHandler({ path: '/api/graphql' });

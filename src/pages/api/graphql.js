import { ApolloServer, gql } from 'apollo-server-micro';
import fs from 'fs';
import path from 'path';

const typeDefs = gql`
  type Query {
    loadCourses: String
    loadUnits: String
  }
  type Mutation {
    saveCourses(courses: String): Boolean
  }
`;

const resolvers = {
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
    }
  },
  Query: {
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

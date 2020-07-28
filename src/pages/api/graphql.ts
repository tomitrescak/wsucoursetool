import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from 'server/schema';
import { resolvers } from 'server/resolvers';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context() {
    return {
      user: 'tomas'
    };
  }
});

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

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { BatchHttpLink } from "apollo-link-batch-http";

const URL = ''; // process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

// const getToken = () => {
//   let token = null;
//   if (typeof document !== 'undefined') {
//     token = 'Bearer ' + document.cookie.get('token');
//   }
//   return token;
// };

export default function createApolloClient(initialState: any, ctx: any) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: createHttpLink({
      uri: `${URL}/api/graphql`, // Server URL (must be absolute)
      credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
      // headers: {
      //   authorization: getToken()
      // }
      // fetch,
    }),
    cache: new InMemoryCache().restore(initialState)
  });
}

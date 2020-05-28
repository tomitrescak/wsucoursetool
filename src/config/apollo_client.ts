import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
// import { BatchHttpLink } from "apollo-link-batch-http";

const URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function createApolloClient(initialState: any, ctx: any) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: `${URL}/api/graphql`, // Server URL (must be absolute)
      credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
      // fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}

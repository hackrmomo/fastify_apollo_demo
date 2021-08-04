import Fastify, { FastifyInstance } from "fastify";
import { ApolloServer, gql } from "apollo-server-fastify";
import { rootTypeDefs, rootResolver } from "./GraphQL";

const server: FastifyInstance = Fastify({});

const apolloServer = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: rootResolver,
});

server.get("/", (req, res) => {
  res.send("The server is alive!");
});
server.get("/json", (req, res) => {
  res.send({
    data: {
      name: "key",
      value: "test",
    },
  });
});

const start = async () => {
  try {
    await apolloServer.start();
    server.register(apolloServer.createHandler());
    await server.listen(3000);

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;

    console.log(`listening on port: ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

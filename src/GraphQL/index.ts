import { gql } from "apollo-server-fastify";
import DataLoader from "dataloader";

import * as fakedb from "./FakeDB.json";

interface Colour {
  colour: string;
  group: string;
}

var coloursCollection = fakedb.colours as Array<Colour>;

const ColorDataLoader = new DataLoader<string, Colour>(async (keys) => {
  return keys.map(
    (key) => coloursCollection.find((c) => c.colour === key) || Error(">:(")
  );
});

export const rootResolver = {
  Query: {
    hello: () => "Hola!",
    colours: async () => coloursCollection,
    users: async () =>
      fakedb.users.map(async (u) => ({
        name: u.name,
        id: u.id,
        favouriteColour: await ColorDataLoader.load(u.favouriteColour),
      })),
  },
  Mutation: {
    mutation1: () => {
      let das = 1 + 1;
      return "mutatedSomething";
    },
  },
};

export const rootTypeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    colours: [Colour]
    users: [User]
  }
  type User {
    name: String
    id: Int
    favouriteColour: Colour
  }
  type Colour {
    colour: String
    group: String
  }
  type Mutation {
    mutation1: String
  }
`;

import fs from "node:fs";
import path from "node:path";
import express from "express";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { fileURLToPath } from "url";
import { dirname } from "path";

type BasicDish = {
    name: string;
    description?: string;
    category: string;
    subcategory?: string;
}

type DishWithPrice = BasicDish & {
  price: number
}

type DishWithPriceOptions = BasicDish & {
  price_options: {
    description: string,
    price: number,
  }[]
}

type Dish = DishWithPrice | DishWithPriceOptions;

export type Data = {
  categories: {
    name: string,
    subcategory?: string,
    price_options?: {
      description: string,
      price: number,
    }
  }[];
  subcategories: { name: string }[];
  dishes: Dish[];
}

// We need to check if `__dirname` is set because in tests,
// `__dirname` is set, but in the server, it's not.
// This is because of weird `ts-jest` settings.
const dir = () => {
  if(typeof __dirname === "undefined") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return __dirname;
  } else {
    return __dirname;
  }
}

const schemaPath = path.resolve(dir(), "./menu.graphql");
const schemaContents = fs.readFileSync(schemaPath, "utf8");
const schema = buildSchema(schemaContents);

export const makeServer = (data: Data) => {
  const root = {
    ping() {
      return "pong";
    },

    categories() {
      return data.categories;
    },

    dishes() {
      return data.dishes;
    }
  };

  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // Serve the GraphiQL IDE.
  app.get("/playground", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });

  app.all(
    "/graphql",
    createHandler({
      schema: schema,
      rootValue: root
    })
  );
  return app;
}

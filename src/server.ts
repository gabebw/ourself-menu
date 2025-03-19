import express from "express";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

const schema = buildSchema(`type Query { hello: String } `);
const root = {
  hello() {
    return "Hello world!";
  }
};

const app = express();
const port = 3000;

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

app.listen(port, (error) => {
  if (error) {
    console.error(`Error: ${error}`);
  } else {
    console.log(`Example app listening on port ${port}`);
  }
});

import supertest from "supertest";
import TestAgent from "supertest/lib/agent.js";

import { makeServer, Data } from "../src/server";

describe("User Endpoints", () => {
  describe("ping", () => {
    it("returns 'pong'", async () => {
      const harness = new Harness();

      const res = await harness.graphqlQuery("{ ping }");

      expectJsonData(res, "ping", "pong");
    });
  });

  describe("categories", () => {
    it("returns all categories", async () => {
      const categories: Data["categories"] = [
        { name: "Food" },
        { name: "Drink" }
      ];
      const harness = new Harness({ categories });

      const res = await harness.graphqlQuery("{ categories { name } }");

      expectJsonData(res, "categories", categories);
    });
  });

  describe("dishes", () => {
    it("returns info about dishes", async () => {
      const dishes = [
        {
          name: "Salad",
          price: 7.5,
          category: "Appetizers"
        },
        {
          name: "Main",
          price: 10.0,
          category: "Main"
        },
        {
          name: "Cheesecake",
          description: "a delicious cake",
          category: "Dessert",
          price_options: [
            {
              description: "with raspberry coulis",
              price: 7.5
            },
            {
              description: "with caramel",
              price: 9.0
            }
          ]
        }
      ];
      const harness = new Harness({ dishes });

      const res = await harness.graphqlQuery(`{
        dishes {
          name
          price
          price_options {
            description
            price
          }
        }
      }`);
      expectJsonData(res, "dishes", [
        { name: "Salad", price: 7.5, price_options: null },
        { name: "Main", price: 10.0, price_options: null },
        {
          name: "Cheesecake",
          price: null,
          price_options: [
            {
              description: "with raspberry coulis",
              price: 7.5
            },
            {
              description: "with caramel",
              price: 9.0
            }
          ]
        }
      ]);
    });
  });

  class Harness {
    private requestWithSupertest: TestAgent;
    private data: Data;

    constructor(data: Partial<Data> = {}) {
      this.data = {
        categories: [],
        subcategories: [],
        dishes: [],
        ...data
      };
      this.requestWithSupertest = supertest(makeServer(this.data));
    }

    graphqlQuery(query: string) {
      return this.requestWithSupertest
        .post("/graphql")
        .send(JSON.stringify({ query: query }))
        .set("Content-Type", "application/json");
    }
  }

  const expectJsonData = (
    res: supertest.Response,
    key: string,
    expected: any
  ) => {
    const json = res.body;
    expect(json).toHaveProperty(`data.${key}`);
    expect(json["data"][key]).toEqual(expected);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual("application/json");
  };
});

process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let bread = { name: "bread", price: 5.99 };

beforeEach(function () {
    items.push(bread);
});

afterEach(function (){
    // We make sure that we mutate items and not redefine it
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [bread] });
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${bread.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: bread });
    })
    test("Responds with a 404 if name doesn't exist", async () => {
        const res = await request(app).get("/items/coconut");
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /items", () => {
    test("Adding an item", async () => {
        const res = await await request(app).post("/items").send({ name: "Peanuts", price: 5.00 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: "Peanuts", price: 5.00 }});
    })
    test("Responds with 400 if name or price is missing", async () => {
        const res = await await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
    test("Responds with 400 if invalid price", async () => {
        const res = await await request(app).post("/items").send({ name: "Cashews", price: "price"});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /iems/:name", () => {
    test("Updating an item's name", async () => {
      const res = await request(app).patch(`/items/${bread.name}`).send({ name: "Milk" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ updated: { name: "Milk", price: 5.99 } });
    })
    test("Responds with 404 for invalid name", async () => {
      const res = await request(app).patch(`/items/Gravy`).send({ name: "Milk" });
      expect(res.statusCode).toBe(404);
    })
  })

  describe("/DELETE /itemss/:name", () => {
    test("Deleting an item", async () => {
      const res = await request(app).delete(`/items/${bread.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/potatoes`);
      expect(res.statusCode).toBe(404);
    })
  })
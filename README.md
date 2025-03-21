# Menu API for Ourself

To run it locally:

    yarn install
    yarn run server

The app runs on <http://localhost:3000>. There's a GraphQL playground available at <http://localhost:3000/playground>.

The app will automatically reload if any of the `src` files are changed, or if
`menu.graphql` or `data.json` are changed.

## Tests

To run the tests:

    yarn test

In order to avoid the [Mystery Guest](https://thoughtbot.com/blog/mystery-guest)
testing anti-pattern, the data needed for each test case is injected for only
that test, rather than relying on the `menu.json` file, which could change at
any time.

## Technical Architecture

I copied most of the provided menu into `data.json`. (In a real app, this data
would live in an external database like Postgres, or possibly be shipped with
the site as a SQLite file.)

There are straightforward dishes with a category, name, description, and price, like this:

```
-APPETIZERS-
Iceberg Wedge Salad with House Cured Bacon – tomato salsa gorgonzola 7.50
```

But there are also categories with a price for the whole category, like this,
where half/full sandwich prices apply to all dishes in the category, and each
dish does not have an individual price:

```
COLD
Choice of sourdough, whole wheat, or rye bread
    half sandwich 7.95
    full sandwich 9.25

Turkey & Avocado – with tomato
Pub Club – turkey, bacon. lettuce, tomato
```

I chose to introduce a `price_options` field for categories to cover this
situation:

```json
{
    "name": "Cold",
    "description": "Choice of sourdough, whole wheat, or rye bread",
    "price_options": [
    {
        "description": "half sandwich",
        "price": 7.95
    },
    {
        "description": "full sandwich",
        "price": 9.25
    }
    ]
}
```

Each dish can also have a price option, like this:

```
French Onion or Soup of the Day Combos
    with small green salad, fresh fruit or house pasta 7.25
    with half pasta of the day 8.75
```

That maps to this JSON:

```json
{
    "name": "French Onion or Soup of the Day Combos",
    "category": "Soup & Salad Combos",
    "price_options": [
        {
            "description": "with small green salad, fresh fruit or house pasta",
            "price": 7.25
        },
        {
            "description": "with half pasta of the day",
            "price": 8.75
        }
    ]
}
```

I would also use `dish_options` to handle the uno/dos/tres enchiladas:

```
Choice of Beef, Chicken, Cheese or Veggie
    uno 8.50
    dos 9.95
    tres 11.50
```

Like so:

```json
{
    "name": "Choice of Beef, Chicken, Cheese or Veggie",
    "category": "Fajitas",
    "price_options": [
        {
            "description": "uno",
            "price": 8.50
        },
        {
            "description": "dos",
            "price": 9.95
        },
        {
            "description": "tres",
            "price": 11.50
        }
    ]
}
```

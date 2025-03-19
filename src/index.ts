import * as DATA from "./data.json";
import { makeServer } from "./server"

const port = process.env.PORT || 3000;
const server = makeServer(DATA);

server.listen(port, (error) => {
  if (error) {
    console.error(`Error: ${error}`);
  } else {
    console.log(`Example app listening on port ${port}`);
  }
});

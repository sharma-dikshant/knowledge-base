const dotenv = require("dotenv");
const ConnectDb = require("./Db/DbConnect");
const app = require("./app");

dotenv.config();
ConnectDb();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is Listening on ${port}`);
});

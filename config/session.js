const mongoDbStore = require("connect-mongodb-session");
const expressSession = require("express-session");

const createSessionStore = () => {
  const MongoDbStore = mongoDbStore(expressSession);
  const db_url = process.env.MONGO_URI || "mongodb://localhost:27017";

  const store = new MongoDbStore({
    uri: db_url,
    databaseName: "ecomApp",
    collection: "sessions",
  });

  return store;
};

const createSessionConfig = () => {
  return {
    secret: "super-secret-ecomApp",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
};

module.exports = createSessionConfig;

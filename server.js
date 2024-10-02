const dotenv = require('dotenv');
const sequelize = require('./sequelize.js');
// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });
dotenv.config({ path: './config.env' });
const app = require('./app.js');

async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    server.close(() => {
      process.exit(1);
    });
  }
}

testDbConnection();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

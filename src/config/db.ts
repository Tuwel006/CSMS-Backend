import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "mysql",
    }
);

sequelize.sync({ alter: true }) // or { force: true } to drop+recreate
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync failed:", err);
  });


export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(('MySQL Connection Successfully.'));
    } catch (error) {
        console.error("MySQL connection Error: ",error);
    }
}
import "reflect-metadata"
import { DataSource } from 'typeorm';
import dotenv from "dotenv"
import Veiculo from "../models/Veiculo";
import Montadora from "../models/Montadora";
import ModeloVeiculo from "../models/ModeloVeiculo";


dotenv.config()

const username_env = process.env.USERNAME_DB
const password_env = process.env.PASSWORD_DB
const name_db_env = process.env.NAME_DB



const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: username_env,
  password: password_env,
  database: name_db_env,
  synchronize: true,
  logging: true,
  entities: [Montadora, Veiculo, ModeloVeiculo],
  subscribers: [],
  migrations: [],
});


export default AppDataSource


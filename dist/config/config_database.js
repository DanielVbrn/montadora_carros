"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Veiculo_1 = __importDefault(require("../models/Veiculo"));
const Montadora_1 = __importDefault(require("../models/Montadora"));
const ModeloVeiculo_1 = __importDefault(require("../models/ModeloVeiculo"));
dotenv_1.default.config();
const username_env = process.env.USERNAME_DB;
const password_env = process.env.PASSWORD_DB;
const name_db_env = process.env.NAME_DB;
const host_db = process.env.HOST_ENV;
const port_env = process.env.HOST_ENV;
const url_env = process.env.URL_ENV;
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: username_env,
    password: password_env,
    database: name_db_env,
    url: url_env,
    synchronize: true,
    logging: true,
    entities: [Montadora_1.default, Veiculo_1.default, ModeloVeiculo_1.default],
    subscribers: [],
    migrations: [],
});
exports.default = AppDataSource;

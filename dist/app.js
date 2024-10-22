"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_database_1 = __importDefault(require("./config/config_database"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 10000; // Defina um valor padrão, caso a variável não seja definida
config_database_1.default.initialize()
    .then(() => {
    console.log('Conexão com o banco de dados estabelecida!');
})
    .catch((error) => console.log('Erro ao conectar ao banco de dados:', error));
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Authorization"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.default);
app.listen(PORT, () => console.log(`Server is running in http://localhost:${PORT}`));

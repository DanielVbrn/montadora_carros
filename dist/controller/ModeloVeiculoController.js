"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_database_1 = __importDefault(require("../config/config_database"));
const ModeloVeiculo_1 = __importDefault(require("../models/ModeloVeiculo"));
const Montadora_1 = __importDefault(require("../models/Montadora"));
class ModeloController {
    static getAdicionarModelo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const montadoras = yield config_database_1.default.getRepository(Montadora_1.default).find();
            const montadoraOptions = montadoras.map(m => `<option value="${m.id}">${m.nome}</option>`).join("");
            return res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="/css/form.css">
                <title>Adicionar Modelo de Veículo</title>
            </head>
            <body>
                <h1>Adicionar Modelo de Veículo</h1>
                <form method="POST" action="/modelos/cadastrar">
                    <label for="montadora">Montadora:</label>
                    <select id="montadora" name="montadora" required>
                        ${montadoraOptions}
                    </select><br>

                    <label for="nome">Nome do Modelo:</label>
                    <input type="text" id="nome" name="nome" required><br>

                    <label for="valor_referencia">Valor de Referência:</label>
                    <input type="number" id="valor_referencia" name="valor_referencia" required><br>

                    <label for="motorizacao">Motorização :</label>
                    <input type="number" id="motorizacao" name="motorizacao" required><br>

                    <label for="turbo">Turbo:</label>
                    <select id="turbo" name="turbo">
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select><br>

                    <label for="automatico">Automático:</label>
                    <select id="automatico" name="automatico">
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select><br>

                    <button type="submit">Adicionar Modelo</button>
                </form>
            </body>
            </html>
        `);
        });
    }
    static adicionarModelo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, montadora, valor_referencia, motorizacao, turbo, automatico } = req.body;
                const novoModelo = new ModeloVeiculo_1.default();
                novoModelo.nome = nome;
                novoModelo.montadora = { id: Number(montadora) };
                novoModelo.valor_referencia = parseFloat(valor_referencia);
                novoModelo.motorizacao = parseFloat(motorizacao);
                novoModelo.automatico = automatico === 'true';
                novoModelo.turbo = turbo === 'true';
                yield config_database_1.default.getRepository(ModeloVeiculo_1.default).save(novoModelo);
                return res.redirect('/modelos/listar');
            }
            catch (error) {
                console.error("Erro ao adicionar modelo:", error);
                return res.status(500).send("Erro ao adicionar modelo");
            }
        });
    }
    static listarModelos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeModelo, automatico, motorizacao, montadoraNome, ordem, atributo } = req.query;
            const query = config_database_1.default.getRepository(ModeloVeiculo_1.default).createQueryBuilder("modelo")
                .leftJoinAndSelect("modelo.montadora", "montadora");
            if (nomeModelo) {
                query.andWhere("modelo.nome LIKE :nome", { nome: `%${nomeModelo}%` });
            }
            if (automatico) {
                query.andWhere("modelo.automatico = :automatico", { automatico: automatico === 'true' });
            }
            if (motorizacao) {
                query.andWhere("modelo.motorizacao = :motorizacao", { motorizacao });
            }
            if (montadoraNome) {
                query.andWhere("montadora.nome LIKE :nome", { nome: `%${montadoraNome}%` });
            }
            // Ordenação
            if (typeof atributo === "string" && typeof ordem === "string") {
                query.orderBy(`modelo.${atributo}`, ordem.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');
            }
            const modelos = yield query.getMany();
            return res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="/css/list.css">

                <title>Lista de Modelos de Veículos</title>
            </head>
            <body>
                <h1>Lista de Modelos de Veículos</h1>
                <ul>
                    ${modelos.map(m => `<li>${m.nome} (${m.motorizacao}L) - ${m.automatico ? 'Automático' : 'Manual'} - Montadora: ${m.montadora.nome}</li>`).join('')}
                </ul>
                <a href="/modelos/cadastrar">Adicionar Novo Modelo</a>
            </body>
            </html>
        `);
        });
    }
    static removerModelo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const modeloId = req.params.id;
            yield config_database_1.default.getRepository(ModeloVeiculo_1.default).delete({ id: Number(modeloId) });
            return res.redirect('/modelos/listar');
        });
    }
    static getEditarModelo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const modeloId = req.params.id;
            const modelo = yield config_database_1.default.getRepository(ModeloVeiculo_1.default).findOneBy({ id: Number(modeloId) });
            if (!modelo) {
                return res.status(404).send("Modelo não encontrado");
            }
            const montadoras = yield config_database_1.default.getRepository(Montadora_1.default).find();
            const montadoraOptions = montadoras.map(m => `<option value="${m.id}" ${m.id === modelo.montadora.id ? 'selected' : ''}>${m.nome}</option>`).join("");
            return res.send(`
            <html>
            <head>
                <title>Editar Modelo de Veículo</title>
            </head>
            <body>
                <h1>Editar Modelo de Veículo</h1>
                <form method="POST" action="/modelos/editar/${modeloId}">
                    <label for="montadora">Montadora:</label>
                    <select id="montadora" name="montadora" required>
                        ${montadoraOptions}
                    </select><br>
    
                    <label for="nome">Nome do Modelo:</label>
                    <input type="text" id="nome" name="nome" value="${modelo.nome}" required><br>
    
                    <label for="valor_referencia">Valor de Referência:</label>
                    <input type="number" id="valor_referencia" name="valor_referencia" value="${modelo.valor_referencia}" required><br>
    
                    <label for="motorizacao">Motorização:</label>
                    <input type="number" id="motorizacao" name="motorizacao" value="${modelo.motorizacao}" required><br>
    
                    <label for="turbo">Turbo:</label>
                    <select id="turbo" name="turbo">
                        <option value="true" ${modelo.turbo ? 'selected' : ''}>Sim</option>
                        <option value="false" ${!modelo.turbo ? 'selected' : ''}>Não</option>
                    </select><br>
    
                    <label for="automatico">Automático:</label>
                    <select id="automatico" name="automatico">
                        <option value="true" ${modelo.automatico ? 'selected' : ''}>Sim</option>
                        <option value="false" ${!modelo.automatico ? 'selected' : ''}>Não</option>
                    </select><br>
    
                    <button type="submit">Salvar Alterações</button>
                </form>
            </body>
            </html>
        `);
        });
    }
}
exports.default = ModeloController;

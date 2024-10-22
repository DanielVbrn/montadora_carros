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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Montadora_1 = __importDefault(require("../models/Montadora"));
const config_database_1 = __importDefault(require("../config/config_database"));
class MontadoraController {
}
_a = MontadoraController;
MontadoraController.getCadastrarMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(`
            <html>
            <head>
                <title>Cadastrar Montadora</title>
                <link rel="stylesheet" href="/css/form.css">
            </head>
            <body>
                <h1>Cadastrar Montadora</h1>
                <form method="POST" action="/montadoras/cadastrar">
                    <label for="nome">Nome da Montadora:</label>
                    <input type="text" id="nome" name="nome" required><br>
    
                    <label for="pais">País de Origem:</label>
                    <input type="text" id="pais" name="pais" required><br>
    
                    <label for="ano_fundacao">Ano de Fundação:</label>
                    <input type="number" id="ano_fundacao" name="ano_fundacao" required><br>
                    
                    <button type="submit">Cadastrar Montadora</button>
                </form>
            </body>
            </html>
        `);
});
MontadoraController.cadastrarMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, pais, ano_fundacao } = req.body;
        const novaMontadora = new Montadora_1.default();
        novaMontadora.nome = nome;
        novaMontadora.pais = pais;
        novaMontadora.ano_fundacao = parseInt(ano_fundacao);
        yield config_database_1.default.getRepository(Montadora_1.default).save(novaMontadora);
        return res.redirect('/montadoras/listar');
    }
    catch (error) {
        console.error("Erro ao cadastrar montadora:", error);
        return res.status(500).send("Erro ao cadastrar montadora");
    }
});
MontadoraController.listarMontadoras = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoras = yield config_database_1.default.getRepository(Montadora_1.default).find();
    const totalMontadoras = montadoras.length;
    const montadoraList = montadoras.map(m => `<li>${m.nome} - ${m.pais} (${m.ano_fundacao})</li>`).join("");
    return res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="/css/list.css">

            </head>
            <body>
                <h1>Lista de Montadoras (${totalMontadoras} Cadastradas)</h1>
                <ul>${montadoraList}</ul>
                <a href="/montadoras/cadastrar">Cadastrar Nova Montadora</a>
            </body>
            </html>
        `);
});
MontadoraController.getAtualizarMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoraId = Number(req.params.id);
    const montadora = yield config_database_1.default.getRepository(Montadora_1.default).findOneBy({ id: montadoraId });
    if (!montadora) {
        return res.status(404).send("Montadora não encontrada");
    }
    return res.send(`
            <html>
            <body>
                <h1>Atualizar Montadora</h1>
                <form method="POST" action="/montadoras/atualizar/${montadoraId}">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value="${montadora.nome}" required><br>

                    <label for="pais">País:</label>
                    <input type="text" id="pais" name="pais" value="${montadora.pais}" required><br>

                    <label for="ano_fundacao">Ano de Fundação:</label>
                    <input type="number" id="ano_fundacao" name="ano_fundacao" value="${montadora.ano_fundacao}" required><br>

                    <button type="submit">Salvar</button>
                </form>
            </body>
            </html>
        `);
});
MontadoraController.atualizarMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoraId = Number(req.params.id);
    const { nome, pais, ano_fundacao } = req.body;
    const montadora = yield config_database_1.default.getRepository(Montadora_1.default).findOneBy({ id: montadoraId });
    if (!montadora) {
        return res.status(404).send("Montadora não encontrada");
    }
    montadora.nome = nome;
    montadora.pais = pais;
    montadora.ano_fundacao = parseInt(ano_fundacao);
    yield config_database_1.default.getRepository(Montadora_1.default).save(montadora);
    return res.redirect('/montadoras/listar');
});
MontadoraController.removerMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoraId = Number(req.params.id);
    yield config_database_1.default.getRepository(Montadora_1.default).delete({ id: montadoraId });
    return res.redirect('/montadoras/listar');
});
exports.default = MontadoraController;

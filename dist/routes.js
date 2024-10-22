"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MontadoraController_1 = __importDefault(require("./controller/MontadoraController"));
const HomeController_1 = __importDefault(require("./controller/HomeController"));
const VeiculoController_1 = __importDefault(require("./controller/VeiculoController"));
const ModeloVeiculoController_1 = __importDefault(require("./controller/ModeloVeiculoController"));
const router = (0, express_1.Router)();
// Rota para a página inicial
router.get("/", HomeController_1.default.getHomePage);
// Rotas para montadoras
router.get('/montadoras/cadastrar', MontadoraController_1.default.getCadastrarMontadora);
router.post('/montadoras/cadastrar', MontadoraController_1.default.cadastrarMontadora);
router.get('/montadoras/listar', MontadoraController_1.default.listarMontadoras);
router.put('/montadoras/atualizar/:id', MontadoraController_1.default.atualizarMontadora);
router.delete('/montadoras/atualizar/:id', MontadoraController_1.default.atualizarMontadora);
// Rotas para modelos
router.get('/modelos/listar', ModeloVeiculoController_1.default.listarModelos);
router.get('/modelos/cadastrar', ModeloVeiculoController_1.default.getAdicionarModelo);
router.post('/modelos/cadastrar', ModeloVeiculoController_1.default.adicionarModelo);
router.put('/modelos/atualizar/:id', ModeloVeiculoController_1.default.getEditarModelo);
router.delete('/modelos/delete/:id', ModeloVeiculoController_1.default.removerModelo);
//Rotas para veiculos
router.get("/veiculos/adicionar", VeiculoController_1.default.getAdicionarVeiculo);
router.post("/veiculos/adicionar", VeiculoController_1.default.adicionarVeiculo);
router.get("/veiculos/listar", VeiculoController_1.default.listarVeiculos);
router.get("/veiculos/editar/:id", VeiculoController_1.default.getEditarVeiculo);
router.post("/veiculos/editar/:id", VeiculoController_1.default.editarVeiculo);
router.get("/veiculos/remover/:id", VeiculoController_1.default.removerVeiculo);
router.get("/veiculos/vender/:id", VeiculoController_1.default.venderVeiculo);
router.get("/veiculos/buscar", VeiculoController_1.default.buscarVeiculo);
router.get("/veiculos/listar/filtro", VeiculoController_1.default.listarVeiculosComFiltro);
router.get("/veiculos/ordenar", VeiculoController_1.default.ordenarVeiculos);
exports.default = router;

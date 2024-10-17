import { Router } from "express";
import MontadoraController from "./controller/MontadoraController";
import HomeController from "./controller/HomeController";
import VeiculoController from "./controller/VeiculoController";

const router = Router();

// Rota para a página inicial
router.get("/", HomeController.getHomePage); 

// Rotas para montadoras
router.get('/montadoras/cadastrar', MontadoraController.getCadastrarMontadora);
router.post('/montadoras/cadastrar', MontadoraController.cadastrarMontadora);
router.get('/montadoras/listar', MontadoraController.listarMontadoras);
router.put('/montadoras/atualizar/:id', MontadoraController.atualizarMontadora);
router.delete('/montadoras/atualizar/:id', MontadoraController.atualizarMontadora);



//Rotas para veiculos
router.get("/veiculos/adicionar", VeiculoController.getAdicionarVeiculo);
router.post("/veiculos/adicionar", VeiculoController.adicionarVeiculo);
router.get("/veiculos/listar", VeiculoController.listarVeiculos);
router.get("/veiculos/editar/:id", VeiculoController.getEditarVeiculo);
router.post("/veiculos/editar/:id", VeiculoController.editarVeiculo);
router.get("/veiculos/remover/:id", VeiculoController.removerVeiculo);
router.get("/veiculos/vender/:id", VeiculoController.venderVeiculo);
router.get("/veiculos/buscar", VeiculoController.buscarVeiculo);
router.get("/veiculos/listar/filtro", VeiculoController.listarVeiculosComFiltro);
router.get("/veiculos/ordenar", VeiculoController.ordenarVeiculos);

export default router;

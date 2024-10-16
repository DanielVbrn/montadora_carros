import { Router } from "express";
import VeiculoController from "./controller/MontadoraController";
import HomeController from "./controller/HomeController";

const router = Router();

router.get("/", HomeController.getHomePage); // Rota para a página inicial
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

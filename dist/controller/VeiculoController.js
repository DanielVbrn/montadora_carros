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
const Veiculo_1 = __importDefault(require("../models/Veiculo"));
const Montadora_1 = __importDefault(require("../models/Montadora"));
const config_database_1 = __importDefault(require("../config/config_database"));
const typeorm_1 = require("typeorm");
const ModeloVeiculo_1 = __importDefault(require("../models/ModeloVeiculo"));
class VeiculoController {
}
_a = VeiculoController;
VeiculoController.getAdicionarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoras = yield config_database_1.default.getRepository(Montadora_1.default).find();
    const montadoraOptions = montadoras.map(m => `<option value="${m.id}">${m.nome}</option>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Adicionar Veículo</title>
                <link rel="stylesheet" href="/css/form.css">
                <script>
                    async function carregarModelos() {
                        const montadoraId = document.getElementById('montadora').value;
                        const response = await fetch('/modelos/' + montadoraId);
                        const modelos = await response.json();
                        const modeloSelect = document.getElementById('modelo_id');
                        modeloSelect.innerHTML = modelos.map(modelo => 
                            '<option value="' + modelo.id + '">' + modelo.nome + '</option>'
                        ).join('');
                    }
                </script>
            </head>
            <body>  
                <h1>Adicionar Veículo</h1>
                <form method="POST" action="/veiculos/adicionar">
                    <label for="montadora">Montadora:</label>
                    <select id="montadora" name="montadoraId" required onchange="carregarModelos()">
                        <option value="">Selecione a Montadora</option>
                        ${montadoraOptions}
                    </select><br>
    
                    <label for="modelo_id">Modelo:</label>
                    <select id="modelo_id" name="modelo_id" required>
                        <option value="">Selecione um Modelo</option>
                    </select><br>
    
                    <label for="name">Nome:</label>
                    <input type="text" id="name" name="name" required><br>
    
                    <label for="cor">Cor:</label>
                    <input type="text" id="cor" name="cor" required><br>
    
                    <label for="ano_fabricacao">Ano de Fabricação:</label>
                    <input type="number" id="ano_fabricacao" name="ano_fabricacao" required><br>
    
                    <label for="ano_modelo">Ano do Modelo:</label>
                    <input type="number" id="ano_modelo" name="ano_modelo" required><br>
    
                    <label for="valor">Valor:</label>
                    <input type="number" id="valor" name="valor" required><br>
    
                    <label for="placa">Placa:</label>
                    <input type="text" id="placa" name="placa" required><br>
    
                    <button type="submit">Adicionar Veículo</button>
                </form>
            </body>
            </html>
        `);
});
VeiculoController.adicionarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { montadora_id, modelo_id, name, cor, ano_fabricacao, ano_modelo, valor, placa, vendido } = req.body;
        const montadora = yield config_database_1.default.getRepository(Montadora_1.default).findOneBy({ id: Number(montadora_id) });
        if (!montadora) {
            return res.status(400).send("Montadora não encontrada!");
        }
        const modelo = yield config_database_1.default.getRepository(ModeloVeiculo_1.default).findOneBy({ id: Number(modelo_id) });
        if (!modelo) {
            return res.status(400).send("Modelo não encontrado");
        }
        const newVeiculo = new Veiculo_1.default();
        newVeiculo.modelo_id = modelo_id;
        newVeiculo.name = name;
        newVeiculo.cor = cor;
        newVeiculo.ano_fabricacao = ano_fabricacao;
        newVeiculo.ano_modelo = ano_modelo;
        newVeiculo.valor = valor;
        newVeiculo.placa = placa;
        newVeiculo.vendido = vendido === "on";
        yield config_database_1.default.getRepository(Veiculo_1.default).save(newVeiculo);
        return res.redirect("/veiculos/listar");
    }
    catch (error) {
        console.error("Erro ao salvar o veículo: ", error);
        return res.status(500).send("Erro ao salvar veículo!");
    }
});
VeiculoController.listarModelosPorMontadora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const montadoraId = req.params.montadoraId;
    try {
        const modelos = yield config_database_1.default.getRepository(ModeloVeiculo_1.default).find({
            where: { montadora: { id: Number(montadoraId) } }
        });
        return res.json(modelos);
    }
    catch (error) {
        console.error("Erro ao buscar modelos: ", error);
        return res.status(500).send("Erro ao buscar modelos.");
    }
});
VeiculoController.listarVeiculos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const veiculos = yield config_database_1.default.getRepository(Veiculo_1.default).find();
    const veiculoList = veiculos.map(v => `<h2>${v.name}</h2>
             <li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'} 
            <a href="/veiculos/editar/${v.id}">Editar</a> 
            <a href="/veiculos/remover/${v.id}">Remover</a></li>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Lista de Veículos</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Lista de Veículos</h1>
                <ul>${veiculoList}</ul>
                <a href="/veiculos/adicionar">Adicionar Novo Veículo</a>
            </body>
            </html>
        `);
});
VeiculoController.getEditarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const veiculoId = req.params.id;
    const veiculo = yield config_database_1.default.getRepository(Veiculo_1.default).findOneBy({ id: Number(veiculoId) });
    if (!veiculo) {
        return res.status(404).send("Veículo não encontrado");
    }
    const montadoras = yield config_database_1.default.getRepository(Montadora_1.default).find();
    const montadoraOptions = montadoras.map(m => `<option value="${m.id}" ${m.id === veiculo.id ? 'selected' : ''}>${m.nome}</option>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Editar Veículo</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Editar Veículo</h1>
                <form method="POST" action="/veiculos/editar/${veiculoId}">
                    <label for="montadora">Montadora:</label>
                    <select id="montadora" name="montadoraId" required>
                        ${montadoraOptions}
                    </select><br>

                    <label for="modelo_id">Modelo ID:</label>
                    <input type="text" id="modelo_id" name="modelo_id" value="${veiculo.modelo_id}" required><br>

                    <label for="cor">Cor:</label>
                    <input type="text" id="cor" name="cor" value="${veiculo.cor}" required><br>

                    <label for="ano_fabricacao">Ano de Fabricação:</label>
                    <input type="number" id="ano_fabricacao" name="ano_fabricacao" value="${veiculo.ano_fabricacao}" required><br>

                    <label for="ano_modelo">Ano do Modelo:</label>
                    <input type="number" id="ano_modelo" name="ano_modelo" value="${veiculo.ano_modelo}" required><br>

                    <label for="valor">Valor:</label>
                    <input type="number" id="valor" name="valor" value="${veiculo.valor}" required><br>

                    <label for="placa">Placa:</label>
                    <input type="text" id="placa" name="placa" value="${veiculo.placa}" required><br>

                    <label for="vendido">Vendido:</label>
                    <input type="checkbox" id="vendido" name="vendido" ${veiculo.vendido ? 'checked' : ''}><br>

                    <button type="submit">Salvar</button>
                </form>
            </body>
            </html>
        `);
});
VeiculoController.editarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const veiculoId = req.params.id;
    const { montadoraId, modelo_id, cor, ano_fabricacao, ano_modelo, valor, placa, vendido } = req.body;
    const veiculo = yield config_database_1.default.getRepository(Veiculo_1.default).findOneBy({ id: Number(veiculoId) });
    if (!veiculo) {
        return res.status(404).send("Veículo não encontrado");
    }
    veiculo.id = Number(montadoraId);
    veiculo.modelo_id = modelo_id;
    veiculo.cor = cor;
    veiculo.ano_fabricacao = parseInt(ano_fabricacao);
    veiculo.ano_modelo = parseInt(ano_modelo);
    veiculo.valor = parseFloat(valor);
    veiculo.placa = placa;
    veiculo.vendido = vendido === 'on';
    yield config_database_1.default.getRepository(Veiculo_1.default).save(veiculo);
    return res.redirect('/veiculos/listar');
});
VeiculoController.removerVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const veiculoId = req.params.id;
    yield config_database_1.default.getRepository(Veiculo_1.default).delete({ id: Number(veiculoId) });
    return res.redirect('/veiculos/listar');
});
VeiculoController.venderVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const veiculoId = req.params.id;
    const veiculo = yield config_database_1.default.getRepository(Veiculo_1.default).findOneBy({ id: Number(veiculoId) });
    if (!veiculo) {
        return res.status(404).send("Veículo não encontrado");
    }
    veiculo.vendido = true;
    yield config_database_1.default.getRepository(Veiculo_1.default).save(veiculo);
    return res.redirect('/veiculos/listar');
});
VeiculoController.buscarVeiculo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filtro } = req.query;
    const veiculos = yield config_database_1.default.getRepository(Veiculo_1.default).find({
        where: [
            { modelo_id: (0, typeorm_1.Like)(`%${filtro}%`) },
            { placa: (0, typeorm_1.Like)(`%${filtro}%`) }
        ]
    });
    const veiculoList = veiculos.map(v => `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Buscar Veículos</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Buscar Veículos</h1>
                <ul>${veiculoList}</ul>
                <a href="/veiculos/listar">Voltar à lista</a>
            </body>
            </html>
        `);
});
VeiculoController.listarVeiculosComFiltro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeModelo, anoFabricacaoMin, anoFabricacaoMax, anoModeloMin, anoModeloMax, valorMin, valorMax, vendido } = req.query;
    const query = config_database_1.default.getRepository(Veiculo_1.default).createQueryBuilder("veiculo");
    if (nomeModelo) {
        query.andWhere("veiculo.modelo_id LIKE :modelo", { modelo: `%${nomeModelo}%` });
    }
    if (anoFabricacaoMin) {
        query.andWhere("veiculo.ano_fabricacao >= :min", { min: anoFabricacaoMin });
    }
    if (anoFabricacaoMax) {
        query.andWhere("veiculo.ano_fabricacao <= :max", { max: anoFabricacaoMax });
    }
    if (anoModeloMin) {
        query.andWhere("veiculo.ano_modelo >= :min", { min: anoModeloMin });
    }
    if (anoModeloMax) {
        query.andWhere("veiculo.ano_modelo <= :max", { max: anoModeloMax });
    }
    if (valorMin) {
        query.andWhere("veiculo.valor >= :min", { min: valorMin });
    }
    if (valorMax) {
        query.andWhere("veiculo.valor <= :max", { max: valorMax });
    }
    if (vendido === 'true') {
        query.andWhere("veiculo.vendido = true");
    }
    else if (vendido === 'false') {
        query.andWhere("veiculo.vendido = false");
    }
    const veiculos = yield query.getMany();
    const veiculoList = veiculos.map(v => `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Lista de Veículos Filtrados</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Lista de Veículos Filtrados</h1>
                <ul>${veiculoList}</ul>
                <a href="/veiculos/listar">Voltar à lista</a>
            </body>
            </html>
        `);
});
VeiculoController.ordenarVeiculos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { criterio, ordem } = req.query;
    const query = config_database_1.default.getRepository(Veiculo_1.default).createQueryBuilder("veiculo");
    if (criterio === 'modelo') {
        query.orderBy("veiculo.modelo_id", ordem === 'ASC' ? 'ASC' : 'DESC');
    }
    else if (criterio === 'ano') {
        query.orderBy("veiculo.ano_fabricacao", ordem === 'ASC' ? 'ASC' : 'DESC');
    }
    else if (criterio === 'valor') {
        query.orderBy("veiculo.valor", ordem === 'ASC' ? 'ASC' : 'DESC');
    }
    const veiculos = yield query.getMany();
    const veiculoList = veiculos.map(v => `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`).join("");
    return res.send(`
            <html>
            <head>
                <title>Veículos Ordenados</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Veículos Ordenados</h1>
                <ul>${veiculoList}</ul>
                <a href="/veiculos/listar">Voltar à lista</a>
            </body>
            </html>
        `);
});
exports.default = VeiculoController;

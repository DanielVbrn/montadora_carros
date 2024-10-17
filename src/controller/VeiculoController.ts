import { Request, Response } from "express";
import Veiculo from "../models/Veiculo";
import Montadora from "../models/Montadora";
import AppDataSource from "../config/config_database";
import { Like } from "typeorm";

class VeiculoController {

    public static getCadastrarMontadora = async (req: Request, res: Response): Promise<any> => {
        return res.send(`
            <html>
            <head>
                <title>Cadastrar Montadora</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <h1>Cadastrar Montadora</h1>
                <form method="POST" action="/montadoras/cadastrar">
                    <label for="nome">Nome da Montadora:</label>
                    <input type="text" id="nome" name="nome" required><br>
                    
                    <button type="submit">Cadastrar Montadora</button>
                </form>
            </body>
            </html>
        `);
    };
    
    public static cadastrarMontadora = async (req: Request, res: Response): Promise<any> => {
        try {
            const { nome } = req.body;
    

            const novaMontadora = new Montadora();
            novaMontadora.nome = nome;
    

            await AppDataSource.getRepository(Montadora).save(novaMontadora);
    
            return res.redirect('/montadoras/listar'); 
        } catch (error) {
            console.error("Erro ao cadastrar montadora:", error);
            return res.status(500).send("Erro ao cadastrar montadora");
        }
    };
    

    public static getAdicionarVeiculo = async (req: Request, res: Response): Promise<any> => {
        const montadoras = await AppDataSource.getRepository(Montadora).find();
        const montadoraOptions = montadoras.map(m => `<option value="${m.id}">${m.nome}</option>`).join("");

        return res.send(`
            <html>
            <head>
                <title>Adicionar Veículo</title>
                <link rel="stylesheet" href="/css/styles.css">

            </head>
            <body>
                <h1>Adicionar Veículo</h1>
                <form method="POST" action="/veiculos/adicionar">
                    <label for="montadora">Montadora:</label>
                    <select id="montadora" name="montadoraId" required>
                        ${montadoraOptions}
                    </select><br>

                    <label for="modelo_id">Modelo ID:</label>
                    <input type="text" id="modelo_id" name="modelo_id" required><br>

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

                    <label for="vendido">Vendido:</label>
                    <input type="checkbox" id="vendido" name="vendido"><br>

                    <button type="submit">Adicionar Veículo</button>
                </form>
            </body>
            </html>
        `);
    };


    public static adicionarVeiculo = async (req: Request, res: Response): Promise<any> => {
        try {
            const { montadoraId, modelo_id, name, cor, ano_fabricacao, ano_modelo, valor, placa, vendido } = req.body;
    
            const novoVeiculo = new Veiculo();
            novoVeiculo.modelo_id = modelo_id;
            novoVeiculo.name = name;  // Adicionando o valor de 'name'
            novoVeiculo.cor = cor;
            novoVeiculo.ano_fabricacao = parseInt(ano_fabricacao);
            novoVeiculo.ano_modelo = parseInt(ano_modelo);
            novoVeiculo.valor = parseFloat(valor);
            novoVeiculo.placa = placa;
            novoVeiculo.vendido = vendido === 'on';
    
            await AppDataSource.getRepository(Veiculo).save(novoVeiculo);
    
            return res.redirect('/veiculos/listar');
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            return res.status(500).send("Erro ao salvar veículo");
        }
    };
    
      
    

    public static listarVeiculos = async (req: Request, res: Response): Promise<any> => {
        const veiculos = await AppDataSource.getRepository(Veiculo).find();
        const veiculoList = veiculos.map(v => 
            `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'} 
            <a href="/veiculos/editar/${v.id}">Editar</a> 
            <a href="/veiculos/remover/${v.id}">Remover</a></li>`
        ).join("");

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
    };

    public static getEditarVeiculo = async (req: Request, res: Response): Promise<any> => {
        const veiculoId = req.params.id;
        const veiculo = await AppDataSource.getRepository(Veiculo).findOneBy({ id: Number(veiculoId) });

        if (!veiculo) {
            return res.status(404).send("Veículo não encontrado");
        }

        const montadoras = await AppDataSource.getRepository(Montadora).find();
        const montadoraOptions = montadoras.map(m => 
            `<option value="${m.id}" ${m.id === veiculo.id ? 'selected' : ''}>${m.nome}</option>`
        ).join("");

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
    };

    public static editarVeiculo = async (req: Request, res: Response): Promise<any> => {
        const veiculoId = req.params.id;
        const { montadoraId, modelo_id, cor, ano_fabricacao, ano_modelo, valor, placa, vendido } = req.body;

        const veiculo = await AppDataSource.getRepository(Veiculo).findOneBy({ id: Number(veiculoId) });

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

        await AppDataSource.getRepository(Veiculo).save(veiculo);
        
        return res.redirect('/veiculos/listar');
    };


    public static removerVeiculo = async (req: Request, res: Response): Promise<any> => {
        const veiculoId = req.params.id;
        await AppDataSource.getRepository(Veiculo).delete({ id: Number(veiculoId) });
        
        return res.redirect('/veiculos/listar');
    };

    public static venderVeiculo = async (req: Request, res: Response): Promise<any> => {
        const veiculoId = req.params.id;
        const veiculo = await AppDataSource.getRepository(Veiculo).findOneBy({ id: Number(veiculoId) });

        if (!veiculo) {
            return res.status(404).send("Veículo não encontrado");
        }

        veiculo.vendido = true;
        await AppDataSource.getRepository(Veiculo).save(veiculo);

        return res.redirect('/veiculos/listar');
    };

    public static buscarVeiculo = async (req: Request, res: Response): Promise<any> => {
        const { filtro } = req.query;
        const veiculos = await AppDataSource.getRepository(Veiculo).find({
            where: [
                { modelo_id: Like(`%${filtro}%`) },
                { placa: Like(`%${filtro}%`) }
            ]
        });

        const veiculoList = veiculos.map(v => 
            `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`
        ).join("");

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
    };


    public static listarVeiculosComFiltro = async (req: Request, res: Response): Promise<any> => {
        const { nomeModelo, anoFabricacaoMin, anoFabricacaoMax, anoModeloMin, anoModeloMax, valorMin, valorMax, vendido } = req.query;

        const query = AppDataSource.getRepository(Veiculo).createQueryBuilder("veiculo");

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
        } else if (vendido === 'false') {
            query.andWhere("veiculo.vendido = false");
        }

        const veiculos = await query.getMany();

        const veiculoList = veiculos.map(v => 
            `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`
        ).join("");

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
    };


    public static ordenarVeiculos = async (req: Request, res: Response): Promise<any> => {
        const { criterio, ordem } = req.query;
        const query = AppDataSource.getRepository(Veiculo).createQueryBuilder("veiculo");

        if (criterio === 'modelo') {
            query.orderBy("veiculo.modelo_id", ordem === 'ASC' ? 'ASC' : 'DESC');
        } else if (criterio === 'ano') {
            query.orderBy("veiculo.ano_fabricacao", ordem === 'ASC' ? 'ASC' : 'DESC');
        } else if (criterio === 'valor') {
            query.orderBy("veiculo.valor", ordem === 'ASC' ? 'ASC' : 'DESC');
        }

        const veiculos = await query.getMany();

        const veiculoList = veiculos.map(v => 
            `<li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'}</li>`
        ).join("");

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
    };
}

export default VeiculoController;

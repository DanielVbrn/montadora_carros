import { Request, Response } from "express";
import Veiculo from "../models/Veiculo";
import Montadora from "../models/Montadora";
import AppDataSource from "../config/config_database";
import { Like } from "typeorm";
import ModeloVeiculo from "../models/ModeloVeiculo";

class VeiculoController {
    public static getAdicionarVeiculo = async (req: Request, res: Response): Promise<any> => {
        const montadoras = await AppDataSource.getRepository(Montadora).find();
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
    };
    

    public static adicionarVeiculo = async (req: Request, res: Response): Promise<any> => {
        try {
            
            const {montadora_id, modelo_id, name, cor, ano_fabricacao, ano_modelo, valor, placa, vendido} = req.body
    
            const montadora = await AppDataSource.getRepository(Montadora).findOneBy({id:Number(montadora_id)})
    
            if(!montadora) {
                return res.status(400).send("Montadora não encontrada!");
            }
    
            const modelo = await AppDataSource.getRepository(ModeloVeiculo).findOneBy({ id: Number(modelo_id) });
            if (!modelo) {
                return res.status(400).send("Modelo não encontrado");
            }
    
            const newVeiculo = new Veiculo();
            newVeiculo.modelo_id = modelo_id;
            newVeiculo.name = name;
            newVeiculo.cor = cor;
            newVeiculo.ano_fabricacao = ano_fabricacao;
            newVeiculo.ano_modelo = ano_modelo;
            newVeiculo.valor = valor;
            newVeiculo.placa = placa;
            newVeiculo.vendido = vendido === "on";
    
            await AppDataSource.getRepository(Veiculo).save(newVeiculo);
    
            return res.redirect("/veiculos/listar");
        } catch (error) {
            console.error("Erro ao salvar o veículo: ",error);
            return res.status(500).send("Erro ao salvar veículo!");
        }

    };

    public static listarModelosPorMontadora = async (req: Request, res: Response): Promise<any> => {
        const montadoraId = req.params.montadoraId;

        try {
            const modelos = await AppDataSource.getRepository(ModeloVeiculo).find({
                where: { montadora: { id: Number(montadoraId) } }
            });

            return res.json(modelos);
        } catch (error) {
            console.error("Erro ao buscar modelos: ", error);
            return res.status(500).send("Erro ao buscar modelos.");
        }
    };


    public static listarVeiculos = async (req: Request, res: Response): Promise<any> => {
        const veiculos = await AppDataSource.getRepository(Veiculo).find();
        const veiculoList = veiculos.map(v => 
            `<h2>${v.name}</h2>
             <li>${v.modelo_id} (${v.placa}) - ${v.vendido ? 'Vendido' : 'Disponível'} 
            <a href="/veiculos/editar/${v.id}">Editar</a> 
            <a href="/veiculos/remover/${v.id}">Remover</a></li>
            <br/>
            <a href="/">Página Inicial</a>
            
            `
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
                <br/>
                <a href="/">Página Inicial</a>
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

        const modelos = await AppDataSource.getRepository(ModeloVeiculo).find({
            where: { montadora: { id: Number(montadoras) } },
            relations: ["montadora"]
        });
                const modeloOptions = modelos.map(md => 
            `<option value="${md.id}" ${md.id === md.montadora.id ? 'selected' : ''}>${md.nome}</option>`
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
                    <input type="text" id="modelo_id" name="modelo_id" value="${modeloOptions}" required><br>

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

import { Request, Response } from "express";
import Montadora from "../models/Montadora";
import AppDataSource from "../config/config_database";

class MontadoraController {
    public static getCadastrarMontadora = async (req: Request, res: Response): Promise<any> => {
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
                    <br/>
                    <a href="/">Página Inicial</a>                
                </form>
            </body>
            </html>
        `);
    };


    public static cadastrarMontadora = async (req: Request, res: Response): Promise<any> => {
        try {
            const { nome, pais, ano_fundacao } = req.body;
    
            const novaMontadora = new Montadora();
            novaMontadora.nome = nome;
            novaMontadora.pais = pais;
            novaMontadora.ano_fundacao = parseInt(ano_fundacao);
    
            await AppDataSource.getRepository(Montadora).save(novaMontadora);
    
            return res.redirect('/montadoras/listar'); 
        } catch (error) {
            console.error("Erro ao cadastrar montadora:", error);
            return res.status(500).send("Erro ao cadastrar montadora");
        }
    };


    public static listarMontadoras = async (req: Request, res: Response): Promise<any> => {
        const montadoras = await AppDataSource.getRepository(Montadora).find();
        const totalMontadoras = montadoras.length;

        const montadoraList = montadoras.map(m => 
            `<li>${m.nome} - ${m.pais} (${m.ano_fundacao})</li>`
        ).join("");

        return res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="/css/list.css">

            </head>
            <body>
                <h1>Lista de Montadoras (${totalMontadoras} Cadastradas)</h1>
                <ul>${montadoraList}</ul>
                <a href="/montadoras/cadastrar">Cadastrar Nova Montadora</a>
                <br/>
                <a href="/">Página Inicial</a>   
            </body>
            </html>
        `);
    };


    public static getAtualizarMontadora = async (req: Request, res: Response): Promise<any> => {
        const montadoraId = Number(req.params.id);
        const montadora = await AppDataSource.getRepository(Montadora).findOneBy({ id: montadoraId });

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
    };

    public static atualizarMontadora = async (req: Request, res: Response): Promise<any> => {
        const montadoraId = Number(req.params.id);
        const { nome, pais, ano_fundacao } = req.body;

        const montadora = await AppDataSource.getRepository(Montadora).findOneBy({ id: montadoraId });
        if (!montadora) {
            return res.status(404).send("Montadora não encontrada");
        }

        montadora.nome = nome;
        montadora.pais = pais;
        montadora.ano_fundacao = parseInt(ano_fundacao);

        await AppDataSource.getRepository(Montadora).save(montadora);
        return res.redirect('/montadoras/listar');
    };

    public static removerMontadora = async (req: Request, res: Response): Promise<any> => {
        const montadoraId = Number(req.params.id);
        await AppDataSource.getRepository(Montadora).delete({ id: montadoraId });
        return res.redirect('/montadoras/listar');
    };
}

export default MontadoraController;

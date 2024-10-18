import { Request, Response } from "express";

class HomeController {
    public static getHomePage = (req: Request, res: Response): void => {
        res.send(`
            <html>
            <head>
                <title>Home - Montadora</title>
                <link rel="stylesheet" href="/css/home.css">
            </head>
            <body>
                <h1>Bem-vindo à Montadora de Carros</h1>
                <p>Escolha uma opção abaixo:</p>
                <ul>
                    <li><a href="/montadoras/cadastrar">Adicionar Montadora</a></li>
                    <li><a href="/modelos/listar">Adicionar Modelos</a></li>
                    <li><a href="/veiculos/listar">Ver Veiculos</a></li>
                    <li><a href="/veiculos/adicionar">Adicionar Veículos</a></li>
                    <li><a href="/vender-veiculo">Vender Veículo</a></li>
                    <li><a href="/veiculos/listar/filtro">Filtrar Veículos</a></li>
                </ul>
            </body>
            </html>
        `);
    }
}

export default HomeController;

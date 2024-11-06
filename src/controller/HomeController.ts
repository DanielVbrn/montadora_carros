import { Request, Response } from "express";

class HomeController {
    public static getHomePage = (req: Request, res: Response): void => {
        res.send(`
            <html>
                <head>
                    <title>Home - Montadora</title>
                    <link rel="stylesheet" href="/css/home.css">
                </head>
                <body class="container">
                    <header class="cabecalho">
                        <h1>Bem-vindo à PatroCars</h1>
                    </header>
                    <aside class="menu-lateral">
                        <ul>
                            <li><a href="/montadoras/cadastrar">Adicionar Montadora</a></li>
                            <li><a href="/modelos/listar">Adicionar Modelos</a></li>
                            <li><a href="/veiculos/listar">Ver Veículos</a></li>
                            <li><a href="/veiculos/adicionar">Adicionar Veículos</a></li>
                            <li><a href="/vender-veiculo">Vender Veículo</a></li>
                            <li><a href="/veiculos/listar/filtro">Filtrar Veículos</a></li>
                        </ul>
                    </aside>
                    <main class="principal">
                        <img src="./carro_moderno.png" alt="Imagem de Carro">
                    </main>
                    <footer class="rodape">
                        <h3>Montadora de Carros</h3>
                        <p>&copy; 2024 Todos os direitos reservados.</p>
                    </footer>
                </body>
            </html>

        `);
    }
}

export default HomeController;

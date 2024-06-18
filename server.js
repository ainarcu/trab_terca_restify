const restify = require('restify');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

class API {
  constructor() {
    this.server = restify.createServer();
    this.server.use(bodyParser.json());

    this.cidades = [
      { id: 1, nome: 'São Paulo' },
      { id: 2, nome: 'Rio de Janeiro' }
    ];

    this.clientes = [
      { id: 1, nome: 'João', altura: 1.80, nascimento: '1990-01-01', cidade_id: 1 },
      { id: 2, nome: 'Maria', altura: 1.65, nascimento: '1995-02-15', cidade_id: 2 }
    ];

    this.pedidos = [
      { id: 1, horario: new Date(), endereco: 'Av. Paulista, 1000', cliente_id: 1 },
      { id: 2, horario: new Date(), endereco: 'Rua Copacabana, 500', cliente_id: 2 }
    ];

    this.pedidosProdutos = [
      { pedido_id: 1, produto_id: 1, preco: 50.0, quantidade: 2.0 },
      { pedido_id: 2, produto_id: 2, preco: 35.0, quantidade: 1.0 }
    ];

    this.produtos = [
      { id: 1, nome: 'Camiseta', preco: 50.0, quantidade: 10, categoria_id: 1 },
      { id: 2, nome: 'Calça', preco: 35.0, quantidade: 5, categoria_id: 1 }
    ];

    this.categorias = [
      { id: 1, nome: 'Vestuário' }
    ];

    this.configureRoutes();
  }

  configureRoutes() {
    this.server.get('/api/cidades', (req, res, next) => {
      res.send(this.cidades);
      next();
    });

    this.server.get('/api/clientes', (req, res, next) => {
      res.send(this.clientes);
      next();
    });

    this.server.get('/api/clientes/:id', (req, res, next) => {
      const cliente = this.clientes.find(c => c.id === parseInt(req.params.id));
      if (!cliente) {
        res.send(404, { error: 'Cliente não encontrado' });
      } else {
        res.send(cliente);
      }
      next();
    });

    this.server.post('/api/clientes', (req, res, next) => {
      const { nome, altura, nascimento, cidade_id } = req.body;
      const novoCliente = {
        id: this.clientes.length + 1,
        nome,
        altura,
        nascimento,
        cidade_id
      };
      this.clientes.push(novoCliente);
      res.send(201, novoCliente);
      next();
    });

    this.server.get('/api/pedidos', (req, res, next) => {
      res.send(this.pedidos);
      next();
    });

    this.server.get('/api/clientes/:cliente_id/pedidos', (req, res, next) => {
      const clientePedidos = this.pedidos.filter(pedido => pedido.cliente_id === parseInt(req.params.cliente_id));
      res.send(clientePedidos);
      next();
    });

    this.server.get('/api/pedidos/:pedido_id/produtos', (req, res, next) => {
      const pedidoProdutos = this.pedidosProdutos.filter(pp => pp.pedido_id === parseInt(req.params.pedido_id));
      const produtosDoPedido = pedidoProdutos.map(pp => {
        const produto = this.produtos.find(p => p.id === pp.produto_id);
        return {
          id: produto.id,
          nome: produto.nome,
          preco: pp.preco,
          quantidade: pp.quantidade
        };
      });
      res.send(produtosDoPedido);
      next();
    });

    this.server.get('/api/produtos', (req, res, next) => {
      res.send(this.produtos);
      next();
    });

    this.server.post('/api/produtos', (req, res, next) => {
      const { nome, preco, quantidade, categoria_id } = req.body;
      const novoProduto = {
        id: this.produtos.length + 1,
        nome,
        preco,
        quantidade,
        categoria_id
      };
      this.produtos.push(novoProduto);
      res.send(201, novoProduto);
      next();
    });

    this.server.put('/api/produtos/:id', (req, res, next) => {
      const { id } = req.params;
      const { nome, preco, quantidade, categoria_id } = req.body;
      const index = this.produtos.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        res.send(404, { error: 'Produto não encontrado' });
      } else {
        this.produtos[index] = {
          ...this.produtos[index],
          nome,
          preco,
          quantidade,
          categoria_id
        };
        res.send(200, this.produtos[index]);
      }
      next();
    });

    this.server.del('/api/produtos/:id', (req, res, next) => {
      const { id } = req.params;
      const index = this.produtos.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        res.send(404, { error: 'Produto não encontrado' });
      } else {
        this.produtos.splice(index, 1);
        res.send(204);
      }
      next();
    });

    this.server.get('/api/categorias', (req, res, next) => {
      res.send(this.categorias);
      next();
    });

    this.server.on('NotFound', (req, res, next) => {
      res.send(404, { error: 'Rota não encontrada' });
      next();
    });

    this.server.listen(8000, () => {
      console.log('Servidor rodando na porta 8000');
    });
  }
}

const api = new API();

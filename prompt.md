Contexto do Projeto
- Desenvolva um frontend em React que se integre com uma API REST NestJS de gerenciamento de vendas. O sistema permite:
- Gerenciar usuários com diferentes permissões (Admin, Vendedor, Usuário)
- Cadastrar e gerenciar produtos, fornecedores e clientes
- Registrar vendas com múltiplos itens
- Visualizar relatórios detalhados de vendas, produtos e desempenho


Estrutura de Dados

Usuários

{
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

Produtos

{
    id: string;
  name: string;
  description: string;
  price: number;
  cost: number; // Custo de aquisição
  stock: number;
  sku: string;
  supplier: Supplier;
  createdAt: Date;
  updatedAt: Date;
}

Fornecedores
{
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

Vendas

{
  id: string;
  customer: Customer;
  user: User; // Vendedor
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  notes: string;
  items: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Item da venda
{
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  sale: Sale;
}

Clientes

{
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  sales: Sale[];
  createdAt: Date;
  updatedAt: Date;
}

Endpoints da API e Parâmetros

Autenticação
- POST /api/auth/login - Login (body: {username, password})
- POST /api/auth/reset-password/request/:username - Solicitar reset (admin)
- POST /api/auth/reset-password/complete - Completar reset (body: {token, newPassword})

Usuários
- GET /api/users - Listar (query: page, take, username, name, role, order)
- GET /api/users/:id - Detalhes
- POST /api/users - Criar (body: {username, password, name, email, role})
- PUT /api/users/:id - Atualizar
- DELETE /api/users/:id - Excluir

Produtos
- GET /api/products - Listar (query: page, take, name, minPrice, maxPrice, supplierId, order)
- GET /api/products/:id - Detalhes
- POST /api/products - Criar (body: {name, description, price, cost, stock, sku, supplierId})
- PUT /api/products/:id - Atualizar
- DELETE /api/products/:id - Excluir

Fornecedores
- GET /api/suppliers - Listar (query: page, take, name, email, order)
- GET /api/suppliers/:id - Detalhes
- POST /api/suppliers - Criar (body: {name, contactName, email, phone, address})
- PUT /api/suppliers/:id - Atualizar
- DELETE /api/suppliers/:id - Excluir

Clientes
- GET /api/customers - Listar (query: page, take, name, email, order)
- GET /api/customers/:id - Detalhes
- POST /api/customers - Criar (body: {name, email, phone, address})
- PUT /api/customers/:id - Atualizar
- DELETE /api/customers/:id - Excluir

Vendas
- GET /api/sales - Listar (query: page, take, status, customerId, userId, startDate, endDate, order)
- GET /api/sales/:id - Detalhes
- POST /api/sales - Criar (body: {customerId, items: [{productId, quantity}], notes})
- PUT /api/sales/:id - Atualizar status (body: {status})
- DELETE /api/sales/:id - Excluir (somente vendas pendentes)

Relatórios
- GET /api/reports/summary - Resumo (query: startDate, endDate, userId)
- GET /api/reports/products - Por produto (query: startDate, endDate, productId)
- GET /api/reports/sellers - Por vendedor (query: startDate, endDate, userId)
- GET /api/reports/daily - Diário (query: startDate, endDate)
- GET /api/reports/weekly - Semanal (query: startDate, endDate)
- GET /api/reports/monthly - Mensal (query: startDate, endDate)
- GET /api/reports/top-customers - Melhores clientes (query: startDate, endDate)

Requisitos de Implementação

Tecnologias Obrigatórias
- React 18+ com TypeScript
- React Router para navegação
- React Query ou Redux Toolkit para estado
- Axios para API
- React Hook Form para formulários
- Material UI ou Chakra UI para componentes
- Recharts para gráficos

Estrutura de Páginas
- Login e Autenticação
- Login com username/password
- Manter sessão com token JWT
- Controle de acesso baseado em roles

Dashboard
- Resumo de vendas recentes (hoje, semana, mês)
- Produtos com baixo estoque
- Métricas principais (total vendas, lucro, etc.)
- Gráfico de vendas no tempo

Gerenciamento de Usuários (Admin)
- Listagem com filtros e paginação
- CRUD completo
- Reset de senha

Gerenciamento de Produtos
- Listagem com filtros, pesquisa e paginação
- CRUD completo
- Visualização detalhada com histórico de vendas

Fornecedores e Clientes
- Listagem com filtros e pesquisa
- CRUD completo
- Visualização de histórico de relacionamento

Processo de Vendas
- Criar nova venda (seleção de cliente e produtos)
- Carrinho/Checkout com cálculo automático
- Finalização e impressão de comprovante

Listagem de vendas com filtros

Relatórios
- Filtros de período e outros parâmetros
- Exibição visual com gráficos
- Tabelas de dados com exportação

Performance por vendedor, produto, cliente

Configurações da Conta
- Perfil do usuário
- Alterar senha
- Preferências do sistema

Controle de Acesso
- Admin: Acesso completo
- Vendedor: Acesso a vendas, clientes, produtos (sem excluir)
- Usuário: Visualização limitada

Funcionalidades Adicionais
- Tema claro/escuro
- Layout responsivo
- Toast notifications para feedback
- Validação completa de formulários
- Lazy loading para otimização
- Tratamento de erros com mensagens amigáveis
- Auto-refresh inteligente de dados

Por favor, implemente este frontend com foco em:
- Organização do código (componentes reutilizáveis)
- Experiência de usuário fluida
- Desempenho (evitar re-renders desnecessários)
- Segurança (sanitização de inputs, validação, XSS)
- Feedback visual para ações do usuário

O resultado final deve ser um sistema completo e profissional que permite gerenciar todo o ciclo de vendas da empresa
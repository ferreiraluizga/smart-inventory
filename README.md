# 📦 SmartInventory - Sistema de Controle de Estoque e Fluxo de Caixa

O **SmartInventory** é uma aplicação moderna para gerenciamento inteligente de estoque e controle financeiro. O sistema permite o cadastro de produtos vinculados às suas respectivas marcas, categorias e fornecedores. Além disso, realiza o balanço automático de lucros monitorando as entradas através de **Vendas** e as saídas por meio de **Pedidos de Fornecimento**.

---

## 🗺️ Modelagem do Sistema

### Diagrama de Casos de Uso
O diagrama de casos de uso ilustra como o usuário interage com as fronteiras do sistema, destacando os fluxos de cadastros e o controle do fluxo de caixa.

![Diagrama de Casos de Uso](docs/uc_diagram.svg)

### Diagrama de Classes
O diagrama de classes representa a estrutura de dados e as regras de negócio. Ele utiliza as tabelas associativas `ItemVenda` e `ItemPedido` para garantir a integridade do estoque e dos históricos de preços de custo e venda.

![Diagrama de Classes](docs/class_diagram.svg)

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Java 21 / Spring Boot 4.x (API Rest)
*   **Frontend:** React / Vite / Bootstrap 
*   **Banco de Dados:** PostgreSQL 14
*   **Containerização:** Docker 

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker 

---

### ▶️ Subir a aplicação

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker-compose up --build
```

---

### 🛑 Parar a aplicação

```bash
docker-compose down
```

---

### 🌐 Endpoints da aplicação

* 💻 API (Backend): [http://localhost:8080](http://localhost:8080)
* * 💻 Site (Frontend): [http://localhost:5173](http://localhost:5173)
* 📑 Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
* 🗄️ Banco de dados: PostgreSQL em `localhost:5432` (se exposto no compose)

---

## 📁 Estrutura do Projeto

O projeto está organizado em duas camadas principais: backend e frontend.

---

### 🖥️ Backend (Spring Boot)

```text
backend/
├── src/main/java/
│   └── com.smartinventory/
│       ├── config/          # Configurações (Security, CORS, etc)
│       ├── controller/      # Controllers REST
│       ├── dto/             # Objetos de transferência
│       ├── entity/          # Entidades JPA
│       ├── exception/       # Tratamento de erros globais da aplicação
│       ├── mapper/          # Conversões Entity <-> DTO
│       ├── repository/      # Acesso ao banco de dados
│       ├── security/        # Sistema de autenticação da API          
│       └── service/         # Regras de negócio
│
├── src/main/resources/
│   ├── application.yml      # Configuração da aplicação
│
└── Dockerfile
````

---

### 🌐 Frontend (React)

```text
frontend/
├── src/
│   ├── assets/              # Estilos e imagens
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Comunicação com API (Axios)
│   ├── routes/             # Rotas da aplicação
│   └── App.jsx
│
├── index.html
└── vite.config.js
```

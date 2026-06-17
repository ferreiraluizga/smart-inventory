# 📦 SmartInventory - Sistema de Controle de Estoque e Fluxo de Caixa

O **SmartInventory** é uma aplicação moderna para gerenciamento inteligente de estoque e controle financeiro. O sistema permite o cadastro de produtos vinculados às suas respectivas marcas, categorias e fornecedores. Além disso, realiza o balanço automático de lucros monitorando as entradas através de **Vendas** e as saídas por meio de **Pedidos de Fornecimento**.

---

## 🗺️ Modelagem do Sistema

### 1. Diagrama de Casos de Uso
O diagrama de casos de uso ilustra como o usuário interage com as fronteiras do sistema, destacando os fluxos de cadastros e o controle do fluxo de caixa.

![Diagrama de Casos de Uso](docs/uc_diagram.svg)

### 2. Diagrama de Classes
O diagrama de classes representa a estrutura de dados e as regras de negócio. Ele utiliza as tabelas associativas `ItemVenda` e `ItemPedido` para garantir a integridade do estoque e dos históricos de preços de custo e venda.

![Diagrama de Classes](docs/class_diagram.svg)

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Java 21 / Spring Boot 4.x (API Rest)
*   **Frontend:** React
*   **Banco de Dados:** PostgreSQL 14
*   **Containerização:** Docker & Docker Compose

---

## 🚀 Como Rodar o Backend e o Banco de Dados Localmente

### Pré-requisitos
*   [Docker Desktop](https://docker.com) instalado e rodando.
*   IDE [IntelliJ IDEA](https://jetbrains.com) configurada com o JDK 21.

### Passo a Passo (Via IntelliJ)

**1. Estrutura de Arquivos:**
Certifique-se de que o arquivo `docker-compose.yml` e o `Dockerfile` estejam criados na **mesma pasta raiz** onde se encontra o arquivo `pom.xml`.

**2. Inicialização dos Serviços:**
*   Abra o arquivo `docker-compose.yml` no IntelliJ.
*   Clique na **seta verde dupla (Play)** localizada na primeira linha do arquivo (ao lado de `services:`) e selecione **Run**.
*   *O Docker irá baixar o PostgreSQL, ler o Dockerfile, compilar o projeto Java via Maven (gerando o `.jar`) e subir a API.*

**3. Acompanhamento dos Logs:**
*   Acesse a aba **Services** na barra inferior do IntelliJ (`Alt + 8`).
*   Clique sobre o serviço `spring-backend` para acompanhar o console de inicialização do Spring Boot em tempo real.

**4. Endereços da Aplicação:**
*   💻 **API Backend:** `http://localhost:8080`
*   📑 **Documentação Swagger:** `http://localhost:8080/swagger-ui/index.html`


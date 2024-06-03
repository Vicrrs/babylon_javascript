# Visualizador 3D com Babylon.js

Este projeto é uma aplicação de visualização 3D desenvolvida com Babylon.js. Ele permite a visualização interativa de modelos 3D, com suporte a carregamento de arquivos `.obj` e outras funcionalidades gráficas avançadas fornecidas pelo Babylon.js.

## Tecnologias Utilizadas

- **Babylon.js**: Uma poderosa biblioteca JavaScript para a criação de experiências 3D interativas em navegadores web.
- **Node.js**: Ambiente de execução JavaScript do lado do servidor.
- **Docker**: Utilizado para containerizar a aplicação, garantindo que ela rode consistentemente em qualquer ambiente.

## Estrutura do Projeto

- `app.js`: Contém a lógica principal do visualizador 3D.
- `index.html`: Arquivo HTML que serve como ponto de entrada para a aplicação.
- `Dockerfile`: Define o ambiente Docker para executar a aplicação.
- `docker-compose.yml`: Configurações para facilitar a gestão do container Docker.

## Como Executar

### Pré-Requisitos

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/download/) (Opcional, apenas se você quiser executar sem Docker)

### Com Docker

1. **Construir o container Docker**:
   ```bash
   docker-compose up --build
   ```
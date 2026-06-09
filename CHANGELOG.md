# Changelog

## [0.3.0](https://github.com/EduardaMFerreira/Frella/compare/v0.2.0...v0.3.0) (2026-06-09)


### Novas Funcionalidades

* adiciona ioredis e RedisCacheService ao auth-service ([c7971c8](https://github.com/EduardaMFerreira/Frella/commit/c7971c89e7831de1e9e363a95a0549d225120c74))
* adiciona ioredis e RedisCacheService ao auth-service ([bb3c678](https://github.com/EduardaMFerreira/Frella/commit/bb3c67889e6dc7e27a36e496914653f6d1373cab))
* **gateway:** add request body, path params and query filters to all services swagger docs ([efa1959](https://github.com/EduardaMFerreira/Frella/commit/efa19592e0fcbadf3f4b995009b1be086c8a9ac3))
* **gateway:** add request body, path params and query filters to all… ([f0e1d3a](https://github.com/EduardaMFerreira/Frella/commit/f0e1d3ae97a2acaf1d2d1e8a3d70bc6387dcfe5d))
* **infra:** add Prometheus and Grafana monitoring ([ebc20c4](https://github.com/EduardaMFerreira/Frella/commit/ebc20c4dd8a207717565d0531440a1494e1cbe06))


### Correções de Bug

* adicionar cors no prestadores-service ([02d90b9](https://github.com/EduardaMFerreira/Frella/commit/02d90b96494d91edf6aa0add614182a656bee7c0))
* **auth:** corrigir build com shared ([9f49452](https://github.com/EduardaMFerreira/Frella/commit/9f494523b82370c5eff850b7e5f408b9062db791))
* **auth:** corrigir build com shared ([04179b5](https://github.com/EduardaMFerreira/Frella/commit/04179b53615558beca512e0d1dc695b090c0ebe5))
* **infra:** add shared moduleNameMapper and fix cache invalidation ([8746c4b](https://github.com/EduardaMFerreira/Frella/commit/8746c4b78237ce2ea63b61c3c74c0244e825451a))
* mover CREATE TABLE para migrate.ts no auth-service ([b9ed9de](https://github.com/EduardaMFerreira/Frella/commit/b9ed9de1bd018e0127d6bab979f9818abd23cee0))
* mover CREATE TABLE para migrate.ts no auth-service ([7c63250](https://github.com/EduardaMFerreira/Frella/commit/7c632501b33306d215f3c439b1691a0f150a1177))

## [0.2.0](https://github.com/EduardaMFerreira/Frella/compare/v0.1.0...v0.2.0) (2026-06-04)


### Novas Funcionalidades

* add health checks (live and ready) to all services ([9cfe629](https://github.com/EduardaMFerreira/Frella/commit/9cfe629c35696c47e5b534cbe02750072d9be7b5))
* add health checks (live and ready) to all services ([6532010](https://github.com/EduardaMFerreira/Frella/commit/6532010f45e441661142b68b91860e4dca0b2cb5))
* add Redis infrastructure and cache service ([1c8c32e](https://github.com/EduardaMFerreira/Frella/commit/1c8c32e68029adc6bf8a44b7d262d68a790bb42e))
* add WebSocket rooms, test client and integration validation ([a1222d9](https://github.com/EduardaMFerreira/Frella/commit/a1222d9d8584e73e6da2414040b61f77bc78ff4c))
* add WebSocket server, RabbitMQ bridge and health endpoint ([c5bf191](https://github.com/EduardaMFerreira/Frella/commit/c5bf19184d58fa3d44a700943560f477bfe3236d))
* add WebSocket server, RabbitMQ bridge and health endpoint ([6f3de10](https://github.com/EduardaMFerreira/Frella/commit/6f3de10c91d934ac1d1c8b673317a266e9f61b28))
* **architecture:** add microservices project structure ([a837f6d](https://github.com/EduardaMFerreira/Frella/commit/a837f6d1a824e79e18fae84f36fb04926903ff97))
* **backend:** add microsserviço cliente e prestador ([db05484](https://github.com/EduardaMFerreira/Frella/commit/db054849567d3f8596a1b2843d227aab9ea584a7))
* **docker:** update docker structure and add README setup guide ([777323f](https://github.com/EduardaMFerreira/Frella/commit/777323f281d292bc82c8fd24ccfeb201a3fed19c))
* **docker:** update docker structure and add README setup guide ([bec9600](https://github.com/EduardaMFerreira/Frella/commit/bec96004eb808a1676c0667ada3500f2eaf28539))
* **frontend:** Vite + React + Tailwind + shadcn ([bbf5065](https://github.com/EduardaMFerreira/Frella/commit/bbf5065779ac422c623b2ae14a74e932bcf12f89))
* **frontend:** Vite + React + Tailwind + shadcn ([cbaf639](https://github.com/EduardaMFerreira/Frella/commit/cbaf6393d53efc53c7cafa617df84be7a6597cfe))
* implement API Gateway with routes, versioning and proxy ([aad5d1b](https://github.com/EduardaMFerreira/Frella/commit/aad5d1bd14e8c5f5a0195964748f0431a81dccdb))
* implement cache layer and reorganize microservices structure ([d8d26b4](https://github.com/EduardaMFerreira/Frella/commit/d8d26b4d2d6bd89f0bb5086ae0c7224159942441))
* implement CQRS structure for propostas service ([083b874](https://github.com/EduardaMFerreira/Frella/commit/083b87418995185a8ddd68e86bb305cfc3c13ab7))
* implement eventual consistency - RabbitMQ consumer, projector and read model ([0b8aef2](https://github.com/EduardaMFerreira/Frella/commit/0b8aef21a5ff2cf2fdeb07f4118dd56a64ffd611))
* implementação dos middlewares (logger, auth e error handler) ([93ea2ae](https://github.com/EduardaMFerreira/Frella/commit/93ea2aeee11d3c56bffa7b6f17ff652366e3b9dc))
* implementar microserviços com CRUD completo e endpoint de status ([6e1ac77](https://github.com/EduardaMFerreira/Frella/commit/6e1ac77f2e87a518e2f66929685268be464a7d52))
* **infra:** adicionar commitlint, husky, endpoint version e footer swagger ([cc10b5e](https://github.com/EduardaMFerreira/Frella/commit/cc10b5ee1e04acc4ee3de37b8d4a62f6251f45d2))
* integrate cache-aside pattern and invalidation ([db45107](https://github.com/EduardaMFerreira/Frella/commit/db4510756d1cfde1b76d5036036e24b3a156ac94))
* **observabilidade:** adiciona logs estruturados com Winston em todos os serviços ([5e93c54](https://github.com/EduardaMFerreira/Frella/commit/5e93c549beed55a0e8ccacbbd1543433552e7473))
* **propostas:** adicionar resiliência com Cockatiel (retry, circuit breaker e timeout) ([0bc7413](https://github.com/EduardaMFerreira/Frella/commit/0bc7413948a25a66f32bd45206c05d0c9d5b866f))
* **resiliencia:** adiciona Cockatiel com Retry, Circuit Breaker e Timeout nos serviços ([0b4624e](https://github.com/EduardaMFerreira/Frella/commit/0b4624e53678af8a96dc8056160a29b6384eee48))


### Correções de Bug

* add missing dependencies for shared module compilation ([a3ca0cd](https://github.com/EduardaMFerreira/Frella/commit/a3ca0cd095301cda33b7f795a88d375d38afb66b))
* add paths and moduleNameMapper to clientes and prestadores ([a9675e8](https://github.com/EduardaMFerreira/Frella/commit/a9675e8e16d419c849819461e198b6557314b70b))
* add paths to tsconfig for shared module resolution ([b39bdee](https://github.com/EduardaMFerreira/Frella/commit/b39bdee044d58edf0c3e247af4f5ad07ddb1ff3a))
* add typeRoots to api-gateway tsconfig ([6616d33](https://github.com/EduardaMFerreira/Frella/commit/6616d333e939dc6c38da3f7c512798085c75e439))
* adicionar install do shared nos jobs business services ([cf40ea1](https://github.com/EduardaMFerreira/Frella/commit/cf40ea1c16711095917b104831678bf72ab926d5))
* adicionar winston ao api-gateway e corrigir tsconfig ([8c07e8d](https://github.com/EduardaMFerreira/Frella/commit/8c07e8d188f7cab5b0bb8d80ac9cb9664209f430))
* atualiza flag do jest para testPathPatterns ([e2ccc5f](https://github.com/EduardaMFerreira/Frella/commit/e2ccc5f26e629ab24bee3ae34d46d117f3e97b52))
* **cache:** renomear RadisCacheService para RedisCacheService ([0f4e7d0](https://github.com/EduardaMFerreira/Frella/commit/0f4e7d0acbad9e7aba322365dd36fa306d5e23f3))
* **cache:** renomear RadisCacheService para RedisCacheService ([4bd1d5a](https://github.com/EduardaMFerreira/Frella/commit/4bd1d5a0fda2825e828f9baee5ed2818edd29b41))
* **ci:** add winston dependency to api-gateway ([61349e9](https://github.com/EduardaMFerreira/Frella/commit/61349e94c00e095bc4effc58df84172e20073032))
* corrige configuração do Swagger e adiciona testes no prestadores-service ([707e874](https://github.com/EduardaMFerreira/Frella/commit/707e8747cc8536361c29f4b3ecd616ba2570ab3e))
* corrige configuração do Swagger no clientes-service ([be28df1](https://github.com/EduardaMFerreira/Frella/commit/be28df138ef69bb97ddbf01c6945db53c2215909))
* corrige nomenclatura do ci-core-services ([b6da30c](https://github.com/EduardaMFerreira/Frella/commit/b6da30c5988415d9e79ddd25640c24c490c14db9))
* corrigir jest.config.js dos business services ([d17dce0](https://github.com/EduardaMFerreira/Frella/commit/d17dce0c2e4d14f406f7cadf5ccfdd2ba0017fdf))
* corrigir mocks do PropostaRepository e ResiliencePolicy nos testes ([280f178](https://github.com/EduardaMFerreira/Frella/commit/280f178892313829d9990bd0929ad6c8b0f5a473))
* garantir winston no api-gateway antes do build no CI ([efae4ca](https://github.com/EduardaMFerreira/Frella/commit/efae4ca4badd28b3e2bd0c0458bd9516a24c5252))
* **infra:** ajusta workflow ci-business-services/ci-core-services ([8eaefb8](https://github.com/EduardaMFerreira/Frella/commit/8eaefb837def41cc423c563874eec339f14e19a2))
* **infra:** ajusta workflow ci-business-services/ci-core-services ([76f62fb](https://github.com/EduardaMFerreira/Frella/commit/76f62fb25f0acbb072a9c810a6184b0713aa0c74))
* instalar shared antes do build do api-gateway no CI ([f1ad15f](https://github.com/EduardaMFerreira/Frella/commit/f1ad15f59038bf87991958c3eccb1b0c2b8831d8))
* mockar ResiliencePolicy e PropostaRepositoryResilient nos testes ([4e193cf](https://github.com/EduardaMFerreira/Frella/commit/4e193cf3ff3e210936cafe3237a7f3e04679b329))
* propostas-service ([ca444ee](https://github.com/EduardaMFerreira/Frella/commit/ca444eef83207bd3ae040128c5f3f7ca958d1e4f))
* resolve merge conflict ([7f8a0ba](https://github.com/EduardaMFerreira/Frella/commit/7f8a0bab04cbb255749f70575a7b605b13792d95))
* trocar verificação RabbitMQ para nc -z na porta 5672 ([b66731f](https://github.com/EduardaMFerreira/Frella/commit/b66731f288ddfd1ac0880ecde8bf042d650bf570))


### Refatorações

* ajustes e melhorias no microsserviço de avaliacoes (validaç… ([a767ddc](https://github.com/EduardaMFerreira/Frella/commit/a767ddcd368b08fdd15adb11ff765cdd0e6f6244))
* ajustes e melhorias no microsserviço de avaliacoes (validações, estrutura e testes) ([d12fb38](https://github.com/EduardaMFerreira/Frella/commit/d12fb387cbe9fc16058e23eac367bac0e7edc3d1))
* ajustes e melhorias no microsserviço de clientes (validaçõe… ([187b9b9](https://github.com/EduardaMFerreira/Frella/commit/187b9b970f9b29c3ff049ac3f921a048af7fe13f))
* ajustes e melhorias no microsserviço de clientes (validações, estrutura e testes) ([720c72e](https://github.com/EduardaMFerreira/Frella/commit/720c72e4abe6b8bc939939710362fd0a3475cd26))
* ajustes e melhorias no microsserviço de contratos (validaçõ… ([a38f93a](https://github.com/EduardaMFerreira/Frella/commit/a38f93ad51b1b2aeadce7646eedaa285adfc9355))
* ajustes e melhorias no microsserviço de contratos (validações, estrutura e testes) ([2c2d55b](https://github.com/EduardaMFerreira/Frella/commit/2c2d55b70ef5160a5d2eb83637318551804eb210))
* ajustes e melhorias no microsserviço de prestadores (valida… ([4042e39](https://github.com/EduardaMFerreira/Frella/commit/4042e392078a85ddc506d4e1de8e7f4ed0149da6))
* ajustes e melhorias no microsserviço de prestadores (validações, estrutura e testes) ([4eedb0a](https://github.com/EduardaMFerreira/Frella/commit/4eedb0af711fa49585f2318541d8f12b430b2f76))
* ajustes e melhorias no microsserviço de propostas (validaçõ… ([a2567a9](https://github.com/EduardaMFerreira/Frella/commit/a2567a9463a3aa5065b50624644e858f082cd591))
* ajustes e melhorias no microsserviço de propostas (validações, estrutura e testes) ([1a6a5c6](https://github.com/EduardaMFerreira/Frella/commit/1a6a5c6655a4ea4043e58cf2072a5b26b736398a))


### Documentação

* add Swagger documentation ([59e258b](https://github.com/EduardaMFerreira/Frella/commit/59e258b84d80259d53eb7bf964ef70f32bd24fa2))

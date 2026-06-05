"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropostaRepositoryResilient = void 0;
const ResiliencePolicy_1 = require("../resilience/ResiliencePolicy");
const PropostaRepository_1 = require("./PropostaRepository");
exports.PropostaRepositoryResilient = {
    async findAll() {
        return ResiliencePolicy_1.resilientPolicy.execute(() => PropostaRepository_1.PropostaRepository.findAll());
    },
    async findById(id) {
        return ResiliencePolicy_1.resilientPolicy.execute(() => PropostaRepository_1.PropostaRepository.findById(id));
    },
    async create(data) {
        return ResiliencePolicy_1.resilientPolicy.execute(() => PropostaRepository_1.PropostaRepository.create(data));
    },
    async updateStatus(id, status) {
        return ResiliencePolicy_1.resilientPolicy.execute(() => PropostaRepository_1.PropostaRepository.updateStatus(id, status));
    },
    async remove(id) {
        return ResiliencePolicy_1.resilientPolicy.execute(() => PropostaRepository_1.PropostaRepository.remove(id));
    },
};

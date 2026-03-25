describe("Clientes Service", () => {

  const criarCliente = (nome: string) => {
    if (!nome) throw new Error("Nome obrigatório");
    return { nome };
  };

  it("deve criar cliente válido", () => {
    const result = criarCliente("Nana");
    expect(result).toHaveProperty("nome", "Nana");
  });

  it("deve lançar erro quando nome inválido", () => {
    expect(() => criarCliente("")).toThrow();
  });

});
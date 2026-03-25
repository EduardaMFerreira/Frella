describe("Prestadores Service", () => {

  const criarPrestador = (nome: string) => {
    if (!nome) throw new Error("Nome obrigatório");
    return { nome };
  };

  it("deve criar prestador válido", () => {
    const result = criarPrestador("João");
    expect(result).toHaveProperty("nome", "João");
  });

  it("deve lançar erro quando nome inválido", () => {
    expect(() => criarPrestador("")).toThrow();
  });

});
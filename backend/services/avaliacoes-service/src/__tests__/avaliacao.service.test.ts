describe("Avaliacao Service", () => {

  const criarAvaliacao = (nota: number) => {
    if (!nota) throw new Error("Nota obrigatória");
    return { nota };
  };

  it("deve criar avaliação válida", () => {
    const result = criarAvaliacao(5);
    expect(result).toHaveProperty("nota", 5);
  });

  it("deve lançar erro quando nota inválida", () => {
    expect(() => criarAvaliacao(0)).toThrow();
  });

});
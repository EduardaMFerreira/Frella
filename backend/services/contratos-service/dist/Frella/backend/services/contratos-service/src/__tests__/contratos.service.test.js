"use strict";
describe("Contratos Service", () => {
    const criar = (titulo) => {
        if (!titulo)
            throw new Error("Título obrigatório");
        return { titulo };
    };
    it("deve criar contrato válido", () => {
        const result = criar("Contrato X");
        expect(result).toHaveProperty("titulo");
    });
    it("deve falhar sem título", () => {
        expect(() => criar("")).toThrow();
    });
});

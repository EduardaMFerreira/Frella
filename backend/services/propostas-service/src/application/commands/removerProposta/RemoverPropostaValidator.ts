export interface RemoverPropostaRequest {
  id: string;
}

export function validarRemoverProposta(data: RemoverPropostaRequest) {
  if (!data.id || !data.id.trim()) {
    throw new Error("ID da proposta é obrigatório");
  }
}

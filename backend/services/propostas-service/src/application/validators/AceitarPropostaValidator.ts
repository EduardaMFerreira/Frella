export interface AceitarPropostaRequest {
  id: string;
  prestador_id: string;
}

export function validarAceitarProposta(data: AceitarPropostaRequest) {
  if (!data.id || !data.id.trim()) {
    throw new Error("ID da proposta é obrigatório");
  }

  if (!data.prestador_id || !data.prestador_id.trim()) {
    throw new Error("Prestador é obrigatório");
  }
}
import { subscribe } from "../../../../../shared/messaging/RabbitMQClient";
import { ROUTING_KEYS, AvaliacaoPublicadaEvent } from "../../../../../shared/events";

export async function startConsumers(): Promise<void> {
  await subscribe(
    ROUTING_KEYS.AVALIACAO_PUBLICADA,
    "avaliacoes.avaliacao-publicada",
    async (data: AvaliacaoPublicadaEvent) => {
      console.log(`[avaliacoes] Avaliação publicada: ${data.avaliacao_id} — nota ${data.nota}`);
      // lógica de atualizar média do prestador vai aqui futuramente
    }
  );

  console.log("[avaliacoes] Consumers iniciados");
}
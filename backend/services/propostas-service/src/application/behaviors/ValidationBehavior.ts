export async function validationBehavior(request: any, next: Function) {
  if (!request) throw new Error("Request inválido");
  return await next();
}
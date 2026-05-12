export async function loggingBehavior(request: any, next: Function) {
  console.log("Executando:", request);
  return await next();
}
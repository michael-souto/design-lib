import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsyncFunctionQueueService {

  private functionQueue: Array<() => Promise<void>> = [];
  private timerId: number | undefined;

  constructor() {
    // Iniciar o timer para executar funções a cada segundo
    this.startExecutingFunctions();
  }

  // Método para adicionar funções à fila
  public enqueueFunction(func: () => Promise<void>): void {
    console.log('Adicionando função assincrona...........')
    this.functionQueue.push(func);
  }

  // Método para iniciar a execução periódica das funções
  private startExecutingFunctions(): void {
    if (!this.timerId) { // Evita a criação de múltiplos timers
      this.timerId = window.setInterval(() => {
        this.executeFunctions();
      }, 1000); // Executa a cada 1000 milissegundos (1 segundo)
    }
  }

  // Método para parar a execução periódica
  private stopExecutingFunctions(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  // Método para verificar a conexão e executar funções, se online
  private checkAndExecuteFunctions(): void {
    if (navigator.onLine) {
      this.executeFunctions();
    }
  }

  // Método para executar todas as funções na fila
  private async executeFunctions(): Promise<void> {
    while (this.functionQueue.length > 0) {
      console.log('Removendo função para iniciar execução...........')
      const func = this.functionQueue.shift(); // Remove a função da fila
      if (func) {
        try {
          console.log('Executando função...........')
          await func();
          // Tenta executar a função
        } catch (error) {
          this.functionQueue.push(func);
          console.error('Error executing function:', error);
        }
      }
    }
  }
}

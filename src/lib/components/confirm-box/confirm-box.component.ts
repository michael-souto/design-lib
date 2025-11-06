import { Component } from '@angular/core'; // OnInit não é necessário se ngOnInit estiver vazio

@Component({
  selector: 'd-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css'],
  standalone: false
})
export class ConfirmBoxComponent { // Removido "implements OnInit" se ngOnInit não for usado

  constructor() { }

  display: boolean = false;
  header: string;
  text: string;
  accept: () => void; // Tipo de função mais específico
  reject: () => void; // Tipo de função mais específico
  acceptLabel: string = 'YES';
  rejectLabel: string = 'NO';
  severityAccept: string = 'primary';
  severityReject: string = 'secondary';


  /**
   * Exibe a caixa de confirmação com cabeçalho, texto e funções de aceitar/rejeitar.
   * Usa os rótulos e severidades padrão para os botões.
   * @param header O título da caixa de diálogo.
   * @param text A mensagem principal da caixa de diálogo.
   * @param accept A função a ser executada quando o usuário aceitar.
   * @param reject A função a ser executada quando o usuário rejeitar.
   */
  showConfirmBox(header: string, text: string, accept: () => void, reject: () => void): void;

  /**
   * Exibe a caixa de confirmação com cabeçalho, texto, funções de aceitar/rejeitar e rótulos customizados para os botões.
   * Usa as severidades padrão para os botões.
   * @param header O título da caixa de diálogo.
   * @param text A mensagem principal da caixa de diálogo.
   * @param accept A função a ser executada quando o usuário aceitar.
   * @param reject A função a ser executada quando o usuário rejeitar.
   * @param acceptLabel O rótulo para o botão de aceitar.
   * @param rejectLabel O rótulo para o botão de rejeitar.
   */
  showConfirmBox(header: string, text: string, accept: () => void, reject: () => void, acceptLabel: string, rejectLabel: string): void;

  /**
   * Exibe a caixa de confirmação com cabeçalho, texto, funções de aceitar/rejeitar,
   * rótulos customizados e severidades customizadas para os botões.
   * @param header O título da caixa de diálogo.
   * @param text A mensagem principal da caixa de diálogo.
   * @param accept A função a ser executada quando o usuário aceitar.
   * @param reject A função a ser executada quando o usuário rejeitar.
   * @param acceptLabel O rótulo para o botão de aceitar.
   * @param rejectLabel O rótulo para o botão de rejeitar.
   * @param severityAccept A severidade (estilo) para o botão de aceitar (ex: 'primary', 'success', 'warning').
   * @param severityReject A severidade (estilo) para o botão de rejeitar (ex: 'secondary', 'danger').
   */
  showConfirmBox(
    header: string,
    text: string,
    accept: () => void,
    reject: () => void,
    acceptLabel: string,
    rejectLabel: string,
    severityAccept: string,
    severityReject: string
  ): void;


  showConfirmBox(
    header: string,
    text: string,
    accept: () => void,
    reject: () => void,
    acceptLabelInput?: string,
    rejectLabelInput?: string,
    severityAcceptInput?: string,
    severityRejectInput?: string
  ): void {
    this.header = header;
    this.text = text;
    this.accept = accept;
    this.reject = reject;

    this.acceptLabel = acceptLabelInput !== undefined ? acceptLabelInput : 'YES';
    this.rejectLabel = rejectLabelInput !== undefined ? rejectLabelInput : 'NO';
    this.severityAccept = severityAcceptInput !== undefined ? severityAcceptInput : 'primary';
    this.severityReject = severityRejectInput !== undefined ? severityRejectInput : 'secondary';

    this.display = true;
  }

  acceptEvent(): void {
    if (this.accept) {
      this.accept();
    }
    this.display = false;
  }

  rejectEvent(): void {
    if (this.reject) {
      this.reject();
    }
    this.display = false;
  }
}
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertToast } from '../../models/alert.interface';


@Injectable({
  providedIn: 'root',
})
export class AlertService {
  defaultToast = 'tl-top-right';
  static titleSucces = 'Éxitoso';
  static titleInfo = 'Información';
  static titleWarn = 'Advertencia';
  static titleError = 'Error';

  constructor(private messageService: MessageService) {}

  showSuccessMessage(alertToast: AlertToast) {
    this.messageService.add({
      key: alertToast.key ?? this.defaultToast,
      severity: 'success',
      summary: alertToast.title,
      detail: alertToast.message,
      life: alertToast.time,
    });
  }


  showInfoMessage(alertToast: AlertToast) {
    this.messageService.add({
      key: alertToast.key ?? this.defaultToast,
      severity: 'info',
      summary: alertToast.title,
      detail: alertToast.message,
      life: alertToast.time,
    });
  }


  showWarnMessage(alertToast: AlertToast) {
    this.messageService.add({
      key: alertToast.key ?? this.defaultToast,
      severity: 'warn',
      summary: alertToast.title,
      detail: alertToast.message,
      life: alertToast.time,
    });
  }


  showErrorMessage(alertToast: AlertToast) {
    this.messageService.add({
      key: alertToast.key ?? this.defaultToast,
      severity: 'error',
      summary: alertToast.title,
      detail: alertToast.message,
      life: alertToast.time,
    });
  }

  getMessageService() {
    return this.messageService;
  }
}

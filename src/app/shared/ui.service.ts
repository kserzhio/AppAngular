import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
@Injectable()
export class UIService {
  loadingStateCganged = new Subject<boolean>();
  constructor(private snackbar: MatSnackBar) {}
  showSnackbar(message, action, duration): void {
    this.snackbar.open(message, action, {
      duration: duration,
    });
  }
}

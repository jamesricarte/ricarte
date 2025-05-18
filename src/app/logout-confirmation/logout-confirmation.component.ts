import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirmation',
  templateUrl: './logout-confirmation.component.html',
  styleUrls: ['./logout-confirmation.component.css']
})
export class LogoutConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  confirmLogout() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false); 
  }
}

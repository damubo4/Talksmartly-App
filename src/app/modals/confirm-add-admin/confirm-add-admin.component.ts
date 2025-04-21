import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-add-admin',
  imports: [CommonModule],
  templateUrl: './confirm-add-admin.component.html',
  styleUrl: './confirm-add-admin.component.scss',
})
export class ConfirmAddAdminComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmAddAdminComponent>);

  close(value: string) {
    this.dialogRef.close(value);
  }
}

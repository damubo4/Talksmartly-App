import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-feedback',
  imports: [CommonModule],
  templateUrl: './detail-feedback.component.html',
  styleUrl: './detail-feedback.component.scss',
})
export class DetailFeedbackComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DetailFeedbackComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  dataFeedback: any = '';
  role: any = '';

  ngOnInit(): void {
    console.log(this.data);
    this.role = sessionStorage.getItem('role');
    if (this.role == 'Student') {
      this.dataFeedback = this.data.feedback;
    } else {
      this.dataFeedback = this.data.feedback[0].detailsFeedback;
    }
  }
}

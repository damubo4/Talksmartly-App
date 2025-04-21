import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-summary-feedback',
  imports: [],
  templateUrl: './summary-feedback.component.html',
  styleUrl: './summary-feedback.component.scss',
})
export class SummaryFeedbackComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SummaryFeedbackComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  summary: any = '';
  role: any = '';

  ngOnInit(): void {
    this.summary = this.data.data.data.summary;
    console.log(this.summary);
  }
}

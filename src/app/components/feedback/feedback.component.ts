import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { FeedbackService } from '../../services/feedback/feedback.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { TitleHeaderService } from '../../services/title-header/title-header.service';
import { SummaryFeedbackComponent } from '../../modals/summary-feedback/summary-feedback.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  providers: [DatePipe],
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  private feedbackService = inject(FeedbackService);
  private router = inject(Router);
  private sessionStorageService = inject(TitleHeaderService);
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'no',
    'scheduleDate',
    'hourInit',
    'nameClass',
    'professorName',
    'status',
    'feedback',
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  monthForm: FormGroup;
  months: { name: string; value: number }[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  years: number[] = [];
  role: any = '';
  data: any = '';

  constructor() {
    this.role = sessionStorage.getItem('role');
    this.dataSource = new MatTableDataSource();
    this.monthForm = this.fb.group({
      month: [new Date().getMonth() + 1], // Mes actual por defecto
      year: [new Date().getFullYear()],
    });
    this.sessionStorageService.setVariable('Feedback');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'long' }),
      value: i + 1,
    }));

    for (let index = 2025; index < 2075; index++) {
      this.years.push(index);
    }

    // Calcular las fechas iniciales para el mes actual
    this.calculateDates();

    // Escuchar cambios en el select
    this.monthForm.get('month')?.valueChanges.subscribe((res) => {
      this.calculateDates();
    });

    this.monthForm.get('year')?.valueChanges.subscribe((res) => {
      this.calculateDates();
    });
  }

  getData() {
    const init = this.startDate?.toISOString().split('T')[0];
    const finish = this.endDate?.toISOString().split('T')[0];

    this.feedbackService.getFeedback(init, finish).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.data.classes);
        this.dataSource.paginator = this.paginator;
        this.data = res;
      },
    });
  }

  calculateDates(): void {
    let year = this.monthForm.get('year')?.value;
    let month = this.monthForm.get('month')?.value; // Año actual
    this.startDate = new Date(year, month - 1, 1); // Primer día del mes
    this.endDate = new Date(year, month, 0); // Último día del mes

    this.getData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  detail(id: number) {
    this.router.navigate([`dashboard/feedback-detail/${id}`], {
      queryParams: {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
      },
    });
  }

  getRowIndex(i: number): number {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    return i + pageIndex * pageSize + 1;
  }

  summary() {
    const dialogRef = this.dialog.open(SummaryFeedbackComponent, {
      data: { data: this.data },
      autoFocus: false,
    });
  }
}

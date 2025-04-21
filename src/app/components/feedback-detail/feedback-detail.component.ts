import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { FeedbackService } from '../../services/feedback/feedback.service';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DetailFeedbackComponent } from '../../modals/detail-feedback/detail-feedback.component';
import { TitleHeaderService } from '../../services/title-header/title-header.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-feedback-detail',
  imports: [
    NgApexchartsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    CommonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './feedback-detail.component.html',
  styleUrl: './feedback-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FeedbackDetailComponent implements OnInit {
  // @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('chart1') chart1!: ChartComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private sessionStorageService = inject(TitleHeaderService);
  private feedbackService = inject(FeedbackService);
  public chartOptions: any;
  public chartOptions1: any;
  idEdit: any = '';
  private fb = inject(FormBuilder);
  displayedColumnsAdmin: string[] = [
    'no',
    'scheduleDate',
    'hourInit',
    'nameClass',
    'professorName',
    'attendance',
    'evaluationDate',
    // 'communication',
    // 'communicationScore',
    // 'grammar',
    // 'grammarScore',
    // 'phonetics',
    // 'phoneticsScore',
    // 'vocabulary',
    // 'vocabularyScore',
    // 'averageScore',
    'actions',
  ];
  displayedColumnsStudent: string[] = [
    'no',
    'scheduleDate',
    'hourInit',
    'nameClass',
    'attendance',
    'evaluationDate',
    // 'communication',
    // 'communicationScore',
    // 'grammar',
    // 'grammarScore',
    // 'phonetics',
    // 'phoneticsScore',
    // 'vocabulary',
    // 'vocabularyScore',
    // 'averageScore',
    'actions',
  ];
  dataSourceAdmin: MatTableDataSource<any>;
  dataSourceStudent: MatTableDataSource<any>;
  monthForm: FormGroup;
  months: { name: string; value: number }[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  role: any = '';
  studentName: string = '';
  years: number[] = [];
  noData: string | null = '';

  constructor() {
    this.role = sessionStorage.getItem('role');
    this.dataSourceAdmin = new MatTableDataSource();
    this.dataSourceStudent = new MatTableDataSource();
    this.monthForm = this.fb.group({
      month: [], // Mes actual por defecto
      year: [],
    });
    this.sessionStorageService.setVariable('Feedback');
  }

  ngOnInit(): void {
    if (this.role != 'Student') {
      this.route.queryParams.subscribe((params) => {
        this.monthForm
          .get('month')
          ?.setValue(Number(params['startDate'].split('-')[1]));
        this.monthForm
          .get('year')
          ?.setValue(Number(params['startDate'].split('-')[0]));

        this.startDate = new Date(params['startDate'] + 'T00:00:00-05:00'); // Convertir a número
        this.endDate = new Date(params['endDate'] + 'T00:00:00-05:00');
      });
    } else {
      this.monthForm.get('month')?.setValue(new Date().getMonth() + 1);
      this.monthForm.get('year')?.setValue(new Date().getFullYear());

      this.calculateDates();
    }

    this.months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'long' }),
      value: i + 1,
    }));

    for (let index = 2025; index < 2075; index++) {
      this.years.push(index);
    }

    this.getData();

    // Escuchar cambios en el select
    this.monthForm.get('month')?.valueChanges.subscribe((res) => {
      this.calculateDates();
    });

    this.monthForm.get('year')?.valueChanges.subscribe((res) => {
      this.calculateDates();
    });
  }

  getData() {
    this.chartOptions1 = {
      series: [],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: false, // 🚫 Desactiva completamente el zoom (scroll incluido)
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      yaxis: {
        decimalsInFloat: undefined,
        floating: false,
        stepSize: 1,
        min: 1,
        max: 5,
        labels: {
          fontSize: '20px',
          format: {},
        },
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          format: 'yyyy-MM-dd',
        },
      },
      tooltip: {
        x: {
          format: 'yyyy/MM/dd',
        },
      },
      legend: {
        fontSize: '70px',
      },
    };

    const init = this.startDate?.toISOString().split('T')[0];
    const finish = this.endDate?.toISOString().split('T')[0];

    this.monthForm.get('month')?.setValue;
    this.route.paramMap.subscribe((params) => {
      this.idEdit = params.get('id');
      if (this.idEdit) {
        this.feedbackService
          .getFeedbackById(this.idEdit, init, finish)
          .subscribe({
            next: (res: any) => {
              if (res.message) {
                this.noData = res.message;
              } else {
                this.noData = null;
                if (this.role != 'Student') {
                  this.studentName =
                    res.data.classes[0]?.feedback[0]?.studentName;
                }
                this.dataSourceAdmin = this.dataSourceStudent =
                  new MatTableDataSource(res.data.classes);

                this.dataSourceAdmin.paginator =
                  this.dataSourceStudent.paginator = this.paginator;

                res.data.graphData?.categories.map((item: any, index: any) => {
                  this.chartOptions1.xaxis.categories.push(
                    `${item}T00:00:0${index}.000Z`
                  );
                });
                this.chartOptions1.series = res.data.graphData?.series;
              }
            },
          });
      }
    });
  }

  calculateDates(): void {
    let year = this.monthForm.get('year')?.value;
    let month = this.monthForm.get('month')?.value; // Año actual
    this.startDate = new Date(year, month - 1, 1); // Primer día del mes
    this.endDate = new Date(year, month, 0); // Último día del mes
    this.getData();
  }

  attendance(data: any) {
    if (data == true) {
      return 'Si';
    } else if (data == false) {
      return 'No';
    } else return '';
  }

  details(data: any) {
    const dialogRef = this.dialog.open(DetailFeedbackComponent, {
      data: data,
      autoFocus: false,
    });
  }

  getRowIndex(i: number): number {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    return i + pageIndex * pageSize + 1;
  }
}

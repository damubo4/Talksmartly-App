import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import localeEs from '@angular/common/locales/es';
import { SchedulingService } from '../../services/scheduling/scheduling.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../services/feedback/feedback.service';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Registra el locale en español
registerLocaleData(localeEs);

@Component({
  selector: 'app-scheduled',
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatRadioModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    MatInputModule,
  ],
  templateUrl: './scheduled.component.html',
  styleUrl: './scheduled.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' },
    provideNativeDateAdapter(),
  ],
})
export class ScheduledComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ScheduledComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private datePipe = inject(DatePipe);
  private fb = inject(FormBuilder);
  private schedulingService = inject(SchedulingService);
  private feedbackService = inject(FeedbackService);
  private _snackBar = inject(MatSnackBar);
  scheduleFormAdmin: FormGroup;
  scheduleFormTeacher: FormGroup;
  role: any = '';
  teachers: any[] = [];
  students: any[] = [];
  classType: any[] = [
    { name: 'Grupal', data: 'GROUP' },
    { name: 'Personalizada', data: 'PERSONALIZED' },
  ];
  currentLevel: any[] = [
    { name: 'Introductory', data: 'INTRODUCTORY' },
    { name: 'Beginners', data: 'BEGINNERS' },
    { name: 'Pre-intermediate', data: 'PRE-INTERMEDIATE' },
    { name: 'Intermediate', data: 'INTERMEDIATE' },
    { name: 'Advanced', data: 'ADVANCED' },
  ];
  toggleClassType: boolean = true;
  spinner: boolean = false;
  studentsData: any[] = [];
  viewFeedback: boolean = false;
  scores: number[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  studentsByClass: any[] = [];
  studentFormsFeedback: any[] = [];
  arrayFeedbackData: any;
  errorsForm: any[] = [];
  prefixName: string = '';
  buttonFeedback: boolean | null = null;
  searchText: string = '';
  searchControl = new FormControl('');

  constructor() {
    this.role = sessionStorage.getItem('role');
    this.scheduleFormAdmin = this.fb.group({
      name: ['', [Validators.required]],
      hourInit: ['', Validators.required],
      hourFinish: ['', Validators.required],
      teacher: ['', Validators.required],
      students: [''],
      classType: ['', Validators.required],
      urlClass: [''],
      currentLevel: ['', Validators.required],
    });

    this.scheduleFormTeacher = this.fb.group({
      hourInit: ['', Validators.required],
      hourFinish: ['', Validators.required],
      currentLevel: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.role == 'Teacher') {
      const fechaHoraStr = `${this.data?.data?.scheduleDate}T${this.data?.data?.hourInit}`;
      const fechaHora = new Date(fechaHoraStr);
      const fechaActual = new Date(); // Fecha y hora actual

      //si la fecha actual es menor que la fecha de clase entonces debe deshabilitarse
      if (fechaActual < fechaHora) {
        this.buttonFeedback = true;
      } else if (
        //si la fecha actual es mayor entonces la clase ya pasó y debe habilitarse
        fechaActual >= fechaHora
      ) {
        this.buttonFeedback = false;
      }
      if (this.data?.data?.classStatus == 'EVALUATED') {
        this.buttonFeedback = true;
      }
      this.arrayFeedbackData = { classId: this.data.data?.id, feedbacks: [] };
      if (this.data.data?.students) {
        this.studentsByClass = this.data.data.students;
        this.initializeFormsFeedback();
      }
    }

    this.scheduleFormAdmin.get('students')?.disable();
    if (this.role == 'Management') {
      this.schedulingService.getUsers().subscribe({
        next: (res: any) => {
          res.data.users.map((item: any) => {
            if (item.role == 'Teacher') {
              this.teachers.push(item);
            } else if (item.role == 'Student' && item.isActivePackage) {
              this.students.push(item);
            }
          });
          if (this.data.type == 'schedule-admin-edit') {
            let students: any = [];
            this.data.data.students.map((item: any) => {
              students.push(item.id);
            });
            this.scheduleFormAdmin.patchValue({
              name: this.data.data?.nameClass,
              hourInit: this.formatHourForm(this.data.data?.hourInit),
              hourFinish: this.formatHourForm(this.data.data?.hourFinish),
              teacher: this.data.data?.professor.id,
              students: students,
              classType: this.data.data?.classType,
              urlClass: this.data.data.urlClass,
              currentLevel: this.data.data.currentLevel,
            });
          }
        },
      });
      console.log(this.students);
    }

    this.scheduleFormAdmin.get('classType')?.valueChanges.subscribe({
      next: (res: any) => {
        this.scheduleFormAdmin.get('students')?.enable();
        if (res == 'GROUP') {
          this.scheduleFormAdmin.get('students')?.clearValidators();
        } else if (res == 'PERSONALIZED') {
          this.scheduleFormAdmin
            .get('students')
            ?.setValidators(Validators.required);
        }
        this.scheduleFormAdmin.get('students')?.updateValueAndValidity();
      },
    });

    this.scheduleFormAdmin.get('currentLevel')?.valueChanges.subscribe({
      next: (res: any) => {
        this.prefixName = `${res} - `;
        this.scheduleFormAdmin.get('name')?.setValue(this.prefixName);
        this.studentsData = this.students.filter(
          (i) => i.packages[0].currentLevel == res
        );
        this.scheduleFormAdmin.get('students')?.enable();
      },
    });

    this.scheduleFormAdmin.get('name')?.valueChanges.subscribe({
      next: (res: any) => {
        if (!res?.startsWith(this.prefixName)) {
          this.scheduleFormAdmin.get('name')?.setValue(this.prefixName);
        }
      },
    });

    this.scheduleFormTeacher.get('hourInit')?.valueChanges.subscribe({
      next: (res: any) => {
        console.log(res);
        const fechaOriginal = new Date(res);
        // Sumar una hora (3600000 milisegundos)
        const fechaSumada = new Date(fechaOriginal.getTime() + 3600000);
        this.scheduleFormTeacher.get('hourFinish')?.setValue(fechaSumada);
      },
    });

    this.scheduleFormAdmin.get('hourInit')?.valueChanges.subscribe({
      next: (res: any) => {
        const fechaOriginal = new Date(res);
        // Sumar una hora (3600000 milisegundos)
        const fechaSumada = new Date(fechaOriginal.getTime() + 3600000);
        this.scheduleFormAdmin.get('hourFinish')?.setValue(fechaSumada);
      },
    });

    this.searchControl?.valueChanges.subscribe({
      next: (res: any) => {
        this.studentsData = this.students.filter((i) => {
          if (res != '' || res != null) {
            const data = i.name;
            console.log(data.includes(res));
          }
          // (res || '').toLowerCase().includes((i.name || '').toLowerCase());
        });
      },
    });
  }

  formatHourForm(hour: string): Date {
    const formattedHour = new Date(
      `Sat Jan 01 1970 ${hour} GMT-0500 (hora estándar de Colombia)`
    );

    return formattedHour;
  }

  formatHour(hour: string): string {
    const formattedHour = new Date(
      `Sat Jan 01 1970 ${hour} GMT-0500 (hora estándar de Colombia)`
    );

    return this.datePipe.transform(formattedHour, 'h a') || '';
  }

  formattedDate(date: string) {
    const formattedDate = this.datePipe.transform(date, 'fullDate');
    return formattedDate;
  }

  scheduleClassStudent() {
    this.spinner = true;
    const data = {
      classes: [
        { scheduleDate: this.data.scheduleDate, hourInit: this.data.hourInit },
      ],
    };
    this.schedulingService.createScheduleStudent(data).subscribe({
      next: (res: any) => {
        this.spinner = false;
        this.dialogRef.close('data');
        this.openSnackBar(`Clase agendada con éxito`, 'OK');
      },
      error: (err) => {
        this.spinner = false;
        this.dialogRef.close('data');
      },
    });
  }

  cancelClassStudent() {
    this.spinner = true;
    this.schedulingService.cancelClassStudent(this.data.id).subscribe({
      next: (res: any) => {
        this.spinner = false;
        this.dialogRef.close('data');
        this.openSnackBar(`Se ha cancelado la clase con éxito`, 'OK');
      },
      error: (err) => {
        this.spinner = false;
      },
    });
  }

  createClassAdmin() {
    this.spinner = true;
    const dataForm = this.scheduleFormAdmin.controls;
    if (this.data.type == 'schedule-admin-create') {
      const data = {
        nameClass: dataForm['name'].value,
        availabilities: [
          {
            startDate: this.datePipe.transform(this.data.date, 'yyyy-MM-dd'),
            hourInit: this.datePipe.transform(
              dataForm['hourInit'].value,
              'HH:mm'
            ),
            hourFinish: this.datePipe.transform(
              dataForm['hourFinish'].value,
              'HH:mm'
            ),
          },
        ],
        teacherId: dataForm['teacher'].value,
        studentIds: dataForm['students'].value,
        classType: dataForm['classType'].value,
        urlClass: dataForm['urlClass'].value,
        currentLevel: dataForm['currentLevel'].value,
      };
      this.schedulingService.createClassAdmin(data).subscribe({
        next: (res: any) => {
          this.spinner = false;
          this.dialogRef.close('data');
          this.openSnackBar(`Clase creada con éxito`, 'OK');
        },
        error: (err) => {
          this.spinner = false;
        },
      });
    } else if (this.data.type == 'schedule-admin-edit') {
      const data1 = {
        classId: this.data?.data?.id,
        date: this.datePipe.transform(
          this.data.data?.scheduleDate,
          'yyyy-MM-dd'
        ),
        hourInit: this.datePipe.transform(dataForm['hourInit'].value, 'HH:mm'),
        classType: dataForm['classType'].value,
        teacherId: dataForm['teacher'].value,
        nameClass: dataForm['name'].value,
        currentLevel: dataForm['currentLevel'].value,
        urlClass: dataForm['urlClass'].value,
        studentIds: dataForm['students'].value, //Obligatorio enviar todos los usuarios que van a contener la clase, si no se envia se elimina de base datos
      };
      this.schedulingService.editClassAdmin(data1).subscribe({
        next: (res: any) => {
          this.spinner = false;
          this.dialogRef.close('data');
          this.openSnackBar(`Clase editada con éxito`, 'OK');
        },
        error: (err) => {
          this.spinner = false;
        },
      });
    }
  }

  createClassTeacher() {
    this.spinner = true;
    const dataForm = this.scheduleFormTeacher.controls;
    const data = {
      availabilities: [
        {
          startDate: this.datePipe.transform(this.data.date, 'yyyy-MM-dd'),
          hourInit: this.datePipe.transform(
            dataForm['hourInit'].value,
            'HH:mm'
          ),
          hourFinish: this.datePipe.transform(
            dataForm['hourFinish'].value,
            'HH:mm'
          ),
        },
      ],
      currentLevel: dataForm['currentLevel'].value,
    };

    this.schedulingService.createAvailabilityTeacher(data).subscribe({
      next: (res: any) => {
        this.spinner = false;
        this.dialogRef.close('data');
        this.openSnackBar(`Disponibilidad creada con éxito`, 'OK');
      },
      error: (err) => {
        this.spinner = false;
      },
    });
  }

  statusClass(status: string) {
    if (status == 'PENDING') {
      return 'Pendiente';
    } else if (status == 'FULL') {
      return 'Completado';
    } else if (status == 'AVAILABLE') {
      return 'Disponible';
    } else if (status == 'CANCELLED') {
      return 'Cancelado';
    } else return '';
  }

  levels(level: string) {
    if (level == 'PRE-INTERMEDIATE') {
      return 'Pre intermedio';
    } else if (level == 'INTRODUCTORY') {
      return 'Introductorio';
    } else if (level == 'BEGINNERS') {
      return 'Principiante';
    } else if (level == 'INTERMEDIATE') {
      return 'Intermedio';
    } else if (level == 'ADVANCE') {
      return 'Avanzado';
    } else return '';
  }

  typeClass(level: string) {
    if (level == 'GROUP') {
      return 'Grupal';
    } else if (level == 'PERSONALIZED') {
      return 'Personalizada';
    } else return '';
  }

  goClass(url: string) {
    if (url !== '' && url !== null) {
      window.open(url, '_blank');
    }
  }

  viewFeedbackFn() {
    this.viewFeedback = !this.viewFeedback;
  }

  initializeFormsFeedback(): void {
    this.studentsByClass.forEach((student) => {
      const formFeedback = this.fb.group({
        attendance: [false],
        communication: [''],
        communicationScore: [''],
        vocabulary: [''],
        vocabularyScore: [''],
        grammar: [''],
        grammarScore: [''],
        phonetics: [''],
        phoneticsScore: [''],
        comments: [''],
        student: student,
      });

      this.studentFormsFeedback.push(formFeedback);
    });
  }

  submitFormsFeedback(): void {
    this.spinner = true;
    this.errorsForm = [];
    this.arrayFeedbackData.feedbacks = [];
    this.studentFormsFeedback.forEach((form, index) => {
      const studentData = form.controls;

      let data;
      if (form.controls['attendance'].value == 'false') {
        form.controls['communication']?.clearValidators();
        form.controls['communicationScore']?.clearValidators();
        form.controls['vocabulary']?.clearValidators();
        form.controls['vocabularyScore']?.clearValidators();
        form.controls['grammar']?.clearValidators();
        form.controls['grammarScore']?.clearValidators();
        form.controls['phonetics']?.clearValidators();
        form.controls['phoneticsScore']?.clearValidators();
        form.controls['comments']?.clearValidators();
      } else if (form.controls['attendance'].value == 'true') {
        form.controls['communication']?.setValidators(Validators.required);
        form.controls['communicationScore']?.setValidators(Validators.required);
        form.controls['vocabulary']?.setValidators(Validators.required);
        form.controls['vocabularyScore']?.setValidators(Validators.required);
        form.controls['grammar']?.setValidators(Validators.required);
        form.controls['grammarScore']?.setValidators(Validators.required);
        form.controls['phonetics']?.setValidators(Validators.required);
        form.controls['phoneticsScore']?.setValidators(Validators.required);
      }

      form.controls['communication']?.updateValueAndValidity();
      form.controls['communicationScore']?.updateValueAndValidity();
      form.controls['vocabulary']?.updateValueAndValidity();
      form.controls['vocabularyScore']?.updateValueAndValidity();
      form.controls['grammar']?.updateValueAndValidity();
      form.controls['grammarScore']?.updateValueAndValidity();
      form.controls['phonetics']?.updateValueAndValidity();
      form.controls['phoneticsScore']?.updateValueAndValidity();
      form.controls['comments']?.updateValueAndValidity();

      if (form.valid) {
        if (studentData['attendance'].value == true) {
          data = {
            studentId: studentData['student'].value.id,
            attendance: true,
            communication: studentData['communication'].value,
            communicationScore: studentData['communicationScore'].value,
            vocabulary: studentData['vocabulary'].value,
            vocabularyScore: studentData['vocabularyScore'].value,
            grammar: studentData['grammar'].value,
            grammarScore: studentData['grammarScore'].value,
            phonetics: studentData['phonetics'].value,
            phoneticsScore: studentData['phoneticsScore'].value,
            comments: studentData['comments'].value,
          };
        } else if (studentData['attendance'].value == false) {
          data = {
            studentId: studentData['student'].value.id,
            attendance: false,
          };
        }

        this.arrayFeedbackData.feedbacks.push(data);
      } else {
        this.errorsForm.push(studentData['student'].value.name);
      }
    });
    if (this.errorsForm.length > 0) {
      this.openSnackBar(
        `El fomulario de ${this.errorsForm.join(', ')} no es válido`,
        'OK'
      );
      this.spinner = false;
    } else {
      this.feedbackService.createFeedback(this.arrayFeedbackData).subscribe({
        next: (res) => {
          this.spinner = false;
          this.dialogRef.close('data');
          this.openSnackBar(`Feedback creado con éxito`, 'OK');
        },
        error: (err) => {
          this.spinner = false;
        },
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  deleteClassAdmin(id: any) {
    this.schedulingService.deleteClass(id).subscribe({
      next: (res: any) => {
        this.openSnackBar(res.message, 'OK');
        this.dialogRef.close('data');
      },
    });
  }
}

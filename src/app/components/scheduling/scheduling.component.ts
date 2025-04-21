import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SchedulingService } from '../../services/scheduling/scheduling.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ScheduledComponent } from '../../modals/scheduled/scheduled.component';
import { TitleHeaderService } from '../../services/title-header/title-header.service';
import { GroupService } from '../../services/counter-classes/group.service';
import { PersonalizedService } from '../../services/counter-classes/personalized.service';
import { CounterClassesAdminService } from '../../services/counter/counter-classes-admin.service';

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule],
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.scss',
  providers: [DatePipe],
})
export class SchedulingComponent implements OnInit {
  private schedulingService = inject(SchedulingService);
  private sessionStorageService = inject(TitleHeaderService);
  private sessionGroupService = inject(GroupService);
  private sessionPersonalizedService = inject(PersonalizedService);
  private sessionClassesAdminService = inject(CounterClassesAdminService);
  private datePipe = inject(DatePipe);
  readonly dialog = inject(MatDialog);
  currentYear!: number;
  currentMonth!: number;
  currentMonthName!: string;
  daysInMonth: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  classesData: any[] = [];
  role: any = '';
  firstDayOfMonth: any;
  lastDayOfMonth: any;
  currentView: 'month' | 'week' = 'month'; // Nueva variable para controlar la vista
  currentWeek: Date[] = []; // Array para almacenar los días de la semana actual
  today: any = '';
  currentMonthByWeek: string = '';

  events: { date: Date; title: string }[] = []; // Lista de eventos

  constructor() {
    this.role = sessionStorage.getItem('role');
    if (this.role == 'Student') {
      this.sessionStorageService.setVariable('Tu agendamiento de clases');
    } else {
      this.sessionStorageService.setVariable('Agendamiento');
    }
  }

  ngOnInit() {
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    this.loadMonth();
  }

  loadWeek(date: Date) {
    this.daysInMonth = [];
    this.currentWeek = [];
    const startOfWeek = new Date(date);
    const optionDate = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay()); // Ir al domingo de la semana

    // console.log(month1);
    //console.log(startOfWeek);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      // const date1 = new Date(this.currentYear, this.currentMonth, i);
      day.setDate(startOfWeek.getDate() + i);
      // console.log(day);
      this.daysInMonth.push({
        date: new Date(day),
        isToday: date.toDateString() === new Date().toDateString(),
        isPlaceholder: false, // Día real
        data: [],
      });

      this.currentWeek.push(day);
    }
    //console.log(this.daysInMonth);
    const currentMonthByWeek1 = this.currentWeek[0].toLocaleString('default', {
      month: 'long',
    });

    const currentMonthByWeek2 = this.currentWeek[6].toLocaleString('default', {
      month: 'long',
    });

    if (currentMonthByWeek1 == currentMonthByWeek2) {
      this.currentMonthByWeek = currentMonthByWeek1;
    } else
      this.currentMonthByWeek = `${currentMonthByWeek1} - ${currentMonthByWeek2}`;

    this.loadData(this.currentWeek[0], this.currentWeek[6]);
  }

  prevWeek() {
    const firstDayOfWeek = this.currentWeek[0];
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
    // console.log(firstDayOfWeek);
    this.loadWeek(firstDayOfWeek);
  }

  nextWeek() {
    const firstDayOfWeek = this.currentWeek[0];
    // const lastDayOfWeek = this.currentWeek[6];
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
    // lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);
    // console.log(firstDayOfWeek.getMonth(), lastDayOfWeek.getMonth());
    this.loadWeek(firstDayOfWeek);
  }

  toggleView(view: 'month' | 'week') {
    this.currentView = view;
    if (this.currentView == 'week') {
      this.loadWeek(this.today);
    } else if (this.currentView == 'month') {
      this.loadMonth();
    }
  }

  loadMonth() {
    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    this.lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    this.currentMonthName = this.lastDayOfMonth.toLocaleString('default', {
      month: 'long',
    });

    // Determinar el día de la semana del primer día del mes (0: Domingo, 1: Lunes, ...)
    const startDayOfWeek = this.firstDayOfMonth.getDay();

    // Determinar el total de días en el mes
    const daysInMonth = this.lastDayOfMonth.getDate();

    // Reiniciar el arreglo de días del mes
    this.daysInMonth = [];

    // Agregar días vacíos antes del primer día del mes
    for (let i = 0; i < startDayOfWeek; i++) {
      this.daysInMonth.push({ isPlaceholder: true }); // Día vacío
    }

    // Agregar los días reales del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.daysInMonth.push({
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        hasEvent: this.events.some((event) =>
          this.isSameDate(event.date, date)
        ),
        isPlaceholder: false, // Día real
        data: [],
      });
    }
    //console.log(this.daysInMonth);
    this.loadData(this.firstDayOfMonth, this.lastDayOfMonth);
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.loadMonth();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.loadMonth();
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  getEventsForDay(day: Date): any[] {
    return this.classesData.filter((event) =>
      this.isSameDate(new Date(event.scheduleDate), day)
    );
  }

  loadData(init: any, finish: any) {
    this.classesData = [];
    this.daysInMonth.forEach((i) => (i.data = []));
    this.schedulingService
      .getAvailability(
        this.datePipe.transform(init, 'yyyy-MM-dd'),
        this.datePipe.transform(finish, 'yyyy-MM-dd')
      )
      .subscribe({
        next: (res: any) => {
          if (this.role == 'Management') {
            this.sessionClassesAdminService.setVariable(
              JSON.stringify(res?.summary)
            );
            this.classesData = res.classes;
            this.daysInMonth.forEach((i: any) => {
              this.classesData.map((e) => {
                if (
                  this.datePipe.transform(i.date, 'yyyy-MM-dd') ==
                  e.scheduleDate
                ) {
                  i.data.push(e);
                }
              });
            });
          } else if (this.role == 'Student') {
            this.sessionPersonalizedService.setVariable(
              JSON.stringify(res.package?.countClassPersonalized)
            );
            this.sessionGroupService.setVariable(
              JSON.stringify(res.package?.countClassGroup)
            );

            res?.availability.map((item: any) => {
              this.classesData.push(item);
            });

            this.classesData.forEach((item) => {
              item.reservationStatus = 'AVAILABLE'; // se crea un nuevo key llamado reservationStatus
            });

            res?.reservations.map((item: any) => {
              this.classesData.push(item);
            });

            this.classesData = this.classesData.reverse();
            this.daysInMonth.forEach((i: any) => {
              this.classesData.map((e) => {
                if (
                  this.datePipe.transform(i.date, 'yyyy-MM-dd') ==
                  e.scheduleDate
                ) {
                  i.data.push(e);
                }
              });
            });
          } else if (this.role == 'Teacher') {
            this.classesData = res.availability;

            this.daysInMonth.forEach((i) => {
              this.classesData.map((e) => {
                if (
                  this.datePipe.transform(i.date, 'yyyy-MM-dd') ==
                  e.scheduleDate
                ) {
                  i.data.push(e);
                }
              });
            });
          }
        },
      });
  }

  formatHour(hour: string): string {
    const formattedHour = new Date(
      `Sat Jan 01 1970 ${hour} GMT-0500 (hora estándar de Colombia)`
    );
    return this.datePipe.transform(formattedHour, 'h a') || '';
  }

  selectDay(day: any) {
    if (this.role != 'Student') {
      const dialogRef = this.dialog.open(ScheduledComponent, {
        data: { date: day.date, type: 'schedule-admin-create' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'data') {
          this.loadData(this.firstDayOfMonth, this.lastDayOfMonth);
        }
      });
    }
  }

  selectItem(data: any, event: MouseEvent) {
    event.stopPropagation();
    if (this.role == 'Student') {
      const dialogRef = this.dialog.open(ScheduledComponent, {
        data: data,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'data') {
          this.loadData(this.firstDayOfMonth, this.lastDayOfMonth);
        }
      });
    } else if (this.role == 'Management') {
      const dialogRef = this.dialog.open(ScheduledComponent, {
        data: { data: data, type: 'schedule-admin-edit' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'data') {
          this.loadData(this.firstDayOfMonth, this.lastDayOfMonth);
        }
      });
    } else if (this.role == 'Teacher') {
      const dialogRef = this.dialog.open(ScheduledComponent, {
        data: { data: data, type: 'schedule-teacher-view' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'data') {
          this.loadData(this.firstDayOfMonth, this.lastDayOfMonth);
        }
      });
    }
  }

  getDayOfWeek(day: any) {
    const daysWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysWeek[day.getDay()];
  }

  getDateOfWeek(day: any) {
    return day.getDate();
  }
}

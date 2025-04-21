import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { AdminUsersService } from '../../../services/admin-users/admin-users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAddAdminComponent } from '../../../modals/confirm-add-admin/confirm-add-admin.component';

@Component({
  selector: 'app-add-users',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss',
  providers: [DatePipe],
})
export class AddUsersComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private adminUserService = inject(AdminUsersService);
  private datePipe = inject(DatePipe);
  FormUser: FormGroup;
  readonly dialog = inject(MatDialog);
  types: any[] = [
    { name: 'Estudiante', value: 'Student' },
    { name: 'Profesor', value: 'Teacher' },
    { name: 'Administrador', value: 'Management' },
  ];
  currentLevel: any = [
    { name: 'Introductory', value: 'INTRODUCTORY' },
    { name: 'Beginners', value: 'BEGINNERS' },
    { name: 'Pre Intermediate', value: 'PRE-INTERMEDIATE' },
    { name: 'Intermediate', value: 'INTERMEDIATE' },
    { name: 'Advanced', value: 'ADVANCED' },
  ];
  isStudent: boolean = false;
  spinner: boolean = false;
  dataForEdit: any;
  title: string = '';
  isEdit: boolean = false;
  idEdit: any = '';

  constructor(private formBuilder: FormBuilder) {
    this.FormUser = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      namepackage: [''],
      description: [''],
      usedGroupClasses: [''], //cantidad de clases grupales que le asigna
      usedPersonalizedClasses: [''],
      maxCancellations: [''], //obligatorio
      startDate: [''], //obligatorio
      endDate: [''], //obligatorio
      currentLevel: [''], //obligatorio
      price: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idEdit = params.get('id');
      if (this.idEdit) {
        this.dataForEdit = sessionStorage.getItem('userForEdit');
        this.dataForEdit = JSON.parse(this.dataForEdit);
        this.fillOutForm();
        this.title = 'Editar';
        this.isEdit = true;
      } else {
        sessionStorage.removeItem('userForEdit');
        this.title = 'Agregar';
        this.isEdit = false;
      }
    });

    this.FormUser.get('role')?.valueChanges.subscribe({
      next: (res: any) => {
        const dataForm = this.FormUser.controls;
        if (res == 'Student') {
          this.isStudent = true;
          dataForm['maxCancellations']?.setValidators(Validators.required);
          dataForm['startDate']?.setValidators(Validators.required);
          dataForm['endDate']?.setValidators(Validators.required);
          dataForm['currentLevel']?.setValidators(Validators.required);
        } else {
          this.isStudent = false;
          dataForm['maxCancellations']?.clearValidators();
          dataForm['startDate']?.clearValidators();
          dataForm['endDate']?.clearValidators();
          dataForm['currentLevel']?.clearValidators();
        }
      },
    });
  }

  fillOutForm() {
    if (this.dataForEdit.role == 'Student') {
      this.isStudent = true;
      const dataForm = this.FormUser.controls;
      dataForm['maxCancellations']?.setValidators(Validators.required);
      dataForm['startDate']?.setValidators(Validators.required);
      dataForm['endDate']?.setValidators(Validators.required);
      dataForm['currentLevel']?.setValidators(Validators.required);
    }

    this.FormUser.patchValue({
      email: this.dataForEdit?.email,
      role: this.dataForEdit?.role,
      namepackage: this.dataForEdit?.packages[0]?.name,
      description: this.dataForEdit?.packages[0]?.name,
      usedGroupClasses: this.dataForEdit?.packages[0]?.usedGroupClasses, //cantidad de clases grupales que le asigna
      usedPersonalizedClasses:
        this.dataForEdit?.packages[0]?.usedPersonalizedClasses,
      maxCancellations: this.dataForEdit?.packages[0]?.maxCancellations, //obligatorio
      startDate: new Date(
        this.dataForEdit?.packages[0]?.startDate + 'T00:00:00'
      ), //obligatorio
      endDate: new Date(this.dataForEdit?.packages[0]?.endDate + 'T00:00:00'), //obligatorio
      currentLevel: this.dataForEdit?.packages[0]?.currentLevel, //obligatorio
      price: this.dataForEdit?.packages[0]?.price,
    });
  }

  actionUser() {
    const dataForm = this.FormUser.controls;
    let data;
    if (this.isStudent) {
      data = {
        email: dataForm['email']?.value,
        roles: dataForm['role']?.value,
        package: {
          namepackage: dataForm['namepackage']?.value,
          description: dataForm['description']?.value,
          usedGroupClasses: dataForm['usedGroupClasses']?.value, //cantidad de clases grupales que le asigna
          usedPersonalizedClasses: dataForm['usedPersonalizedClasses']?.value,
          maxCancellations: dataForm['maxCancellations']?.value, //obligatorio
          startDate: this.datePipe.transform(
            dataForm['startDate']?.value,
            'yyyy-MM-dd'
          ), //obligatorio
          endDate: this.datePipe.transform(
            dataForm['endDate']?.value,
            'yyyy-MM-dd'
          ), //obligatorio
          currentLevel: dataForm['currentLevel']?.value, //obligatorio
          price: Number(dataForm['price']?.value),
        },
      };
    } else {
      data = {
        email: dataForm['email']?.value,
        roles: dataForm['role']?.value,
      };
    }

    this.saveUser(data);
  }

  saveUser(data: any) {
    const dataForm = this.FormUser.controls;
    if (dataForm['role']?.value == 'Management') {
      const dialogRef = this.dialog.open(ConfirmAddAdminComponent, {
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'yes') {
          this.spinner = true;
          if (this.isEdit) {
            this.adminUserService.editUser(this.idEdit, data).subscribe({
              next: (res: any) => {
                this.spinner = false;
                this.openSnackBar(res.message, 'OK');
              },
              error: (err) => {
                this.spinner = false;
              },
            });
          } else {
            this.adminUserService.addUsers(data).subscribe({
              next: (res: any) => {
                this.spinner = false;
                this.openSnackBar(res.message, 'OK');
                this.router.navigate(['/dashboard/admin-users']);
              },
              error: (err) => {
                this.spinner = false;
              },
            });
          }
        }
      });
    } else {
      this.spinner = true;
      if (this.isEdit) {
        this.adminUserService.editUser(this.idEdit, data).subscribe({
          next: (res: any) => {
            this.spinner = false;
            this.openSnackBar(res.message, 'OK');
          },
          error: (err) => {
            this.spinner = false;
          },
        });
      } else {
        this.adminUserService.addUsers(data).subscribe({
          next: (res: any) => {
            this.spinner = false;
            this.openSnackBar(res.message, 'OK');
            this.router.navigate(['/dashboard/admin-users']);
          },
          error: (err) => {
            this.spinner = false;
          },
        });
      }
    }
  }

  editUser() {
    const dataForm = this.FormUser.controls;
    if (this.isStudent) {
      const data = {
        email: dataForm['email']?.value,
        roles: dataForm['role']?.value,
        package: {
          namepackage: dataForm['namepackage']?.value,
          description: dataForm['description']?.value,
          usedGroupClasses: dataForm['usedGroupClasses']?.value, //cantidad de clases grupales que le asigna
          usedPersonalizedClasses: dataForm['usedPersonalizedClasses']?.value,
          maxCancellations: dataForm['maxCancellations']?.value, //obligatorio
          startDate: this.datePipe.transform(
            dataForm['startDate']?.value,
            'yyyy-MM-dd'
          ), //obligatorio
          endDate: this.datePipe.transform(
            dataForm['endDate']?.value,
            'yyyy-MM-dd'
          ), //obligatorio
          currentLevel: dataForm['currentLevel']?.value, //obligatorio
          price: Number(dataForm['price']?.value),
        },
      };
    } else {
      const data = {
        email: dataForm['email']?.value,
        roles: dataForm['role']?.value,
      };
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

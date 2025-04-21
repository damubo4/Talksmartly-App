import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialService } from '../../services/material/material.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleHeaderService } from '../../services/title-header/title-header.service';

@Component({
  selector: 'app-material',
  imports: [
    MatTabsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    RouterLink,
    MatMenuModule,
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MaterialComponent implements OnInit {
  private materialService = inject(MaterialService);
  private sanitizer = inject(DomSanitizer);
  private sessionStorageService = inject(TitleHeaderService);
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  introductory: any[] = [];
  beginners: any[] = [];
  pre_intermediate: any[] = [];
  intermediate: any[] = [];
  advanced: any[] = [];
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  currentLevel: any[] = [
    { name: 'Introductory', data: 'INTRODUCTORY' },
    { name: 'Beginners', data: 'BEGINNERS' },
    { name: 'Pre-intermediate', data: 'PREINTERMEDIATE' },
    { name: 'Intermediate', data: 'INTERMEDIATE' },
    { name: 'Advanced', data: 'ADVANCED' },
  ];
  role: any = '';
  selectedTabIndex: number = 0;

  constructor() {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      title: ['', Validators.required],
      current_level: ['', Validators.required],
    });
    this.role = sessionStorage.getItem('role');
    this.sessionStorageService.setVariable('Material');
  }

  ngOnInit(): void {
    this.getMaterial();
  }

  getMaterial() {
    this.introductory = [];
    this.beginners = [];
    this.pre_intermediate = [];
    this.intermediate = [];
    this.advanced = [];

    this.materialService.getMaterial().subscribe({
      next: (res: any) => {
        res?.data?.INTRODUCTORY?.map((item: any) =>
          this.introductory.push({
            url: item,
            nameFile: this.getNameFile(item),
          })
        );

        res?.data?.BEGINNERS?.map((item: any) =>
          this.beginners.push({
            url: item,
            nameFile: this.getNameFile(item),
          })
        );

        res?.data?.PREINTERMEDIATE?.map((item: any) =>
          this.pre_intermediate.push({
            url: item,
            nameFile: this.getNameFile(item),
          })
        );

        res?.data?.INTERMEDIATE?.map((item: any) =>
          this.intermediate.push({
            url: item,
            nameFile: this.getNameFile(item),
          })
        );

        res?.data?.ADVANCED?.map((item: any) =>
          this.advanced.push({
            url: item,
            nameFile: this.getNameFile(item),
          })
        );

        if (this.role == 'Student') {
          if (this.introductory.length > 0) {
            this.selectedTabIndex = 0;
          } else if (this.beginners.length > 0) {
            this.selectedTabIndex = 1;
          } else if (this.pre_intermediate.length > 0) {
            this.selectedTabIndex = 2;
          } else if (this.intermediate.length > 0) {
            this.selectedTabIndex = 3;
          } else if (this.advanced.length > 0) {
            this.selectedTabIndex = 4;
          }
        }
      },
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getNameFile(name: string): string {
    const nameDes = name.split('/');
    return nameDes[nameDes.length - 1];
  }

  downloadFile(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = this.getNameFile(url); // Nombre del archivo al descargar
    link.target = '_blank'; // Abre en una nueva pestaña
    link.click(); // Simula el clic en el enlace
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file }); // Actualizar el valor del campo "file" en el formulario
    }
  }

  deleteFile(level: any, name: any) {
    this.materialService.deleteFile(level, name).subscribe({
      next: (res: any) => {
        this.openSnackBar(res.message, 'OK');
        this.getMaterial();
      },
      error: (err: any) => {
        this.openSnackBar(err.message, 'OK');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

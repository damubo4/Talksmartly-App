import { Component, inject } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../services/material/material.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-material-add',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './material-add.component.html',
  styleUrl: './material-add.component.scss',
})
export class MaterialAddComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialService);
  private _snackBar = inject(MatSnackBar);
  spinner: boolean = false;
  currentLevel: any[] = [
    { name: 'Introductory', data: 'INTRODUCTORY' },
    { name: 'Beginners', data: 'BEGINNERS' },
    { name: 'Pre-intermediate', data: 'PREINTERMEDIATE' },
    { name: 'Intermediate', data: 'INTERMEDIATE' },
    { name: 'Advanced', data: 'ADVANCED' },
  ];

  constructor() {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      title: ['', Validators.required],
      current_level: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file }); // Actualizar el valor del campo "file" en el formulario
    }
  }

  // Método para enviar el formulario
  onSubmit(): void {
    this.spinner = true;
    if (this.uploadForm.invalid || !this.selectedFile) {
      alert(
        'Por favor, completa todos los campos y selecciona un archivo PDF.'
      );
      return;
    }

    // Crear el objeto FormData
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('title', this.uploadForm.value.title);
    formData.append('current_level', this.uploadForm.value.current_level);

    this.materialService.createFile(formData).subscribe({
      next: (res: any) => {
        this.openSnackBar(res.message, 'OK');
        this.uploadForm.reset();
        this.spinner = false;
      },
      error: (err: any) => {
        this.openSnackBar(err.message, 'OK');
        this.spinner = false;
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

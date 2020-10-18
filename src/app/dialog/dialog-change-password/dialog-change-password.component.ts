import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  newPassword: string;
  hide = true;
  hide1 = true;
  hide2 = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogChangePasswordComponent>
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.passwordForm.controls;
  }
  onSubmit(): void {
    this.dialogRef.afterClosed().subscribe((result) => {
      this.newPassword = result;
      console.log(this.newPassword);
    });
  }
}

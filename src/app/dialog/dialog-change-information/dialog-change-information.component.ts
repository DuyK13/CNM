import { User } from './../../_interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-information',
  templateUrl: './dialog-change-information.component.html',
  styleUrls: ['./dialog-change-information.component.css'],
})
export class DialogChangeInformationComponent implements OnInit {
  userForm: FormGroup;
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogChangePasswordComponent>
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          // Validators.pattern('0[1-9][0-9]{8}\b')
        ],
      ],
      date: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get controls() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.dialogRef.afterClosed().subscribe((result) => {
      var day = result.date._i.date;
      var month = result.date._i.month;
      var year = result.date._i.year;
      this.user.userName = result.userName;
      this.user.email = result.email;
      this.user.phone = result.phone;
      this.user.birthday = day + '/' + month + '/' + year;

      console.log(this.user);
    });
  }
}

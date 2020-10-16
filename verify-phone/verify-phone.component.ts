import { AuthService } from './../_services/auth.service';
import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { WindowService } from '../_services/window.service';
import * as firebase from 'firebase';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.prod';
import { AngularFireAuth } from '@angular/fire/auth';

// const config = {
//   apiKey: environment.configFirebase.apiKey,
//   authDomain: environment.configFirebase.authDomain,
//   databaseURL: environment.configFirebase.databaseURL,
//   projectId: environment.configFirebase.projectId,
//   storageBucket: environment.configFirebase.storageBucket,
//   messagingSenderId: environment.configFirebase.messagingSenderId,
//   appId: environment.configFirebase.appId,
//   measurementId: environment.configFirebase.messagingSenderId,
// };
const config = {
  apiKey: 'AIzaSyDPg5EBhX6qkYwrZwIRy7W_-uITG7swL1U',
  authDomain: 'congnghemoi-12496.firebaseapp.com',
  databaseURL: 'https://congnghemoi-12496.firebaseio.com',
  projectId: 'congnghemoi-12496',
  storageBucket: 'congnghemoi-12496.appspot.com',
  messagingSenderId: '828088726078',
  appId: '1:828088726078:web:f579ccb5daa642d56c176f',
  measurementId: 'G-QNHK72ZP86',
};

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;
  // format phone numbers as E.164
  get e164(): any {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }
}

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css'],
})
export class VerifyPhoneComponent implements OnInit, AfterViewInit {
  @Input() isRegister: boolean;

  windowRef: any;
  phone: string;
  email: string = '';
  isEmailSend: boolean;
  phoneNumber = new PhoneNumber();
  verificationCode: string;

  @Output() isVerify = new EventEmitter<boolean>();

  isVerifyPhoneSuccess: boolean;
  isVerifyEmailSuccess: boolean;

  verifyPhoneForm: FormGroup;
  verifyEmailForm: FormGroup;
  PHONE_REGEXP = /^[0-9]{10}$/i;
  EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  constructor(
    private win: WindowService,
    public fireAuthService: AngularFireAuth,
    private auth: AuthService
  ) {
    this.windowRef = this.win.windowRef;
  }

  ngOnInit(): void {
    this.verifyPhoneForm = new FormGroup({
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(this.PHONE_REGEXP),
      ]),
    });
    this.verifyEmailForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.EMAIL_REGEXP),
      ]),
    });
    firebase.initializeApp(config);
    this.isVerifyEmailSuccess = false;
    this.isVerifyPhoneSuccess = false;
  }

  ngAfterViewInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    );
    this.windowRef.recaptchaVerifier.render().then((widgetId) => {
      this.windowRef.recapchaWidgetId = widgetId;
    });
  }

  hasError(controlName, errorName): boolean {
    return this.verifyPhoneForm.controls[controlName].hasError(errorName);
  }

  sendLoginCode(): void {
    const appVerifier = this.windowRef.recaptchaVerifier;
    console.log('phone : ' + this.phone);
    console.log('phone : ' + this.modifyPhone(this.phone));

    firebase
      .auth()
      .signInWithPhoneNumber(this.modifyPhone(this.phone), appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
      })
      .catch((error) => console.log('error', error));
  }

  modifyPhone(phone): any {
    return '+84' + phone.substring(1);
  }

  verifyLoginCode(): void {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((result) => {
        console.log(result);
        sessionStorage.setItem('phone', this.phone);
        this.isVerifyEmailSuccess = true;
        this.isVerifyPhoneSuccess = true;

        this.isVerify.emit(this.isVerifyPhoneSuccess);
        this.isVerify.emit(this.isVerifyEmailSuccess);
      })
      .catch((error) => console.log(error, 'Incorrect code entered?'));
  }

  // Email

  emailHasError(controlName, errorName): boolean {
    return this.verifyEmailForm.controls[controlName].hasError(errorName);
  }

  sendEmailVerification(): void {
    this.email = this.verifyEmailForm.controls['email'].value;
    this.auth.sendEmailVerification(this.email);
    this.isEmailSend = true;
  }

  checkEmailVerify(): boolean {
    return this.auth.checkEmailVerified();
  }

  verifyEmail(): void {
    //Chuyển trang đăng ký
    sessionStorage.setItem('email', this.email);
  }
}

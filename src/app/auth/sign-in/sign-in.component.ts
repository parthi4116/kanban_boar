import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  title = 'angular-lc';
  loginform: FormGroup;
  isLoading: boolean;
  submitted: boolean;
  hasError: boolean;
  hide = true;


  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { };

  ngOnInit() {
    this.initform();
  }
  initform() {
    this.loginform = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^\s*[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\s*$/i)])],
      password: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
      ],
    })
  }

  submit() {
    this.isLoading = true;
    this.submitted = true;
    const controls = this.loginform.controls;
    if (this.loginform.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      });
      this.isLoading = false;
    } else {
      if (localStorage.getItem('email') != controls['email'].value) {
        this.toastr.error("Email not Found");
      } else if (localStorage.getItem('password') != controls['password'].value) {
        this.toastr.error("Password is miss match");
      } else {
        this.router.navigate(['/pages']);

      }
    }
  }

}

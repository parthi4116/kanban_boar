import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  loginform: FormGroup;
  submitted: boolean;
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
      fname: ['', Validators.required],
      lname: ['', Validators.required],
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
    this.submitted = true;
    const controls = this.loginform.controls;
    if (this.loginform.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      });
      return false;
    } else {
      localStorage.setItem('password', controls['password'].value);
      localStorage.setItem('email', controls['email'].value);
      this.router.navigate(['/pages']);
      this.toastr.success("Account Created Successfully");
      return true;
    }
  }

}

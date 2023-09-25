import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/services/components.service';
import { DataService } from 'src/app/services/data.service';
import { ChangePassword } from '../../interfaces/interfaces';
import { Session } from 'src/app/interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  @ViewChild('loginFormRef', { static: false }) loginFormRef!: NgForm;

  public loginForm: FormGroup = new FormGroup({});

  public changePassword!: ChangePassword;
  public invalidLogin: boolean = false;
  public session!: Session;

  constructor(private router: Router,
              private comService: ComponentsService,
              private dataService: DataService,
              private storage: Storage) { }

  ngOnInit() {
    this.getSession();
    this.setupForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  setupForm() {
    this.loginForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)])
    });
  }

  getSession() {
    this.storage.get('session').then((val) => {
      this.session = val;
    });
  }

  async onSubmit(){
    let ev: any = undefined;

    this.loginFormRef.onSubmit(ev);

    if (this.loginForm.valid) {

      await this.showLoading();
      this.changePassword = {
        user: this.session.userID,
        password: this.loginForm.get('password')?.value
      };
      this.dataService.getChangePassword(this.changePassword)
        .subscribe(resp => {
          if (resp.isSuccessful) {
            this.dismissLoading();
            this.router.navigate(['/login']);
            this.storage.clear();
          } else {
            this.dismissLoading();
            this.invalidLogin = true;
          }
        });
    }
  }

  async showLoading() {
    await this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

}

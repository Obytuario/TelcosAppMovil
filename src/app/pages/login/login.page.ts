import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { Login, Session } from '../../interfaces/interfaces';
import { StorageService } from '../../services/storage.service';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('loginFormRef', { static: false }) loginFormRef!: NgForm;

  public loginForm: FormGroup = new FormGroup({});

  public invalidLogin: boolean = false;
  public login!: Login;
  public session!: Session;

  constructor(private router: Router, private dataService: DataService,
    private storageService: StorageService, private comService: ComponentsService) { }

  ngOnInit() {
    this.setupForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  setupForm() {
    this.loginForm = new FormGroup({
      user: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {

    let ev: any = undefined;

    this.loginFormRef.onSubmit(ev);

    if (this.loginForm.valid) {
      this.showLoading();
      this.login = { user: this.loginForm.get('user')?.value, password: this.loginForm.get('password')?.value };
      this.dataService.getLogin(this.login)
        .subscribe(resp => {
          if (resp.isSuccessful) {
            this.setSession(resp.result);
            this.dismissLoading();
            this.router.navigate(['/home']);
          } else {
            this.dismissLoading();
            this.invalidLogin = true;
          }
        });
    }
  }

  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

  async setSession(session: Session){
    await  this.storageService.loadSession({ token: session.token, userID: session.userID })
  }

}

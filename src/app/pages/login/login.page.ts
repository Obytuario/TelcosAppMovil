import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nombre: string = 'Fernando';
  usuario = {
    email: '',
    password: ''
  }

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
  }

  onSubmit(formulario: NgForm){
    console.log('SUBMIT');
    console.log(this.usuario);
    console.log(formulario);
    this,this.showLoading();
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.dataService.dismissLoading();
    }, 1500);
  }

  showLoading() {
    this.dataService.showLoading();
  }

}

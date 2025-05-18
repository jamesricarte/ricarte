import { Component } from '@angular/core';  
import { NgForm } from '@angular/forms';
import {AuthService} from "../auth.service";  
  
@Component({  
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']

})  
export class signupcomponent{  
  Loading: boolean = false; 

  constructor(public authService: AuthService){}  

  onSignup(form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    this.authService.CreateUser(form.value.email, form.value.password);  
  }  
}  
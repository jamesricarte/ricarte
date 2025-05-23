import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';  
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from "@angular/router"; 

@Injectable()  
export class AuthGuard implements CanActivate{  

    constructor(private authService: AuthService, private router:Router){}  

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {  
    const isAuth = this.authService.getIsAuth();  
    if(!isAuth){  
      this.router.navigate(['/login']);  
    }  
    return isAuth;  
  }  
}   
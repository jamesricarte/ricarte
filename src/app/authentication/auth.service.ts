import { Injectable } from '@angular/core';  
import { HttpClient } from "@angular/common/http";  
import { AuthData } from './auth-data.model';
import { Subject } from "rxjs";
import { Router } from "@angular/router"; 

@Injectable({providedIn: "root"})  
export class AuthService{  
    private token!: string | null;
    private authStatusListener = new Subject<boolean>();  
    private isAuthenticated = false;  
    private tokenTimer: any;
    public userId!: string | null; 
    private userEmail!: string | null;

    constructor(private http: HttpClient, private router: Router) {}

    getToken(){  
        return this.token;  
      }  

    getIsAuth() {  
      return this.isAuthenticated;  
    }

    getUserId(){  
      return this.userId;  
    }  

    getUserEmail() {
      return this.userEmail;
    }
    
    getAuthStatusListener() {  
      return this.authStatusListener.asObservable();  
    }  

    CreateUser(email: string, password: string){  
        const authData: AuthData = {email: email, password: password }  
        this.http  
        .post<{ token: string }>("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {  
        const token = response.token;  
        this.token = token; 
        this.authStatusListener.next(true); 
        this.loginUser(email, password)
      });   
    }  

    loginUser(email: string, password: string){  
        const authData: AuthData= {email: email, password: password};  
        this.http.post<{ token: string; expiresIn: number, userId: string, email: string}>(  
          "http://localhost:3000/api/user/login",  
          authData  
        )
        .subscribe(response => {
          const token = response.token;
          this.token = token;
          if (token) {
            console.log(response)
            const expiresInDuration = response.expiresIn;  
          this.setAuthTimer(expiresInDuration);  
            this.isAuthenticated = true;
            this.userId = response.userId;  
            this.userEmail = response.email;
            this.authStatusListener.next(true);
            const now= new Date();  
            const expirationDate = new Date(now.getTime()+expiresInDuration*1000);  
            this.saveAuthData(token, expirationDate, this.userId, this.userEmail);  
            this.router.navigate(['/']);  
          }
        });
    }

    logout() {  
      this.token = null;  
      this.isAuthenticated = false;  
      this.authStatusListener.next(false);
      clearTimeout(this.tokenTimer);  
      this.clearAuthData();
      this.userId = null;  
      this.router.navigate(['/']);
    }  

    changePassword(currentPassword: string, newPassword: string) {
      const payload = { currentPassword, newPassword };
      return this.http.post("http://localhost:3000/api/user/change-password", payload, {
        headers: { Authorization: "Bearer " + this.getToken() }
      });
    }

    deleteAccount() {
      return this.http.delete("http://localhost:3000/api/user/delete-account", {
        headers: { Authorization: "Bearer " + this.getToken() }
      });
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, email: string) {  
      localStorage.setItem('token', token);
      localStorage.setItem('expiration',expirationDate.toISOString());
      localStorage.setItem('userId', userId);  
      localStorage.setItem('email', email);
    }  

    private clearAuthData() {  
      localStorage.removeItem("token");  
      localStorage.removeItem("expiration");
      localStorage.removeItem("userId");  
      localStorage.removeItem("email");
    }  

    autoAuthUser() {  
      const authInformation = this.getAuthData();  
      if (!authInformation) {  
        return;  
      }  
      const now = new Date();  
      const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();  
      if(expiresInDuration > 0){  
        this.token = authInformation.token;  
        this.isAuthenticated = true; 
        this.userId = authInformation.userId;
        this.userEmail = authInformation.email;
        this.setAuthTimer(expiresInDuration / 1000);  
        this.authStatusListener.next(true);  
      }  
      
    } 

    private getAuthData() {  
      const token = localStorage.getItem("token");  
      const expirationDate = localStorage.getItem("expiration");
      const userId = localStorage.getItem("userId");  
      const email = localStorage.getItem("email");

      if(!token|| !expirationDate || !email){  
        return;  
      }  
      return{  
        token: token,  
        expirationDate: new Date(expirationDate),
        userId: userId,
        email: email,
      }  
    }  

    private setAuthTimer(duration: number) {  
      this.tokenTimer=setTimeout(()=>{  
        this.logout();  
      }, duration*1000);  
        
    }  
}  
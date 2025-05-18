import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {MatPaginatorModule} from '@angular/material/paginator';  

import { logincomponent } from './authentication/login/login.component';

import { signupcomponent } from './authentication/signup/signup.component';

import { MatCardModule } from '@angular/material/card';
import { AuthInterceptor } from './authentication/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import{MatDialogModule} from '@angular/material/dialog';  

import { ErrorComponent } from './error/error.component';
import { LogoutConfirmationComponent } from './logout-confirmation/logout-confirmation.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    logincomponent,
    signupcomponent,
    ErrorComponent,
    LogoutConfirmationComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,  
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule
  ],
 providers: [{provide: HTTP_INTERCEPTORS,   
    useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../authentication/auth.service";
import { Subscription } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component'; 

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{  
    private authListenerSubs!: Subscription;  
    public userIsAuthenticated = false;  
    isDropdownOpen = false;
    public userEmail: string | null = null;

    constructor(private authService: AuthService, private dialog: MatDialog) {}

    ngOnInit(){  
        this.userIsAuthenticated = this.authService.getIsAuth();  
        this.userEmail = this.authService.getUserEmail();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{  
      this.userIsAuthenticated = isAuthenticated;
      this.userEmail = this.authService.getUserEmail();
    });  
    }

    onLogout(event?: MouseEvent) {
      (event?.target as HTMLElement)?.blur();

      const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
        width: '300px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.authService.logout();
          this.isDropdownOpen = false;
        }
      });
    }

    ngOnDestroy(){  
      this.authListenerSubs.unsubscribe();  
    }  

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }  
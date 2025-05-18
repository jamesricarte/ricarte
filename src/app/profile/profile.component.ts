import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    email: 'yourmail@example.com',
    username: 'yourusername',
  };
  public userEmail: string | null = null;
  public userName!: string;

  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.userEmail = this.authService.getUserEmail();
    this.userName = this.userEmail!.split("@")[0];
  }

  onChangePassword() {
  if (this.passwordForm.valid) {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    this.authService.changePassword(currentPassword, newPassword)
      .subscribe({
        next: (res) => {
          alert("Password changed successfully.");
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error(err.error.message || "Password change failed.");
        }
      });
    }
  }

  onDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action is irreversible!');
    if (confirmed) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          alert("Account deleted.");
          this.authService.logout(); // Optional: logs out and redirects
        },
        error: (err) => {
          alert(err.error.message || "Failed to delete account.");
        }
      });
    }
  }
}

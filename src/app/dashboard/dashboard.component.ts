import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private loginService: LoginService) { }

  loadUsers() {
    this.loginService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data.users;
      },
      error: (error: any) => console.log(error),
      complete: () => console.log()
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onLogout() {
    this.loginService.logout();
  }
}

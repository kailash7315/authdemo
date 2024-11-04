import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './login/login.service';
import { User } from './login/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: User | null = null;

  constructor(private authService: LoginService) {}
  
  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.user.subscribe((data: User | null) => {
      if (data) 
        this.user = data;
    })
  }
}

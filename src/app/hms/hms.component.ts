import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-hms',
  template: `
    <router-outlet></router-outlet>
  `
})
export class HmsComponent {
  constructor(
    public userservice: UserService,
    private userIdle: UserIdleService
  ) {

    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe((count) => {
      console.log(`Inactive for ${count}`);
    });
    this.userIdle.onTimeout().subscribe(() => {
      console.log("Timeout");
    });

  }

}
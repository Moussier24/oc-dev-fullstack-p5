import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit, OnDestroy {
  public user: User | undefined;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private matSnackBar: MatSnackBar,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.userService
        .getById(this.sessionService.sessionInformation!.id.toString())
        .pipe(
          catchError((error) => {
            this.matSnackBar.open('Error loading user details', 'Close', {
              duration: 3000,
            });
            return of(undefined);
          })
        )
        .subscribe((user: User | undefined) => {
          this.user = user;
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public back(): void {
    window.history.back();
  }

  public delete(): void {
    this.subscription.add(
      this.userService
        .delete(this.sessionService.sessionInformation!.id.toString())
        .pipe(
          tap(() => {
            this.matSnackBar.open('Your account has been deleted !', 'Close', {
              duration: 3000,
            });
            this.sessionService.logOut();
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            this.matSnackBar.open('Error deleting account', 'Close', {
              duration: 3000,
            });
            return of(undefined);
          })
        )
        .subscribe()
    );
  }
}

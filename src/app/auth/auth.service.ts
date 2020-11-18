import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }
  registreUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new UI.StoptLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StoptLoading());
        this.uiService.showSnackbar(error.message, null, 300);
      });
  }
  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new UI.StoptLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StoptLoading());
        this.uiService.showSnackbar(error.message, null, 300);
      });
  }
  logout() {
    this.afAuth.signOut();
  }
  isAuth() {
    return this.isAuthenticated;
  }
}

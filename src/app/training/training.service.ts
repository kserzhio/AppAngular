import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { error } from 'protractor';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private finishedExercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];
  constructor(private db: AngularFirestore, private uiService: UIService) {}
  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as Exercise),
              };
            });
          })
        )
        .subscribe(
          (ex: Exercise[]) => {
            this.availableExercises = ex;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            this.uiService.loadingStateCganged.next(false);
            this.uiService.showSnackbar(
              'Fetching Exercises failed , please try again later',
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }
  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }
  compeleteExercise() {
    this.addDataToDataBase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  cancelExercise(progress) {
    this.addDataToDataBase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  getRunningExercise() {
    return { ...this.runningExercise };
  }
  fetchCompletedOrCancelledExercise() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }
  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
  private addDataToDataBase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}

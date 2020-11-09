import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exercisesSubcsription: Subscription;
  constructor(private trainingSevice: TrainingService) {}

  ngOnInit(): void {
    this.exercisesSubcsription = this.trainingSevice.exercisesChanged.subscribe(
      (exercises) => (this.exercises = exercises)
    );
    this.trainingSevice.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm): void {
    this.trainingSevice.startExercise(form.value.exercises);
  }
  ngOnDestroy(): void {
    this.exercisesSubcsription.unsubscribe();
  }
}

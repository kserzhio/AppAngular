import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.quard';
import { HomePageComponent } from './home-page/home-page.component';
const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'training',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./training/training.module').then((m) => m.TrainingModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}

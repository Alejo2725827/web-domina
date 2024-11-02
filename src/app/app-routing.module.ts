import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { LoginComponent } from './components/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component'; // Importar el layout
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent // Ruta al login
  },
  {
    path: 'register',
    component: RegisterComponent // Ruta al login
  },
  {
    path: '',
    component: AppLayoutComponent, // Usar AppLayout como contenedor
    canActivate: [AuthGuard], // Aplica el guard al grupo de rutas
    children: [
      {
        path: 'my-tasks',
        component: MyTasksComponent
      },      
      {
        path: 'task-form',
        component: TaskFormComponent
      },
      {
        path: '',
        redirectTo: 'my-tasks',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

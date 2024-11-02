import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Task {
  _id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  taskId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      completed: [false] // Control para el estado de completado, por defecto en falso
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Estos son los parámetros', params);
      this.taskId = params['task_id'] || null;
      if (this.taskId) {
        this.obtenerTarea(this.taskId);
      }
    });
  }

  obtenerTarea(taskId: string): void {
    this.loading = true;

    // Obtener el userId del localStorage
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.error = 'No se encontró el usuario. Por favor, inicia sesión.';
      this.loading = false;
      return;
    }

    // Construir la URL base de la API
    const url = `http://localhost:3001/tasks/${userId}?task_id=${taskId}`;

    this.http.get<{ tareas: Task[] }>(url)
      .subscribe({
        next: (response) => {
          if (response.tareas && response.tareas.length > 0) {
            const task = response.tareas[0]; // Tomar solo la primera tarea
            this.taskForm.patchValue({
              title: task.title,
              completed: task.completed // Cargar el estado de completado
            });
          } else {
            this.error = 'No se encontró la tarea solicitada.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar la tarea. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    this.loading = true;
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      this.error = 'No se encontró el usuario. Por favor, inicia sesión.';
      this.loading = false;
      return;
    }

    const taskData = {
      userId: userId, // Usar el userId del localStorage
      title: this.taskForm.value.title,
      completed: this.taskForm.value.completed // Incluir el estado de completado al enviar
    };

    if (this.taskId) {
      // Si existe taskId, actualizar tarea
      this.http.put(`http://localhost:3001/tasks/${this.taskId}/actualizar`, taskData)
        .subscribe({
          next: () => {
            this.router.navigate(['/my-tasks']); // Redirige a la lista de tareas
          },
          error: (err) => {
            this.error = 'Error al actualizar la tarea. Por favor, intenta de nuevo más tarde.';
            this.loading = false;
          }
        });
    } else {
      // Si no existe taskId, crear tarea
      this.http.post('http://localhost:3001/tasks/crear', taskData)
        .subscribe({
          next: () => {
            this.router.navigate(['/my-tasks']); // Redirige a la lista de tareas
          },
          error: (err) => {
            this.error = 'Error al crear la tarea. Por favor, intenta de nuevo más tarde.';
            this.loading = false;
          }
        });
    }
  }
}

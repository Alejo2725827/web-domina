import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Task {
  _id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = true;
  error: string | null = null;
  completedFilter: boolean | null = null; // Para almacenar el estado del filtro

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el userId del localStorage
    const userId = localStorage.getItem('user_id');

    if (userId) {
      this.route.queryParams.subscribe(params => {
        this.completedFilter = params['completed'] === 'true';
        this.obtenerTareas(userId, this.completedFilter);
      });
    } else {
      this.error = 'No se encontró el usuario. Por favor, inicia sesión.';
      this.loading = false;
    }
  }

  obtenerTareas(userId: string, completed: boolean | null): void {
    // Construir la URL base de la API
    let url = `http://localhost:3001/tasks/${userId}`;

    // Solo añadir el query param `completed` si está definido y es verdadero
    if (completed) {
      url += `?completed=${completed}`;
    }

    this.http.get<{ tareas: Task[] }>(url)
      .subscribe({
        next: (response) => {
          this.tasks = response.tareas;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las tareas. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
        }
      });
  }

  toggleCompletedFilter(event: Event): void {
    this.completedFilter = (event.target as HTMLInputElement).checked; // Obtener el estado del checkbox

    // Actualizar los parámetros de la URL
    if (this.completedFilter) {
      this.router.navigate([], { queryParams: { completed: this.completedFilter } });
    } else {
      this.router.navigate([], { queryParams: { completed: null } }); // Eliminar el parámetro completado
    }

    // Cargar las tareas nuevamente sin el parámetro si el checkbox no está marcado
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.obtenerTareas(userId, this.completedFilter);
    }
  }

  eliminarTarea(taskId: string): void {
    const url = `http://localhost:3001/tasks/${taskId}/eliminar`;

    this.http.delete(url).subscribe({
      next: () => {
        // Filtrar la tarea eliminada de la lista
        this.tasks = this.tasks.filter(task => task._id !== taskId);
      },
      error: (err) => {
        this.error = 'Error al eliminar la tarea. Por favor, intenta de nuevo más tarde.';
      }
    });
  }
}

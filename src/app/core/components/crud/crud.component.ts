import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [ToolbarModule, ToastModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent {

}

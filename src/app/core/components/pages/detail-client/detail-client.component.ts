import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css'
})
export class DetailClientComponent {

  constructor(private route: ActivatedRoute) { }

  productId: string | null = null;

  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id');
    console.log('ID del producto (Snapshot):', this.productId);
  }

}

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { Component, inject } from '@angular/core';
import { CarritoAlimentosService } from '../../service/carrito-alimentos.service';
import { CartItem } from '../../api/alimento';

@Component({
  selector: 'app-carrito-alimentos',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './carrito-alimentos.component.html',
  styleUrl: './carrito-alimentos.component.css'
})
export class CarritoAlimentosComponent {
  private cartService = inject(CarritoAlimentosService);

  cartItems = this.cartService.cartItems.asReadonly();
  totalAmount = this.cartService.totalAmount;

  constructor(){}

  incrementQuantity(alimento: CartItem['alimento']) {
    this.cartService.addToCart(alimento);
  }

  decrementQuantity(alimento: CartItem['alimento']) {
    this.cartService.removeFromCart(alimento.id);
  }

  removeProduct(productId: number) {
    this.cartService.removeAllOfProduct(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

}

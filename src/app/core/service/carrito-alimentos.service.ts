import { computed, Injectable, signal } from '@angular/core';
import { Alimento, CartItem } from '../api/alimento';

@Injectable({
  providedIn: 'root'
})
export class CarritoAlimentosService {
  cartItems = signal<CartItem[]>([]);

  // Computed Signal para calcular el total de ítems en el carrito
  // Se recalcula automáticamente cada vez que cartItems cambia
  totalAmount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.alimento.gramos * item.quantity), 0);
  });

  constructor() { }

  addToCart(alimento: Alimento) {
    console.log("alimento ", alimento);
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.alimento.id === alimento.id);

      if (existingItem) {
        // Si el alimento ya está en el carrito, incrementa la cantidad
        return items.map(item =>
          item.alimento.id === alimento.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un alimento nuevo, lo añade con cantidad 1
        return [...items, { alimento: alimento, quantity: 1 }];
      }
    });
  }

  removeFromCart(alimentoId: number) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.alimento.id === alimentoId);

      if (existingItem && existingItem.quantity > 1) {
        // Si la cantidad es mayor a 1, solo decrementa
        return items.map(item =>
          item.alimento.id === alimentoId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Si la cantidad es 1, o el ítem no existe, lo filtra del array
        return items.filter(item => item.alimento.id !== alimentoId);
      }
    });
  }

  removeAllOfProduct(alimentoId: number) {
    this.cartItems.update(items => items.filter(item => item.alimento.id !== alimentoId));
  }

  clearCart() {
    this.cartItems.set([]); // Establece el array de ítems como vacío
  }
}

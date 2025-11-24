import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  // Si usas componentes standalone:
  standalone: true 
})
export class TitleCasePipe implements PipeTransform {

  // La función 'transform' aplica la lógica al valor (value)
  transform(value: string | null | undefined): string {
    // 1. Manejar valores nulos o vacíos
    if (!value) {
      return '';
    }

    // 2. Convertir la cadena a minúsculas
    // 3. Dividir la cadena por espacios
    // 4. Mapear cada palabra:
    //    - Capitalizar la primera letra (toUpperCase)
    //    - Unirla al resto de la palabra (slice(1))
    // 5. Unir todas las palabras con un espacio
    return value.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
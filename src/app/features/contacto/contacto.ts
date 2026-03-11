import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatIconModule, TranslateModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // Estados del popup
  showPopup = signal(false);
  popupMessage = signal('');
  popupType = signal<'success' | 'error'>('success');
  isSubmitting = signal(false);

  // Lista de archivos seleccionados
  selectedFiles = signal<File[]>([]);

  // Formulario Seguro (Validadores para evitar inyección y asegurar formato)
  // Utilizamos regex para limitar los caracteres permitidos y prevenir XSS básico.
  contactForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    profesion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.,]+$/)]],
    plataforma: ['', [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\.\-\_\/\:\@]+$/)]], // URLs, @handles
    conociste: ['', [Validators.required]],
    interes: ['', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), Validators.pattern(/^[^<>{}]+$/)]] // Evita etiquetas HTML
  });

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSizeBytes = 25 * 1024 * 1024; // max 25MB para alta calidad
      const validFiles = Array.from(files).filter(f => allowedTypes.includes(f.type) && f.size <= maxSizeBytes);

      if (validFiles.length !== files.length) {
        this.showNotification('Algunos archivos no son imágenes válidas (JPG, PNG, WEBP) o superan los 25MB permitidos.', 'error');
      }
      this.selectedFiles.update(current => [...current, ...validFiles]);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.update(files => files.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Preparar el FormData para adjuntos y texto
    const formData = new FormData();
    Object.keys(this.contactForm.controls).forEach(key => {
      formData.append(key, this.contactForm.get(key)?.value);
    });

    // Adjuntar archivos si existen
    this.selectedFiles().forEach((file, index) => {
      formData.append(`foto_${index}`, file);
    });

    // Añadir configuración para formsubmit
    formData.append('_subject', 'Nuevo mensaje de contacto - Amazonas Jungle');
    formData.append('_template', 'table');
    // Para no redirigir
    formData.append('_captcha', 'false');

    // Email destino (jmcharrogarcia@gmail.com)
    // Usamos el endpoint ajax de formsubmit para enviar sin recargar página
    this.http.post('https://formsubmit.co/ajax/jmcharrogarcia@gmail.com', formData)
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.contactForm.reset();
          this.selectedFiles.set([]);
          this.showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.showNotification('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
          console.error('Error sending form', error);
        }
      });
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.popupMessage.set(message);
    this.popupType.set(type);
    this.showPopup.set(true);

    setTimeout(() => {
      this.closePopup();
    }, 4000); // 4 segundos para asegurar que lo lee bien
  }

  closePopup() {
    this.showPopup.set(false);
  }

  isDropdownOpen = signal(false);

  interesesMap: { [key: string]: string } = {
    'conservacion': 'Conservación y Medio Ambiente',
    'investigacion': 'Investigación Científica',
    'tribus': 'Cultura y Tribus Indígenas',
    'fotografia': 'Fotografía / Documental',
    'turismo': 'Viaje y Exploración',
    'otro': 'Otro'
  };

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  selectInteres(value: string) {
    this.contactForm.get('interes')?.setValue(value);
    this.contactForm.get('interes')?.markAsTouched();
    this.isDropdownOpen.set(false);
  }

  get selectedInteresText(): string {
    const val = this.contactForm.get('interes')?.value;
    return val ? this.interesesMap[val] : 'Selecciona un interés...';
  }

  clearForm() {
    this.contactForm.reset();
    this.selectedFiles.set([]);
    this.isSubmitting.set(false);
  }

  // Getters para chequear validación en el HTML
  get f() { return this.contactForm.controls; }
}

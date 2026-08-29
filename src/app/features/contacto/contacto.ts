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

  // Formulario Seguro (Validadores para evitar inyección y asegurar formato)
  // Utilizamos regex para limitar los caracteres permitidos y prevenir XSS básico.
  contactForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    profesion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.,]+$/)]],
    web: ['', [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\.\-\_\/\:\@]+$/)]], // URLs
    instagram: ['', [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\.\-\_\/\:\@]+$/)]], // @handles
    plataforma: ['', [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\.\-\_\/\:\@]+$/)]], // URLs, @handles
    conociste: ['', [Validators.required]],
    interes: ['', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), Validators.pattern(/^[^<>{}]+$/)]] // Evita etiquetas HTML
  });


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

    // Enviar al nuevo backend PHP local
    this.http.post('/api/contacto.php', formData)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);
          this.contactForm.reset();
          this.showNotification('CONTACT_PAGE.NOTIFICATIONS.SUCCESS', 'success');
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.showNotification('CONTACT_PAGE.NOTIFICATIONS.ERROR', 'error');
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
    'conservacion': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.CONSERVATION',
    'investigacion': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.RESEARCH',
    'tribus': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.TRIBES',
    'fotografia': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.PHOTO',
    'turismo': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.TOURISM',
    'otro': 'CONTACT_PAGE.FORM.INTEREST_OPTIONS.OTHER'
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
    return val ? this.interesesMap[val] : 'CONTACT_PAGE.FORM.INTEREST_PLACEHOLDER';
  }

  clearForm() {
    this.contactForm.reset();
    this.isSubmitting.set(false);
  }

  // Getters para chequear validación en el HTML
  get f() { return this.contactForm.controls; }
}

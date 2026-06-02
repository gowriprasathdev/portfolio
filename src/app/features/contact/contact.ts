import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  state = inject(PortfolioStateService);
  private fb = inject(FormBuilder);

  // Submission state signals
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean | null>(null);
  toastMessage = signal<string>('');

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);

    // Simulate enterprise backend API post delay
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.toastMessage.set('Thank you! Your message has been sent successfully.');
      this.contactForm.reset();

      // Clear success notification toast after 4 seconds
      setTimeout(() => {
        this.submitSuccess.set(null);
        this.toastMessage.set('');
      }, 4000);
    }, 1500);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}

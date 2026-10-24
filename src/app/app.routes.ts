import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent),
    title: 'Gowri Prasath | Senior Software Developer'
  },
  {
    path: 'projects/whatsapp-ai-sales',
    loadComponent: () => import('./features/projects/case-study/case-study').then(m => m.CaseStudyComponent),
    title: 'Conversational WhatsApp AI Sales Platform | Architecture & Case Study'
  },
  {
    path: 'projects/whatsapp-sales',
    redirectTo: 'projects/whatsapp-ai-sales',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

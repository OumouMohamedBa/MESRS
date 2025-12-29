import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { UserDto, UserService } from '../services/user.service';
import { Mission, MissionNotificationService } from '../services/mission-notification.service';
import { NotificationService } from '../services/notification.service';
import { Etablissement } from '../etablissements/etablissement.model';
import { EtablissementService } from '../etablissements/etablissement.service';

@Component({
  selector: 'app-inspection-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './inspection-planning.component.html'
})
export class InspectionPlanningComponent implements OnInit {
  loadingUsers = false;
  loadingEtablissements = false;
  saving = false;

  inspectors: UserDto[] = [];
  etablissements: Etablissement[] = [];
  missions: Mission[] = [];

  formModel: {
    date: string;
    objet: string;
    etablissementId: string;
    assignedToUsername: string;
  } = {
    date: '',
    objet: '',
    etablissementId: '',
    assignedToUsername: ''
  };

  constructor(
    private users: UserService,
    private etabs: EtablissementService,
    private missionService: MissionNotificationService,
    private toast: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInspectors();
    this.loadEtablissements();
    this.refreshMissions();
  }

  loadInspectors(): void {
    this.loadingUsers = true;
    const preselect = this.route.snapshot.queryParamMap.get('assignedTo');
    this.users.getAll().subscribe({
      next: (list) => {
        this.inspectors = (list || []).filter((u) => (u.role || '').startsWith('SOUS_INSPECTEUR'));
        if (preselect && this.inspectors.some((u) => u.username === preselect)) {
          this.formModel.assignedToUsername = preselect;
        }
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Erreur chargement inspecteurs', err);
        this.loadingUsers = false;
        this.toast.error('Impossible de charger les inspecteurs');
      }
    });
  }

  loadEtablissements(): void {
    this.loadingEtablissements = true;
    this.etabs.list().subscribe({
      next: (list) => {
        this.etablissements = list || [];
        this.loadingEtablissements = false;
      },
      error: (err) => {
        console.error('Erreur chargement établissements', err);
        this.etablissements = [];
        this.loadingEtablissements = false;
        this.toast.error('Impossible de charger les établissements');
      }
    });
  }

  refreshMissions(): void {
    this.missions = this.missionService.getAllMissions();
  }

  onSubmit(form: NgForm): void {
    if (this.saving) return;
    if (form.invalid) {
      this.toast.warning('Merci de remplir les champs obligatoires');
      return;
    }
    if (!this.formModel.etablissementId) {
      this.toast.warning("Merci de sélectionner un établissement");
      return;
    }
    if (!this.formModel.assignedToUsername) {
      this.toast.warning("Merci de sélectionner un inspecteur");
      return;
    }

    this.saving = true;
    try {
      this.missionService.createMission({
        date: this.formModel.date,
        objet: this.formModel.objet,
        etablissementId: this.formModel.etablissementId,
        assignedToUsername: this.formModel.assignedToUsername
      });
      this.toast.success('Mission planifiée et notification envoyée');
      form.resetForm({ date: '', objet: '', etablissementId: '', assignedToUsername: '' });
      this.refreshMissions();
    } finally {
      this.saving = false;
    }
  }

  getEtablissementLabel(etablissementId: string): string {
    const found = this.etablissements.find((e) => e.id === etablissementId);
    if (!found) return etablissementId;
    return found.nom;
  }

  getInspectorLabel(username: string): string {
    const found = this.inspectors.find((i) => i.username === username);
    if (!found) return username;
    return `${found.fullname} (${found.username})`;
  }
}

import { User } from 'src/models/user.model';

export class CreateDemandeDto {
  user: User;
  approved: boolean;
  documents: string[];
  num_matricule: string;
  puissance: string;
  num_chassie: string;
  mark: string;
  model: string;
  nb_place: string;
  carburant: string;
  year: string;
  valeur: string;
  adresse: string;
  maison: string;
  nb_piece: string;
  superficie: string;
  type: string;
}

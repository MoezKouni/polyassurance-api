import { IsEmail, Matches, Validator } from "class-validator";

export class CreateUserDto {
  firstname: string;
  lastname: string;
  @IsEmail(Validator, { message: 'email: Adresse e-mail invalide' })
  email: string;
  
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      'password: Mot de passe doit contenir au moins 8 caractères, au moins une lettre majuscule, un caractère spécial et au moins un chiffre',
  })
  password: string;

  avatar: string;
  role: string;
  archived: boolean
  address: string
  phone: string
}

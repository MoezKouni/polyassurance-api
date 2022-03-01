import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'name: Veuillez saisir un nom pour cette permission' })
    name: string
}

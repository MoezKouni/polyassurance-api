import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DemandesService } from './demandes.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';
import { diskStorage } from 'multer';
import { Helper } from 'src/helpers/filenameUpload';
import { Roles } from 'src/decorators/roles.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('demandes')
@UseGuards(RolesGuard, PermissionsGuard)
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('docs[]', 10, {
      storage: diskStorage({
        destination: './upload/documents',
        filename: Helper.customFileName,
      }),
    }),
  )
  create(
    @Body() createDemandeDto: CreateDemandeDto,
    @Req() req: any,
    @UploadedFiles() files,
  ) {
    return this.demandesService.create(createDemandeDto, req.user._id, files);
  }

  @Roles('admin', 'agent')
  @Permissions('read-demandes')
  @Get("all")
  findAll() {
    return this.demandesService.findAll();
  }

  @Roles('admin', 'agent')
  @Permissions('read-demandes')
  @Get("user/:userId")
  findByUserId(@Param('userId') userId: string) {
    return this.demandesService.findByUserId(userId);
  }

  @Roles('admin', 'agent')
  @Permissions('read-demandes')
  @Get("demande/:id")
  findDemandeById(@Param('id') id: string) {
    return this.demandesService.findDemandeById(id);
  }

  @Roles('admin', 'agent')
  @Permissions('read-demandes')
  @Get("recent")
  findRecentDemandes() {
    return this.demandesService.findRecentDemandes();
  }

  @Roles('admin', 'agent')
  @Permissions('update-demandes')
  @Put("status/:id")
  changeStatus(@Param('id') id: string, @Body() updateDemandeDto: UpdateDemandeDto) {
    return this.demandesService.changeStatus(id, updateDemandeDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.demandesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDemandeDto: UpdateDemandeDto) {
  //   return this.demandesService.update(+id, updateDemandeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.demandesService.remove(+id);
  // }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('users')
@UseGuards(RolesGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin', 'agent')
  @Permissions('read-clients')
  @Get("client/recent/signups")
  findRecentSingups() {
    return this.usersService.findRecentSingups();
  }

  @Roles('admin', 'agent')
  @Permissions('read-clients')
  @Get("client/:id")
  findOneClient(@Param('id') id: string) {
    return this.usersService.findOneClient(id);
  }

  @Roles('admin', 'agent')
  @Permissions('create-clients')
  @Post("client/new")
  createNewClient(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createNewClient(createUserDto);
  }

  @Roles('admin', 'agent')
  @Permissions('update-clients')
  @Put("client/update/:id")
  updateClient(@Param('id') id: string,@Body() createUserDto: UpdateUserDto) {
    return this.usersService.updateClient(id, createUserDto);
  }

  @Roles('admin', 'agent')
  @Permissions('read-clients')
  @Get("client")
  findAllClients() {
    return this.usersService.findAllClients();
  }

  @Roles('admin', 'agent')
  @Permissions('read-team')
  @Get("team")
  findTeammembers() {
    return this.usersService.findTeammembers();
  }

  @Roles('admin', 'agent')
  @Permissions('create-team')
  @Post("team/new")
  createNewMember(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createNewMember(createUserDto);
  }

  @Roles('admin', 'agent')
  @Permissions('read-team')
  @Get("team/:id")
  getOneTeammember(@Param('id') id: string) {
    return this.usersService.getOneTeammember(id);
  }

  @Roles('admin', 'agent')
  @Permissions('update-team')
  @Put("team/update/:id")
  updateTeammember(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateTeammember(id, updateUserDto);
  }

  @Roles('admin', 'agent')
  @Permissions('update-team')
  @Put("team/archive/:id")
  archiveMember(@Param('id') id: string) {
    return this.usersService.archiveMember(id);
  }
  @Roles('admin', 'agent')
  @Permissions('update-clients')
  @Put("client/archive/:id")
  archiveClient(@Param('id') id: string) {
    return this.usersService.archiveMember(id);
  }

}

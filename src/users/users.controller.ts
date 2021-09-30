import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(
    @Body('firstname') userfname: string,
    @Body('lastname') userlname: string,
    @Body('email') useremail: string,
    @Body('password') userpassword: string,
  ) {
    const generatedId = await this.usersService.insertUser(
      userfname,
      userlname,
      useremail,
      userpassword,
    );
    return { id: generatedId };
  }
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getUsers();
    return users;
  }

  @Get(':id')
  getUser(@Param('id') userid: string) {
    return this.usersService.getSingleUser(userid);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userid: string,
    @Body('firstname') fname: string,
    @Body('lastname') lname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    await this.usersService.updateUser(userid, fname, lname, email, password);
    return null;
  }

  @Delete(':id')
  async deleteUser(@Param('id') userid: string) {
    await this.usersService.deleteUser(userid);
    return null;
  }
}

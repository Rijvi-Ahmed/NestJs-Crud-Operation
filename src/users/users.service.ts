import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async insertUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const newUser = new this.UserModel({
      firstname,
      lastname,
      email,
      password,
    });
    const result = await newUser.save();
    return result.id as string;
    //console.log(result);
  }

  async getUsers() {
    const users = await this.UserModel.find().exec();
    return users.map((prod) => ({
      id: prod.id,
      firstname: prod.firstname,
      lastname: prod.lastname,
      email: prod.email,
      password: prod.password,
    }));
  }

  async getSingleUser(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
    };
  }

  async updateUser(
    userId: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const updatedUser = await this.findUser(userId);
    if (firstname) {
      updatedUser.firstname = firstname;
    }
    if (lastname) {
      updatedUser.lastname = lastname;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }
    updatedUser.save();
  }

  async deleteUser(userId: string) {
    const result = await this.UserModel.deleteOne({ _id: userId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.UserModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!user) {
      throw new NotFoundException('Could not find product.');
    }
    return user;
  }
}

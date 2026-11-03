import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {


    @Get()
    public getUsers(){
        return "Called get users enpoint"
    }


    @Post()
    public createUser(){
        return " Called create user endpoint"
    }
}

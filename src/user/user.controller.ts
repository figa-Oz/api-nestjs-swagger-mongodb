import { 
    Controller,
    Post,
    Body,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { UserRegisterDTO } from './dto/register.dto';
import { UserLoginDTO } from './dto/login.dto';
import { RefreshAccessTokenDTO } from '../auth/dto/refresh-access-token.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * @route   POST api/v1/users
     * @desc    Create a new user
     * @access  Public
     */
    @Post()
    @ApiOperation({ summary: 'User Registration' })
    async register(@Body() userRegisterDTO: UserRegisterDTO) {
        return await this.userService.create(userRegisterDTO);
    }

    /**
     * @route   POST api/v1/users/login
     * @desc    Authenticate user
     * @access  Public
     */
    @Post('login')
    @ApiOperation({ summary: 'User Login' })
    async login(@Req() req: FastifyRequest, @Body() userLoginDTO: UserLoginDTO) {
        return await this.userService.login(req, userLoginDTO);
    }

    /**
     * @route   POST api/v1/users/refresh-access-token
     * @desc    Refresh user access token
     * @access  Public
     */
    @Post('refresh-access-token')
    @ApiOperation({ summary: 'Refresh Access Token' })
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDTO) {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    }
}

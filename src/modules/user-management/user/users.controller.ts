import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Param,
  ValidationPipe,
  UsePipes,
  Put,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserWithCount } from './interfaces/user-with-count.interface';

@ApiTags('Users') // Groups endpoints under "Users" in Swagger UI
@ApiBearerAuth('access-token')
@Controller('/api/v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto }) // Document input type for this endpoint
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of users.',
    schema: {
      example: [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User One',
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User Two',
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of cities to skip for pagination',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of cities to retrieve per page',
  })
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<UserWithCount> {
    return this.usersService.findAllWithPagination(skip, take);
  }

  @Get('/profile') // Adding the new profile endpoint
  @ApiOperation({
    summary: 'Get the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile.',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: 'User Name',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt')) // Ensuring the user is authenticated
  async getProfile(@Request() req) {
    const email = req.user['email']; // Assuming 'id' is present in the JWT payload
    console.log(email);
    return this.usersService.getUserProfile(email);
  }
}

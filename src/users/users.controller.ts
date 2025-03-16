import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Query, 
  UseInterceptors, 
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User, UserRole } from './entities/user.entity';
import { PageDto } from '../common/dto/page.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SortOptions } from '../common/enum/sort-options.enum';
import { Order } from 'src/common/dto/page-options.dto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all users with pagination and filtering' })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'search', required: false, description: 'Search in any field (username, name, email)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: SortOptions })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiResponse({ status: 200, description: 'Return list of users', type: PageDto })
  findAll(@Query() queryUserDto: QueryUserDto): Promise<PageDto<User>> {
    return this.usersService.findAll(queryUserDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user.' })
  getProfile(@CurrentUser() user: User): User {
    return user;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
} 
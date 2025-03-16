import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as argon2 from 'argon2';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { SortOptions } from '../common/enum/sort-options.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(createUserDto.password);

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(queryUserDto: QueryUserDto): Promise<PageDto<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    // Apply specific filters
    if (queryUserDto.username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${queryUserDto.username}%` });
    }
    
    if (queryUserDto.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${queryUserDto.name}%` });
    }
    
    if (queryUserDto.role) {
      queryBuilder.andWhere('user.role = :role', { role: queryUserDto.role });
    }
    
    // Apply global search if provided
    if (queryUserDto.search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${queryUserDto.search}%` }
      );
    }
    
    // Apply ordering
    if (queryUserDto.sort) {
      queryBuilder.orderBy(`user.${queryUserDto.sort}`, queryUserDto.order);
    } else {
      // Default ordering
      queryBuilder.orderBy('user.createdAt', queryUserDto.order);
    }
    
    // Apply pagination
    queryBuilder
      .skip(queryUserDto.skip)
      .take(queryUserDto.take);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: queryUserDto });
    
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    
    // Update user fields
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.findOne(id);
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // This method should be used only for system initialization
  async createAdminIfNotExists(): Promise<void> {
    const adminUser = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!adminUser) {
      await this.create({
        username: 'admin',
        password: 'admin123456', // This should be changed after first login
        role: UserRole.ADMIN,
        email: process.env.ADMIN_EMAIL,
        name: 'System Administrator',
      });
    }
  }
} 
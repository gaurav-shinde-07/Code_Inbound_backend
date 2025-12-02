import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: createDto.email }});
    if (existing) throw new BadRequestException('Email already registered');
    const user = this.usersRepository.create(createDto as any);
    user.password = await bcrypt.hash(createDto.password, 10);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id','email','name','role','createdAt','updatedAt'] });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }});
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }});
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }});
    if (!user) throw new NotFoundException('User not found');
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    delete saved.password;
    return saved;
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id }});
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.delete(id);
  }
}

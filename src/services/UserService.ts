import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

/**
 * User service for handling user-related database operations
 * This service provides methods for user CRUD operations and authentication
 */
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<User> {
    const user = this.userRepository.create({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: userData.role || 'user',
    });

    return await this.userRepository.save(user);
  }

  /**
   * Find user by email (including password for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * Find user by email (without password)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Get all users with pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Get user count by role (for seeding script)
   */
  async getUserCountByRole(): Promise<{
    admin: number;
    user: number;
    total: number;
  }> {
    const [adminCount, userCount, total] = await Promise.all([
      this.userRepository.count({ where: { role: 'admin' } }),
      this.userRepository.count({ where: { role: 'user' } }),
      this.userRepository.count(),
    ]);

    return {
      admin: adminCount,
      user: userCount,
      total,
    };
  }
}

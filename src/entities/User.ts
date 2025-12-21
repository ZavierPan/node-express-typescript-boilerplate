import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';

/**
 * User entity representing users in the database
 * This entity includes authentication and user management fields
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 255, select: false }) // Don't select password by default
  password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role!: 'admin' | 'user';

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Hash password before inserting new user
   */
  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  /**
   * Hash password before updating user (only if password is modified)
   */
  @BeforeUpdate()
  async hashPasswordBeforeUpdate(): Promise<void> {
    // Only hash if password is being updated and it's not already hashed
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  /**
   * Compare provided password with stored hash
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Update last login timestamp
   */
  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  /**
   * Convert entity to safe object (without password)
   */
  toSafeObject(): Omit<
    User,
    | 'password'
    | 'hashPasswordBeforeInsert'
    | 'hashPasswordBeforeUpdate'
    | 'comparePassword'
    | 'updateLastLogin'
    | 'toSafeObject'
  > {
    const { password, ...safeUser } = this;
    return safeUser;
  }
}

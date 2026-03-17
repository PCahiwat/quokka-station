import { type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const existing = this.users.get(userData.id);
    const user: User = { ...existing, ...userData };
    this.users.set(userData.id, user);
    return user;
  }
}

export const storage = new MemStorage();

import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  private static prismaInstance: PrismaClient;

  private constructor() {} // Prevents instantiation

  public static getInstance(): PrismaClient {
    if (!this.prismaInstance) {
      this.prismaInstance = new PrismaClient();
    }
    return this.prismaInstance;
  }
}

const prisma = PrismaSingleton.getInstance();

export default prisma;

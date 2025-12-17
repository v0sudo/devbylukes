import { PrismaClient } from "../generated/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const developers = await prisma.developer.findMany();

  console.log(`Found ${developers.length} developers`);

  for (const developer of developers) {
    if (!developer.editUuid) {
      const uuid = randomUUID();
      await prisma.developer.update({
        where: { id: developer.id },
        data: { editUuid: uuid },
      });
      console.log(`Updated developer ${developer.id} (${developer.name}) with UUID: ${uuid}`);
    } else {
      console.log(`Developer ${developer.id} (${developer.name}) already has UUID: ${developer.editUuid}`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


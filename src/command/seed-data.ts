import { AppDataSource } from "../../data-design/src/data-source";
import { Objective } from "../../data-design/src/entity/Objective.entity";

export async function seedData() {
  try {
    await AppDataSource.initialize();
  } catch (err: any) {
    console.log(err);
  } finally {
    process.exit(0);
  }
}
seedData();
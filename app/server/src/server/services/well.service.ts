import uuid4 from "uuid4";
import { Well } from "../models";
import { WellRepo } from "../repositories";

export const WellService = {
    async createWell(userId: string): Promise<Well> {
        const well = {
            id: uuid4(),
            createdAt: new Date(),
            userId: userId,
        }

        return await WellRepo.create(well);
    }
}
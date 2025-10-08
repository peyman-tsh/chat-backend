import { Module } from "@nestjs/common";
import { FactorController } from "./factor.controller";
import { FactorService } from "./factor.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Factor, FactorSchema } from "./factor.entity";

@Module({
    imports:[MongooseModule.forFeature([{name:Factor.name,schema:FactorSchema}])],
    controllers:[FactorController],
    providers:[FactorService]
})

export class FactorModule{}
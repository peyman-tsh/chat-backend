import { Injectable, NotFoundException } from "@nestjs/common";
import { IFactorService } from "./interfaces/IFactorService";
import { CreateFactorDto } from "./dtos/add.factor.dto";
import { UpdateFactorDto } from "./dtos/update.factor.dto";
import { Factor } from "./factor.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()

export class FactorService implements IFactorService{
    constructor(@InjectModel(Factor.name) private readonly factorRepo:Model<Factor>){}
    async addFactor(factor: CreateFactorDto): Promise<Factor> {
        const createFactor=await this.factorRepo.create(factor);
        return createFactor;
    }
    async getFactor(id: string): Promise<Factor> {
        const getFactor=await this.factorRepo.findById(id);
        if(!getFactor){
         throw new NotFoundException('factor not found')
        }
        return getFactor;
    }
    async getFactors(): Promise<Factor[]> {
        const getFactors=await this.factorRepo.find();
        return getFactors
    }
    async updateFactor(id: string, factor: UpdateFactorDto): Promise<Factor|null> {
        const updateFactor=await this.factorRepo.findByIdAndUpdate(id,factor);
        return updateFactor
    }
    async deleteFactor(id: string): Promise<Factor> {
        const deleteFactor=await this.factorRepo.findByIdAndDelete(id);
        if(!deleteFactor){
            throw new NotFoundException('dont deleted')
        }
        return deleteFactor
    }

}
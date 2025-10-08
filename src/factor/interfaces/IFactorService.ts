import { CreateFactorDto } from "../dtos/add.factor.dto";
import { UpdateFactorDto } from "../dtos/update.factor.dto";
import { Factor } from "../factor.entity";

export interface IFactorService{
    addFactor(factor:CreateFactorDto):Promise<Factor>;
    getFactor(id:string):Promise<Factor>;
    getFactors():Promise<Factor[]>
    updateFactor(id:string,factor:UpdateFactorDto):Promise<Factor|null>;
    deleteFactor(id:string):Promise<Factor>;
}
import { Module } from "@nestjs/common";
import { RateLimitService } from "./rate.limit.service";


Module({
    imports:[],
    controllers:[],
    providers:[RateLimitService],
    exports:[RateLimitService]
})

export class RateLimitModule{}
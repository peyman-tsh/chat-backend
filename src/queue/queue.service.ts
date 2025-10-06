import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { InjectQueue , Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@Processor('sendNotif',{concurrency:3})
export class QueueService extends WorkerHost {
    @WebSocketServer() server: Socket;
    service: any;
   async process(job: Job, token?: string): Promise<any> {
        console.log(job);
        
    this.server.emit('new_message',job.data)
    return true
   }
}
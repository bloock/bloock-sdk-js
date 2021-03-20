import { singleton } from "tsyringe";

@singleton()
export class HttpData {
    public apiKey?: string;
}
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export interface IProxySettings {
    uri: string;
    port: number;
    withholdBlock: boolean;
}
export class ProxySettingsDto implements IProxySettings {

    @IsString()
    uri: string;

    @IsNumber()
    port: number;

    @IsBoolean()
    @IsOptional()
    withholdBlock: boolean;
}
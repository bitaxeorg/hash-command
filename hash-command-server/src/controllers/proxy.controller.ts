import { BadRequestException, Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ProxySettingsDto } from 'models/ProxySettings';
import { ProxyService } from 'src/services/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) { }

  @Get('status')
  async getStatus() {
    return { listening: this.proxyService.listening() };
  }

  @Post('enable')
  async enableProxy(@Body() proxySettings: ProxySettingsDto) {
    await this.proxyService.enableProxy(proxySettings);
  }

  @Delete('disable')
  async disableProxy() {
    await this.proxyService.disableProxy();
  }
}

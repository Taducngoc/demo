import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CasesService } from './cases.service';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post('validate-tree')
  @ApiOperation({ summary: 'Kiểm tra tính hợp lệ của cây quyết định (No orphan, no cycle, terminal reachability)' })
  validateTree(@Body() body: { nodes: any[]; rootNodeId: string }) {
    return this.casesService.validateTree(body.nodes, body.rootNodeId);
  }
}

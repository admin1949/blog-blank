import { Test, TestingModule } from '@nestjs/testing';
import { PagerService } from './pager.service';

describe('PagerService', () => {
  let service: PagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagerService],
    }).compile();

    service = module.get<PagerService>(PagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

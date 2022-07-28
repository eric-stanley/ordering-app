import { Injectable } from '@nestjs/common';
import { CounterRepository } from '../repositories/counter.repository';

@Injectable()
export class CounterService {
  public static readonly counterRepository: CounterRepository;

  static async updateCounter(field: string) {
    await this.counterRepository.findOneAndUpdate(
      { _id: field },
      { $inc: { sequence_value: 1 } },
    );
  }
}

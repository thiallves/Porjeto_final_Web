import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from '../../database/models/review.model';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { ReviewRepository } from './repositories/reviews.repository';

@Module({
  imports: [SequelizeModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
})
export class ReviewModule {}

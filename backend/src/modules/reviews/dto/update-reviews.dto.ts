import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-reviews.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

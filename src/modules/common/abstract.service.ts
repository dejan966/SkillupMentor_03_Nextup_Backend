import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDataDto) {
    const createdData = new this.model(createDataDto);
    return createdData.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findBy(condition): Promise<T> {
    try {
      return this.model.findOne(condition);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  async findById(_id: string): Promise<T> {
    return await this.model.findById(_id);
  }

  async update(_id: string, updateDataDto): Promise<T> {
    const data = await this.findById(_id);
    try {
      for (const key in data) {
        if (updateDataDto[key] !== undefined) {
          data[key] = updateDataDto[key];
        }
      }
      await this.model.updateOne({ _id }, data);
      return data;
    } catch (error) {
      throw new NotFoundException('Something went wrong while updating the data.');
    }
  }

  async remove(_id: string) {
    try {
      return this.model.findOneAndDelete({ _id });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while deleting an item.');
    }
  }
}

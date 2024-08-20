import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Logging from 'library/Logging';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDataDto) {
    const createdData = new this.model(createDataDto);
    return createdData.save();
  }

  async findAll(populate = ''): Promise<T[]> {
    return await this.model.find().populate(populate).exec();
  }

  async findPaginate(pageNumber: number, populate = '') {
    const take = 15;
    const skip = take * (pageNumber - 1);
    const search = await this.model
      .find()
      .populate(populate)
      .limit(take)
      .skip(skip);
    const searchDocuments = await this.model.countDocuments();
    return {
      data: search,
      meta: {
        total: searchDocuments,
        page: pageNumber,
        last_page: Math.ceil(searchDocuments / take),
      },
    };
  }

  async findBy(condition) {
    try {
      return await this.model.findOne(condition);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  async findById(_id: ObjectId, p = '') {
    return await this.model.findById(_id).populate(p).exec();
  }

  async update(_id: ObjectId, updateDataDto) {
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
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }

  async remove(_id: ObjectId) {
    try {
      return this.model.findOneAndDelete({ _id });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while deleting an item.',
      );
    }
  }
}

import { ClassSerializerInterceptor, PlainLiteralObject, Type } from "@nestjs/common";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Document, Types } from "mongoose";

function stringifyObjectIds(value: any): any {
  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(stringifyObjectIds);
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      value[key] = stringifyObjectIds(value[key]);
    }
  }

  return value;
}

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      const plain = document.toObject({
        virtuals: true,
      });

      return plainToClass(classToIntercept, stringifyObjectIds(plain));
    }

    private prepareResponse(response: PlainLiteralObject | PlainLiteralObject[]) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      // pagination
      if (response && Array.isArray(response["data"])) {
        return {
          ...response,
          data: response["data"].map(this.changePlainObjectToClass),
          meta: response["meta"],
        };
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      const serialized = super.serialize(this.prepareResponse(response), options);
      return stringifyObjectIds(serialized);
    }
  };
}

export default MongooseClassSerializerInterceptor;

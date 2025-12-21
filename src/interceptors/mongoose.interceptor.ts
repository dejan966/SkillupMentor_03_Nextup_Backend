import { ClassSerializerInterceptor, PlainLiteralObject, Type } from "@nestjs/common";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Document } from "mongoose";

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(response: PlainLiteralObject | PlainLiteralObject[]) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      // for pagination
      if (Array.isArray(response["data"])) {
        return {
          ...response,
          ["data"]: response["data"].map(this.changePlainObjectToClass),
          ["meta"]: response["meta"],
        };
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export default MongooseClassSerializerInterceptor;

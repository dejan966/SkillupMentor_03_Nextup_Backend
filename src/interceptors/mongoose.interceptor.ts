import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  PlainLiteralObject,
  Type,
} from "@nestjs/common";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Document, Types } from "mongoose";
import { map, Observable } from "rxjs";

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
    private changePlainObjectToClass(
      document: PlainLiteralObject,
      options: ClassTransformOptions,
    ) {
      if (!(document instanceof Document)) {
        return document;
      }

      const plain = document.toObject({
        virtuals: true,
      });

      return plainToClass(classToIntercept, stringifyObjectIds(plain), options);
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      if (Array.isArray(response)) {
        return response.map((item) => this.changePlainObjectToClass(item, options));
      }

      // pagination
      if (response && Array.isArray(response["data"])) {
        return {
          ...response,
          data: response["data"].map((item) => this.changePlainObjectToClass(item, options)),
          meta: response["meta"],
        };
      }

      return this.changePlainObjectToClass(response, options);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      const serialized = super.serialize(this.prepareResponse(response, options), options);
      return stringifyObjectIds(serialized);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const contextOptions = this.getContextOptions(context);
      const options = {
        ...this.defaultOptions,
        ...contextOptions,
      };

      return next
        .handle()
        .pipe(
          map((res: PlainLiteralObject | PlainLiteralObject[]) => this.serialize(res, options)),
        );
    }

    protected getContextOptions(context: ExecutionContext): ClassTransformOptions | undefined {
      return this.reflector.getAllAndOverride("class_serializer:options", [
        context.getHandler(),
        context.getClass(),
      ]);
    }
  };
}

export default MongooseClassSerializerInterceptor;

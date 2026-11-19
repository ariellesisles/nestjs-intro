import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const METHOD_ORDER: Record<string, number> = {
  post: 0,
  get: 1,
  put: 2,
  patch: 3,
  delete: 4,
};

function getOperationProp(op: unknown, key: 'method' | 'path'): string {
  if (!op || typeof op !== 'object') {
    return '';
  }

  const maybeMap = op as {
    get?: (k: string) => unknown;
    [k: string]: unknown;
  };
  const raw =
    typeof maybeMap.get === 'function' ? maybeMap.get(key) : maybeMap[key];

  if (typeof raw === 'string') {
    return raw;
  }

  if (typeof raw === 'number') {
    return String(raw);
  }

  return '';
}

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS Application - Blog App API')
    .setDescription('Use the base API URL as http://localhost:3000/api-swagger')
    .setTermsOfService(
      'Use the base API URL as http://localhost:3000/terms-of-service',
    )
    .setLicense(
      'MIT License',
      'https://github.com/ariellesisles/nestjs-intro/blob/main/LICENSE',
    )
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-swagger', app, document, {
    swaggerOptions: {
      operationsSorter: (a: unknown, b: unknown) => {
        const methodOrder: Record<string, number> = {
          post: 0,
          get: 1,
          put: 2,
          patch: 3,
          delete: 4,
        };

        const readProp = (item: unknown, prop: 'method' | 'path'): string => {
          if (!item || typeof item !== 'object') {
            return '';
          }
          const candidate = item as {
            get?: (k: string) => unknown;
            [k: string]: unknown;
          };
          const value =
            typeof candidate.get === 'function'
              ? candidate.get(prop)
              : candidate[prop];

          if (typeof value === 'string') {
            return value;
          }
          if (typeof value === 'number') {
            return String(value);
          }
          return '';
        };

        const methodA = readProp(a, 'method').toLowerCase();
        const methodB = readProp(b, 'method').toLowerCase();

        const rankA = methodOrder[methodA] ?? 99;
        const rankB = methodOrder[methodB] ?? 99;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        const pathA = readProp(a, 'path');
        const pathB = readProp(b, 'path');
        return pathA.localeCompare(pathB);
      },
    },
  });
}

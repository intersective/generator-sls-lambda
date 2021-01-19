const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');

const BASE_FILES = [
  '.env', '.env.example', '.eslintrc', '.gitignore', 'jest.config.js', 'package.json', 'README.MD', 'serverless.yml', 'tsconfig.json',
  'src/index.ts', 'src/utils.ts',
  'src/routes/index.ts', 'src/routes/dashboard.ts', 'src/routes/__tests__/dashboard.spec.ts',
  'src/__mocks__/utils.ts',
  '.github/CODEOWNERS', '.github/pull_request_template.md',
  '.github/workflows/dependabotautomerge.yml', '.github/workflows/deploy.yml', '.github/workflows/lint_unit_test.yml'
];

const DYNAMODB_FILES = [
  'src/dynamodb.ts', 'create_dynamoDB_global_table.sh'
];

const SONARCLOUD_FILES = [
  'sonar-project.properties'
];

const BASE_PACKAGES = [
  'express', 'cors', 'dotenv', 'serverless', 'serverless-http', 'serverless-offline', 'serverless-plugin-typescript', 'serverless-certificate-creator', 'serverless-domain-manager', '@dazn/lambda-powertools-logger', '@dazn/lambda-powertools-pattern-basic', '@dazn/lambda-powertools-http-client', '@types/cors', '@types/express', 'typescript', 'eslint', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', '@typescript-eslint/eslint-plugin-tslint', 'jest', 'jest-express', 'ts-jest'
];

const JWT_PARSER_PACKAGES = ['@practera/jwt-parser'];

const DYNAMODB_PACKAGES = ['@dazn/lambda-powertools-dynamodb-client', 'serverless-dynamodb-local', 'aws-sdk'];

const SONARCLOUD_PACKAGES = ['jest-sonar-reporter'];

function filesInDir(files, dir) {
  return files.map(file => `${ dir }/${ file }`);
}

describe('sls-lambda:app generates a project ', function () {
  it('in current directory with base files', function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      // .withOptions({ foo: 'bar' })      // Mock options passed in
      // .withArguments(['newapp'])        // Mock the arguments
      .withPrompts({ name: 'newapp', choices: [] })   // Mock the prompt answers
      // .withLocalConfig({ lang: 'en' }) // Mock the local config
      .then(function() {
        assert.file(BASE_FILES);
        assert.noFile([ ...DYNAMODB_FILES, ...SONARCLOUD_FILES]);
      });
  });

  it('in new directory with base files', function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withArguments(['newapp'])
      .withPrompts({ name: 'newapp', choices: [] })
      .then(function() {
        assert.file(filesInDir(BASE_FILES, 'newapp'));
        assert.noFile(filesInDir([ ...DYNAMODB_FILES, ...SONARCLOUD_FILES], 'newapp'));
      });
  });

  it('in new directory with base & dynamodb files', function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withArguments(['newapp'])
      .withPrompts({ name: 'newapp', choices: ['dynamodb'] })   // Mock the prompt answers
      .then(function() {
        assert.file(filesInDir([ ...BASE_FILES, ...DYNAMODB_FILES], 'newapp'));
        assert.noFile(filesInDir(SONARCLOUD_FILES, 'newapp'));
      });
  });

  it('in new directory with base & dynamodb & sonarcloud files', function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withArguments(['newapp'])
      .withPrompts({ name: 'newapp', choices: ['dynamodb', 'sonarCloud'] })   // Mock the prompt answers
      .then(function() {
        assert.file(filesInDir([ ...BASE_FILES, ...DYNAMODB_FILES, ...SONARCLOUD_FILES], 'newapp'));
      });
  });
});
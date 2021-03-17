const Generator = require('yeoman-generator');
const glob = require('glob');
const logo = require('./logo.js');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.argument('appdir', { type: String, desc: 'The name of the new folder of your project', required: false });
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        // Default to current folder name
        default: this.options.appdir ? this.options.appdir : this.appname
      },
      {
        type: 'checkbox',
        name: 'choices',
        message: 'What do you want to use in your project?',
        choices: [
          {
            name: 'JWT parser',
            value: 'jwtParser',
            checked: true
          },
          {
            name: 'SonarCloud',
            value: 'sonarCloud',
            checked: true
          },
          {
            name: 'DynamoDB',
            value: 'dynamodb'
          },
        ]
      },
      {
        type: 'list',
        name: 'api',
        message: 'What type of API do you need?',
        choices: [
          {
            name: 'REST API',
            value: 'rest',
          },
          {
            name: 'GraphQL(Apollo)',
            value: 'graphql'
          },
          {
            name: 'Web Hook',
            value: 'webhook'
          },
        ],
        default: 'rest',
      }
    ]);
  }

  copyFiles() {
    const destinationPath = this.options.appdir ? this.destinationPath(`${ this.options.appdir }/`) : this.destinationPath();
    const parameters = {
      appname: this.answers.name,
      APPNAME: this.answers.name.replace("-", "_").toUpperCase(),
      useSonarCloud: this.answers.choices.includes('sonarCloud'),
      useJwtParser: this.answers.choices.includes('jwtParser'),
      useDynamoDB: this.answers.choices.includes('dynamodb'),
      useGraphQL: this.answers.api === 'graphql',
    };

    // copy base files
    this.fs.copyTpl(
      glob.sync(this.templatePath('base/**/*'), { dot: true }),
      destinationPath,
      parameters
    );

    // copy dynamodb related files
    if (this.answers.choices.includes('dynamodb')) {
      this.fs.copyTpl(
        glob.sync(this.templatePath('dynamodb/**/*'), { dot: true }),
        destinationPath,
        parameters
      );
    }

    // copy sonarCloud related files
    if (this.answers.choices.includes('sonarCloud')) {
      this.fs.copyTpl(
        glob.sync(this.templatePath('sonarcloud/**/*'), { dot: true }),
        destinationPath,
        parameters
      );
    }
    switch (this.answers.api) {
      case 'graphql':
        // copy graphql related files
        this.fs.copyTpl(
          glob.sync(this.templatePath('graphql/**/*'), { dot: true }),
          // graphql related files are only inside 'src', that's why we need to specify it
          `${ destinationPath }/src/`,
          parameters
        );
        break;

      case 'webhook':
        // copy webhook related files
        this.fs.copyTpl(
          glob.sync(this.templatePath('webhook/**/*'), { dot: true }),
          // webhook related files are only inside 'src', that's why we need to specify it
          destinationPath,
          parameters
        );
        break;

     default:
      // copy rest API related files
      this.fs.copyTpl(
        glob.sync(this.templatePath('rest/**/*'), { dot: true }),
        // rest related files are only inside 'src', that's why we need to specify it
        `${ destinationPath }/src/`,
        parameters
      );
    }
  }

  installPackages() {
    const dependencies = [
      'dotenv', '@dazn/lambda-powertools-logger', '@dazn/lambda-powertools-pattern-basic', '@dazn/lambda-powertools-http-client'
    ];
    const devDependencies = [
      'serverless', 'serverless-offline', 'serverless-plugin-typescript', 'serverless-certificate-creator', 'serverless-domain-manager',
      'typescript', 'eslint', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', '@typescript-eslint/eslint-plugin-tslint',
      'jest', 'jest-express', 'ts-jest'
    ];

    if (this.answers.choices.includes('jwtParser')) {
      dependencies.push('@practera/jwt-parser');
    }

    if (this.answers.choices.includes('dynamodb')) {
      dependencies.push('@dazn/lambda-powertools-dynamodb-client');
      devDependencies.push('serverless-dynamodb-local', 'aws-sdk');
    }

    if (this.answers.choices.includes('sonarCloud')) {
      devDependencies.push('jest-sonar-reporter');
    }

    switch (this.answers.api) {
      case 'graphql':
        // graphql packages
        dependencies.push('apollo-datasource', 'apollo-datasource-rest', 'apollo-server-lambda', 'dataloader', 'graphql', 'graphql-tag');
        devDependencies.push('@2fd/graphdoc', '@types/aws-lambda', 'apollo-server-testing');
        break;

      case 'webhook':
        dependencies.push('@types/aws-lambda', 'axios', 'jsonwebtoken');
        devDependencies.push('nock', '@types/jest', '@types/jsonwebtoken');
        break;

      default:
        // rest API packages
        dependencies.push('cors', 'express', 'serverless-http');
        devDependencies.push('@types/cors', '@types/express');
        break;
    }

    this._npmInstall(dependencies);
    this._npmInstall(devDependencies, true);
  }

  _npmInstall(packages, saveDev = false) {
    if (this.options.appdir) {
      return this.npmInstall(packages, { 'save-dev': saveDev }, { cwd: this.options.appdir });
    }
    return this.npmInstall(packages, { 'save-dev': saveDev });
  }

  end() {
    this.log(logo);
    this.log('Thanks for using sls-lambda :)');
    switch (this.answers.api) {
      case 'graphql':
        break;

      case 'webhook':
        this.log('In the serverless.yaml file please remember to put a proper queue name and to change the filter to the messages that you are expecting.');
        break;

      default:
        break;
    }

  }
};

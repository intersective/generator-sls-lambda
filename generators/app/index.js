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
          {
            name: 'GraphQL(Apollo)',
            value: 'graphql'
          }
        ]
      }
    ]);
  }

  copyFiles() {
    const destinationPath = this.options.appdir ? this.destinationPath(`${ this.options.appdir }/`) : this.destinationPath();
    const parameters = {
      appname: this.answers.name,
      useSonarCloud: this.answers.choices.includes('sonarCloud'),
      useJwtParser: this.answers.choices.includes('jwtParser'),
      useDynamoDB: this.answers.choices.includes('dynamodb'),
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
  }

  installPackages() {
    const dependencies = [
      'cors', 'dotenv', 'express', 'serverless-http',
      '@dazn/lambda-powertools-logger', '@dazn/lambda-powertools-pattern-basic', '@dazn/lambda-powertools-http-client'
    ];
    const devDependencies = [
      'serverless', 'serverless-offline', 'serverless-plugin-typescript', 'serverless-certificate-creator', 'serverless-domain-manager',
      '@types/cors', '@types/express', 'typescript',
      'eslint', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', '@typescript-eslint/eslint-plugin-tslint',
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
  }
};

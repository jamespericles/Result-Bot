module.exports = {
  description: 'Generates a command',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the command?",
    },
    {
      type: 'input',
      name: 'description',
      message: "What's the description of the command?",
    }
  ],
    actions: [
      {
        type: 'add',
        path: 'src/commands/{{name}}.ts',
        templateFile: 'plop/Command/command.hbs',
      },
      {
        type: 'append',
        path: 'src/commands/index.ts',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `export * as {{camelCase name}} from './{{name}}'`,
    },
  ],
}

module.exports = {
  client: {
    service: {
      name: 'apollo',
      url: 'http://localhost:3000/api/graphql'
      // localSchemaFile: './schema.graphql'
    },
    includes: ['src/components/**/*.graphql']
  }
};

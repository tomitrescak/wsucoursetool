This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# PX Info

## Project Description

The project aims to expand the current prototype of the **Course Analyser** with functionality aimed at students. First, we aim to implement the student management interface, allowing to enter new students and their current performance in the degree. Second, we aim to implement a **Course Planner** that allows students to generate project paths based on their current performance and personal preferences.

**Responsabilities:**

- Programmers - Back end / front end development
- Documentation - Maintain records / analysis / data entry

## Project plan:

1. **Week 1-3**: Learning and Analysis
   1. https://es6.io/ (MAYBE)
   1. https://reactforbeginners.com/ (MAYBE)
   1. https://flexbox.io/ (MAYBE)
   1. https://advancedreact.com/ (MUST)
2. **Week 4-6**: Student Management: CRUD on student records and performance
3. **Week 7-9**: Job / Specialisation visualisation
4. **Week 10-14/15**: Course Planner

## Specification

### Student Management

The system admin has to have the following capabilities:

#### Student Records

- List all students (name and ID)
- Add a new student (by Name and ID)
- View student details, which shows which blocks / units student has studied, or is surrently studying and what are the results. It also shows groups of student preferences out of which one is marked as active. The preference contains following fields:

  - Interests (list of keywords, e.g. video games, netowrks)
  - Desired Jobs
  - Desired Specialisations
  - Desired Units
  - Desired Blocks

- Register student results
- Change stuent preferences

#### Job Visualisation

The system admin has to have the following capabilities:

- List all registered jobs and their current "Matching" with student profile. Matching is numerated as Percentage (e.g. 57% match)
- Mark which jobs will reach at least X (e.g. 90%) match by the end of the study
- Show job details, where a graphical coparison of currwnt student capabailities vs desired job capabilities is visualised
- Generate a new study plan to match with this job

#### Study Plan

- Enumerates saved user preferences and generates new study plans

## Documentation Team Questionnaire

Please answer following questions as best as you can and if possible try to ask your colleagues as well. If you can ask also diverse people who performed really good vs who performed ok. You can anonymise it, but please I need to know at least the performance (e.g. GPA)

1. On scale 1 (lowest) to 5 (highest) how are you satified with the education process (not educators, the process -the support, the flexibility, the content) in your degree
2. Which unit was the most enjoyable?
3. What made it enjoyable?
4. Which Unit was the least enjoyable?
5. What made it not enjoyable?
6. Have you considered the "Assumed Knowledge" when selecting unit?
7. If so, was it clear what was required?
8. How did you select your units? Random / Major ...
9. Did you have a change of heart during your degree, changing your units?
10. On scale 0 (does not apply), 1 (not flexible) to 5 (very flexible), how would you rate the flexibility of your degree, considering your changing preferences

**IMPORTANT ONES**

11. Are there units that you would like to study but they did not fit into your study plan? Which ones?
12. How would you feel about studying only portion of the unit that interests you or is recommended? What are the pros and what are the cons?
13. Looking back at the order of units you studied, what would you change? If you would change something, can you please provide the original and changed order of units?
14. Overall, can you tell us what you liked about your degree and what you disliked?

## Backend Cookbook

### Adding a new API call

We will add a new call that return student info basedon his student id, stored in the JSON file in the "student" folder as `{id}.json`. We will return raw JSON and do not care about actual shape of the data here.

1. We need to add the schema definition to `src/server/schema.ts`

   ```grapqhql
   type Query {
     ...
     student(id: String!): JSON!
   }
   ```

2. We run `yarn generate` to generate the type safe resolver structure
3. In `src/server/resolvers.ts` we implement the resolver under the `Query`
   ```ts
   export const resolvers: IResolvers = {
     Query: {
       // ...
       student(_, { id }) {
         return fs.readFileSync(path.resolve(`./src/data/students/${id}.json`), {
           encoding: 'utf-8'
         });
       }
     }
   };
   ```
4. Profit. Do similar things with mutations.

## Frontend Cookbook

### Querying data

1. Write a graphql query in the .graphql file
2. Run `yarn generate`, which will generate a type safe version of the query
3. Import the query in your component and use it as such

```tsx
import { useTopicsQuery } from 'config/graphql';

// see an example in tag_editors.tsx
const { loading, error, data } = useTopicsQuery();
if (loading || error) {
  return <ProgressView loading={loading} error={error} />;
}
// now work with data
console.log(data.useTopics);
```

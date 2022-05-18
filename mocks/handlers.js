import { rest } from 'msw';

export const handlers = [
  rest.post("*loans", (req, res, ctx) => {
    return res(
      ctx.json({
        loan: {
          id: '1',
          first_name: "John",
          last_name: "Doe"
        }
      })
    );
  }),
];

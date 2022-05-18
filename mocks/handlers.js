import { rest } from 'msw';
const data = [
  { id: '1', first_name: "John", last_name: "Doe" },
  { id: '2', first_name: "Dani", last_name: "Popov" },
  { id: '3', first_name: "Daniel", last_name: "Dvorkin" }
]

export const handlers = [
  rest.post("*loans", (req, res, ctx) => {
    return res(
      ctx.json({
        loan: data[0]
      })
    );
  }),
  rest.get("http://localhost:5001/api/v1/loans", (req, res, ctx) => {
    const search = req.url.searchParams.get('search');

    return res(
      ctx.json({
        loans: search ? data.filter((d) => d.first_name.includes("Jo")) : data
      })
    );
  })
];

const routes = {
  root: '/',
  loan: (id) => `/loan/${id ? id : ':id'}`,
}

export default routes;